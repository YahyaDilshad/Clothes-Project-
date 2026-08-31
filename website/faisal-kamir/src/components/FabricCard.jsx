import { Link } from 'react-router-dom';

const SLUG_MAP = {
  'Wash & Wear': 'wash-and-wear',
  Cotton: 'cotton',
  Boski: 'boski',
  Khaddar: 'khaddar',
  Linen: 'linen',
  'Premium Blends': 'premium-blends',
};

export default function FabricCard({ fabric, index }) {
  return (
    <Link
      to={`/shop/${SLUG_MAP[fabric.name] || ''}`}
      className="group border border-charcoal/10 p-6 hover:border-gold transition-colors bg-white"
    >
      <span className="font-display text-3xl text-gold/40 group-hover:text-gold transition-colors">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="font-display text-xl text-charcoal mt-3">{fabric.name}</h3>
      <p className="text-sm text-stone mt-2 leading-relaxed">{fabric.desc}</p>
    </Link>
  );
}
