import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

export default function WishlistDrawer() {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, addToCart } = useCart();
  const { content } = useStore();
  const allProducts = content?.products || [];

  if (!isWishlistOpen) return null;

  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (prod) => {
    addToCart(prod, prod.swatches?.[0], 1);
    toggleWishlist(prod.id);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="var(--accent)" fill="var(--accent)" />
            <h2 className="drawer-title">Saved Wishlist ({wishlistedProducts.length})</h2>
          </div>
          <button
            className="drawer-close"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
          >
            <X size={18} />
          </button>
        </div>

        <div className="drawer-content">
          {wishlistedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 10px', color: 'var(--text-muted)' }}>
              <Heart size={48} strokeWidth={1.5} color="var(--border-dk)" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'var(--font-disp)', fontSize: '18px', color: 'var(--text)', marginBottom: '6px' }}>
                Your wishlist is empty
              </p>
              <p style={{ fontSize: '13px' }}>Save your favorite handcrafted weaves to revisit anytime.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {wishlistedProducts.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      width: '68px',
                      height: '84px',
                      objectFit: 'cover',
                      borderRadius: 'var(--r-sm)'
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '.1em' }}>
                      {prod.type}
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                      {prod.name}
                    </h3>
                    <div className="pricing" style={{ marginBottom: '8px' }}>
                      <span className="p-cur" style={{ fontSize: '14px' }}>₹{prod.price?.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && <span className="p-was">₹{prod.originalPrice?.toLocaleString('en-IN')}</span>}
                    </div>

                    <button
                      onClick={() => handleMoveToCart(prod)}
                      className="btn-pri"
                      style={{ padding: '6px 14px', fontSize: '10px' }}
                    >
                      <ShoppingBag size={12} />
                      Move to Bag
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    style={{ color: 'var(--text-light)', padding: '6px', alignSelf: 'flex-start' }}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
