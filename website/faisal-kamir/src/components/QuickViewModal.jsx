import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import Modal from './Modal.jsx';
import WishlistButton from './WishlistButton.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();

  return (
    <Modal open={!!product} onClose={onClose} title={product?.name} maxWidth="max-w-3xl">
      {product && (
        <div className="grid sm:grid-cols-2">
          <div className="aspect-[3/4] sm:aspect-auto bg-stone/10">
            <img src={product.images ? product.images[0] : product.img} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 sm:p-8 flex flex-col">
            <p className="eyebrow mb-2">{product.fabric}</p>
            <h2 className="font-display text-2xl text-charcoal">{product.name}</h2>
            <div className="flex items-center gap-1 text-sm text-stone mt-2">
              <Star size={14} className="fill-gold text-gold" />
              <span className="text-charcoal">{product.rating}</span>
              <span>({product.reviews})</span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              {product.salePrice ? (
                <>
                  <span className="text-xl font-semibold text-charcoal">Rs. {product.salePrice.toLocaleString()}</span>
                  <span className="text-sm text-stone line-through">Rs. {product.price.toLocaleString()}</span>
                </>
              ) : (
                <span className="text-xl font-semibold text-charcoal">Rs. {product.price.toLocaleString()}</span>
              )}
            </div>
            <p className="text-sm text-stone mt-4 leading-relaxed line-clamp-4">{product.description}</p>
            <div className="text-xs text-stone mt-4 space-y-1">
              <p>Colour: <span className="text-charcoal">{product.color}</span></p>
              <p>Length: <span className="text-charcoal">{product.length}</span></p>
              <p>Stock: <span className="text-charcoal">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => addToCart(product)} className="btn-primary flex-1" disabled={product.stock === 0}>
                Add to Cart
              </button>
              <WishlistButton product={product} className="border border-charcoal/20" />
            </div>
            <Link to={`/product/${product.id}`} onClick={onClose} className="text-center text-xs uppercase tracking-wide text-gold hover:underline mt-4">
              View Full Details
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
