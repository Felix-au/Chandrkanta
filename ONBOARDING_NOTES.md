# Onboarding Notes: Chandrakanta Luxury Handlooms Website

**Date of Onboarding:** October 21, 2026  
**Workspace Root:** `c:\Users\Felix\Desktop\chandraknta\website`  
**Git Repository:** `https://github.com/Felix-au/Chandrkanta.git` (Branch: `main`)

---

## 1. Overview

**Chandrakanta** is a full-stack Indian ethnic e-commerce web platform specializing in handcrafted Banarasi silk sarees, Kanjivaram sarees, and unstitched suit sets.

The platform is structured into two main applications:
1. **Storefront Frontend (`client/`)**: A single-page application built with React 19 and Vite. It implements custom luxury ethnic design tokens, an animated announcement marquee, dynamic hero banner, category filters, product quick-view modal, slide-out cart & wishlist drawers, and a checkout modal supporting Cash on Delivery (COD), UPI (with dynamic QR code generation), and Razorpay payments.
2. **Backend API & CMS Engine (`server/`)**: An Express REST API with dual-mode storage (runs fully in-memory with automatic sync to MongoDB Atlas when configured), media asset upload handling (Cloudinary with local disk fallback), payment processing, and a live-versus-draft content management system (CMS) that allows real-time site updates.
3. **Admin Customizer Portal (`client/src/admin/`)**: A password-protected dashboard accessible via `/admin` or `Ctrl+Shift+A` that allows store managers to edit site copy, manage catalog products and collections, track orders, and publish draft updates directly to the storefront.

---

## 2. Stack and Dependencies

### Languages & Runtimes
- **Node.js**: `v24.22.0`
- **npm**: `11.19.1` (use `npm.cmd` on Windows PowerShell to respect script execution policies)
- **Module System**: ECMAScript Modules (`"type": "module"` in both client and server)

### Frontend (`client/package.json`)
- **Core**: React `^19.2.8`, `react-dom` `^19.2.8`
- **Bundler & Dev Server**: Vite `^8.3.0` with `@vitejs/plugin-react` `^6.1.1`
- **Icons**: Lucide React `^0.475.0`
- **Styling**: Vanilla CSS design tokens ([`client/src/styles/index.css`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/styles/index.css)) and component-scoped `<style>` tags
- **Typography**: Google Fonts (*Playfair Display* for serif headings, *Mulish* for body copy)
- **Development Port**: `3000` (proxies `/api` and `/uploads` to `http://localhost:5000`)

### Backend (`server/package.json`)
- **Web Framework**: Express `^4.19.2`
- **Database ODM**: Mongoose `^8.3.2`
- **Authentication**: `jsonwebtoken` `^9.0.2` (admin JWT auth)
- **Security & Hashes**: Node native `crypto` module (HMAC SHA-256 for Razorpay signature verification)
- **Middleware**: `cors` `^2.8.5`, `dotenv` `^16.4.5`, `multer` `^1.4.5-lts.1` (memory buffer storage)
- **Media Hosting**: `cloudinary` `^2.11.0` (with fallback to local filesystem)
- **Development Port**: `5000` (configurable via `process.env.PORT`)

### External Services & Integrations
- **MongoDB Atlas**: Database layer in [`server/db.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/db.js); automatically operates in-memory if `MONGODB_URI` is unset or unreachable.
- **Razorpay**: Payment gateway integration in [`server/services/paymentService.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/services/paymentService.js); provides simulated checkout if credentials are unset.
- **UPI Deep Linking & QR Codes**: Standard `upi://pay` intent generator with dynamic QR codes via `https://api.qrserver.com/v1/create-qr-code`.
- **Cloudinary**: Cloud image storage in [`server/services/mediaService.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/services/mediaService.js); falls back to local disk writes in [`client/public/uploads/`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/public/uploads).
- **Design System Asset Reference**: [`skillui-extract/chandrakanta-design/`](file:///c:/Users/Felix/Desktop/chandraknta/website/skillui-extract/chandrakanta-design) contains extracted tokens, fonts, and component guidelines.

---

## 3. Structure

```
website/
├── .gitignore                  # Git ignore rules for node_modules, .env, uploads, build output
├── ONBOARDING_NOTES.md         # Onboarding documentation and architectural guide
├── README.md                   # High-level overview and setup instructions
├── render.yaml                 # Render Blueprint for server deployment
├── vercel.json                 # Vercel configuration for client deployment & routing
├── client/                     # Frontend React 19 + Vite application
│   ├── .env.example            # Client environment variable template (VITE_API_URL)
│   ├── index.html              # HTML shell mounting Google Fonts and src/main.jsx
│   ├── package.json            # Client package dependencies and npm scripts
│   ├── vite.config.js          # Vite config with reverse proxy to http://localhost:5000
│   ├── public/                 # Static assets served by Vite
│   │   ├── images/             # 25 static product and collection image files
│   │   └── uploads/            # Target folder for local disk fallback image uploads
│   └── src/
│       ├── main.jsx            # React 19 root mounting <StoreProvider> and <CartProvider>
│       ├── App.jsx             # Shell component, /admin route switcher, mobile action bar
│       ├── admin/
│       │   └── AdminDashboard.jsx # 1120+ line Admin CMS portal (copy editor, products, orders)
│       ├── components/         # Storefront UI components
│       │   ├── AnnouncementBar.jsx  # Animated marquee announcements
│       │   ├── CartDrawer.jsx       # Slide-out shopping cart with free shipping bar
│       │   ├── CategoryGrid.jsx     # Visual collection cards (Sarees, Suit Sets)
│       │   ├── CheckoutModal.jsx    # Checkout flow with COD, UPI QR, and Razorpay
│       │   ├── FestiveBanner.jsx    # Promotional editorial banner
│       │   ├── Footer.jsx           # Store footer with brand info and admin trigger link
│       │   ├── Hero.jsx             # Full-width hero banner with dual CTA buttons
│       │   ├── Navbar.jsx           # Sticky nav with search, cart/wishlist counters
│       │   ├── Newsletter.jsx       # Email subscriber signup strip
│       │   ├── ProductDetailModal.jsx # Quick-view product popup with color swatches
│       │   ├── ProductGrid.jsx      # Filterable product gallery with tabs & search
│       │   ├── Testimonials.jsx     # Customer review quotes
│       │   ├── TrustStrip.jsx       # Value props (authentic handloom, easy returns)
│       │   ├── WhyUs.jsx            # Artisan commitment block
│       │   └── WishlistDrawer.jsx   # Slide-out saved items drawer
│       ├── config/
│       │   └── api.js               # API URL resolver (VITE_API_URL vs relative proxy)
│       ├── context/
│       │   ├── CartContext.jsx      # Cart, wishlist, pricing, order placement (localStorage)
│       │   └── StoreContext.jsx     # Live & draft CMS state, admin login, catalog CRUD
│       ├── data/
│       │   └── defaultStoreData.js  # Client-side fallback seed data
│       └── styles/
│           └── index.css            # Master stylesheet with luxury ethnic design tokens
├── server/                     # Backend Node.js Express REST API
│   ├── .env                    # Local environment variables (ports, secrets, keys)
│   ├── .env.example            # Backend environment template
│   ├── db.js                   # Dual-mode database layer (in-memory + MongoDB sync)
│   ├── index.js                # Express app entry, routes, auth guard, media upload
│   ├── package.json            # Server package definition & scripts
│   ├── data/
│   │   └── defaultData.js      # Server-side default store and content seed
│   ├── models/
│   │   ├── Content.js          # Mongoose schema for CMS live/draft content documents
│   │   ├── Order.js            # Mongoose schema for customer orders
│   │   └── Product.js          # Mongoose schema for catalog products
│   ├── routes/                 # Directory exists (all routes currently live in index.js)
│   └── services/
│       ├── mediaService.js     # Image upload abstraction (local disk vs Cloudinary)
│       └── paymentService.js   # Razorpay client & signature verification + UPI QR generator
├── skillui-extract/            # Design system tokens and specifications
│   └── chandrakanta-design/
│       ├── CLAUDE.md           # Instructions on how to consult SKILL.md
│       ├── DESIGN.md           # Visual design tokens and UI specifications
│       ├── SKILL.md            # Comprehensive design system manual
│       ├── fonts/              # Custom font files
│       ├── references/         # Extended layout and component references
│       └── screenshots/        # Scroll journey screenshots
└── SAMPLE/                     # Untracked sample app ("Hotel Swastika Inn")
```

---

## 4. Architecture and Core Flows

### Architecture Overview
- **Storefront Client**: Single-page application using React Context. State is separated into [`StoreContext.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/context/StoreContext.jsx) (CMS copy, catalog products, categories, admin session) and [`CartContext.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/context/CartContext.jsx) (cart items, wishlist, order placement, `localStorage` persistence).
- **Backend API**: Monolithic Express application in [`server/index.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/index.js) backed by [`server/db.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/db.js).
- **Live vs. Draft CMS Workflow**:
  - Store content is represented as a JSON document tree (hero, announcements, categories, products, footer, settings).
  - Admin changes are saved to the `draft` document.
  - Public storefront requests only receive the `live` document.
  - When the admin publishes, `draft` overwrites `live`, updating `lastPublishedAt`.

### Core Flow 1: Storefront Hydration
1. Client boots via [`client/src/main.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/main.jsx) and mounts `<StoreProvider>`.
2. `fetchLiveContent()` requests `GET /api/content` via [`client/src/config/api.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/config/api.js).
3. Express server answers from `db.getLive()`.
4. If the server is offline, `<StoreProvider>` catches the network error and loads local seed data from [`client/src/data/defaultStoreData.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/data/defaultStoreData.js).
5. All storefront UI components read dynamic copy and catalog items from `useStore().content`.

### Core Flow 2: Cart, Wishlist, and Checkout
1. A visitor clicks "Add to Bag" on a product card or in [`ProductDetailModal.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/components/ProductDetailModal.jsx).
2. `addToCart()` in [`CartContext.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/context/CartContext.jsx) updates state, recalculates shipping thresholds, syncs `localStorage` (`ck_cart`), and slides open [`CartDrawer.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/components/CartDrawer.jsx).
3. The customer proceeds to [`CheckoutModal.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/components/CheckoutModal.jsx):
   - **Cash on Delivery (COD)**: Payment status defaults to `PENDING`.
   - **UPI**: Frontend requests `GET /api/payments/upi-info?amount={total}`, displaying the merchant VPA and dynamic QR code generated via QRServer.
   - **Razorpay**: Frontend requests `POST /api/payments/create-order`. Server uses [`server/services/paymentService.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/services/paymentService.js) (live or simulation mode).
4. Submitting the order sends `POST /api/orders` with customer info and line items.
5. Server validates required fields, invokes `db.createOrder()`, generates an order ID (e.g., `CK-89421`), and stores it in memory.
6. The customer receives an order confirmation dialog, and the cart is emptied.

### Core Flow 3: Admin CMS & Live Publishing
1. Store administrator accesses `/admin` or presses `Ctrl+Shift+A` on the storefront.
2. Login credentials are submitted to `POST /api/auth/login`.
3. The server compares against `ADMIN_PASSWORD` and signs a 7-day JWT.
4. Token is saved in `localStorage` (`ck_admin_token`).
5. Admin modifies content in [`AdminDashboard.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/admin/AdminDashboard.jsx), which calls `PUT /api/admin/draft/:section` or `PUT /api/admin/draft`.
6. Changes are stored in `inMemoryDraft` (and MongoDB `Content` document with key `'draft'` if connected).
7. Admin clicks "Publish to Storefront" -> `POST /api/admin/publish`.
8. The server copies `inMemoryDraft` into `inMemoryLive` (and MongoDB `'live'` document), setting a new `lastPublishedAt` timestamp.

### Core Flow 4: Media Upload
1. Admin selects an image to upload in the product or customizer editor.
2. Form submits multipart data to `POST /api/media/upload` with Bearer auth.
3. Multer buffers the file in memory.
4. [`server/services/mediaService.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/services/mediaService.js) checks for Cloudinary credentials:
   - If present, uploads directly to Cloudinary.
   - If absent, writes file to [`client/public/uploads/`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/public/uploads/) and returns `/uploads/<filename>`.

### Data Models
- **Content** ([`server/models/Content.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/models/Content.js)): Key-value document schema (`'live'` and `'draft'`) holding the entire site tree (hero, marquee, categories, products, footer, settings).
- **Product** ([`server/models/Product.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/models/Product.js)): Schema for catalog items (`id`, `name`, `type`, `category`, `price`, `images`, `swatches`, `stock`, `details`).
- **Order** ([`server/models/Order.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/models/Order.js)): Schema for customer orders (`orderId`, `customer`, `items`, `pricing`, `paymentMethod`, `paymentStatus`, `orderStatus`, `transactionId`).
- *Note:* In the current implementation of `server/db.js`, products reside inside the monolithic `Content` document, and customer orders reside in the `inMemoryOrders` array.

---

## 5. Conventions

### Code Style & Formatting
- **Pure ECMAScript Modules**: `import`/`export` across both client and server; no CommonJS `require()`.
- **CSS Design Tokens**: Defined in [`client/src/styles/index.css`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/styles/index.css):
  - Primary Accent: `--accent: #7B1C1C;` (Royal Crimson)
  - Secondary Accent: `--gold: #C8922A;` (Zari Gold)
  - Background: `--bg: #faf8f5;` (Ivory Silk)
  - Surface: `--surface: #ffffff;`
  - Typography: `--font-disp: 'Playfair Display', Georgia, serif;`, `--font-body: 'Mulish', 'Helvetica Neue', sans-serif;`
- **Error Handling**: API endpoints catch errors and return consistent JSON payloads (`{ success: false, error: err.message }` or `{ error: ... }`).
- **State Management**: React Context (`StoreContext`, `CartContext`) combined with `localStorage` for offline survivability.
- **Git Commit Conventions**: Conventional commit format (`feat:`, `fix:`, `refactor:`, `chore:`, `deploy:`, `media:`, `design:`, `docs:`).

---

## 6. How to Run, Build, and Test

### Prerequisites
- Node.js `v20+` (Environment runtime: `v24.22.0`)
- npm `v10+` (Environment runtime: `11.19.1`, use `npm.cmd` on Windows)

### 1. Backend Server
```powershell
cd server
npm.cmd install
npm.cmd run dev       # Starts development server with node --watch index.js
npm.cmd start         # Starts production node index.js
```
*Backend URL:* `http://localhost:5000`

### 2. Frontend Client
```powershell
cd client
npm.cmd install
npm.cmd run dev       # Starts Vite dev server on http://localhost:3000
npm.cmd run build     # Compiles production bundle to client/dist
npm.cmd run preview   # Previews the production build locally
```
*Frontend URL:* `http://localhost:3000` (proxies `/api` and `/uploads` to port `5000`)

### 3. Tests and Linting
- **Tests**: No automated test framework (Vitest, Jest) or test scripts currently exist in either `package.json`.
- **Linting**: No ESLint or Prettier configurations are set up.

### 4. Required Environment Variables
*Variable names only (never commit secret values):*
- **Server (`server/.env`)**:
  - `PORT`
  - `NODE_ENV`
  - `JWT_SECRET`
  - `ADMIN_PASSWORD`
  - `MONGODB_URI` *(Optional: runs in-memory if empty)*
  - `RAZORPAY_KEY_ID` *(Optional: runs in simulation mode if empty)*
  - `RAZORPAY_KEY_SECRET` *(Optional: runs in simulation mode if empty)*
  - `UPI_VPA`
  - `UPI_MERCHANT_NAME`
  - `CLOUDINARY_CLOUD_NAME` *(Optional: writes to client/public/uploads if empty)*
  - `CLOUDINARY_API_KEY` *(Optional)*
  - `CLOUDINARY_API_SECRET` *(Optional)*
  - `CLOUDINARY_URL` *(Optional)*
- **Client (`client/.env`)**:
  - `VITE_API_URL` *(Optional in dev: uses Vite proxy; required in production if frontend and backend are hosted on separate domains)*

---

## 7. Risks and Tech Debt

1. **Ephemeral Order Storage**:
   - Customer orders are stored exclusively in an in-memory array (`inMemoryOrders` in [`server/db.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/db.js)). Even if `MONGODB_URI` is provided, customer orders are not written to MongoDB and will be wiped whenever the server restarts.
2. **Monolithic Content Document**:
   - Catalog products and categories are stored as sub-arrays inside the single `Content` document rather than utilizing the standalone [`server/models/Product.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/models/Product.js) collection.
3. **Data Duplication**:
   - Seed data in [`server/data/defaultData.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/data/defaultData.js) and [`client/src/data/defaultStoreData.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/data/defaultStoreData.js) are duplicate copies of the same 284 lines. Edits to one will not automatically reflect in the other.
4. **Monolithic Admin Component**:
   - [`client/src/admin/AdminDashboard.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/admin/AdminDashboard.jsx) is over 1,120 lines long, bundling dashboard navigation, CMS editors, order viewer, product forms, and CSS in a single file.
5. **Monolithic Backend Route File**:
   - All backend REST endpoints (content, products, orders, payments, auth, admin, media) are declared in [`server/index.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/index.js), while the `server/routes/` directory remains unused.
6. **Single Hardcoded Admin Password**:
   - Authentication relies on comparing a plaintext password against `ADMIN_PASSWORD` in `.env` (with a hardcoded fallback string) rather than hashed user accounts in a database.
7. **Zero Automated Tests**:
   - No unit or end-to-end tests exist for shopping cart calculations, UPI deep link formatting, or checkout flows.
8. **Untracked Directory (`SAMPLE/`)**:
   - An untracked directory `SAMPLE/` (containing an Ayodhya hotel application) exists in the repository root and is not listed in `.gitignore`.

---

## 8. Open Questions

1. **Order & Catalog Persistence**: Should we connect customer orders and catalog products directly to MongoDB collections ([`Order`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/models/Order.js) and [`Product`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/models/Product.js)) instead of keeping orders in volatile memory and products embedded in the `Content` document?
2. **Untracked Directory (`SAMPLE/`)**: Is the `SAMPLE/` folder needed for reference, or should it be removed or added to `.gitignore`?
3. **Admin User Management**: Would you like to keep the single environment-based admin password, or migrate to a database-backed user model with bcrypt-hashed passwords?
4. **Automated Testing**: Should we configure Vitest for frontend context/component testing and Jest/Supertest for backend API testing?
