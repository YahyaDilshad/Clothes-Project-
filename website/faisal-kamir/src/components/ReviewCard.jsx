import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white border border-charcoal/10 p-6 h-full flex flex-col">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className={i < review.rating ? 'fill-gold text-gold' : 'text-stone/30'} />
        ))}
      </div>
      <p className="text-sm text-charcoal/80 leading-relaxed flex-1">"{review.text}"</p>
      <div className="mt-5 pt-4 border-t border-charcoal/10">
        <p className="text-sm font-medium text-charcoal">{review.name}</p>
        <p className="text-xs text-stone mt-0.5">{review.city} · {review.product}</p>
      </div>
    </div>
  );
}
