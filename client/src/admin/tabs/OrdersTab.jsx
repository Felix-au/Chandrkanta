import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Eye, 
  CreditCard, 
  Phone, 
  MapPin, 
  RotateCw,
  X
} from 'lucide-react';

export default function OrdersTab({
  orders = [],
  onUpdateOrderStatus,
  onRefreshOrders
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchId = o.orderId?.toLowerCase().includes(q);
      const matchName = o.customer?.name?.toLowerCase().includes(q);
      const matchPhone = o.customer?.phone?.toLowerCase().includes(q);
      const matchCity = o.customer?.city?.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  // Analytics summary
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'COMPLETED')
    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
  const placedCount = orders.filter(o => o.orderStatus === 'PLACED').length;
  const shippedCount = orders.filter(o => o.orderStatus === 'SHIPPED').length;

  const handleStatusChange = async (orderId, newOrderStatus, newPaymentStatus) => {
    setIsUpdating(true);
    await onUpdateOrderStatus(orderId, newOrderStatus, newPaymentStatus);
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder(prev => ({
        ...prev,
        orderStatus: newOrderStatus || prev.orderStatus,
        paymentStatus: newPaymentStatus || prev.paymentStatus
      }));
    }
    setIsUpdating(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PLACED': return 'badge-placed';
      case 'CONFIRMED': return 'badge-confirmed';
      case 'SHIPPED': return 'badge-shipped';
      case 'DELIVERED': return 'badge-delivered';
      case 'CANCELLED': return 'badge-cancelled';
      default: return '';
    }
  };

  return (
    <div className="cms-tab-content">
      {/* Header */}
      <div className="cms-tab-header">
        <div className="cms-tab-title-wrap">
          <Package className="cms-tab-icon" size={20} />
          <div>
            <h3>Orders & Fulfillment Command Center</h3>
            <p>Track customer purchases, update shipping stages, and monitor payments.</p>
          </div>
        </div>

        <button
          type="button"
          className="cms-btn-secondary"
          onClick={onRefreshOrders}
          title="Refresh orders"
        >
          <RotateCw size={14} /> Refresh
        </button>
      </div>

      {/* Analytics Metric Bar */}
      <div className="cms-metrics-row">
        <div className="cms-metric-box">
          <span className="cms-metric-num">{orders.length}</span>
          <span className="cms-metric-lbl">Total Orders</span>
        </div>
        <div className="cms-metric-box">
          <span className="cms-metric-num" style={{ color: '#C8922A' }}>{placedCount}</span>
          <span className="cms-metric-lbl">Needs Confirmation</span>
        </div>
        <div className="cms-metric-box">
          <span className="cms-metric-num" style={{ color: '#2563eb' }}>{shippedCount}</span>
          <span className="cms-metric-lbl">In Transit</span>
        </div>
        <div className="cms-metric-box">
          <span className="cms-metric-num" style={{ color: '#16a34a' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="cms-metric-lbl">Settled Revenue</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="cms-filter-toolbar">
        <div className="cms-search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search Order ID, Customer Name, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="cms-select"
          style={{ maxWidth: '170px' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="PLACED">Placed</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="cms-orders-table-wrapper">
        {filtered.length === 0 ? (
          <div className="cms-empty-state">
            <Package size={32} />
            <p>No customer orders matching criteria.</p>
          </div>
        ) : (
          <table className="cms-orders-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ord) => (
                <tr key={ord.orderId}>
                  <td>
                    <strong>{ord.orderId}</strong>
                    <br />
                    <small style={{ color: '#888' }}>
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}
                    </small>
                  </td>
                  <td>
                    <div>{ord.customer?.name}</div>
                    <small style={{ color: '#777' }}>{ord.customer?.city}, {ord.customer?.state}</small>
                  </td>
                  <td>
                    {(ord.items || []).length} item{(ord.items || []).length > 1 ? 's' : ''}
                  </td>
                  <td>
                    <strong>₹{ord.pricing?.total?.toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <span className="cms-pay-badge">{ord.paymentMethod}</span>
                  </td>
                  <td>
                    <span className={`cms-status-badge ${getStatusBadgeClass(ord.orderStatus)}`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`cms-pay-status ${ord.paymentStatus === 'COMPLETED' ? 'paid' : 'pending'}`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="cms-view-order-btn"
                      onClick={() => setSelectedOrder(ord)}
                      title="View Details"
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="cms-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="cms-modal-window" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="cms-modal-header">
              <div>
                <h3>Order #{selectedOrder.orderId}</h3>
                <small style={{ color: '#888' }}>
                  Placed on {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                </small>
              </div>
              <button
                type="button"
                className="cms-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="cms-order-detail-content">
              {/* Customer Info Card */}
              <div className="cms-order-section-box">
                <div className="cms-box-hdr">
                  <MapPin size={14} />
                  <strong>Customer & Delivery Information</strong>
                </div>
                <div className="cms-info-grid">
                  <div><strong>Name:</strong> {selectedOrder.customer?.name}</div>
                  <div><strong>Phone:</strong> {selectedOrder.customer?.phone}</div>
                  <div><strong>Email:</strong> {selectedOrder.customer?.email || 'N/A'}</div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Shipping Address:</strong> {selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.state} – {selectedOrder.customer?.pincode}
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="cms-order-section-box">
                <div className="cms-box-hdr">
                  <Package size={14} />
                  <strong>Ordered Weaves ({selectedOrder.items?.length})</strong>
                </div>
                <div className="cms-order-items-list">
                  {(selectedOrder.items || []).map((it, idx) => (
                    <div key={idx} className="cms-order-item-row">
                      <img src={it.image || '/images/saree-teal.jpg'} alt={it.name} />
                      <div className="item-txt">
                        <strong>{it.name}</strong>
                        <div>Color: <span className="item-color-dot" style={{ background: it.selectedColor || '#7B1C1C' }}></span> {it.selectedColor}</div>
                        <div>Qty: {it.quantity} × ₹{it.price}</div>
                      </div>
                      <div className="item-total">
                        ₹{(it.price * (it.quantity || 1)).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cms-pricing-summary">
                  <div className="price-row"><span>Subtotal:</span> <span>₹{selectedOrder.pricing?.subtotal?.toLocaleString('en-IN')}</span></div>
                  <div className="price-row"><span>Shipping:</span> <span>{selectedOrder.pricing?.shipping === 0 ? 'FREE' : `₹${selectedOrder.pricing?.shipping}`}</span></div>
                  <div className="price-row total"><span>Total Amount:</span> <strong>₹{selectedOrder.pricing?.total?.toLocaleString('en-IN')}</strong></div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="cms-order-section-box">
                <div className="cms-box-hdr">
                  <Clock size={14} />
                  <strong>Advance Order Status</strong>
                </div>
                <div className="cms-status-actions-grid">
                  <button
                    type="button"
                    disabled={isUpdating}
                    className={`status-btn ${selectedOrder.orderStatus === 'CONFIRMED' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder.orderId, 'CONFIRMED')}
                  >
                    Confirm Order
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    className={`status-btn ${selectedOrder.orderStatus === 'SHIPPED' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder.orderId, 'SHIPPED')}
                  >
                    Mark as Shipped
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    className={`status-btn ${selectedOrder.orderStatus === 'DELIVERED' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder.orderId, 'DELIVERED', 'COMPLETED')}
                  >
                    Mark as Delivered
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    className={`status-btn cancel ${selectedOrder.orderStatus === 'CANCELLED' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(selectedOrder.orderId, 'CANCELLED')}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
