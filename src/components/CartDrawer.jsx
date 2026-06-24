import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, Tag, ShoppingBag } from 'lucide-react';

const CartDrawer = ({ open, setOpen, setCurrentView, setAuthModalOpen, setAuthMode }) => {
  const { user } = useAuth();
  const {
    cartItems,
    coupon,
    couponError,
    couponSuccess,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = await applyCoupon(couponCode);
    if (success) setCouponCode('');
  };

  const handleCheckoutClick = () => {
    setOpen(false);
    if (user) {
      setCurrentView('checkout');
    } else {
      setAuthMode('login');
      setAuthModalOpen(true);
      alert('Please sign in or register to complete your supermarket order.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-dark/45 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Sliding Panel */}
        <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl border-l border-gray-50 h-full justify-between fade-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand" />
              <h2 className="text-lg font-extrabold text-brand-dark">Shopping Cart</h2>
              <span className="bg-brand-light text-brand text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cartItems.length} items
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-textColor-muted hover:text-brand-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
                <span className="text-5xl">🛒</span>
                <h3 className="text-base font-bold text-brand-dark">Your cart is empty</h3>
                <p className="text-xs text-textColor-muted max-w-[240px]">
                  Fill it with fresh veggies, organic fruits, and baking ingredients!
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 py-3 border-b border-gray-50 group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-textColor-muted tracking-wide uppercase">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-extrabold text-brand-dark truncate leading-normal">
                      {item.name}
                    </h4>
                    <span className="text-xs font-bold text-brand mt-1 block">
                      ${item.price.toFixed(2)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center mt-2 gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() =>
                            item.quantity === 1
                              ? removeFromCart(item._id)
                              : updateQuantity(item._id, item.quantity - 1, item.stock)
                          }
                          className="px-1.5 py-1 text-textColor-body hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-extrabold text-brand-dark min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1, item.stock)}
                          disabled={item.quantity >= item.stock}
                          className="px-1.5 py-1 text-textColor-body hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-textColor-muted hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Bottom block: Coupon code and totals */}
          {cartItems.length > 0 && (
            <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50 space-y-4 shrink-0">
              
              {/* Coupon input */}
              {coupon ? (
                <div className="bg-brand-light/75 border border-brand/20 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand" />
                    <span className="font-extrabold text-brand-dark uppercase tracking-wider">
                      {coupon.code}
                    </span>
                    <span className="text-brand font-semibold">
                      Applied ({coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-600 font-extrabold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="w-full bg-white border border-gray-200 text-brand-dark text-xs rounded-xl py-3 pl-4 pr-10 outline-none focus:border-brand transition-all uppercase tracking-widest font-extrabold"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Tag className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textColor-muted" />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-dark hover:bg-brand text-white px-4 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Coupon error/success indicators */}
              {couponError && <p className="text-[11px] text-red-500 font-bold px-1">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-brand font-bold px-1">{couponSuccess}</p>}

              {/* Calculations block */}
              <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
                <div className="flex justify-between font-medium">
                  <span className="text-textColor-body">Subtotal</span>
                  <span className="text-brand-dark font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand font-semibold">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span className="text-textColor-body">Delivery Fee</span>
                  <span className="text-brand font-semibold">FREE (COD)</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-extrabold">
                  <span className="text-brand-dark">Total</span>
                  <span className="text-brand">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-brand hover:bg-brand-dark text-white py-3.5 rounded-2xl font-extrabold text-sm tracking-wider shadow-md shadow-brand/10 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
