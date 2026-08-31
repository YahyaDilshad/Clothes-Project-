import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import ProductGrid from '../components/ProductGrid.jsx';
import FilterDrawer from '../components/FilterDrawer.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { PRODUCTS, CATEGORIES } from '../data/products.js';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

const emptyFilters = { fabric: [], color: [], occasion: [], priceMin: 0, priceMax: 0, inStockOnly: false };

export default function Shop() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeCategory = CATEGORIES.find((c) => c.slug === category);
  const occasionParam = searchParams.get('occasion');
  const seasonParam = searchParams.get('season');

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [category, filters, sort, occasionParam, seasonParam]);

  useEffect(() => {
    if (occasionParam) setFilters((f) => ({ ...f, occasion: [occasionParam] }));
  }, [occasionParam]);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory.slug);
    if (seasonParam) list = list.filter((p) => p.season === seasonParam || p.season === 'All Season');
    if (filters.fabric.length) list = list.filter((p) => filters.fabric.includes(p.fabric));
    if (filters.color.length) list = list.filter((p) => filters.color.includes(p.color));
    if (filters.occasion.length) list = list.filter((p) => filters.occasion.includes(p.occasion));
    if (filters.priceMin > 0) list = list.filter((p) => (p.salePrice || p.price) >= filters.priceMin);
    if (filters.priceMax > 0) list = list.filter((p) => (p.salePrice || p.price) <= filters.priceMax);
    if (filters.inStockOnly) list = list.filter((p) => p.stock > 0);

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => (b.badge === 'New') - (a.badge === 'New'));
        break;
      default:
        break;
    }
    return list;
  }, [activeCategory, filters, sort, seasonParam]);

  return (
    <div className="container-fk py-8 sm:py-12">
      <div className="flex items-center gap-1.5 text-xs text-stone mb-5">
        <Link to="/" className="hover:text-gold">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-gold">Shop</Link>
        {activeCategory && (
          <>
            <ChevronRight size={12} />
            <span className="text-charcoal">{activeCategory.name}</span>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal">
            {activeCategory ? activeCategory.name : 'All Fabrics'}
          </h1>
          {activeCategory && <p className="text-stone text-sm mt-2 max-w-md">{activeCategory.blurb}</p>}
        </div>
        <p className="text-sm text-stone">{filtered.length} products</p>
      </div>

      <div className="flex items-center justify-between mb-6 lg:hidden">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 text-sm uppercase tracking-wide border border-charcoal/20 px-4 py-2.5"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-charcoal/20 px-3 py-2.5 text-sm bg-white"
          aria-label="Sort products"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-10">
        <FilterDrawer
          filters={filters}
          setFilters={setFilters}
          onClear={() => setFilters(emptyFilters)}
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        />

        <div className="flex-1 min-w-0">
          <div className="hidden lg:flex items-center justify-end mb-6">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-charcoal/20 px-3 py-2.5 text-sm bg-white"
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <ProductGrid products={filtered} onQuickView={setQuickViewProduct} loading={loading} />
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
