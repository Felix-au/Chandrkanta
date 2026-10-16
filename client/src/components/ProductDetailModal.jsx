import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart, toggleWishlist, isWishlisted, setIsCheckoutOpen } = useCart();
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const activeColor = selectedColor || product.swatches?.[0] || 'Standard';
  const loved = isWishlisted(product.id);

  const handleAdd = () => {
    addToCart(product, activeColor, qty);
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(product, activeColor, qty);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
      <div
        className="modal-box"
        style={{ maxWidth: '820px', padding: '0', display: 'grid', gridTemplateColumns: '1fr 1fr' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Image */}
        <div style={{ position: 'relative', background: '#f5f0ea', overflow: 'hidden' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '440px' }}
          />
          {product.badge && (
            <span
              className={`badge ${product.badge.toLowerCase() === 'new' ? 'new' : ''}`}
              style={{ position: 'absolute', top: '16px', left: '16px' }}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Right Details */}
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-light)' }}>
              {product.type || 'Ethnic Wear'}
            </span>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{ color: 'var(--text-muted)', padding: '4px' }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '24px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.25 }}>
            {product.name}
          </h2>

          <div className="pricing" style={{ marginBottom: '18px' }}>
            <span className="p-cur" style={{ fontSize: '22px' }}>₹{product.price?.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="p-was" style={{ fontSize: '15px' }}>₹{product.originalPrice?.toLocaleString('en-IN')}</span>
            )}
            {product.discount && <span className="p-off">{product.discount}</span>}
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
            {product.description || 'Authentic handcrafted heritage ethnic wear, carefully woven by master artisans in Varanasi & Lucknow.'}
          </p>

          {/* Color Selector */}
          {product.swatches && product.swatches.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Select Color / Weave
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.swatches.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: color,
                      border: activeColor === color ? '2px solid var(--accent)' : '1.5px solid var(--border-dk)',
                      boxShadow: activeColor === color ? '0 0 0 2px #fff, 0 0 0 4px var(--accent)' : 'none',
                      transition: 'transform .2s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-muted)' }}>
              Quantity
            </label>
            <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ padding: '6px 12px', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}
              >
                -
              </button>
              <span style={{ padding: '6px 14px', fontSize: '14px', fontWeight: 600 }}>{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                style={{ padding: '6px 12px', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', marginBottom: '20px' }}>
            <button
              onClick={handleAdd}
              className="btn-pri"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <ShoppingBag size={15} />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="btn-pri"
              style={{ flex: 1, background: 'var(--gold)', borderColor: 'var(--gold)', color: '#171717', justifyContent: 'center' }}
            >
              Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: loved ? 'var(--accent)' : 'var(--text-muted)'
              }}
              title={loved ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={18} fill={loved ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Value mini trust */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="var(--gold)" /> 100% Handloom
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Truck size={14} color="var(--gold)" /> Free Shipping
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RotateCcw size={14} color="var(--gold)" /> 7-Day Returns
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
