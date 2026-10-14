# Chandrakanta — Luxury Handlooms & Ethnic Wear

A full-stack Indian ethnic e-commerce platform specializing in handcrafted Banarasi silk sarees, Kanjivaram sarees, and unstitched suit sets.

## Features

- **Storefront**: High-performance React 19 single-page application built with Vite and luxury ethnic design tokens.
- **Interactive UI**: Animated announcement marquee, dynamic hero banner, category filters, product quick-view modal, slide-out cart & wishlist drawers.
- **Checkout & Payments**: Multi-method checkout supporting Cash on Delivery (COD), UPI (with dynamic QR codes), and Razorpay integration.
- **Dual-Mode Backend**: Express REST API running in-memory by default with automatic sync to MongoDB Atlas when configured.
- **Admin CMS**: Real-time content management system with live vs. draft preview and one-click publishing.
- **Media Uploads**: Integrated Cloudinary cloud storage with automatic local disk fallback.

## Project Structure

```
├── client/           # React 19 + Vite frontend
├── server/           # Express.js REST API backend
├── skillui-extract/  # Design system tokens and specifications
├── vercel.json       # Vercel deployment configuration
├── render.yaml       # Render deployment blueprint
└── README.md
```

## Local Development

### 1. Server
```bash
cd server
npm install
npm run dev
```

### 2. Client
```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` and proxies API requests to `http://localhost:5000`.

## Deployment

- **Frontend (Vercel)**: Connect repository to Vercel. Set Root Directory to `client` or use root `vercel.json`.
- **Backend (Render)**: Deploy using the included `render.yaml` Blueprint or create a Node Web Service pointed at `server/`.
