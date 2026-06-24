import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import PromoBanners from './components/PromoBanners';
import ProductSection from './components/ProductSection';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import CheckoutForm from './components/CheckoutForm';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './components/AdminDashboard';

const AppContent = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'checkout', 'orders', 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [cartOpen, setCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  return (
    <div className="min-h-screen bg-[#F4F6FA]/20 flex flex-col justify-between">
      {/* 1. Fullscreen Preloader */}
      <Preloader />

      {/* 2. Global Header Navigation */}
      <Navbar
        setCurrentView={setCurrentView}
        setSearchQuery={setSearchQuery}
        setCartOpen={setCartOpen}
        setAuthModalOpen={setAuthModalOpen}
        setAuthMode={setAuthMode}
        currentView={currentView}
      />

      {/* 3. Main Views router */}
      <main className="flex-grow pb-16">
        {currentView === 'home' && (
          <>
            <Hero />
            <CategorySection
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <PromoBanners
              setActiveCategory={setActiveCategory}
            />
            <ProductSection
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
            />
          </>
        )}

        {currentView === 'checkout' && (
          <CheckoutForm setCurrentView={setCurrentView} />
        )}

        {currentView === 'orders' && (
          <OrderHistory />
        )}

        {currentView === 'admin' && user?.role === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* 4. Premium Footer */}
      <footer className="bg-brand-dark py-12 border-t border-brand/10 text-textColor-muted text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-white text-lg font-black tracking-wide">
              Nest<span className="text-brand">Grocer</span>
            </h4>
            <p className="leading-relaxed">
              Premium supermarket e-commerce experience. Fresh, clean, organic products sourced directly from local farms. Cash on delivery accepted.
            </p>
          </div>
          <div>
            <h5 className="text-white font-extrabold mb-4 text-sm uppercase tracking-wider">Product Categories</h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveCategory('Vegetables'); setCurrentView('home'); }}
                  className="hover:text-white transition-colors"
                >
                  Fresh Vegetables
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('Fresh Fruits'); setCurrentView('home'); }}
                  className="hover:text-white transition-colors"
                >
                  Organic Fruits
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('Milks & Dairies'); setCurrentView('home'); }}
                  className="hover:text-white transition-colors"
                >
                  Milk & Dairy Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('Baking material'); setCurrentView('home'); }}
                  className="hover:text-white transition-colors"
                >
                  Baking Ingredients
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-extrabold mb-4 text-sm uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">
                  Home Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (user) setCurrentView('orders');
                    else {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }
                  }}
                  className="hover:text-white transition-colors"
                >
                  Track Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="hover:text-white transition-colors"
                >
                  Register Account
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-white font-extrabold mb-2 text-sm uppercase tracking-wider">Store Contact Info</h5>
            <p>📍 77 Grocery Way, Fresh Meadows, CA 90001</p>
            <p>📞 Toll Free: +1 (800) 555-NEST</p>
            <p>✉️ Support: team@nestgrocer.com</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-8 pt-6 text-center text-[10px]">
          © {new Date().getFullYear()} NestGrocer Inc. All items sold are locally farmed. Cash on Delivery (COD) payment only.
        </div>
      </footer>

      {/* 5. Cart Drawer overlay */}
      <CartDrawer
        open={cartOpen}
        setOpen={setCartOpen}
        setCurrentView={setCurrentView}
        setAuthModalOpen={setAuthModalOpen}
        setAuthMode={setAuthMode}
      />

      {/* 6. Authentication modal overlay */}
      <AuthModal
        open={authModalOpen}
        setOpen={setAuthModalOpen}
        mode={authMode}
        setMode={setAuthMode}
      />
    </div>
  );
};

const App = () => {
  // Insert your Google Sign-In Client ID here if available, e.g., "YOUR_CLIENT_ID.apps.googleusercontent.com"
  const googleClientId = "";

  return (
    <GoogleOAuthProvider clientId={googleClientId || "dummy_google_client_id_for_oauth_rendering"}>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
