import React from 'react';
import { Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Footer({ onFilterCategory, onOpenAdmin }) {
  const { content } = useStore();
  const settings = content?.settings || {};
  const brandName = settings.brandName || 'Chandrakanta';
  const tagline = settings.tagline || 'Premium Ethnic Wear';

  const handleCategoryClick = (catId) => {
    if (onFilterCategory) onFilterCategory(catId);
    const section = document.getElementById('sarees');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer role="contentinfo">
      <div className="ft-in">
        <div className="ft-top">
          {/* Brand Info */}
          <div className="ft-col">
            <div className="ft-brand-name">{brandName}</div>
            <div className="ft-brand-tag">{tagline}</div>
            <p className="ft-brand-desc">
              Celebrating the timeless beauty of Indian handloom. Sarees, suit sets and bridal couture — crafted with love for the modern Indian woman.
            </p>
            <div className="ft-social" aria-label="Follow us">
              <a href="#" className="soc-btn" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="soc-btn" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="soc-btn" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="ft-col">
            <h3 className="ft-col-ttl">Shop</h3>
            <ul>
              <li><button onClick={() => handleCategoryClick('sarees')}>Banarasi Sarees</button></li>
              <li><button onClick={() => handleCategoryClick('sarees')}>Kanjivaram Sarees</button></li>
              <li><button onClick={() => handleCategoryClick('sarees')}>Chiffon Sarees</button></li>
              <li><button onClick={() => handleCategoryClick('suits')}>Anarkali Suit Sets</button></li>
              <li><button onClick={() => handleCategoryClick('suits')}>Straight Cut Sets</button></li>
              <li><button onClick={() => handleCategoryClick('bridal')}>Bridal Collection</button></li>
              <li><button onClick={() => handleCategoryClick('new')}>New Arrivals</button></li>
            </ul>
          </div>

          {/* Help */}
          <div className="ft-col">
            <h3 className="ft-col-ttl">Help &amp; Orders</h3>
            <ul>
              <li><a href="#hero">Track Your Order</a></li>
              <li><a href="#hero">Returns &amp; Exchanges</a></li>
              <li><a href="#hero">Shipping Info</a></li>
              <li><a href="#hero">Care Instructions</a></li>
              <li><a href="#hero">Contact Us</a></li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  style={{ color: 'var(--gold-lt)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <Shield size={12} /> Admin Studio
                </button>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="ft-col">
            <h3 className="ft-col-ttl">About</h3>
            <ul>
              <li><a href="#hero">Our Story</a></li>
              <li><a href="#hero">Artisans &amp; Weavers</a></li>
              <li><a href="#hero">Varanasi &amp; Kanchipuram</a></li>
              <li><a href="#hero">Privacy Policy</a></li>
              <li><a href="#hero">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="ft-bot">
          <p className="ft-copy">
            © {new Date().getFullYear()} {brandName}. All rights reserved. Handcrafted with ♥ in India.
          </p>
          <div className="pay-icons" aria-label="Accepted payment methods">
            <span className="pay">Visa</span>
            <span className="pay">Mastercard</span>
            <span className="pay">UPI</span>
            <span className="pay">COD</span>
            <span className="pay">Razorpay Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
