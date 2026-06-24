import React from 'react';

const banners = [
  {
    title: 'Everyday Fresh & Clean with Our Products',
    bg: 'bg-[#F5ECD7]',
    image: 'https://images.unsplash.com/photo-1508747703725-719ae2c73ee8?w=300&auto=format&fit=crop&q=60',
    color: '#253D35',
  },
  {
    title: 'Make your Breakfast Healthy and Easy',
    bg: 'bg-[#EBF3E8]',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&auto=format&fit=crop&q=60',
    color: '#253D35',
  },
  {
    title: 'The best Organic Products Online',
    bg: 'bg-[#F3E8E8]',
    image: 'https://images.unsplash.com/photo-1543083503-0c40dacd55c6?w=300&auto=format&fit=crop&q=60',
    color: '#253D35',
  },
];

const PromoBanners = ({ setActiveCategory }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className={`relative rounded-3xl overflow-hidden p-8 flex flex-col justify-between min-h-[220px] transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-premium ${banner.bg}`}
          >
            
            {/* Background elements */}
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-85 pointer-events-none translate-x-2 translate-y-4">
              <img
                src={banner.image}
                alt="Promo feature item"
                className="w-full h-full object-cover rounded-2xl border-2 border-white shadow-md rotate-[-6deg]"
              />
            </div>

            {/* Banner Text Content */}
            <div className="max-w-[65%] space-y-4 z-10">
              <h4 className="text-xl font-extrabold text-brand-dark leading-snug">
                {banner.title}
              </h4>
              
              <button
                onClick={() => {
                  if (idx === 0) setActiveCategory('Vegetables');
                  else if (idx === 1) setActiveCategory('Milks & Dairies');
                  else setActiveCategory('Fresh Fruits');
                }}
                className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-xs font-extrabold tracking-wide transition-all shadow-sm"
              >
                Shop Now →
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanners;
