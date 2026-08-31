import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight, Ruler, Check } from 'lucide-react';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { getProductById, getRelatedProducts, CATEGORIES } from '../data/products.js';
import { REVIEWS } from '../data/collections.js';

const TABS = ['Description', 'Care Instructions', 'Reviews'];

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);
  const [tab, setTab] = useState('Description');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (!product) return <Navigate to="/shop" replace />;

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const related = getRelatedProducts(product);
  const productReviews = REVIEWS.slice(0, 3);

  return (
    <div className="container-fk py-8 sm:py-12">
      <div className="flex items-center gap-1.5 text-xs text-stone mb-6 flex-wrap">
        <Link to="/" className="hover:text-gold">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-gold">Shop</Link>
        <ChevronRight size={12} />
        <Link to={`/shop/${product.category}`} className="hover:text-gold">{category?.name}</Link>
        <ChevronRight size={12} />
        <span className="text-charcoal line-clamp-1">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Fabric close-up */}
      <section className="mt-20 grid sm:grid-cols-2 gap-8 items-center bg-white border border-charcoal/10 p-6 sm:p-10">
        <div className="aspect-square overflow-hidden">
          <img src={product.images[3] || product.images[0]} alt={`${product.name} fabric close-up`} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="eyebrow mb-2">Fabric Close-Up</p>
          <h2 className="font-display text-2xl sm:text-3xl text-charcoal mb-4">Weave & Texture</h2>
          <p className="text-sm text-stone leading-relaxed mb-5">
            A closer look at the {product.fabric.toLowerCase()} weave — {product.weight.toLowerCase()},
            finished in {product.color.toLowerCase()} with a hand-feel built for {product.occasion.toLowerCase()} wear.
          </p>
          <ul className="space-y-2.5 text-sm text-charcoal">
            <li className="flex items-center gap-2"><Check size={15} className="text-gold" /> {product.length} fabric length, enough for one full suit</li>
            <li className="flex items-center gap-2"><Check size={15} className="text-gold" /> Colourfast dyeing, tested for wash durability</li>
            <li className="flex items-center gap-2"><Check size={15} className="text-gold" /> Pre-shrunk finish for accurate tailoring</li>
          </ul>
        </div>
      </section>

      {/* Tabs: Description / Care / Reviews */}
      <section className="mt-16">
        <div className="flex gap-8 border-b border-charcoal/10">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 text-sm uppercase tracking-wide -mb-px border-b-2 transition-colors ${
                tab === t ? 'border-gold text-charcoal' : 'border-transparent text-stone hover:text-charcoal'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-8 max-w-2xl">
          {tab === 'Description' && (
            <p className="text-sm text-stone leading-relaxed">{product.description}</p>
          )}
          {tab === 'Care Instructions' && (
            <ul className="space-y-2.5 text-sm text-stone">
              {product.care.map((c, i) => (
                <li key={i} className="flex items-start gap-2"><Check size={15} className="text-gold mt-0.5 shrink-0" /> {c}</li>
              ))}
            </ul>
          )}
          {tab === 'Reviews' && (
            <div className="grid sm:grid-cols-2 gap-5">
              {productReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tailoring guidance */}
      <section className="bg-charcoal text-ivory p-6 sm:p-10 mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <Ruler size={32} className="text-gold shrink-0" />
        <div>
          <h3 className="font-display text-xl text-ivory mb-1.5">Size & Tailoring Guidance</h3>
          <p className="text-ivory/70 text-sm leading-relaxed max-w-2xl">
            {product.length} of fabric comfortably covers one shalwar kameez or a kurta with shalwar for most
            builds. For a waistcoat or an additional layer, we recommend ordering an extra 1–1.5m. Share your
            usual measurements with your tailor, or message us on WhatsApp for cutting guidance specific to
            this fabric.
          </p>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="text-center mb-8">
            <p className="eyebrow mb-2">You May Also Like</p>
            <h2 className="section-title">Related Fabrics</h2>
          </div>
          <ProductGrid products={related} onQuickView={setQuickViewProduct} />
        </section>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
