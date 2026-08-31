import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function WishlistButton({ product, className = '' }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
      className={`p-2 bg-white/90 backdrop-blur hover:bg-white transition-colors ${className}`}
    >
      <Heart size={17} className={active ? 'fill-gold text-gold' : 'text-charcoal'} />
    </button>
  );
}
