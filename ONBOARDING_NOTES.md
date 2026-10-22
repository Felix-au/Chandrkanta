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

│   │   ├── images/             # 25 static product and collection image files
│   │   └── uploads/            # Target folder for locally uploaded CMS media
│   └── src/
│       ├── main.jsx            # React 19 application entry point
│       ├── App.jsx             # Shell component, route switcher (/admin), mobile action bar
│       ├── admin/
│       │   └── AdminDashboard.jsx # 1100+ line Admin CMS portal (UI editor, products, orders)
│       ├── components/         # Storefront UI components
│       │   ├── AnnouncementBar.jsx  # Animated marquee announcements
│       │   ├── CartDrawer.jsx       # Side-drawer shopping cart with free shipping bar
│       │   ├── CategoryGrid.jsx     # Visual collection cards (Sarees, Suit Sets)
│       │   ├── CheckoutModal.jsx    # Checkout flow with COD, UPI QR, and Razorpay
│       │   ├── FestiveBanner.jsx    # Promotional editorial banner
│       │   ├── Footer.jsx           # Store footer with brand info and admin link
│       │   ├── Hero.jsx             # Full-width hero banner with call to actions
│       │   ├── Navbar.jsx           # Sticky nav with search, cart/wishlist counters
│       │   ├── Newsletter.jsx       # Email subscriber signup strip
│       │   ├── ProductDetailModal.jsx # Quick-view product popup with color swatches
│       │   ├── ProductGrid.jsx      # Filterable product gallery with tabs & search
│       │   ├── Testimonials.jsx     # Customer review quotes
│       │   ├── TrustStrip.jsx       # Value props (authentic handloom, easy returns)
│       │   ├── WhyUs.jsx            # Artisan commitment block
│       │   └── WishlistDrawer.jsx   # Slide-out saved items drawer
│       ├── context/
│       │   ├── CartContext.jsx      # Cart, wishlist, pricing, order placement (localStorage)
│       │   └── StoreContext.jsx     # Live & draft CMS state, admin login, catalog CRUD
│       ├── data/
│       │   └── defaultStoreData.js  # Client-side fallback seed data
│       └── styles/
│           └── index.css            # Master stylesheet with luxury ethnic design tokens
├── server/                     # Backend Node.js Express REST API
│   ├── .env                    # Environment variables (secrets, ports, provider keys)
│   ├── db.js                   # Dual-mode database layer (in-memory + MongoDB sync)
│   ├── index.js                # Express app entry, routes, auth guard, media upload
│   ├── package.json            # Server package definition & scripts
│   ├── data/
│   │   └── defaultData.js      # Server-side default store and content seed
│   ├── models/
│   │   ├── Content.js          # Mongoose schema for CMS live/draft content documents
│   │   ├── Order.js            # Mongoose schema for customer orders
│   │   └── Product.js          # Mongoose schema for catalog products
│   ├── routes/                 # Empty directory (all route handlers live in index.js)
│   └── services/
│       ├── mediaService.js     # Image upload abstraction (local disk vs Cloudinary)
│       └── paymentService.js   # Razorpay API client & verification + UPI QR generator
└── skillui-extract/            # Design system skill files extracted by skillui
    └── chandrakanta-design/
        ├── CLAUDE.md           # Instructions on how to consult SKILL.md
        ├── DESIGN.md           # Visual design tokens and UI specifications
        ├── SKILL.md            # Comprehensive design system manual
        ├── chandrakanta-design.skill
        ├── fonts/              # Custom font files
        ├── references/         # Extended layout and component references
        └── screenshots/        # Scroll journey screenshots
```

---

## 4. Architecture and Core Flows

### Architecture Overview
- **Storefront Client**: React SPA leveraging React Context for shared state. State is split into [`StoreContext.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/context/StoreContext.jsx) (CMS content, catalog, admin authentication) and [`CartContext.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/context/CartContext.jsx) (cart items, wishlist, checkout triggers, localStorage persistence).
- **Backend API**: Express server in [`server/index.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/index.js) backed by [`server/db.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/db.js).
- **Live vs. Draft CMS Model**:
  - The site data is represented as a JSON document tree (hero, banners, announcements, products, categories).
  - Admin changes write to a `draft` copy.
  - The live storefront only displays the `live` copy.
  - When the admin clicks "Publish", the draft overwrites the live content.

### Core Flow 1: Storefront Hydration
1. Client starts up in [`client/src/main.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/main.jsx), rendering `<StoreProvider>`.
2. `StoreProvider` calls `GET /api/content` (proxied by Vite to port 5000).
3. Express in [`server/index.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/index.js) responds via `db.getLive()`.
4. If the server is offline or unreachable, `StoreProvider` catches the error and falls back to [`client/src/data/defaultStoreData.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/data/defaultStoreData.js).
5. All storefront components dynamically render content from `useStore().content`.

### Core Flow 2: Adding to Cart & Checkout
1. User clicks "Add to Bag" on a product card or within [`ProductDetailModal.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/components/ProductDetailModal.jsx).
2. `addToCart()` in [`CartContext.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/context/CartContext.jsx) appends the item, recalculates totals and free shipping eligibility, saves state to `localStorage` key `ck_cart`, and opens [`CartDrawer.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/components/CartDrawer.jsx).
3. Clicking "Proceed to Checkout" opens [`CheckoutModal.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/components/CheckoutModal.jsx).
4. Depending on selected payment method:
   - **Cash on Delivery (COD)**: Payment status defaults to `PENDING`.
   - **UPI**: Frontend requests `GET /api/payments/upi-info?amount={total}`, displaying the VPA and dynamic QR code generated via QRServer.
   - **Razorpay**: Frontend requests `POST /api/payments/create-order`. Server uses [`paymentService.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/services/paymentService.js) to return an order ID (live or simulation).
5. Submitting the form calls `placeOrder()` -> `POST /api/orders`.
6. Server validates required customer fields, calls `db.createOrder()`, generates an order ID (e.g., `CK-89421`), and saves it to `inMemoryOrders`.
7. Cart is cleared, and an order confirmation screen is displayed.

### Core Flow 3: Admin CMS & Live Publishing
1. Store administrator accesses `/admin` or presses `Ctrl+Shift+A` on the storefront.
2. Login form sends `POST /api/auth/login` with password.
3. Server checks against `ADMIN_PASSWORD` (default `chandrakanta2026`) and returns a 7-day signed JWT.
4. Token is saved in `localStorage` (`ck_admin_token`).
5. Admin edits content in [`AdminDashboard.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/admin/AdminDashboard.jsx), triggering `PUT /api/admin/draft/:section` or `PUT /api/admin/draft`.
6. Server updates `inMemoryDraft` (and the `draft` document in MongoDB if connected).
7. Admin clicks "Publish to Storefront" -> `POST /api/admin/publish`.
8. Server copies `inMemoryDraft` to `inMemoryLive` (and updates MongoDB `live` document), setting a new `lastPublishedAt` timestamp.

---

## 5. Conventions

### Code Style & Patterns
- **Styling**: All global styling and CSS custom properties are maintained in [`client/src/styles/index.css`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/styles/index.css). Design tokens include:
  - Background: `--bg: #faf8f5;`
  - Accent Red: `--accent: #7B1C1C;`
  - Gold: `--gold: #C8922A;`
  - Surface: `--surface: #ffffff;`
  - Typography: `--font-disp: 'Playfair Display', Georgia, serif;`, `--font-body: 'Mulish', 'Helvetica Neue', sans-serif;`
- **Component Design**: Functional components with hooks; no external UI component libraries (custom vanilla CSS classes used throughout).
- **Authentication**: Bearer token authentication via HTTP headers (`Authorization: Bearer <token>`) protected by the `requireAuth` middleware in [`server/index.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/index.js).
- **Error Handling**: API endpoints wrap logic in `try/catch` and return `{ success: false, error: err.message }` or `{ error: ... }`.
- **Git & Commits**: There is currently **no Git repository initialized** in the workspace.

---

## 6. How to Run, Build, and Test

### Prerequisites
- Node.js `v20+` (current environment: `v24.22.0`)
- On Windows PowerShell, use `npm.cmd` instead of `npm` if script execution policies block `.ps1` files.

### 1. Backend Server
```powershell
# Navigate to server
cd c:\Users\Felix\Desktop\chandraknta\website\server

# Install dependencies (if needed)
npm.cmd install

# Start in development mode (with Node --watch)
npm.cmd run dev

# Or start standard production server
npm.cmd start
```
*Server runs on:* `http://localhost:5000`

### 2. Frontend Client
```powershell
# Navigate to client
cd c:\Users\Felix\Desktop\chandraknta\website\client

# Install dependencies (if needed)
npm.cmd install

# Start Vite dev server
npm.cmd run dev

# Build production bundle
npm.cmd run build

# Preview production build
npm.cmd run preview
```
*Frontend runs on:* `http://localhost:3000`

### 3. Tests and Linting
- **Tests**: None configured. Neither `client` nor `server` has test runners (Vitest, Jest, Mocha) or test scripts in `package.json`.
- **Linting**: No ESLint or Prettier configuration files are present in the repository.

### 4. Required Environment Variables (`server/.env`)
*Note: Variable names only; never store secrets in notes or code.*
- `PORT` (e.g. `5000`)
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `MONGODB_URI` *(Optional: runs in-memory if empty)*
- `RAZORPAY_KEY_ID` *(Optional: runs simulated if empty)*
- `RAZORPAY_KEY_SECRET` *(Optional: runs simulated if empty)*
- `UPI_VPA`
- `UPI_MERCHANT_NAME`
- `CLOUDINARY_CLOUD_NAME` *(Optional: saves to client/public/uploads if empty)*
- `CLOUDINARY_API_KEY` *(Optional)*
- `CLOUDINARY_API_SECRET` *(Optional)*

---

## 7. Risks and Tech Debt

1. **No Version Control**:
   - The workspace directory is not a Git repository. Any file edits are irreversible without manual backups.
2. **Database Persistence Gaps**:
   - `server/models/Product.js` and `server/models/Order.js` exist, but [`server/db.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/db.js) stores orders strictly in an in-memory array (`inMemoryOrders`). Orders are completely lost whenever the server restarts.
   - Products are stored inside the monolithic `live` and `draft` content JSON documents in the `Content` collection rather than using the `Product` collection.
3. **Hardcoded Secrets in Source**:
   - [`server/index.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/index.js) and [`server/.env`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/.env) contain default fallback credentials for `JWT_SECRET` and `ADMIN_PASSWORD`.
4. **Monolithic Backend Routing**:
   - The `server/routes/` folder is empty; all API routes (public content, products, categories, orders, payments, auth, admin CMS, media) are concentrated in [`server/index.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/index.js).
5. **Monolithic Admin Component**:
   - [`AdminDashboard.jsx`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/admin/AdminDashboard.jsx) is 1,125 lines, bundling state, modals, tabs, forms, and custom styles in a single file.
6. **Data Duplication**:
   - Seed data in [`server/data/defaultData.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/server/data/defaultData.js) and [`client/src/data/defaultStoreData.js`](file:///c:/Users/Felix/Desktop/chandraknta/website/client/src/data/defaultStoreData.js) are separate duplicates of the same 284 lines of data. Changes made to one will not reflect in the other.
7. **Zero Automated Test Coverage**:
   - There are no unit, integration, or end-to-end tests for checkout calculations, auth verification, or database synchronization.

---

## 8. Open Questions

1. **Version Control**: Should we initialize a Git repository in this directory (`git init`) or connect to an existing remote repository?
2. **Order & Product Persistence**: Should customer orders and catalog products be persisted into dedicated MongoDB collections (`Order` and `Product` models), or continue living inside the in-memory array / monolithic `Content` document?
3. **Admin Authentication**: Would you like to introduce hashed admin passwords (e.g., bcrypt) and multiple admin user roles, or keep the single shared environment password?
4. **Production Payment Setup**: Are Razorpay API keys and a live MongoDB instance ready to be hooked up, or should we continue developing in simulation mode?
