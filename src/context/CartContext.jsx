import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const API_URL = 'http://localhost:5000/api/coupons';

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState(null);

  // Sync cart items to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Recalculate coupon discount if cart items change
  useEffect(() => {
    if (coupon) {
      const subtotal = getSubtotal();
      if (subtotal < coupon.minOrderAmount) {
        removeCoupon();
        setCouponError(`Coupon removed. Minimum order value of $${coupon.minOrderAmount} required.`);
        setTimeout(() => setCouponError(null), 5000);
      } else {
        let discount = 0;
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
        } else if (coupon.discountType === 'flat') {
          discount = coupon.discountValue;
        }
        if (discount > subtotal) discount = subtotal;
        setCoupon(prev => ({ ...prev, discountAmount: discount }));
      }
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const exists = prevItems.find((item) => item._id === product._id);
      if (exists) {
        // Limit additions to product stock
        const targetQty = exists.quantity + quantity;
        if (targetQty > product.stock) {
          alert(`Cannot add more items. Only ${product.stock} left in stock.`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: targetQty } : item
        );
      }
      if (quantity > product.stock) {
        alert(`Cannot add. Only ${product.stock} left in stock.`);
        return prevItems;
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) {
      alert(`Only ${stock} items available in stock.`);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    return coupon ? coupon.discountAmount : 0;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    return Math.max(0, subtotal - discount);
  };

  const applyCoupon = async (code) => {
    setCouponError(null);
    setCouponSuccess(null);

    if (!token) {
      setCouponError('Please log in to apply discount coupons.');
      return false;
    }

    try {
      const subtotal = getSubtotal();
      const response = await fetch(`${API_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code, cartTotal: subtotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Coupon validation failed');
      }

      setCoupon({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        discountAmount: data.discountAmount,
        minOrderAmount: data.minOrderAmount || 0,
      });
      setCouponSuccess(data.message);
      setTimeout(() => setCouponSuccess(null), 5000);
      return true;
    } catch (err) {
      setCouponError(err.message);
      setTimeout(() => setCouponError(null), 5000);
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponSuccess(null);
    setCouponError(null);
  };

  const clearCart = () => {
    setCartItems([]);
    removeCoupon();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        coupon,
        couponError,
        couponSuccess,
        addToCart,
        removeFromCart,
        updateQuantity,
        getSubtotal,
        getDiscountAmount,
        getTotal,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
