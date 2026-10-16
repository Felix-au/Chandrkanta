import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    itemCount,
    subtotal,
    shippingFee,
    total,
    freeThreshold,
    updateQuantity,
    removeFromCart,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  const neededForFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--accent)" />
            <h2 className="drawer-title">Your Shopping Bag ({itemCount})</h2>
          </div>
          <button
            className="drawer-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ background: 'var(--surface-2)', padding: '12px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
            <Truck size={14} color="var(--gold)" />
            {neededForFree === 0 ? (
              <span style={{ color: '#2d6b2d' }}>🎉 Congratulations! You qualify for Free Delivery!</span>
            ) : (
              <span>Add ₹{neededForFree.toLocaleString('en-IN')} more to unlock <strong>FREE Shipping</strong></span>
            )}
          </div>
          <div style={{ width: '100%', height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: neededForFree === 0 ? '#2d6b2d' : 'var(--gold)',
                transition: 'width .3s ease'
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="drawer-content">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 10px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} strokeWidth={1.5} color="var(--border-dk)" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontFamily: 'var(--font-disp)', fontSize: '18px', color: 'var(--text)', marginBottom: '6px' }}>
                Your bag is empty
              </p>
              <p style={{ fontSize: '13px', marginBottom: '20px' }}>
                Discover our handcrafted Banarasi sarees and unstitched suits.
              </p>
              <button
                className="btn-pri"
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'center'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '68px',
                      height: '84px',
                      objectFit: 'cover',
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--surface-2)'
                    }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '.1em' }}>
                      {item.type}
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                      {item.name}
                    </h3>

                    {/* Color badge */}
                    {item.selectedColor && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Weave:</span>
                        <span
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: item.selectedColor,
                            border: '1px solid var(--border)'
                          }}
                        />
                      </div>
                    )}

                    {/* Price & Quantity */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, -1)}
                          style={{ padding: '2px 8px', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '2px 8px', fontSize: '12px', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, 1)}
                          style={{ padding: '2px 8px', fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedColor)}
                    style={{ color: 'var(--text-light)', padding: '6px', alignSelf: 'flex-start' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              <span>Delivery Charges</span>
              <span>{shippingFee === 0 ? <strong style={{ color: '#2d6b2d' }}>FREE</strong> : `₹${shippingFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '18px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              <span>Estimated Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-pri"
              style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
            >
              Proceed to Checkout
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
