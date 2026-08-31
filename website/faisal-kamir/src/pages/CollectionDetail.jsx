import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '../components/ProductGrid.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { COLLECTIONS } from '../data/collections.js';
import { PRODUCTS } from '../data/products.js';

export default function CollectionDetail() {
  const { id } = useParams();
  const collection = COLLECTIONS.find((c) => c.id === id);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (!collection) return <Navigate to="/collections" replace />;

  const products = PRODUCTS.filter((p) => collection.categories.includes(p.category));

  return (
    <div>
      <section className="relative h-[300px] sm:h-[380px] bg-charcoal">
        <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative container-fk h-full flex flex-col justify-end pb-10 text-ivory">
          <div className="flex items-center gap-1.5 text-xs text-ivory/60 mb-4">
            <Link to="/" className="hover:text-gold">Home</Link>
            <ChevronRight size={12} />
            <Link to="/collections" className="hover:text-gold">Collections</Link>
            <ChevronRight size={12} />
            <span className="text-ivory">{collection.name}</span>
          </div>
          <p className="eyebrow mb-2">{collection.tagline}</p>
          <h1 className="font-display text-4xl sm:text-5xl">{collection.name}</h1>
        </div>
      </section>

      <div className="container-fk py-12 sm:py-16">
        <p className="text-stone text-sm max-w-2xl leading-relaxed mb-10">{collection.description}</p>
        <ProductGrid products={products} onQuickView={setQuickViewProduct} />
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
