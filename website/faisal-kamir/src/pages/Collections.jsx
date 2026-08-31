import CollectionCard from '../components/CollectionCard.jsx';
import { COLLECTIONS } from '../data/collections.js';

export default function Collections() {
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
      <div className="grid sm:grid-cols-2 gap-6">
        {COLLECTIONS.map((c) => (
          <CollectionCard key={c.id} collection={c} />
        ))}
      </div>
    </div>
  );
}
