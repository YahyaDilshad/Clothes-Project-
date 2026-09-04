import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import CollectionCard from '../components/CollectionCard.jsx';
import { useProductStore } from '../store/useProductStore'; // Store import kiya

export default function Collections() {
  const { collections, fetchCollections, isLoading } = useProductStore();

  // API se collections fetch karna jab component mount ho
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  if (isLoading && collections.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="container-fk py-12 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="eyebrow mb-2">Curated Edits</p>
        <h1 className="font-display text-4xl text-charcoal">Our Collections</h1>
        <p className="text-stone text-sm mt-3 leading-relaxed">
          Focused edits of our fabric library, built around season, occasion and the way you
          like to dress.
        </p>
      </div>

      {collections.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {collections.map((c) => (
            <CollectionCard key={c._id || c.id} collection={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone/5 border border-dashed border-charcoal/10">
          <p className="text-stone italic text-sm">No collections available at the moment.</p>
        </div>
      )}
    </div>
  );
}