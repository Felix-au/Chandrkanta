import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import CategoryGrid from './components/CategoryGrid';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import FestiveBanner from './components/FestiveBanner';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './admin/AdminDashboard';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { Phone, MessageCircle, ShoppingBag } from 'lucide-react';

function StorefrontContent({ onOpenAdmin }) {
  const { content } = useStore();
  const { itemCount, setIsCartOpen } = useCart();
  const settings = content?.settings || {};
  const layout = content?.layout || {};
  const visibleSections = layout.visibleSections || {};

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterCategory = (catId, query = '') => {
    setActiveCategory(catId);
    setSearchQuery(query);
  };

  const defaultOrder = [
    'hero',
    'trustStrip',
    'categories',
    'featuredProducts',
    'festiveBanner',
    'whyUs',
    'testimonials',
    'newsletter'
  ];
  const sectionOrder = layout.sectionOrder || defaultOrder;

  const renderSection = (key) => {
    switch (key) {
      case 'hero':
        return <Hero key="hero" onFilterCategory={handleFilterCategory} />;
      case 'trustStrip':
        return <TrustStrip key="trustStrip" />;
      case 'categories':
        return <CategoryGrid key="categories" onSelectCategory={handleFilterCategory} />;
      case 'featuredProducts':
      case 'products':
        return (
          <ProductGrid
            key="products"
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onSelectCategory={handleFilterCategory}
          />
        );
      case 'festiveBanner':
      case 'festive':
        return <FestiveBanner key="festive" onExplore={handleFilterCategory} />;
      case 'whyUs':
        return <WhyUs key="whyUs" />;
      case 'testimonials':
        return <Testimonials key="testimonials" />;
      case 'newsletter':
        return <Newsletter key="newsletter" />;
      default:
        return null;
    }
  };

  return (
    <div className="chandrakanta-storefront">
      {/* Dynamic Announcement Marquee */}
      <AnnouncementBar />

      {/* Header Navigation */}
      <Navbar
        onOpenAdmin={onOpenAdmin}
        onFilterCategory={handleFilterCategory}
      />

      <main>
        {/* Render Sections in Dynamic Ordered Flow */}
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </main>

      {/* Footer */}
      <Footer
        onFilterCategory={handleFilterCategory}
        onOpenAdmin={onOpenAdmin}
      />

      {/* Slide-out & Modal Overlays */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <CheckoutModal />

      {/* Mobile Floating Action Bar */}
      {visibleSections.floatingMobileBar !== false && (
        <div className="mobile-floating-bar">
          <a
            href={`tel:${settings.phonePrimary || '+919876543210'}`}
            className="mobile-bar-btn call"
            aria-label="Call Store"
          >
            <Phone size={16} />
            <span>Call Now</span>
          </a>

          <a
            href={`https://wa.me/${settings.whatsappNumber || '919876543210'}?text=Namaste!%20I%20would%20like%20to%20inquire%20about%20Chandrakanta%20ethnic%20wear.`}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-bar-btn wa"
            aria-label="WhatsApp Inquiry"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => setIsCartOpen(true)}
            className="mobile-bar-btn bag"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag size={16} />
            <span>Bag ({itemCount})</span>
          </button>
        </div>
      )}

      <style>{`
        .chandrakanta-storefront {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
        }

        main {
          flex: 1;
        }

        .mobile-floating-bar {
          display: none;
          position: fixed;
          bottom: 12px;
          left: 12px;
          right: 12px;
          z-index: 1500;
          background: rgba(250, 248, 245, 0.96);
          backdrop-filter: blur(16px);
          border: 1.5px solid rgba(200, 146, 42, 0.35);
          border-radius: var(--r-full, 999px);
          padding: 6px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          gap: 6px;
        }

        .mobile-bar-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 8px;
          border-radius: var(--r-full, 999px);
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }

        .mobile-bar-btn.call {
          background: rgba(123, 28, 28, 0.08);
          color: var(--accent);
          border: 1px solid rgba(123, 28, 28, 0.2);
        }

        .mobile-bar-btn.wa {
          background: #25d366;
          color: #ffffff;
        }

        .mobile-bar-btn.bag {
          background: var(--accent);
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .mobile-floating-bar {
            display: flex;
          }
          footer {
            padding-bottom: 5.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // Prevent opening admin inside the preview iframe to avoid recursion
    if (window.self !== window.top) {
      setIsAdminOpen(false);
      return;
    }

    // Check URL for /admin, ?admin=true, or #admin
    const checkAdminRoute = () => {
      if (window.self !== window.top) return;
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (
        path === '/admin' ||
        path === '/admin/' ||
        params.get('admin') === 'true' ||
        window.location.hash === '#admin'
      ) {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);

    // Keyboard shortcut: Ctrl + Shift + A
    const handleKeyDown = (e) => {
      if (window.self !== window.top) return;
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.startsWith('/admin') || window.location.search.includes('admin') || window.location.hash === '#admin') {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <StoreProvider>
      <CartProvider>
        <StorefrontContent onOpenAdmin={() => setIsAdminOpen(true)} />
        {isAdminOpen && <AdminDashboard onClose={handleCloseAdmin} />}
      </CartProvider>
    </StoreProvider>
  );
}
