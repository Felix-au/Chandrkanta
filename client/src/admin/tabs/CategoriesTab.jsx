import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import { Layers, Plus, Trash2, Edit3, Eye, Check, X } from 'lucide-react';

export default function CategoriesTab({
  categories = [],
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  token,
  sendFocusToPreview,
  sendBlurToPreview,
  scrollPreviewToSection
}) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenNew = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name: '',
      count: '50+ Styles',
      image: '/images/cat-saree.jpg'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingCategory.name) {
      alert('Category name is required');
      return;
    }

    const existing = categories.some((c) => c.id === editingCategory.id);
    if (existing) {
      await onUpdateCategory(editingCategory.id, editingCategory);
    } else {
      await onAddCategory(editingCategory);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (cat) => {
    if (confirm(`Delete collection "${cat.name}"?`)) {
      await onDeleteCategory(cat.id);
    }
  };

  return (
    <div className="cms-tab-content">
      {/* Header */}
      <div className="cms-tab-header">
        <div className="cms-tab-title-wrap">
          <Layers className="cms-tab-icon" size={20} />
          <div>
            <h3>Collections & Category Cards</h3>
            <p>Curate visual category cards, collection covers, and style counts.</p>
          </div>
        </div>

        <button
          type="button"
          className="cms-btn-primary"
          onClick={handleOpenNew}
        >
          <Plus size={15} /> Add Collection
        </button>
      </div>

      <div className="cms-items-list">
        {categories.map((cat, idx) => {
          const targetKey = `categories.${idx}`;
          return (
            <div
              key={cat.id || idx}
              className="cms-category-row-card"
              data-editor-target={targetKey}
            >
              <img
                src={cat.image || '/images/cat-saree.jpg'}
                alt={cat.name}
                className="cms-category-thumb"
              />

              <div className="cms-category-info">
                <h4>{cat.name}</h4>
                <p>{cat.count || 'Styles'}</p>
                <small>Slug: #{cat.id}</small>
              </div>

              <div className="cms-category-actions">
                <button
                  type="button"
                  className="cms-action-icon-btn"
                  onClick={() => {
                    scrollPreviewToSection('categories');
                    sendFocusToPreview(targetKey, true);
                  }}
                  title="Focus in preview"
                >
                  <Eye size={14} />
                </button>
                <button
                  type="button"
                  className="cms-action-icon-btn"
                  onClick={() => handleEdit(cat)}
                  title="Edit collection"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  className="cms-action-icon-btn delete"
                  onClick={() => handleDelete(cat)}
                  title="Delete collection"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && editingCategory && (
        <div className="cms-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="cms-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <h3>{categories.some(c => c.id === editingCategory.id) ? 'Edit Collection' : 'New Collection Card'}</h3>
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
                  <label>Collection Title *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="cms-input"
                    placeholder="e.g. Bridal Lehengas"
                  />
                </div>
                <div className="cms-input-field">
                  <label>Styles Count Tag</label>
                  <input
                    type="text"
                    value={editingCategory.count}
                    onChange={(e) => setEditingCategory({ ...editingCategory, count: e.target.value })}
                    className="cms-input"
                    placeholder="e.g. 150+ Styles"
                  />
                </div>
              </div>

              <ImageUploader
                label="Collection Cover Photography"
                value={editingCategory.image || ''}
                onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                token={token}
                folder="chandrakanta/categories"
              />

              <div className="cms-modal-actions">
                <button
                  type="button"
                  className="cms-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cms-btn-primary">
                  <Check size={14} /> Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
