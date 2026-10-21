import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Check, 
  Tag, 
  Layers,
  Sparkles
} from 'lucide-react';

export default function ProductsTab({
  products = [],
  categories = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  token,
  sendFocusToPreview,
  sendBlurToPreview,
  scrollPreviewToSection
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSwatch, setNewSwatch] = useState('#7B1C1C');

  // Filter products
  const filtered = products.filter((p) => {
    if (selectedCat !== 'all' && p.category?.toLowerCase() !== selectedCat.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchType = p.type?.toLowerCase().includes(q);
      if (!matchName && !matchType) return false;
    }
    return true;
  });

  const handleOpenNew = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: '',
      type: 'Handloom Saree',
      category: categories[0]?.id || 'sarees',
      price: 2999,
      originalPrice: 4500,
      discount: '33% off',
      badge: 'New Arrival',
      image: '/images/saree-teal.jpg',
      swatches: ['#7B1C1C', '#C8922A', '#1a6b6b'],
      stock: 10,
      description: '',
      details: ['Pure Handcrafted Weave', 'Zari Border', 'Dry Clean Only']
    });
    setIsModalOpen(true);
  };

  const handleEdit = (prod) => {
    setEditingProduct({ ...prod });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price) {
      alert('Product name and price are required');
      return;
    }

    const existingIdx = products.findIndex((p) => p.id === editingProduct.id);
    if (existingIdx !== -1) {
      await onUpdateProduct(editingProduct.id, editingProduct);
    } else {
      await onAddProduct(editingProduct);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (prod) => {
    if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
      await onDeleteProduct(prod.id);
    }
  };

  const handleAddSwatch = () => {
    if (!newSwatch) return;
    const current = editingProduct.swatches || [];
    if (!current.includes(newSwatch)) {
      setEditingProduct({
        ...editingProduct,
        swatches: [...current, newSwatch]
      });
    }
  };

  const handleRemoveSwatch = (color) => {
    setEditingProduct({
      ...editingProduct,
      swatches: (editingProduct.swatches || []).filter((c) => c !== color)
    });
  };

  return (
    <div className="cms-tab-content">
      {/* Header */}
      <div className="cms-tab-header">
        <div className="cms-tab-title-wrap">
          <ShoppingBag className="cms-tab-icon" size={20} />
          <div>
            <h3>Product Catalog Management</h3>
            <p>Manage handloom sarees, suits, bridal lehengas, swatches, and pricing.</p>
          </div>
        </div>

        <button
          type="button"
          className="cms-btn-primary"
          onClick={handleOpenNew}
        >
          <Plus size={15} /> Add New Weave
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="cms-filter-toolbar">
        <div className="cms-search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search by weave name, fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="cms-select"
          style={{ maxWidth: '180px' }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
          <option value="sarees">Sarees</option>
          <option value="suits">Suit Sets</option>
          <option value="bridal">Bridal</option>
        </select>

        <span className="cms-count-pill">{filtered.length} Weaves</span>
      </div>

      {/* Product Items List */}
      <div className="cms-prods-list">
        {filtered.map((prod, idx) => {
          const originalIdx = products.findIndex((p) => p.id === prod.id);
          const targetKey = `products.${originalIdx >= 0 ? originalIdx : idx}`;

          return (
            <div
              key={prod.id}
              className="cms-prod-row-card"
              data-editor-target={targetKey}
            >
              <img
                src={prod.image || '/images/saree-teal.jpg'}
                alt={prod.name}
                className="cms-prod-row-thumb"
              />

              <div className="cms-prod-row-info">
                <div className="cms-prod-row-top">
                  <span className="cms-tag-pill">{prod.type || 'Ethnic Wear'}</span>
                  {prod.badge && <span className="cms-badge-pill">{prod.badge}</span>}
                </div>
                <h4 className="cms-prod-row-name">{prod.name}</h4>
                <div className="cms-prod-row-meta">
                  <strong className="cms-price">₹{prod.price?.toLocaleString('en-IN')}</strong>
                  {prod.originalPrice && (
                    <span className="cms-was">₹{prod.originalPrice?.toLocaleString('en-IN')}</span>
                  )}
                  {prod.discount && <span className="cms-off">{prod.discount}</span>}
                  <span className="cms-stock">Stock: {prod.stock || 10}</span>
                </div>
                {/* Swatches preview */}
                {prod.swatches && prod.swatches.length > 0 && (
                  <div className="cms-prod-swatches-strip">
                    {prod.swatches.map((color, sIdx) => (
                      <span key={sIdx} className="cms-dot-swatch" style={{ background: color }}></span>
                    ))}
                  </div>
                )}
              </div>

              <div className="cms-prod-row-actions">
                <button
                  type="button"
                  className="cms-action-icon-btn"
                  onClick={() => {
                    scrollPreviewToSection('products');
                    sendFocusToPreview(targetKey, true);
                  }}
                  title="Focus in live preview"
                >
                  <Eye size={14} />
                </button>
                <button
                  type="button"
                  className="cms-action-icon-btn"
                  onClick={() => handleEdit(prod)}
                  title="Edit product"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  className="cms-action-icon-btn delete"
                  onClick={() => handleDelete(prod)}
                  title="Delete product"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="cms-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="cms-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <h3>{products.some(p => p.id === editingProduct.id) ? 'Edit Luxury Weave' : 'Add New Product'}</h3>
              <button
                type="button"
                className="cms-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="cms-modal-form">
              <div className="cms-input-row">
                <div className="cms-input-field">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="cms-input"
                    placeholder="e.g. Royal Banarasi Silk Saree"
                  />
                </div>
                <div className="cms-input-field">
                  <label>Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="cms-select"
                  >
                    <option value="sarees">Sarees</option>
                    <option value="suits">Suit Sets</option>
                    <option value="bridal">Bridal Lehengas</option>
                  </select>
                </div>
              </div>

              <div className="cms-input-row">
                <div className="cms-input-field">
                  <label>Weave Type</label>
                  <input
                    type="text"
                    value={editingProduct.type}
                    onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })}
                    className="cms-input"
                    placeholder="e.g. Katan Silk, Chanderi"
                  />
                </div>
                <div className="cms-input-field">
                  <label>Badge Highlight</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="cms-input"
                    placeholder="e.g. Bestseller, New, Trending"
                  />
                </div>
              </div>

              <div className="cms-input-row">
                <div className="cms-input-field">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const orig = editingProduct.originalPrice || p;
                      const disc = orig > p ? `${Math.round(((orig - p) / orig) * 100)}% off` : '';
                      setEditingProduct({
                        ...editingProduct,
                        price: p,
                        discount: disc
                      });
                    }}
                    className="cms-input"
                  />
                </div>
                <div className="cms-input-field">
                  <label>Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => {
                      const orig = Number(e.target.value);
                      const p = editingProduct.price || orig;
                      const disc = orig > p ? `${Math.round(((orig - p) / orig) * 100)}% off` : '';
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: orig,
                        discount: disc
                      });
                    }}
                    className="cms-input"
                  />
                </div>
                <div className="cms-input-field" style={{ maxWidth: '120px' }}>
                  <label>Stock Count</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="cms-input"
                  />
                </div>
              </div>

              {/* Main Image Uploader */}
              <ImageUploader
                label="Product Main Photo"
                value={editingProduct.image || ''}
                onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                token={token}
                folder="chandrakanta/products"
              />

              {/* Color Swatches */}
              <div className="cms-card-section" style={{ marginTop: '14px' }}>
                <label className="cms-field-label">Color Swatches</label>
                <div className="cms-swatches-manager">
                  <div className="cms-active-swatches">
                    {(editingProduct.swatches || []).map((color, idx) => (
                      <span
                        key={idx}
                        className="cms-swatch-chip"
                        style={{ background: color }}
                        onClick={() => handleRemoveSwatch(color)}
                        title="Click to remove"
                      >
                        ✕
                      </span>
                    ))}
                  </div>
                  <div className="cms-add-swatch-row">
                    <input
                      type="color"
                      value={newSwatch}
                      onChange={(e) => setNewSwatch(e.target.value)}
                    />
                    <input
                      type="text"
                      value={newSwatch}
                      onChange={(e) => setNewSwatch(e.target.value)}
                      className="cms-input"
                      style={{ width: '100px' }}
                    />
                    <button
                      type="button"
                      className="cms-btn-secondary"
                      onClick={handleAddSwatch}
                    >
                      <Plus size={13} /> Add Swatch
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="cms-input-field" style={{ marginTop: '14px' }}>
                <label>Artisanal Description</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="cms-textarea"
                  rows={3}
                  placeholder="Tell the artisan weaving story..."
                />
              </div>

              <div className="cms-modal-actions">
                <button
                  type="button"
                  className="cms-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cms-btn-primary">
                  <Check size={14} /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
