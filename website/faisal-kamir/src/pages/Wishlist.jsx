import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductGrid from '../components/ProductGrid.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { PRODUCTS } from '../data/products.js';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const products = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container-fk py-12 sm:py-16">
      <div className="mb-10">
        <p className="eyebrow mb-2">Saved for Later</p>
        <h1 className="font-display text-4xl text-charcoal">Your Wishlist</h1>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center text-center py-20">
          <Heart size={40} className="text-stone/40 mb-4" />
          <p className="text-charcoal font-medium mb-1">Your wishlist is empty</p>
          <p className="text-sm text-stone mb-6 max-w-sm">
            Tap the heart icon on any fabric to save it here for later.
          </p>
          <Link to="/shop" className="btn-primary">Browse Fabrics</Link>
        </div>
      ) : (
        <ProductGrid products={products} onQuickView={setQuickViewProduct} />
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
