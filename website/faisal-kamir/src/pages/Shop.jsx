import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronRight, Loader2 } from 'lucide-react';
import ProductGrid from '../components/ProductGrid.jsx';
import FilterDrawer from '../components/FilterDrawer.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { useProductStore } from '../store/useProductStore'; // Store import kiya

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
  
  // Zustand Store States
  const { products, categories, fetchProducts, fetchCategories, isLoading } = useProductStore();

  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // API Call on Mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const activeCategory = categories.find((c) => c.slug === category);
  const occasionParam = searchParams.get('occasion');
  const seasonParam = searchParams.get('season');

  useEffect(() => {
    if (occasionParam) setFilters((f) => ({ ...f, occasion: [occasionParam] }));
  }, [occasionParam]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory.slug);
    if (seasonParam) list = list.filter((p) => p.season === seasonParam || p.season === 'All Season');
    if (filters.fabric.length) list = list.filter((p) => filters.fabric.includes(p.fabric));
    if (filters.color.length) list = list.filter((p) => filters.color.includes(p.color));
    if (filters.occasion.length) list = list.filter((p) => filters.occasion.includes(p.occasion));
    if (filters.priceMin > 0) list = list.filter((p) => (p.salePrice || p.price) >= filters.priceMin);
    if (filters.priceMax > 0) list = list.filter((p) => (p.salePrice || p.price) <= filters.priceMax);
    if (filters.inStockOnly) list = list.filter((p) => p.stock > 0);

    // Sorting Logic
    if (sort === 'price-asc') list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    if (sort === 'price-desc') list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    return list;
  }, [products, activeCategory, filters, sort, seasonParam]);

  if (isLoading && products.length === 0) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" /></div>;
  }

  return (
    <div className="container-fk py-8 sm:py-12">
      {/* Breadcrumbs aur Header same rahega */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal">
            {activeCategory ? activeCategory.name : 'All Fabrics'}
          </h1>
        </div>
        <p className="text-sm text-stone">{filtered.length} products</p>
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
          <ProductGrid products={filtered} onQuickView={setQuickViewProduct} loading={isLoading} />
        </div>
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}