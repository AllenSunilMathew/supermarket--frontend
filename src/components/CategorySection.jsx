import React from 'react';

const categories = [
  {
    name: 'Baking material',
    count: '11 items',
    bg: 'bg-[#F2FCE4]',
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=120&auto=format&fit=crop&q=60',
  },
  {
    name: 'Fresh Fruits',
    count: '6 items',
    bg: 'bg-[#FFF3EB]',
    image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=120&auto=format&fit=crop&q=60',
  },
  {
    name: 'Milks & Dairies',
    count: '5 items',
    bg: 'bg-[#ECFFEC]',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=60',
  },
  {
    name: 'Vegetables',
    count: '10 items',
    bg: 'bg-[#FEEFEA]',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=120&auto=format&fit=crop&q=60',
  },
  {
    name: 'Meats',
    count: '11 items',
    bg: 'bg-[#FFF3FF]',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=120&auto=format&fit=crop&q=60',
  },
  {
    name: 'Coffee & Tea',
    count: '5 items',
    bg: 'bg-[#F2FCE4]',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=120&auto=format&fit=crop&q=60',
  },
  {
    name: 'Baking material',
    count: '10 items',
    bg: 'bg-[#ECFFEC]',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&auto=format&fit=crop&q=60',
  },
  {
    name: 'Fresh Fruits',
    count: '10 items',
    bg: 'bg-[#FEEFEA]',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=120&auto=format&fit=crop&q=60',
  },
  {
    name: 'Vegetables',
    count: '10 items',
    bg: 'bg-[#FFF3EB]',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=120&auto=format&fit=crop&q=60',
  },
  {
    name: 'Coffee & Tea',
    count: '11 items',
    bg: 'bg-[#ECFFEC]',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=120&auto=format&fit=crop&q=60',
  },
];

const CategorySection = ({ activeCategory, setActiveCategory }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex items-center gap-6">
          <h3 className="text-2xl font-extrabold text-brand-dark">Featured Categories</h3>
          <ul className="hidden md:flex gap-4 text-xs font-semibold text-textColor-muted">
            <li className="hover:text-brand transition-colors cursor-pointer">Cake & Milk</li>
            <li className="hover:text-brand transition-colors cursor-pointer">Coffee & Teas</li>
            <li className="hover:text-brand transition-colors cursor-pointer">Pet Foods</li>
            <li className="hover:text-brand transition-colors cursor-pointer">Vegetables</li>
          </ul>
        </div>
        {/* Navigation arrows (cosmetic) */}
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-full bg-gray-100 text-textColor-body hover:bg-brand hover:text-white flex items-center justify-center transition-all" aria-label="Previous category">
            ←
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-100 text-textColor-body hover:bg-brand hover:text-white flex items-center justify-center transition-all" aria-label="Next category">
            →
          </button>
        </div>
      </div>

      {/* Categories Horizontal Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 overflow-x-auto pb-4">
        {categories.map((cat, idx) => {
          const isSelected = activeCategory === cat.name;
          return (
            <div
              key={idx}
              onClick={() => setActiveCategory(isSelected ? 'All' : cat.name)}
              className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-custom border ${
                isSelected
                  ? 'border-brand ring-2 ring-brand/10 shadow-custom'
                  : 'border-transparent'
              } ${cat.bg}`}
            >
              {/* Image box */}
              <div className="w-16 h-16 flex items-center justify-center mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full zoom-hover shadow-sm"
                />
              </div>

              {/* Title */}
              <h4 className="text-sm font-extrabold text-brand-dark truncate w-full">
                {cat.name}
              </h4>
              
              {/* Count */}
              <span className="text-[11px] text-textColor-muted font-medium mt-1">
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default CategorySection;
