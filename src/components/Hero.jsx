import React, { useState } from 'react';

const Hero = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="relative my-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Curved Banner Card */}
      <div className="relative rounded-[30px] overflow-hidden bg-gradient-to-r from-[#DFF2EC] to-[#E2F5E1] min-h-[380px] sm:min-h-[440px] flex items-center px-8 sm:px-16 py-12 shadow-sm border border-brand-light/35">
        
        {/* Background Decorative Circles */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#DEF9EC] rounded-full filter blur-3xl opacity-50 -z-10 translate-x-20 -translate-y-20"></div>
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-brand-light rounded-full filter blur-2xl opacity-40 -z-10 translate-y-16"></div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 max-w-xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-[1.1]">
              Fresh Vegetables <br className="hidden sm:inline" />
              <span className="text-brand">Big discount</span>
            </h2>
            <p className="text-textColor-body text-base sm:text-lg font-medium tracking-wide">
              Save up to 50% off on your first order. Delivered fresh to your doorstep.
            </p>

            {/* Newsletter Subscription */}
          
          </div>

          {/* Right Image */}
          <div className="hidden lg:col-span-5 lg:flex justify-end pr-4">
            <div className="relative max-w-sm xl:max-w-md transition-transform duration-700 hover:rotate-2">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
                alt="Fresh supermarket organic vegetables bowl"
                className="w-full h-auto rounded-[30px] shadow-premium object-cover aspect-[4/3] border-4 border-white"
              />
              {/* Little Floating Badges */}
              <span className="absolute -top-4 -left-4 bg-brand-yellow text-brand-dark text-xs font-extrabold py-2 px-3.5 rounded-full shadow-lg border border-white">
                ⭐ 100% Organic
              </span>
              <span className="absolute -bottom-4 -right-4 bg-brand text-white text-xs font-extrabold py-2 px-3.5 rounded-full shadow-lg border border-white">
                🍃 Local Farm Fresh
              </span>
            </div>
          </div>

        </div>

        {/* Carousel indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <button className="w-2.5 h-2.5 rounded-full bg-brand" aria-label="Slide 1"></button>
          <button className="w-2.5 h-2.5 rounded-full bg-brand/30 hover:bg-brand transition-colors" aria-label="Slide 2"></button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
