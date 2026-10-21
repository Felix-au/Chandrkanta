import React from 'react';

export default function OrdersTab({ orders = [], onStatusUpdate }) {
  return (
    <div className="orders-tab">
      <h3>Customer Orders ({orders.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ background: '#f8f8f8', textAlign: 'left' }}>
            <th style={{ padding: '10px' }}>Order ID</th>
            <th style={{ padding: '10px' }}>Customer</th>
            <th style={{ padding: '10px' }}>Amount</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.orderId || o.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{o.orderId}</td>
              <td style={{ padding: '10px' }}>{o.customerName || o.shippingAddress?.name || 'Guest'}</td>
              <td style={{ padding: '10px' }}>₹{o.totalAmount || o.amount}</td>
              <td style={{ padding: '10px' }}>{o.orderStatus || 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
