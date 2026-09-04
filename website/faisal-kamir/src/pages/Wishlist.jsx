import { useState, useEffect } from 'react';
import { useProductStore } from '../store/useProductStore.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductGrid from '../components/ProductGrid.jsx';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const { products, fetchProducts } = useProductStore();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if(products.length === 0) fetchProducts();
  }, []);

  const wishlistProducts = products.filter((p) => wishlist.includes(p._id || p.id));

  return (
    <div className="container-fk py-12 sm:py-16">
      <h1 className="font-display text-4xl mb-10">Your Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <ProductGrid products={wishlistProducts} onQuickView={setQuickViewProduct} />
      )}
    </div>
  );
}