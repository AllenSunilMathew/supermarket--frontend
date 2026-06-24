import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, CheckCircle, Truck, ShoppingBag, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/orders';

const CheckoutForm = ({ setCurrentView }) => {
  const { token } = useAuth();
  const { cartItems, coupon, getSubtotal, getDiscountAmount, getTotal, clearCart } = useCart();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!address || !phone) {
      setError('Please fill in both shipping address and phone number.');
      setLoading(false);
      return;
    }

    try {
      const items = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          shippingAddress: address,
          phone,
          couponCode: coupon ? coupon.code : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order.');
      }

      setPlacedOrder(data);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center bg-brand-light p-4 rounded-full text-brand mb-6 animate-bounce">
          <CheckCircle className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-extrabold text-brand-dark mb-3">Order Placed Successfully!</h2>
        <p className="text-sm font-medium text-textColor-body max-w-md mx-auto mb-4">
          Thank you for shopping with NestGrocer. Your order will be delivered to your address soon.
        </p>
        <div className="bg-[#F4F6FA] border border-gray-100 rounded-3xl p-5 max-w-sm mx-auto mb-8 text-left text-xs font-semibold text-textColor-body space-y-2">
          <p><span className="text-textColor-muted">Order ID:</span> {placedOrder?._id}</p>
          <p><span className="text-textColor-muted">Total Amount:</span> ${placedOrder?.totalAmount.toFixed(2)}</p>
          <p><span className="text-textColor-muted">Payment Mode:</span> Cash on Delivery (COD)</p>
          <p><span className="text-textColor-muted">Delivery Address:</span> {placedOrder?.shippingAddress}</p>
        </div>
        <button
          onClick={() => setCurrentView('orders')}
          className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-bold text-xs tracking-wider shadow-md shadow-brand/10 transition-all"
        >
          View Order History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 fade-in">
      <h2 className="text-2xl font-extrabold text-brand-dark mb-8">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Address Details Form */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-[28px] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <Truck className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-bold text-brand-dark">Shipping & Payment Details</h3>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 rounded-xl p-3.5 mb-6 flex items-start gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="address" className="text-xs font-bold text-brand-dark tracking-wide uppercase">
                Delivery Address
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  rows="3"
                  placeholder="Enter complete shipping address (Street address, Apartment, City, Postal Code)"
                  className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-brand focus:bg-white transition-all font-medium resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <MapPin className="absolute left-4 top-4.5 w-4.5 h-4.5 text-textColor-muted" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-brand-dark tracking-wide uppercase">
                Contact Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +1 (555) 019-2834"
                  className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-brand focus:bg-white transition-all font-medium"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textColor-muted" />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-50">
              <span className="text-xs font-bold text-brand-dark tracking-wide uppercase">
                Payment Option
              </span>
              <div className="bg-brand-light/35 border border-brand/10 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-brand p-1.5 rounded-lg text-white">
                    💵
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-brand-dark">Cash on Delivery (COD)</h4>
                    <p className="text-[10px] text-textColor-body font-semibold">Pay with cash when your groceries arrive.</p>
                  </div>
                </div>
                <input
                  type="radio"
                  defaultChecked
                  className="w-4 h-4 text-brand border-gray-300 focus:ring-brand accent-brand"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-2xl font-extrabold text-sm tracking-wider shadow-md shadow-brand/10 transition-all disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : `Place Order ($${total.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <ShoppingBag className="w-5 h-5 text-brand" />
              <h3 className="text-lg font-bold text-brand-dark">Order Summary</h3>
            </div>

            {/* List items */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center gap-3 py-1 border-b border-gray-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-brand-dark truncate">{item.name}</h4>
                      <p className="text-[10px] text-textColor-body font-semibold">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-brand-dark shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing blocks */}
          <div className="space-y-3 pt-6 border-t border-gray-100 mt-6 text-xs font-semibold text-textColor-body">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-brand-dark font-extrabold">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand">
                <span>Discount coupon ({coupon?.code})</span>
                <span className="font-extrabold">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-brand">FREE</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-4 text-sm font-extrabold">
              <span className="text-brand-dark">Grand Total</span>
              <span className="text-brand text-base font-black">${total.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutForm;
