import React from 'react';
import { ShoppingCart, Star, Plus, Minus } from 'lucide-react';

const ProductCard = ({ product, addToCart, cartItem, updateQuantity, removeFromCart }) => {
  const { _id, name, oldPrice, price, image, category, brand, badge, rating, stock } = product;

  const handleAdd = () => {
    addToCart(product, 1);
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(_id, cartItem.quantity + 1, stock);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      if (cartItem.quantity === 1) {
        removeFromCart(_id);
      } else {
        updateQuantity(_id, cartItem.quantity - 1, stock);
      }
    }
  };

  // Helper to color badges
  const getBadgeColor = (type) => {
    if (!type) return '';
    const val = type.toLowerCase();
    if (val === 'hot') return 'bg-orange-500';
    if (val === 'sale') return 'bg-brand';
    if (val === 'new') return 'bg-[#3BB77E]';
    return 'bg-[#fd7e14]';
  };

  return (
    <div className="relative bg-white rounded-3xl border border-gray-100 p-5 flex flex-col justify-between group transition-all duration-300 hover:border-brand hover:shadow-custom">
      
      {/* Product Badge */}
      {badge && (
        <span className={`absolute top-4 left-4 z-10 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-br-2xl rounded-tl-xl ${getBadgeColor(badge)}`}>
          {badge}
        </span>
      )}

      {/* Stock warning */}
      {stock === 0 && (
        <span className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">
          Out of Stock
        </span>
      )}
      {stock > 0 && stock <= 5 && (
        <span className="absolute top-4 right-4 z-10 bg-brand-yellow text-brand-dark text-[9px] font-extrabold px-2 py-0.5 rounded-full">
          Only {stock} Left
        </span>
      )}

      {/* Product Image */}
      <div className="w-full h-44 overflow-hidden rounded-2xl flex items-center justify-center mb-4 bg-gray-50 relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover zoom-hover"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-[11px] font-medium text-textColor-muted tracking-wide uppercase">
            {category}
          </span>

          {/* Title */}
          <h4 className="text-[15px] font-extrabold text-brand-dark mt-1 line-clamp-2 leading-snug group-hover:text-brand transition-colors h-10">
            {name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2 mb-2">
            <div className="flex items-center text-brand-yellow">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating) ? 'fill-current' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-textColor-muted font-semibold">
              ({rating.toFixed(1)})
            </span>
          </div>

          {/* Brand */}
          <span className="text-[11px] text-textColor-muted font-medium">
            By <span className="text-brand font-semibold">{brand}</span>
          </span>
        </div>

        {/* Price & Add button */}
        <div className="flex justify-between items-center mt-4">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[17px] font-extrabold text-brand">
                ${price.toFixed(2)}
              </span>
              {oldPrice && (
                <span className="text-xs font-semibold text-textColor-muted line-through">
                  ${oldPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Add to Cart button */}
          {cartItem ? (
            <div className="flex items-center bg-brand-light border border-brand/20 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={handleDecrement}
                className="px-2.5 py-2 hover:bg-brand hover:text-white transition-colors text-brand"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-3 text-xs font-extrabold text-brand-dark select-none">
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={cartItem.quantity >= stock}
                className="px-2.5 py-2 hover:bg-brand hover:text-white transition-colors text-brand disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={stock === 0}
              className="bg-brand-light hover:bg-brand border border-brand-light hover:border-brand text-brand hover:text-white px-3.5 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.03]"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ProductCard;
