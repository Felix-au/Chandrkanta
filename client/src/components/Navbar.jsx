import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Settings, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenAdmin, onFilterCategory }) {
  const { content } = useStore();
  const { itemCount, wishlist, setIsCartOpen, setIsWishlistOpen } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const settings = content?.settings || {};
  const brandName = settings.brandName || 'Chandrakanta';
  const tagline = settings.tagline || 'Premium Ethnic Wear';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onFilterCategory) {
      onFilterCategory('all', searchQuery);
    }
    const section = document.getElementById('sarees');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setIsSearchOpen(false);
  };

  const handleNavClick = (catId) => {
    if (onFilterCategory) {
      onFilterCategory(catId);
    }
    const section = document.getElementById('sarees');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="nav-wrap" role="navigation" aria-label="Site navigation">
      <div className="nav-top">
        {/* Left primary links */}
        <nav className="nav-links" aria-label="Primary left">
          <a href="#sarees" onClick={() => handleNavClick('sarees')}>Sarees</a>
          <a href="#suits" onClick={() => handleNavClick('suits')}>Suit Sets</a>
          <a href="#festive">Festive</a>
        </nav>

        {/* Center Logo */}
        <a href="#" className="nav-logo" aria-label={`${brandName} — Home`}>
          <span className="nav-logo-name">{brandName}</span>
          <span className="nav-logo-tag">{tagline}</span>
        </a>

        {/* Right action icons */}
        <div className="nav-acts">
          <button
            className="nav-btn"
            aria-label="Search collection"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            title="Search Products"
          >
            <Search size={18} strokeWidth={2} />
          </button>

          <button
            className="nav-btn"
            aria-label={`Wishlist — ${wishlist.length} items`}
            onClick={() => setIsWishlistOpen(true)}
            title="View Wishlist"
          >
            <Heart size={18} strokeWidth={2} />
            {wishlist.length > 0 && <span className="dot">{wishlist.length}</span>}
          </button>

          <div className="cart-wrap">
            <button
              className="nav-btn"
              aria-label={`Cart — ${itemCount} items`}
              onClick={() => setIsCartOpen(true)}
              title="View Cart"
            >
              <ShoppingBag size={18} strokeWidth={2} />
              {itemCount > 0 && <span className="dot">{itemCount}</span>}
            </button>
          </div>

          {/* Admin Studio trigger */}
          <button
            className="nav-btn"
            aria-label="Admin Studio"
            onClick={onOpenAdmin}
            title="Admin Studio (Ctrl+Shift+A)"
            style={{ color: 'var(--accent)' }}
          >
            <Settings size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {isSearchOpen && (
        <div style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '12px 24px',
          animation: 'fadeIn .2s ease'
        }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search sarees, suit sets, fabrics, colors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                color: 'var(--text)'
              }}
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              style={{ color: 'var(--text-muted)', padding: '4px' }}
            >
              <X size={16} />
            </button>
            <button
              type="submit"
              className="btn-pri"
              style={{ padding: '8px 16px', fontSize: '10px' }}
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Category Ribbon */}
      <div className="nav-strip" aria-label="Category navigation">
        <div className="nav-strip-in">
          <button onClick={() => handleNavClick('sarees')}>Banarasi</button>
          <button onClick={() => handleNavClick('sarees')}>Kanjivaram</button>
          <button onClick={() => handleNavClick('sarees')}>Chiffon</button>
          <button onClick={() => handleNavClick('suits')}>Anarkali Sets</button>
          <button onClick={() => handleNavClick('suits')}>Straight Cut</button>
          <button onClick={() => handleNavClick('bridal')}>Lehenga Sets</button>
          <button onClick={() => handleNavClick('bridal')}>Bridal</button>
          <button onClick={() => handleNavClick('new')}>New Arrivals</button>
          <button onClick={() => handleNavClick('all')}>All Collections</button>
        </div>
      </div>
    </div>
  );
}
