import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Plus, Trash2, Calendar, ShoppingBag, Edit, Percent } from 'lucide-react';

const API_ORDERS = 'http://localhost:5000/api/orders';
const API_PRODUCTS = 'http://localhost:5000/api/products';
const API_COUPONS = 'http://localhost:5000/api/coupons';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', oldPrice: '', description: '', category: 'Vegetables', brand: '', image: '', stock: '50', badge: ''
  });

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [couponForm, setCouponForm] = useState({
    code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '0', expiryDate: '', firstTimeOnly: false
  });

  // Load Data
  const loadOrders = async () => {
    try {
      const res = await fetch(API_ORDERS, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) { console.error(err); }
    finally { setOrdersLoading(false); }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(API_PRODUCTS);
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) { console.error(err); }
    finally { setProductsLoading(false); }
  };

  const loadCoupons = async () => {
    try {
      const res = await fetch(API_COUPONS, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setCoupons(data);
    } catch (err) { console.error(err); }
    finally { setCouponsLoading(false); }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
      loadProducts();
      loadCoupons();
    }
  }, [token]);

  // Order Status update
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_ORDERS}/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        alert('Order status updated!');
        loadOrders();
      } else {
        const err = await res.json();
        alert(err.message || 'Status update failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      stock: Number(productForm.stock)
    };

    try {
      const url = editingProduct ? `${API_PRODUCTS}/${editingProduct._id}` : API_PRODUCTS;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editingProduct ? 'Product updated!' : 'Product added!');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({ name: '', price: '', oldPrice: '', description: '', category: 'Vegetables', brand: '', image: '', stock: '50', badge: '' });
        loadProducts();
      } else {
        const err = await res.json();
        alert(err.message || 'Product save failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price.toString(),
      oldPrice: prod.oldPrice ? prod.oldPrice.toString() : '',
      description: prod.description,
      category: prod.category,
      brand: prod.brand,
      image: prod.image,
      stock: prod.stock.toString(),
      badge: prod.badge || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API_PRODUCTS}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Product deleted!');
        loadProducts();
      }
    } catch (err) { console.error(err); }
  };

  // Coupon CRUD
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_COUPONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(couponForm)
      });
      if (res.ok) {
        alert('Coupon created!');
        setCouponForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '0', expiryDate: '', firstTimeOnly: false });
        loadCoupons();
      } else {
        const err = await res.json();
        alert(err.message || 'Coupon creation failed.');
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`${API_COUPONS}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Coupon deleted!');
        loadCoupons();
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 fade-in">
      <h2 className="text-2xl font-extrabold text-brand-dark mb-6">Store Manager Dashboard</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 gap-4 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'orders' ? 'border-brand text-brand' : 'border-transparent text-textColor-muted hover:text-brand-dark'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Fulfill Orders
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-2 text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'products' ? 'border-brand text-brand' : 'border-transparent text-textColor-muted hover:text-brand-dark'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Product Catalog
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-4 px-2 text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'coupons' ? 'border-brand text-brand' : 'border-transparent text-textColor-muted hover:text-brand-dark'
          }`}
        >
          <Percent className="w-4 h-4" />
          Discount Coupons
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-brand-dark mb-6">Customer Orders</h3>
          {ordersLoading ? (
            <p className="text-xs text-textColor-muted animate-pulse">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-xs text-textColor-muted">No orders found in the database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-textColor-body border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-[10px] text-textColor-muted uppercase tracking-wider">
                    <th className="py-4">ID / User</th>
                    <th className="py-4">Date</th>
                    <th className="py-4">Items Summary</th>
                    <th className="py-4">Delivery address</th>
                    <th className="py-4">Total Price</th>
                    <th className="py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50/50 hover:bg-gray-50/30">
                      <td className="py-4 pr-3">
                        <span className="text-[10px] font-mono text-textColor-muted block">#{order._id}</span>
                        <span className="font-extrabold text-brand-dark">{order.user?.name || 'Guest'}</span>
                        <span className="text-[10px] text-textColor-body block">{order.user?.email}</span>
                      </td>
                      <td className="py-4 pr-3 text-textColor-body">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 pr-3">
                        <ul className="list-disc pl-4 space-y-0.5 max-w-[180px] truncate">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-[11px] truncate">
                              {item.product?.name || 'Deleted Product'} (x{item.quantity})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 pr-3 max-w-[150px] truncate">
                        <span>{order.shippingAddress}</span>
                        <span className="block text-[10px] text-textColor-muted">{order.phone}</span>
                      </td>
                      <td className="py-4 pr-3 font-extrabold text-brand-dark">
                        ${order.totalAmount.toFixed(2)}
                        {order.discountAmount > 0 && (
                          <span className="block text-[9px] text-brand">-${order.discountAmount.toFixed(2)} coupon</span>
                        )}
                      </td>
                      <td className="py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="bg-[#F4F6FA] border border-gray-200 text-brand-dark rounded-xl px-2 py-1.5 font-bold focus:border-brand focus:bg-white outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Header Action */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-brand-dark">Catalog List ({products.length} products)</h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({ name: '', price: '', oldPrice: '', description: '', category: 'Vegetables', brand: '', image: '', stock: '50', badge: '' });
                setShowProductForm(!showProductForm);
              }}
              className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-brand/10 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {showProductForm ? 'Cancel Form' : 'Add New Product'}
            </button>
          </div>

          {/* Product form panel */}
          {showProductForm && (
            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm max-w-2xl fade-in">
              <h4 className="text-sm font-extrabold text-brand-dark mb-4 uppercase tracking-wider">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
              </h4>
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-brand-dark block mb-1">Product Name</label>
                  <input type="text" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-dark block mb-1">Brand</label>
                  <input type="text" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" required placeholder="e.g. NestFood" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-dark block mb-1">Price ($)</label>
                  <input type="number" step="0.01" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-dark block mb-1">Old Price ($) (Optional)</label>
                  <input type="number" step="0.01" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" value={productForm.oldPrice} onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-dark block mb-1">Category</label>
                  <select className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fresh Fruits">Fresh Fruits</option>
                    <option value="Milks & Dairies">Milks & Dairies</option>
                    <option value="Baking material">Baking material</option>
                    <option value="Meats">Meats</option>
                    <option value="Coffee & Tea">Coffee & Tea</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-dark block mb-1">Stock Level</label>
                  <input type="number" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" required value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-brand-dark block mb-1">Image URL</label>
                  <input type="text" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" required placeholder="https://unsplash..." value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-dark block mb-1">Badge (Optional)</label>
                  <input type="text" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" placeholder="e.g. Hot, Sale, -10%" value={productForm.badge} onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-brand-dark block mb-1">Description</label>
                  <textarea rows="3" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none resize-none" required value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2.5">
                  <button type="submit" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-bold text-xs">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product list */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm">
            {productsLoading ? (
              <p className="text-xs text-textColor-muted animate-pulse">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-xs text-textColor-muted">No products found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-textColor-body border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] text-textColor-muted uppercase tracking-wider">
                      <th className="py-4">Image</th>
                      <th className="py-4">Product Name</th>
                      <th className="py-4">Category</th>
                      <th className="py-4">Stock</th>
                      <th className="py-4">Price</th>
                      <th className="py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod._id} className="border-b border-gray-50/50 hover:bg-gray-50/30">
                        <td className="py-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                        </td>
                        <td className="py-3 pr-3 font-extrabold text-brand-dark">
                          {prod.name}
                          <span className="block text-[10px] text-textColor-muted font-medium">By {prod.brand}</span>
                        </td>
                        <td className="py-3 pr-3">{prod.category}</td>
                        <td className="py-3 pr-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prod.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-brand-light text-brand'
                          }`}>
                            {prod.stock} items
                          </span>
                        </td>
                        <td className="py-3 pr-3 font-extrabold text-brand-dark">${prod.price.toFixed(2)}</td>
                        <td className="py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditProduct(prod)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit Product">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteProduct(prod._id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete Product">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Coupon Form */}
          <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm h-fit">
            <h3 className="text-base font-extrabold text-brand-dark mb-4 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-brand" />
              Create Coupon
            </h3>
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-brand-dark block mb-1">Coupon Code (Uppercase)</label>
                <input type="text" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none uppercase font-extrabold tracking-widest" required placeholder="e.g. SUMMER50" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-dark block mb-1">Discount Type</label>
                <select className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none font-bold" value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-dark block mb-1">Discount Value</label>
                <input type="number" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" required placeholder="e.g. 10" value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-dark block mb-1">Minimum Order Amount ($)</label>
                <input type="number" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none" value={couponForm.minOrderAmount} onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-dark block mb-1">Expiry Date</label>
                <input type="date" className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl p-3 outline-none font-bold" required value={couponForm.expiryDate} onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })} />
              </div>
              <div className="flex items-center gap-2 py-1">
                <input type="checkbox" id="firstTimeOnly" className="w-4 h-4 text-brand rounded focus:ring-brand accent-brand" checked={couponForm.firstTimeOnly} onChange={(e) => setCouponForm({ ...couponForm, firstTimeOnly: e.target.checked })} />
                <label htmlFor="firstTimeOnly" className="text-xs font-bold text-brand-dark cursor-pointer select-none">
                  Valid for first order only
                </label>
              </div>
              <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all">
                Create Coupon
              </button>
            </form>
          </div>

          {/* Coupon List */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-brand-dark mb-4">Active Coupons</h3>
            {couponsLoading ? (
              <p className="text-xs text-textColor-muted animate-pulse">Loading coupons...</p>
            ) : coupons.length === 0 ? (
              <p className="text-xs text-textColor-muted">No coupons found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-textColor-body border-collapse">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] text-textColor-muted uppercase tracking-wider">
                      <th className="py-4">Code</th>
                      <th className="py-4">Discount</th>
                      <th className="py-4">Condition</th>
                      <th className="py-4">Expires</th>
                      <th className="py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c._id} className="border-b border-gray-50/50 hover:bg-gray-50/30">
                        <td className="py-3 pr-3 font-extrabold text-brand uppercase tracking-widest">{c.code}</td>
                        <td className="py-3 pr-3 font-bold text-brand-dark">
                          {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `$${c.discountValue.toFixed(2)} Flat`}
                        </td>
                        <td className="py-3 pr-3 text-[11px]">
                          <span>Min: ${c.minOrderAmount}</span>
                          {c.firstTimeOnly && <span className="block text-[10px] text-orange-500 font-bold">1st order only</span>}
                        </td>
                        <td className="py-3 pr-3 text-textColor-muted">{new Date(c.expiryDate).toLocaleDateString()}</td>
                        <td className="py-3">
                          <div className="flex justify-center">
                            <button onClick={() => handleDeleteCoupon(c._id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete Coupon">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
