import React from 'react';

export default function CategoriesTab({ categories = [], onEdit, onDelete }) {
  return (
    <div className="categories-tab">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Store Categories ({categories.length})</h3>
        <button type="button" style={{ padding: '8px 16px', background: '#c8922a', color: '#fff', border: 'none', borderRadius: '6px' }}>Add Category</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {categories.map(cat => (
          <div key={cat.id || cat._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '12px' }}>
            <h4>{cat.name}</h4>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{cat.itemCount || 0} Products</p>
          </div>
        ))}
      </div>
    </div>
  );
}
