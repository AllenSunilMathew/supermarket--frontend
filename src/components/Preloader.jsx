import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Keep the preloader visible for 1.2 seconds, then trigger fade out
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1200);

    // Completely unmount the component after the fade-out transition finishes
    const destroyTimer = setTimeout(() => {
      setShouldRender(false);
    }, 1700);

    return () => {
      clearTimeout(timer);
      clearTimeout(destroyTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Animated Supermarket Cart SVG */}
        <div className="relative mb-4 h-24 w-24 flex items-center justify-center">
          <svg
            className="h-16 w-16 text-brand animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {/* Outer Pulsing Aura */}
          <div className="absolute inset-0 rounded-full bg-brand/10 animate-ping"></div>
        </div>

        {/* Brand Text */}
        <h2 className="text-3xl font-extrabold text-brand-dark tracking-wide font-sans">
          Nest<span className="text-brand">Grocer</span>
        </h2>
        <p className="mt-2 text-xs font-semibold tracking-widest text-textColor-muted uppercase animate-pulse">
          Loading Fresh Groceries...
        </p>
      </div>
    </div>
  );
};

export default Preloader;
