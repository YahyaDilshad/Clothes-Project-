import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CollectionCard({ collection }) {
  return (
    <Link to={`/collections/${collection.id}`} className="group relative block overflow-hidden aspect-[4/5]">
      <img
        src={collection.image.url}
        alt={collection.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-red-50 text-[11px] tracking-widest2 uppercase mb-1">{collection.tagline}</p>
        <h3 className="font-display text-2xl text-ivory">{collection.name}</h3>
        <span className="inline-flex items-center gap-1.5 text-ivory text-xs uppercase tracking-wide mt-3 group-hover:gap-2.5 transition-all">
          Discover <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
