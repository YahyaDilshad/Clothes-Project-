import { Link } from 'react-router-dom';
import { Star, Eye, ShoppingBag } from 'lucide-react';
import WishlistButton from './WishlistButton.jsx';
import { useCart } from '../context/CartContext.jsx';

const BADGE_STYLES = {
  New: 'bg-charcoal text-ivory',
  'Best Seller': 'bg-gold text-ivory',
  Sale: 'bg-[#8a4a2e] text-ivory',
  Signature: 'bg-charcoal text-gold border border-gold',
};

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();

  return (
    <div className="group relative flex flex-col">
      <div className="relative overflow-hidden bg-stone/10 aspect-[3/4]">
        <Link to={`/product/${product.id}`} aria-label={product.name}>
          <img
            src={product.images ? product.images[0] : product.img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        </Link>

        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] tracking-wide uppercase font-medium px-2.5 py-1 ${BADGE_STYLES[product.badge] || 'bg-charcoal text-ivory'}`}
          >
            {product.badge}
          </span>
        )}

        <WishlistButton product={product} className="absolute top-3 right-3" />

        <div className="absolute bottom-0 left-0 right-0 flex opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => onQuickView?.(product)}
            className="flex-1 bg-white/95 hover:bg-white text-charcoal text-xs uppercase tracking-wide py-2.5 flex items-center justify-center gap-1.5 border-t border-charcoal/10"
          >
            <Eye size={14} /> Quick View
          </button>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-charcoal hover:bg-gold text-ivory text-xs uppercase tracking-wide py-2.5 flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={14} /> Add
          </button>
        </div>
      </div>

      <Link to={`/product/${product.id}`} className="mt-3">
        <h3 className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors line-clamp-2">
          {product.name}
        </h3>
      </Link>
      <p className="text-xs text-stone mt-0.5">
        {product.fabric} · {product.color}
      </p>

      <div className="flex items-center gap-1 mt-1.5 text-xs text-stone">
        <Star size={13} className="fill-gold text-gold" />
        <span>{product.rating}</span>
        <span>({product.reviews})</span>
      </div>

      <div className="mt-1.5 flex items-baseline gap-2">
        {product.salePrice ? (
          <>
            <span className="text-sm font-semibold text-charcoal">Rs. {product.salePrice.toLocaleString()}</span>
            <span className="text-xs text-stone line-through">Rs. {product.price.toLocaleString()}</span>
          </>
        ) : (
          <span className="text-sm font-semibold text-charcoal">Rs. {product.price.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}
