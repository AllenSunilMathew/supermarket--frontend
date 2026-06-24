import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, History, Search } from 'lucide-react';

const Navbar = ({
  setCurrentView,
  setSearchQuery,
  setCartOpen,
  setAuthModalOpen,
  setAuthMode,
  currentView
}) => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentView('home');
  };

  const handleNavClick = (view) => {
    setCurrentView(view);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Banner (Promo alert) */}
      <div className="bg-brand-light py-1.5 px-4 text-center text-xs font-semibold text-brand-dark">
        🔥 Special Offer! Use coupon code <span className="text-brand font-extrabold font-mono bg-white px-1.5 py-0.5 rounded border border-brand/20">FRESH25</span> to get 25% off on orders above $50!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="bg-brand p-2 rounded-xl text-white shadow-md shadow-brand/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-brand-dark tracking-wide">
              Nest<span className="text-brand">Grocer</span>
            </h1>
          </div>

          {/* Search bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md mx-8 relative"
          >
            <input
              type="text"
              placeholder="Search for vegetables, fruits, groceries..."
              className="w-full bg-[#F4F6FA] border border-gray-200 text-brand-dark text-sm rounded-xl py-3 pl-5 pr-12 outline-none focus:border-brand focus:bg-white transition-all font-medium"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textColor-muted hover:text-brand transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Right section actions */}
          <div className="flex items-center gap-6">
            
            {/* Cart Icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-brand-light text-brand-dark hover:text-brand transition-all flex items-center gap-2 group"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-sm font-semibold tracking-wide">Cart</span>
            </button>

            {/* User Profile dropdown */}
            <div className="relative text-brand-dark">
              {user ? (
                <>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 border border-gray-100 transition-all text-brand-dark font-semibold text-sm"
                  >
                    <div className="bg-brand-light p-1.5 rounded-lg text-brand">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="max-w-[120px] truncate">Hi, {user.name.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 fade-in">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-textColor-muted">Logged in as</p>
                        <p className="text-sm font-bold text-brand-dark truncate">{user.email}</p>
                      </div>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                            currentView === 'admin' ? 'text-brand bg-brand-light/40' : 'text-brand-dark hover:text-brand hover:bg-gray-50'
                          }`}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Panel
                        </button>
                      )}

                      <button
                        onClick={() => handleNavClick('orders')}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                          currentView === 'orders' ? 'text-brand bg-brand-light/40' : 'text-brand-dark hover:text-brand hover:bg-gray-50'
                        }`}
                      >
                        <History className="w-4 h-4" />
                        My Orders
                      </button>

                      <hr className="my-1 border-gray-50" />

                      <button
                        onClick={() => {
                          logout();
                          handleNavClick('home');
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50/50 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-brand/10 transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
