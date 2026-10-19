import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import { apiUrl } from '../config/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { content } = useStore();
  const settings = content?.settings || {};
  const freeThreshold = settings.freeShippingThreshold || 1999;
  const standardShipping = settings.standardShippingFee || 99;

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ck_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('ck_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawers and Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('ck_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ck_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Cart actions
  const addToCart = (product, selectedColor = null, quantity = 1) => {
    const color = selectedColor || product.swatches?.[0] || 'Standard';
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id && item.selectedColor === color);
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          selectedColor: color,
          quantity
        }
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, selectedColor) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedColor === selectedColor)));
  };

  const updateQuantity = (id, selectedColor, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === id && item.selectedColor === selectedColor) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Wishlist actions
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // Calculations
  const itemCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = cartItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const shippingFee = subtotal >= freeThreshold || subtotal === 0 ? 0 : standardShipping;
  const tax = 0; // Inclusive GST
  const total = subtotal + shippingFee;

  // Place Order
  const placeOrder = async (customerData, paymentMethod = 'COD', transactionId = '') => {
    try {
      const orderPayload = {
        customer: customerData,
        items: cartItems,
        pricing: {
          subtotal,
          shipping: shippingFee,
          tax,
          total
        },
        paymentMethod,
        transactionId
      };

      const res = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit order');

      clearCart();
      setIsCheckoutOpen(false);
      return { success: true, order: data.order };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        shippingFee,
        tax,
        total,
        freeThreshold,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
