import React from 'react';

export default function ProductsTab({ products = [], onEdit, onDelete }) {
  return (
    <div className="products-tab">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Products Catalog ({products.length})</h3>
        <button type="button" style={{ padding: '8px 16px', background: '#c8922a', color: '#fff', border: 'none', borderRadius: '6px' }}>New Product</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8f8f8', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Product</th>
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Price</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id || p._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{p.name}</td>
              <td style={{ padding: '10px' }}>{p.category}</td>
              <td style={{ padding: '10px' }}>₹{p.price}</td>
              <td style={{ padding: '10px' }}>
                <button type="button" onClick={() => onEdit?.(p)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
