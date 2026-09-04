import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import ProductGrid from '../components/ProductGrid.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { useProductStore } from '../store/useProductStore';

export default function CollectionDetail() {
  const { id } = useParams();
  const { collections, products, fetchProducts, fetchCollections, isLoading } = useProductStore();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (collections.length === 0) fetchCollections();
  }, []);

  const collection = collections.find((c) => c._id === id || c.id === id);

  if (isLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-gold" /></div>;
  if (!collection) return <Navigate to="/shop" replace />;

  // Filter products that belong to this collection (Backend logic check)
  const collectionProducts = products.filter((p) => p.collectionId === id || p.collectionName === collection.name);

  return (
    <div>
      <section className="relative h-[300px] sm:h-[380px] bg-charcoal">
        <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative container-fk h-full flex flex-col justify-end pb-10 text-ivory">
          <div className="flex items-center gap-1.5 text-xs text-ivory/60 mb-4">
            <Link to="/" className="hover:text-gold">Home</Link>
            <ChevronRight size={12} />
            <span className="text-ivory">{collection.name}</span>
          </div>
          <p className="eyebrow mb-2">{collection.tagline || 'Exclusively Curated'}</p>
          <h1 className="font-display text-4xl sm:text-5xl">{collection.name}</h1>
        </div>
      </section>

      <div className="container-fk py-12 sm:py-16">
        <p className="text-stone text-sm max-w-2xl leading-relaxed mb-10">{collection.description}</p>
        <ProductGrid products={collectionProducts} onQuickView={setQuickViewProduct} loading={isLoading} />
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}