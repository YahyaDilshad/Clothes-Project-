import { PackageSearch } from 'lucide-react';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, onQuickView, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-stone/15" />
            <div className="h-3 bg-stone/15 mt-3 w-4/5" />
            <div className="h-3 bg-stone/10 mt-2 w-2/5" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 px-4">
        <PackageSearch size={40} className="text-stone/50 mb-4" />
        <h3 className="font-display text-xl text-charcoal mb-1">No fabrics found</h3>
        <p className="text-stone text-sm max-w-sm">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
