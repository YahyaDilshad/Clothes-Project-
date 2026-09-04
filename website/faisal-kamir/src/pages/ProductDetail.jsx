import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight, Ruler, Check, Loader2 } from 'lucide-react';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { useProductStore } from '../store/useProductStore.js';

const TABS = ['Description', 'Care Instructions', 'Reviews'];

export default function ProductDetail() {
  const { id } = useParams();
  const { products, categories, fetchProducts, isLoading } = useProductStore();
  const [tab, setTab] = useState('Description');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  // Backend se id handle karna (kuch DBs mein _id hota hai)
  const product = products.find(p => p._id === id || p.id === id);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" /></div>;
  if (!product && !isLoading) return <Navigate to="/shop" replace />;

  const category = categories.find((c) => c.slug === product.category);
  const related = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);

  return (
    <div className="container-fk py-8 sm:py-12">
      {/* ... (Breadcrumbs same raheinge, product variables handle karein) ... */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Fabric Close-up with API data */}
      <section className="mt-20 grid sm:grid-cols-2 gap-8 items-center bg-white border border-charcoal/10 p-6 sm:p-10">
        <div className="aspect-square overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="eyebrow mb-2">Fabric Close-Up</p>
          <h2 className="font-display text-2xl sm:text-3xl text-charcoal mb-4">Weave & Texture</h2>
          <p className="text-sm text-stone leading-relaxed mb-5">
            Quality {product.fabric} fabric in {product.color} color. Best for {product.occasion}.
          </p>
        </div>
      </section>

      {/* Tabs Logic */}
      <section className="mt-16">
        {/* ... (Tabs UI same rahega) ... */}
        <div className="py-8 max-w-2xl">
          {tab === 'Description' && <p className="text-sm text-stone">{product.description}</p>}
          {tab === 'Care Instructions' && (
             <ul className="space-y-2.5 text-sm text-stone">
               {product.care?.map((c, i) => (
                 <li key={i} className="flex items-center gap-2"><Check size={15} className="text-gold" /> {c}</li>
               ))}
             </ul>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title text-center mb-8">Related Fabrics</h2>
          <ProductGrid products={related} onQuickView={setQuickViewProduct} />
        </section>
      )}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}