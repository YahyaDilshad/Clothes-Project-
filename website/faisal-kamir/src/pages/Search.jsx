import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { PRODUCTS } from '../data/products.js';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (query) setSearchParams({ q: query });
      else setSearchParams({});
    }, 250);
    return () => clearTimeout(t);
  }, [query, setSearchParams]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) =>
      [p.name, p.fabric, p.color, p.occasion, p.season, p.category]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  return (
    <div className="container-fk py-12 sm:py-16">
      <div className="max-w-xl mx-auto text-center mb-10">
        <p className="eyebrow mb-2">Find Your Fabric</p>
        <h1 className="font-display text-4xl text-charcoal mb-6">Search</h1>
        <SearchBar value={query} onChange={setQuery} autoFocus />
      </div>

      {query.trim() ? (
        <>
          <p className="text-sm text-stone mb-6">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
          <ProductGrid products={results} onQuickView={setQuickViewProduct} />
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-stone text-sm">
            Try searching by fabric type, colour, or occasion — e.g. "khaddar", "navy", "wedding".
          </p>
        </div>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
