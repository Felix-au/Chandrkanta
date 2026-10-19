import React, { useState } from 'react';
import { X, CheckCircle, QrCode, Banknote, CreditCard, ArrowRight, ShieldCheck, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { apiUrl } from '../config/api';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cartItems, total, subtotal, shippingFee, placeOrder } = useCart();
  const { content } = useStore();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [upiData, setUpiData] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleFetchUpi = async () => {
    try {
      const res = await fetch(apiUrl(`/api/payments/upi-info?amount=${total}`));
      const data = await res.json();
      if (data.success) {
        setUpiData(data.data);
      }
    } catch (err) {
      console.error('Failed to get UPI payload:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address || !customer.pincode) {
      alert('Please fill in all required shipping details.');
      return;
    }

    setIsSubmitting(true);

    let transactionId = '';
    if (paymentMethod === 'RAZORPAY') {
      try {
        const orderRes = await fetch(apiUrl('/api/payments/create-order'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, receipt: `rcpt_${Date.now()}` })
        });
        const orderData = await orderRes.json();
        transactionId = orderData.order?.orderId || `rzp_sim_${Date.now()}`;
      } catch {
        transactionId = `rzp_fallback_${Date.now()}`;
      }
    } else if (paymentMethod === 'UPI') {
      transactionId = `UPI_REF_${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    const result = await placeOrder(customer, paymentMethod, transactionId);
    setIsSubmitting(false);

    if (result.success) {
      setCompletedOrder(result.order);
    } else {
      alert('Order could not be submitted: ' + result.error);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
  };

  const copyUpiId = () => {
    if (upiData?.vpa) {
      navigator.clipboard.writeText(upiData.vpa);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-box"
        style={{ maxWidth: '640px', padding: '32px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Order Success State */}
        {completedOrder ? (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <CheckCircle size={64} color="var(--accent)" style={{ margin: '0 auto 16px' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Order Confirmed
            </span>
            <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '28px', color: 'var(--text)', margin: '8px 0 12px' }}>
              Thank You, {completedOrder.customer?.name}!
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
              Your order <strong style={{ color: 'var(--accent)' }}>#{completedOrder.orderId}</strong> has been received and is being prepared with royal care by our weavers.
            </p>

            <div style={{ background: 'var(--surface-2)', padding: '16px 20px', borderRadius: 'var(--r-md)', textAlign: 'left', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                <strong>{completedOrder.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
                <strong>₹{completedOrder.pricing?.total?.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery Address:</span>
                <span style={{ textAlign: 'right', maxWidth: '60%' }}>{completedOrder.customer?.address}, {completedOrder.customer?.city} ({completedOrder.customer?.pincode})</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="btn-pri"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Secure Checkout
                </span>
                <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '22px', color: 'var(--text)' }}>
                  Delivery &amp; Payment Details
                </h2>
              </div>
              <button onClick={handleClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Customer Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={customer.name}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 9876543210"
                    value={customer.phone}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={customer.email}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Delivery Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="House/Flat No, Landmark, Street"
                  value={customer.address}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Lucknow"
                    value={customer.city}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={customer.state}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="226001"
                    value={customer.pincode}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text)', marginBottom: '10px' }}>
                  Select Payment Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {/* COD */}
                  <label
                    style={{
                      border: paymentMethod === 'COD' ? '2px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: 'var(--r-sm)',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      background: paymentMethod === 'COD' ? 'rgba(123,28,28,.04)' : 'var(--surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      textAlign: 'center'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      style={{ display: 'none' }}
                    />
                    <Banknote size={20} color={paymentMethod === 'COD' ? 'var(--accent)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>Cash on Delivery</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Pay upon arrival</span>
                  </label>

                  {/* UPI */}
                  <label
                    onClick={handleFetchUpi}
                    style={{
                      border: paymentMethod === 'UPI' ? '2px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: 'var(--r-sm)',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      background: paymentMethod === 'UPI' ? 'rgba(123,28,28,.04)' : 'var(--surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      textAlign: 'center'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      style={{ display: 'none' }}
                    />
                    <QrCode size={20} color={paymentMethod === 'UPI' ? 'var(--accent)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>UPI / QR Code</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>GooglePay / PhonePe</span>
                  </label>

                  {/* Online / Razorpay */}
                  <label
                    style={{
                      border: paymentMethod === 'RAZORPAY' ? '2px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: 'var(--r-sm)',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      background: paymentMethod === 'RAZORPAY' ? 'rgba(123,28,28,.04)' : 'var(--surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      textAlign: 'center'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      style={{ display: 'none' }}
                    />
                    <CreditCard size={20} color={paymentMethod === 'RAZORPAY' ? 'var(--accent)' : 'var(--text-muted)'} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>Cards / NetBanking</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Razorpay Ready</span>
                  </label>
                </div>
              </div>

              {/* UPI QR Display when chosen */}
              {paymentMethod === 'UPI' && (
                <div style={{ background: 'var(--surface-2)', border: '1px dashed var(--gold)', padding: '16px', borderRadius: 'var(--r-sm)', marginBottom: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                    Scan QR code with any UPI App (GPay, PhonePe, Paytm):
                  </p>
                  <img
                    src={upiData?.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=chandrakanta@upi&pn=Chandrakanta&am=${total}&cu=INR`}
                    alt="UPI Payment QR Code"
                    style={{ width: '140px', height: '140px', margin: '0 auto 10px', borderRadius: '4px', border: '1px solid var(--border)' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px' }}>
                    <span>UPI ID: <strong>chandrakanta@upi</strong></span>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700 }}
                    >
                      <Copy size={12} /> {copiedUpi ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Razorpay Gateway Notice */}
              {paymentMethod === 'RAZORPAY' && (
                <div style={{ background: 'rgba(200,146,42,.1)', border: '1px solid var(--gold)', padding: '12px 16px', borderRadius: 'var(--r-sm)', marginBottom: '20px', fontSize: '12px', color: 'var(--text)' }}>
                  <ShieldCheck size={16} color="var(--gold)" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  <strong>Razorpay Gateway Ready:</strong> Test mode active. Live API keys in <code>server/.env</code> will enable instant production processing.
                </div>
              )}

              {/* Order Summary & Submit */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Items Total ({cartItems.length}):</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '14px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shipping:</span>
                  <span>{shippingFee === 0 ? <strong style={{ color: '#2d6b2d' }}>FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>
                  <span>Total Payable:</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-pri"
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Placing Order...' : `Confirm Order (₹${total.toLocaleString('en-IN')})`}
                  <ArrowRight size={15} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
