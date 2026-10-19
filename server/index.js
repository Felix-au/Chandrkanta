import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, connectDB } from './db.js';
import { mediaService } from './services/mediaService.js';
import { paymentService } from './services/paymentService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'chandrakanta_luxury_ethnic_secret_key_2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'chandrakanta2026';

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static files for client uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'client', 'public', 'uploads')));

// Multer memory storage for uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// Authentication Guard
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
}

// ==========================================
// 1. PUBLIC STOREFRONT ENDPOINTS
// ==========================================

// Health Check with Database and CDN status
app.get(['/health', '/api/health'], async (req, res) => {
  try {
    const [dbHealth, cdnHealth] = await Promise.all([
      db.checkHealth(),
      mediaService.checkHealth()
    ]);

    const isSystemHealthy = dbHealth.status === 'healthy' && cdnHealth.status === 'healthy';

    res.status(isSystemHealthy ? 200 : 207).json({
      status: isSystemHealthy ? 'healthy' : 'degraded',
      brand: 'Chandrakanta Luxury Handlooms',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbHealth,
      cdn: cdnHealth,
      payments: {
        razorpayConfigured: paymentService.isRazorpayConfigured(),
        upiConfigured: Boolean(process.env.UPI_VPA)
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Live Public Website Content
app.get('/api/content', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    const liveContent = await db.getLive();
    res.json({ success: true, data: liveContent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch content: ' + err.message });
  }
});

// Specific Section
app.get('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const liveContent = await db.getLive();
    if (liveContent[section]) {
      return res.json({ success: true, data: liveContent[section] });
    }
    res.status(404).json({ error: `Section '${section}' not found` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Products List
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let products = await db.getProducts();

    if (category && category !== 'all') {
      products = products.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories List
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. CHECKOUT & ORDERS
// ==========================================

// Create Customer Order
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, pricing, paymentMethod, transactionId } = req.body;

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ error: 'Customer name, phone, and address are required' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cannot place empty order' });
    }

    const orderPayload = {
      customer,
      items,
      pricing: pricing || {
        subtotal: items.reduce((s, it) => s + (it.price * it.quantity), 0),
        shipping: 0,
        tax: 0,
        total: items.reduce((s, it) => s + (it.price * it.quantity), 0)
      },
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
      orderStatus: 'PLACED',
      transactionId: transactionId || ''
    };

    const newOrder = await db.createOrder(orderPayload);
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order: ' + err.message });
  }
});

// Payment Gateway Stubs (Razorpay + UPI)
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid order amount' });
    }

    const order = await paymentService.createRazorpayOrder(amount, 'INR', receipt);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payments/verify', (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const isValid = paymentService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    res.json({ success: true, verified: isValid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/payments/upi-info', (req, res) => {
  try {
    const amount = parseFloat(req.query.amount) || 1999;
    const orderId = req.query.orderId || `CK-${Date.now()}`;
    const payload = paymentService.generateUpiPayload(amount, orderId);
    res.json({ success: true, data: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. ADMIN AUTHENTICATION
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  const token = jwt.sign({ role: 'admin', user: 'chandrakanta_manager' }, JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({
    success: true,
    token,
    user: { role: 'admin', name: 'Chandrakanta Store Administrator' }
  });
});

app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ==========================================
// 4. ADMIN CMS & DYNAMIC UI CUSTOMIZER
// ==========================================

// Get working draft + status
app.get('/api/admin/draft', requireAuth, async (req, res) => {
  try {
    const draft = await db.getDraft();
    const status = db.getStatus();
    res.json({ success: true, draft, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update draft section
app.put('/api/admin/draft/:section', requireAuth, async (req, res) => {
  const { section } = req.params;
  try {
    const updatedDraft = await db.updateDraftSection(section, req.body);
    res.json({
      success: true,
      message: `Section '${section}' draft updated`,
      draft: updatedDraft,
      status: db.getStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update full draft
app.put('/api/admin/draft', requireAuth, async (req, res) => {
  try {
    const updatedDraft = await db.updateFullDraft(req.body);
    res.json({ success: true, draft: updatedDraft, status: db.getStatus() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publish draft to live website
app.post('/api/admin/publish', requireAuth, async (req, res) => {
  try {
    const result = await db.publishDraft();
    res.json({
      success: true,
      message: 'Draft published to live storefront successfully!',
      publishedAt: result.publishedAt,
      data: result.data,
      status: db.getStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Discard draft changes
app.post('/api/admin/discard', requireAuth, async (req, res) => {
  try {
    const result = await db.discardDraft();
    res.json({
      success: true,
      message: 'Draft discarded. Reverted to live content.',
      draft: result.data,
      status: db.getStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset database to defaults
app.post('/api/admin/reset-defaults', requireAuth, async (req, res) => {
  try {
    const result = await db.resetDefaults();
    res.json({
      success: true,
      message: 'Reset all site content and catalog to original defaults.',
      data: result.data,
      status: db.getStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. ADMIN PRODUCTS & CATEGORIES CRUD
// ==========================================

app.post('/api/admin/products', requireAuth, async (req, res) => {
  try {
    const newProd = await db.addProduct(req.body);
    res.status(201).json({ success: true, product: newProd });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', requireAuth, async (req, res) => {
  try {
    await db.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories
app.post('/api/admin/categories', requireAuth, async (req, res) => {
  try {
    const newCat = await db.addCategory(req.body);
    res.status(201).json({ success: true, category: newCat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/categories/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true, category: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/categories/:id', requireAuth, async (req, res) => {
  try {
    await db.deleteCategory(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders Management
app.get('/api/admin/orders', requireAuth, async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/orders/:id/status', requireAuth, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updated = await db.updateOrderStatus(req.params.id, orderStatus, paymentStatus);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. MEDIA UPLOAD
// ==========================================

app.post('/api/media/upload', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    const folder = req.body.folder || 'chandrakanta';
    const uploadResult = await mediaService.uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );
    res.json({ success: true, ...uploadResult });
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed: ' + err.message });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log('======================================================');
  console.log(`✨ Chandrakanta Luxury Handlooms Backend on port ${PORT}`);
  console.log(`🌐 Public Store Content: http://localhost:${PORT}/api/content`);
  console.log(`👗 Catalog Products:     http://localhost:${PORT}/api/products`);
  console.log(`🛠️ Health Check:         http://localhost:${PORT}/api/health`);
  console.log(`🔑 Admin Auth:           POST http://localhost:${PORT}/api/auth/login`);
  console.log('======================================================');
  await connectDB();
});
