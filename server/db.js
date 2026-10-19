import mongoose from 'mongoose';
import { Content } from './models/Content.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { DEFAULT_SITE_DATA } from './data/defaultData.js';

let isConnected = false;
let inMemoryLive = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
let inMemoryDraft = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
let inMemoryOrders = [
  {
    orderId: "CK-89421",
    customer: {
      name: "Sunita Sharma",
      phone: "+91 98234 11223",
      email: "sunita.sharma@example.com",
      address: "B-42, Gomti Nagar",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "226010"
    },
    items: [
      {
        id: "prod-1",
        name: "Teal Zari Weave Saree",
        price: 3499,
        quantity: 1,
        selectedColor: "#1a6b6b",
        image: "/images/saree-teal.jpg"
      }
    ],
    pricing: {
      subtotal: 3499,
      shipping: 0,
      tax: 0,
      total: 3499
    },
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "CONFIRMED",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    orderId: "CK-89422",
    customer: {
      name: "Pooja Verma",
      phone: "+91 94150 99887",
      email: "pooja.v@example.com",
      address: "12/A, Civil Lines",
      city: "Varanasi",
      state: "Uttar Pradesh",
      pincode: "221002"
    },
    items: [
      {
        id: "prod-6",
        name: "Emerald Royale Anarkali Suit",
        price: 2899,
        quantity: 1,
        selectedColor: "#0b4f3b",
        image: "/images/suit-emerald.jpg"
      }
    ],
    pricing: {
      subtotal: 2899,
      shipping: 0,
      tax: 0,
      total: 2899
    },
    paymentMethod: "UPI",
    paymentStatus: "COMPLETED",
    orderStatus: "SHIPPED",
    transactionId: "UPI_REF_9812739812",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

let statusCache = {
  lastPublishedAt: new Date().toISOString(),
  lastDraftUpdatedAt: new Date().toISOString()
};

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ [DB] Running in high-performance in-memory mode. Set MONGODB_URI to persist permanently.');
    return false;
  }

  try {
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return true;
    }

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log('✅ [MongoDB] Connected successfully to remote database');
    await syncWithDatabase();
    return true;
  } catch (err) {
    console.warn('⚠️ [MongoDB] Connection error (using in-memory store):', err.message);
    isConnected = false;
    return false;
  }
}

async function syncWithDatabase() {
  if (!isConnected) return;
  try {
    let liveDoc = await Content.findOne({ key: 'live' });
    if (!liveDoc) {
      liveDoc = await Content.create({
        key: 'live',
        data: DEFAULT_SITE_DATA,
        lastPublishedAt: new Date()
      });
    }

    let draftDoc = await Content.findOne({ key: 'draft' });
    if (!draftDoc) {
      draftDoc = await Content.create({
        key: 'draft',
        data: liveDoc.data,
        lastDraftUpdatedAt: new Date()
      });
    }

    inMemoryLive = {
      ...DEFAULT_SITE_DATA,
      ...liveDoc.data,
      theme: { ...DEFAULT_SITE_DATA.theme, ...(liveDoc.data?.theme || {}) },
      layout: { ...DEFAULT_SITE_DATA.layout, ...(liveDoc.data?.layout || {}) }
    };
    inMemoryDraft = {
      ...DEFAULT_SITE_DATA,
      ...draftDoc.data,
      theme: { ...DEFAULT_SITE_DATA.theme, ...(draftDoc.data?.theme || {}) },
      layout: { ...DEFAULT_SITE_DATA.layout, ...(draftDoc.data?.layout || {}) }
    };
    statusCache.lastPublishedAt = liveDoc.lastPublishedAt?.toISOString() || new Date().toISOString();
    statusCache.lastDraftUpdatedAt = draftDoc.lastDraftUpdatedAt?.toISOString() || new Date().toISOString();
  } catch (err) {
    console.error('❌ [DB] Sync error:', err.message);
  }
}

export const db = {
  isReady: () => isConnected,

  checkHealth: async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
      try {
        const start = Date.now();
        await mongoose.connection.db.command({ ping: 1 });
        const latencyMs = Date.now() - start;
        return {
          status: 'healthy',
          type: 'mongodb',
          connected: true,
          latencyMs,
          host: mongoose.connection.host || 'remote-cluster'
        };
      } catch (err) {
        return {
          status: 'degraded',
          type: 'mongodb',
          connected: false,
          error: err.message
        };
      }
    }
    return {
      status: 'healthy',
      type: 'in-memory',
      connected: true,
      mode: 'fallback-cache'
    };
  },

  /* Content & UI */
  getLive: async () => {
    if (isConnected) {
      try {
        const doc = await Content.findOne({ key: 'live' }).lean();
        if (doc?.data) return doc.data;
      } catch (e) {
        console.error(e);
      }
    }
    return inMemoryLive;
  },

  getDraft: async () => {
    if (isConnected) {
      try {
        const doc = await Content.findOne({ key: 'draft' }).lean();
        if (doc?.data) return doc.data;
      } catch (e) {
        console.error(e);
      }
    }
    return inMemoryDraft;
  },

  updateDraftSection: async (section, data) => {
    if (!inMemoryDraft) {
      inMemoryDraft = JSON.parse(JSON.stringify(inMemoryLive));
    }
    inMemoryDraft[section] = JSON.parse(JSON.stringify(data));
    statusCache.lastDraftUpdatedAt = new Date().toISOString();

    if (isConnected) {
      try {
        await Content.findOneAndUpdate(
          { key: 'draft' },
          { $set: { [`data.${section}`]: data, lastDraftUpdatedAt: new Date() } },
          { upsert: true }
        );
      } catch (e) {
        console.error(e);
      }
    }
    return inMemoryDraft;
  },

  updateFullDraft: async (fullDraftData) => {
    inMemoryDraft = JSON.parse(JSON.stringify(fullDraftData));
    statusCache.lastDraftUpdatedAt = new Date().toISOString();

    if (isConnected) {
      try {
        await Content.findOneAndUpdate(
          { key: 'draft' },
          { $set: { data: fullDraftData, lastDraftUpdatedAt: new Date() } },
          { upsert: true }
        );
      } catch (e) {
        console.error(e);
      }
    }
    return inMemoryDraft;
  },

  publishDraft: async () => {
    inMemoryLive = JSON.parse(JSON.stringify(inMemoryDraft));
    const now = new Date();
    statusCache.lastPublishedAt = now.toISOString();

    if (isConnected) {
      try {
        await Content.findOneAndUpdate(
          { key: 'live' },
          { $set: { data: inMemoryDraft, lastPublishedAt: now } },
          { upsert: true }
        );
      } catch (e) {
        console.error(e);
      }
    }

    return {
      success: true,
      publishedAt: statusCache.lastPublishedAt,
      data: inMemoryLive
    };
  },

  discardDraft: async () => {
    inMemoryDraft = JSON.parse(JSON.stringify(inMemoryLive));
    statusCache.lastDraftUpdatedAt = new Date().toISOString();

    if (isConnected) {
      try {
        await Content.findOneAndUpdate(
          { key: 'draft' },
          { $set: { data: inMemoryLive, lastDraftUpdatedAt: new Date() } },
          { upsert: true }
        );
      } catch (e) {
        console.error(e);
      }
    }
    return { success: true, data: inMemoryDraft };
  },

  resetDefaults: async () => {
    inMemoryLive = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    inMemoryDraft = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    const now = new Date();
    statusCache.lastPublishedAt = now.toISOString();
    statusCache.lastDraftUpdatedAt = now.toISOString();

    if (isConnected) {
      try {
        await Content.findOneAndUpdate(
          { key: 'live' },
          { $set: { data: DEFAULT_SITE_DATA, lastPublishedAt: now } },
          { upsert: true }
        );
        await Content.findOneAndUpdate(
          { key: 'draft' },
          { $set: { data: DEFAULT_SITE_DATA, lastDraftUpdatedAt: now } },
          { upsert: true }
        );
      } catch (e) {
        console.error(e);
      }
    }
    return { success: true, data: inMemoryLive };
  },

  getStatus: () => {
    return {
      hasUnpublishedChanges: JSON.stringify(inMemoryLive) !== JSON.stringify(inMemoryDraft),
      lastPublishedAt: statusCache.lastPublishedAt,
      lastDraftUpdatedAt: statusCache.lastDraftUpdatedAt,
      database: isConnected ? 'mongodb_connected' : 'memory_pending_mongodb_uri'
    };
  },

  /* Products */
  getProducts: async () => {
    return inMemoryLive.products || [];
  },

  addProduct: async (productData) => {
    const newProduct = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`
    };
    if (!inMemoryDraft.products) inMemoryDraft.products = [];
    if (!inMemoryLive.products) inMemoryLive.products = [];

    inMemoryDraft.products.push(newProduct);
    // Also push to live for immediate store update if desired
    inMemoryLive.products.push(newProduct);
    statusCache.lastDraftUpdatedAt = new Date().toISOString();
    statusCache.lastPublishedAt = new Date().toISOString();
    return newProduct;
  },

  updateProduct: async (id, updatedData) => {
    const draftIdx = (inMemoryDraft.products || []).findIndex(p => p.id === id);
    if (draftIdx !== -1) {
      inMemoryDraft.products[draftIdx] = { ...inMemoryDraft.products[draftIdx], ...updatedData };
    }
    const liveIdx = (inMemoryLive.products || []).findIndex(p => p.id === id);
    if (liveIdx !== -1) {
      inMemoryLive.products[liveIdx] = { ...inMemoryLive.products[liveIdx], ...updatedData };
      return inMemoryLive.products[liveIdx];
    }
    return null;
  },

  deleteProduct: async (id) => {
    inMemoryDraft.products = (inMemoryDraft.products || []).filter(p => p.id !== id);
    inMemoryLive.products = (inMemoryLive.products || []).filter(p => p.id !== id);
    return true;
  },

  /* Categories */
  getCategories: async () => {
    return inMemoryLive.categories || [];
  },

  addCategory: async (categoryData) => {
    const newCat = {
      ...categoryData,
      id: categoryData.id || `cat-${Date.now()}`
    };
    inMemoryDraft.categories = inMemoryDraft.categories || [];
    inMemoryLive.categories = inMemoryLive.categories || [];
    inMemoryDraft.categories.push(newCat);
    inMemoryLive.categories.push(newCat);
    return newCat;
  },

  updateCategory: async (id, updatedData) => {
    const liveIdx = (inMemoryLive.categories || []).findIndex(c => c.id === id);
    if (liveIdx !== -1) {
      inMemoryLive.categories[liveIdx] = { ...inMemoryLive.categories[liveIdx], ...updatedData };
      if (inMemoryDraft.categories) {
        const dIdx = inMemoryDraft.categories.findIndex(c => c.id === id);
        if (dIdx !== -1) inMemoryDraft.categories[dIdx] = { ...inMemoryDraft.categories[dIdx], ...updatedData };
      }
      return inMemoryLive.categories[liveIdx];
    }
    return null;
  },

  deleteCategory: async (id) => {
    inMemoryDraft.categories = (inMemoryDraft.categories || []).filter(c => c.id !== id);
    inMemoryLive.categories = (inMemoryLive.categories || []).filter(c => c.id !== id);
    return true;
  },

  /* Orders */
  getOrders: async () => {
    if (isConnected) {
      try {
        const mongoOrders = await Order.find().sort({ createdAt: -1 }).lean();
        if (mongoOrders && mongoOrders.length > 0) {
          return mongoOrders;
        }
      } catch (e) {
        console.error('Error fetching orders from MongoDB:', e.message);
      }
    }
    return inMemoryOrders;
  },

  createOrder: async (orderPayload) => {
    const newOrder = {
      ...orderPayload,
      orderId: `CK-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString()
    };
    inMemoryOrders.unshift(newOrder);

    if (isConnected) {
      try {
        await Order.create(newOrder);
      } catch (e) {
        console.error('Error persisting order to MongoDB:', e.message);
      }
    }

    return newOrder;
  },

  updateOrderStatus: async (orderId, orderStatus, paymentStatus) => {
    const idx = inMemoryOrders.findIndex(o => o.orderId === orderId);
    if (idx !== -1) {
      if (orderStatus) inMemoryOrders[idx].orderStatus = orderStatus;
      if (paymentStatus) inMemoryOrders[idx].paymentStatus = paymentStatus;
      return inMemoryOrders[idx];
    }
    return null;
  }
};
