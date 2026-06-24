import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import { RefreshCw } from 'lucide-react';

const categories = ['All', 'Baking material', 'Fresh Fruits', 'Milks & Dairies', 'Meats', 'Vegetables'];

const ProductSection = ({ activeCategory, setActiveCategory, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:5000/api/products';
      const params = [];
      
      if (activeCategory && activeCategory !== 'All') {
        params.push(`category=${encodeURIComponent(activeCategory)}`);
      }
      if (searchQuery) {
        params.push(`search=${encodeURIComponent(searchQuery)}`);
      }
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch product catalog.');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      {/* Header and Category Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-extrabold text-brand-dark">Popular Products</h3>
          {searchQuery && (
            <p className="text-xs font-semibold text-textColor-muted mt-1">
              Search results for: <span className="text-brand">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Tab filters */}
        <div className="w-full md:w-auto overflow-x-auto">
          <div className="flex gap-2.5 pb-2 md:pb-0">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold tracking-wide whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-brand text-white border-brand shadow-md shadow-brand/10'
                      : 'bg-white text-textColor-body border-gray-100 hover:text-brand hover:border-brand-light'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-500 border border-red-100 rounded-3xl p-8 text-center max-w-lg mx-auto">
          <p className="font-bold text-lg mb-2">Something went wrong</p>
          <p className="text-sm font-medium text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-red-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse border border-gray-100 rounded-3xl p-5 bg-white space-y-4">
              <div className="bg-gray-100 rounded-2xl h-44 w-full"></div>
              <div className="space-y-2.5">
                <div className="bg-gray-100 h-3 w-16 rounded"></div>
                <div className="bg-gray-100 h-4 w-5/6 rounded"></div>
                <div className="bg-gray-100 h-3 w-2/5 rounded"></div>
                <div className="bg-gray-100 h-3 w-24 rounded"></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="bg-gray-100 h-5 w-20 rounded"></div>
                <div className="bg-gray-100 h-9 w-16 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product List Grid */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-16 bg-brand-light/20 rounded-[30px] border border-dashed border-brand/20 max-w-xl mx-auto">
              <span className="text-4xl">🥬</span>
              <h4 className="text-lg font-bold text-brand-dark mt-4">No products found</h4>
              <p className="text-sm font-medium text-textColor-body mt-1.5 px-6">
                We couldn't find any items matching your filters or search keywords. Please adjust your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setActiveCategory('All');
                }}
                className="mt-5 bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-brand/10"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.map((prod) => {
                const cartItem = cartItems.find((item) => item._id === prod._id);
                return (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    addToCart={addToCart}
                    cartItem={cartItem}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductSection;
