import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Calendar, MapPin, Truck, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/orders/my-orders';

const OrderHistory = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to retrieve order history.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
      case 'Processing':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Shipped':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Delivered':
        return 'bg-green-50 text-brand border border-brand/20';
      case 'Cancelled':
        return 'bg-red-50 text-red-500 border border-red-100';
      default:
        return 'bg-gray-50 text-textColor-muted border border-gray-100';
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 my-12 animate-pulse space-y-6">
        <div className="h-6 bg-gray-100 rounded w-1/4 mb-8"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-3xl w-full"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 my-16 text-center">
        <div className="bg-red-50 border border-red-100 text-red-500 rounded-3xl p-6 flex flex-col items-center gap-3">
          <AlertCircle className="w-12 h-12" />
          <h3 className="font-extrabold text-brand-dark">Error Fetching Orders</h3>
          <p className="text-xs font-semibold text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-10 fade-in">
      <div className="flex items-center gap-2.5 mb-8">
        <ClipboardList className="w-6 h-6 text-brand" />
        <h2 className="text-2xl font-extrabold text-brand-dark">My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[30px] border border-gray-100 max-w-lg mx-auto">
          <span className="text-5xl">🛍️</span>
          <h3 className="text-base font-bold text-brand-dark mt-4">No Orders Placed Yet</h3>
          <p className="text-xs text-textColor-muted mt-1 px-8">
            You haven't ordered anything yet! Browse our collection of fresh groceries and make your first purchase.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-premium transition-all"
            >
              
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 pb-4 mb-4 gap-2">
                <div>
                  <span className="text-[10px] text-textColor-muted font-bold tracking-wider block uppercase">
                    Order ID: #{order._id}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-textColor-body font-semibold mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Order items list */}
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        {item.product ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px]">
                            Deleted
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-brand-dark font-extrabold truncate">
                          {item.product ? item.product.name : 'Unknown Product'}
                        </h4>
                        <p className="text-[10px] text-textColor-muted mt-0.5">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-brand-dark font-extrabold shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer summary info */}
              <div className="border-t border-gray-50 pt-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold text-textColor-body">
                <div className="space-y-1.5 max-w-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-textColor-muted shrink-0" />
                    <span className="truncate">Address: {order.shippingAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-textColor-muted shrink-0" />
                    <span>Contact: {order.phone} | Payment: COD</span>
                  </div>
                </div>

                <div className="text-right border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0 w-full sm:w-auto">
                  {order.discountAmount > 0 && (
                    <p className="text-textColor-muted">
                      Discount: <span className="text-brand font-bold">-${order.discountAmount.toFixed(2)}</span>
                    </p>
                  )}
                  <p className="text-sm font-extrabold text-brand-dark mt-0.5">
                    Total Charged: <span className="text-brand font-black">${order.totalAmount.toFixed(2)}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
