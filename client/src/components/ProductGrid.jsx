import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

export default function ProductGrid({ activeCategory, searchQuery, onSelectCategory }) {
  const { content } = useStore();
  const { addToCart, toggleWishlist, isWishlisted, setSelectedProduct } = useCart();
  const [selectedSwatches, setSelectedSwatches] = useState({});

  const products = content?.products || [];

  // Filter tabs
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'sarees', label: 'Sarees' },
    { id: 'suits', label: 'Suit Sets' },
    { id: 'bridal', label: 'Bridal' },
    { id: 'new', label: 'New In' }
  ];

  // Filtering logic
  const filteredProducts = products.filter((prod) => {
    // Category match
    if (activeCategory === 'new') {
      if (!prod.isNew && prod.badge?.toLowerCase() !== 'new') return false;
    } else if (activeCategory && activeCategory !== 'all') {
      if (prod.category?.toLowerCase() !== activeCategory.toLowerCase()) return false;
    }

    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name?.toLowerCase().includes(q);
      const matchType = prod.type?.toLowerCase().includes(q);
      const matchDesc = prod.description?.toLowerCase().includes(q);
      if (!matchName && !matchType && !matchDesc) return false;
    }

    return true;
  });

  const handleSwatchSelect = (productId, colorHex, e) => {
    e.stopPropagation();
    setSelectedSwatches((prev) => ({ ...prev, [productId]: colorHex }));
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const chosenColor = selectedSwatches[product.id] || product.swatches?.[0];
    addToCart(product, chosenColor, 1);
  };

  const handleWishlistClick = (productId, e) => {
    e.stopPropagation();
    toggleWishlist(productId);
  };

  return (
    <section className="prods" id="sarees" aria-labelledby="prod-h2">
      <div className="prods-in">
        <div className="sec-hdr">
          <p className="sec-label">Bestsellers</p>
          <h2 className="sec-title" id="prod-h2">Our Finest Picks</h2>
          <p className="sec-desc">
            Curated with love — each piece tells a story of artisanal craftsmanship.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="tabs" role="tablist" aria-label="Product filters">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeCategory === tab.id ? 'on' : ''}`}
              role="tab"
              aria-selected={activeCategory === tab.id}
              onClick={() => onSelectCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontFamily: 'var(--font-disp)', fontSize: '20px', marginBottom: '8px' }}>
              No weaves found in this category
            </p>
            <p style={{ fontSize: '14px' }}>Try switching filters or clearing your search query.</p>
            <button
              className="btn-pri"
              onClick={() => onSelectCategory('all')}
              style={{ marginTop: '18px' }}
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="prod-grid" role="list">
            {filteredProducts.map((prod) => {
              const loved = isWishlisted(prod.id);
              const activeSwatch = selectedSwatches[prod.id] || prod.swatches?.[0];

              return (
                <article
                  key={prod.id}
                  className="prod-card"
                  role="listitem"
                  aria-label={prod.name}
                  onClick={() => setSelectedProduct(prod)}
                >
                  <div className="prod-img">
                    <img
                      src={prod.image || '/images/saree-teal.jpg'}
                      alt={prod.name}
                      loading="lazy"
                    />

                    {/* Badge */}
                    {prod.badge && (
                      <span className={`badge ${prod.badge.toLowerCase() === 'new' ? 'new' : ''}`}>
                        {prod.badge}
                      </span>
                    )}

                    {/* Wishlist Heart */}
                    <button
                      className={`wish-btn ${loved ? 'loved' : ''}`}
                      aria-label={loved ? 'Remove from wishlist' : 'Add to wishlist'}
                      onClick={(e) => handleWishlistClick(prod.id, e)}
                    >
                      <Heart size={15} fill={loved ? 'currentColor' : 'none'} strokeWidth={2} />
                    </button>

                    {/* Slide-Up Add To Cart */}
                    <div
                      className="atc"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleAddToCart(prod, e)}
                    >
                      Add to Cart
                    </div>
                  </div>

                  <div className="prod-info">
                    <p className="prod-type">{prod.type || 'Ethnic Wear'}</p>
                    <h3 className="prod-name">{prod.name}</h3>

                    <div className="pricing">
                      <span className="p-cur">₹{prod.price?.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && (
                        <span className="p-was">₹{prod.originalPrice?.toLocaleString('en-IN')}</span>
                      )}
                      {prod.discount && <span className="p-off">{prod.discount}</span>}
                    </div>

                    {/* Color Swatches */}
                    {prod.swatches && prod.swatches.length > 0 && (
                      <div className="swatches" aria-label="Color choices">
                        {prod.swatches.map((color, idx) => (
                          <span
                            key={idx}
                            className={`sw ${activeSwatch === color ? 'on' : ''}`}
                            style={{ background: color }}
                            aria-label={`Color option ${idx + 1}`}
                            onClick={(e) => handleSwatchSelect(prod.id, color, e)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
