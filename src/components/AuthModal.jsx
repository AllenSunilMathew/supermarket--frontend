import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const AuthModal = ({ open, setOpen, mode = 'login', setMode }) => {
  const { login, register, googleLogin, error, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please enter email and password.');
      return;
    }

    if (mode === 'register' && !name) {
      setValidationError('Please enter your name.');
      return;
    }

    let success;
    if (mode === 'login') {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
    }

    if (success) {
      // Clear forms and close
      setName('');
      setEmail('');
      setPassword('');
      setOpen(false);
    }
  };

  // Google Login callbacks
  const handleGoogleSuccess = async (credentialResponse) => {
    const success = await googleLogin({
      token: credentialResponse.credential,
    });
    if (success) setOpen(false);
  };

  const handleGoogleFailure = () => {
    setValidationError('Google Sign-In failed. Please try standard sign-in or mock-mode.');
  };

  // Fallback Mock Google Authentication for local testing without OAuth ID setup
  const handleMockGoogleLogin = async () => {
    const mockEmail = `test_google_${Math.floor(Math.random() * 900 + 100)}@gmail.com`;
    const success = await googleLogin({
      isMock: true,
      mockData: {
        email: mockEmail,
        name: 'Google Test Customer',
        googleId: `google_${Date.now()}`,
      },
    });
    if (success) {
      setOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-dark/45 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-md p-8 rounded-[28px] shadow-2xl border border-gray-100 mx-4 z-10 fade-in">
        
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-6 top-6 p-1.5 rounded-full hover:bg-gray-100 text-textColor-muted hover:text-brand-dark transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-brand-dark">
            {mode === 'login' ? 'Sign In to NestGrocer' : 'Create Account'}
          </h2>
          <p className="text-xs text-textColor-muted mt-1 font-semibold">
            {mode === 'login'
              ? 'Enter your credentials to browse and order fresh groceries'
              : 'Register to start placing supermarket orders'}
          </p>
        </div>

        {/* Error Panels */}
        {(validationError || error) && (
          <div className="bg-red-50 border border-red-100 text-red-500 rounded-xl p-3 mb-4 flex items-start gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-brand focus:bg-white transition-all font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textColor-muted" />
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-brand focus:bg-white transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textColor-muted" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-[#F4F6FA] border border-gray-100 text-brand-dark text-xs rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-brand focus:bg-white transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textColor-muted" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white py-3.5 rounded-xl font-extrabold text-xs tracking-wider transition-all shadow-md shadow-brand/10 disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-3 bg-white text-[10px] font-extrabold text-textColor-muted tracking-widest uppercase">
            OR SIGN IN WITH
          </span>
        </div>

        {/* Google OAuth Button block */}
        <div className="space-y-2.5">
          {/* Real Google OAuth Login (Hidden if no client ID is in Vite, but left ready) */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap
              theme="outline"
              size="large"
              shape="circle"
              width="320"
            />
          </div>

          {/* Quick Mock Google login button for immediate testing */}
          <button
            onClick={handleMockGoogleLogin}
            type="button"
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-brand-dark py-3.5 rounded-xl font-extrabold text-xs tracking-wide transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.45 1.71 14.93 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.9 3.03C6.35 7.42 9.01 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.82-.07-1.6-.21-2.36H12v4.47h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.87c2.16-1.99 3.72-4.94 3.72-8.56z"
              />
              <path
                fill="#FBBC05"
                d="M5.4 10.53a7.19 7.19 0 0 1 0 4.14l-3.9 3.03C.54 15.65 0 13.89 0 12s.54-3.65 1.5-5.7l3.9 3.03z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.96 1.09-2.99 0-5.65-2.38-6.6-5.49L1.8 15.85C3.69 19.7 7.65 23 12 23z"
              />
            </svg>
            Mock Google Sign-In
          </button>
        </div>

        {/* Modal Toggle link */}
        <div className="text-center mt-6 text-xs font-semibold text-textColor-body">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-brand hover:underline font-extrabold ml-0.5"
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-brand hover:underline font-extrabold ml-0.5"
              >
                Sign In instead
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
