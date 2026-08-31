import { Link } from 'react-router-dom';
import { heroImage } from '../data/images.js';

export default function Hero() {
  return (
    <section className="relative bg-charcoal text-ivory overflow-hidden">
      <div className="container-fk grid lg:grid-cols-2 items-center min-h-[560px] sm:min-h-[620px]">
        <div className="relative z-10 py-16 lg:py-0 animate-fadeIn">
          <p className="eyebrow mb-5">Season 2026 · Now Available</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] max-w-lg">
            Premium Men's <span className="text-gold">Unstitched Fabrics</span>
          </h1>
          <p className="text-ivory/70 mt-6 max-w-md text-[15px] leading-relaxed">
            Wash & Wear, Cotton, Boski, Khaddar, Linen and Premium Blends — sourced,
            woven and finished for men who take their tailoring seriously. Delivered
            nationwide across Pakistan.
          </p>
          <div className="flex flex-wrap gap-4 mt-9">
            <Link to="/shop" className="btn-gold">Shop Collection</Link>
            <Link to="/collections" className="inline-flex items-center justify-center gap-2 border border-ivory/40 text-ivory px-7 py-3.5 text-sm tracking-wide uppercase font-medium hover:border-gold hover:text-gold transition-colors duration-300">
              Explore Fabrics
            </Link>
          </div>
          <div className="flex items-center gap-8 mt-12 text-xs text-ivory/50 tracking-wide">
            <span>500+ 5-Star Reviews</span>
            <span className="w-px h-4 bg-ivory/20" />
            <span>Nationwide COD</span>
          </div>
        </div>
      </div>
      <img
        src={heroImage(1200, 1400)}
        alt="Faisal Kamir premium unstitched fabric drape"
        className="hidden lg:block absolute top-0 right-0 h-full w-[46%] object-cover"
      />
      <div className="hidden lg:block absolute top-0 right-[46%] h-full w-40 bg-gradient-to-r from-charcoal to-transparent" />
    </section>
  );
}
