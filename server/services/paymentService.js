import crypto from 'crypto';

/**
 * Payment Service supporting Razorpay and UPI.
 * Operates safely with stub/simulation when API credentials are not yet configured,
 * and seamlessly activates official Razorpay verification once keys are provided.
 */
export const paymentService = {
  isRazorpayConfigured: () => {
    return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  },

  /**
   * Create Razorpay Order
   * @param {number} amount - Amount in INR
   * @param {string} currency - Default INR
   * @param {string} receipt - Order reference
   */
  createRazorpayOrder: async (amount, currency = 'INR', receipt = '') => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Return simulated payment order for testing/prototyping
      return {
        mode: 'simulation',
        orderId: `order_sim_${Date.now()}`,
        amount: Math.round(amount * 100), // paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        keyId: 'rzp_test_simulated_key',
        notes: {
          info: 'Razorpay keys pending in server/.env. Running in simulation mode.'
        }
      };
    }

    // When actual credentials are provided, calls Razorpay API:
    try {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency,
          receipt: receipt || `rcpt_${Date.now()}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.description || 'Razorpay order creation failed');
      }

      const orderData = await response.json();
      return {
        mode: 'live',
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        keyId
      };
    } catch (err) {
      console.error('[Razorpay Error]:', err.message);
      throw err;
    }
  },

  /**
   * Verify Razorpay payment signature
   */
  verifyPaymentSignature: (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      // Simulation mode verification passes
      return true;
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  },

  /**
   * Generate UPI Deep Link / QR Code parameters
   */
  generateUpiPayload: (amount, orderId, note = 'Chandrakanta Ethnic Order') => {
    const vpa = process.env.UPI_VPA || 'chandrakanta@upi';
    const merchant = encodeURIComponent(process.env.UPI_MERCHANT_NAME || 'Chandrakanta Handlooms');
    const encodedNote = encodeURIComponent(note);
    const upiLink = `upi://pay?pa=${vpa}&pn=${merchant}&am=${amount.toFixed(2)}&cu=INR&tn=${encodedNote}&tr=${orderId}`;

    return {
      vpa,
      merchantName: process.env.UPI_MERCHANT_NAME || 'Chandrakanta Handlooms',
      amount: amount.toFixed(2),
      orderId,
      upiLink,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`
    };
  }
};
