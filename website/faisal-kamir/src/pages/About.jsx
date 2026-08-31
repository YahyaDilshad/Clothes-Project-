import { Award, Users, Factory, Leaf } from 'lucide-react';
import { shopShelvesImage } from '../data/images.js';

const VALUES = [
  { icon: Factory, title: 'Direct from the Mill', desc: 'We work directly with weaving mills across Punjab, cutting out layers that dilute quality.' },
  { icon: Award, title: 'Inspected, Not Assumed', desc: 'Every roll is checked for weave consistency, colour fastness and finish before it reaches you.' },
  { icon: Users, title: 'Built for Tailors', desc: 'Fabric chosen with a tailor\'s eye — for drape, grain and how it behaves under a needle.' },
  { icon: Leaf, title: 'Considered Sourcing', desc: 'We favour mills that treat their fibre, water and workforce responsibly.' },
];

export default function About() {
  return (
    <div>
      <section className="bg-charcoal text-ivory py-20 sm:py-28">
        <div className="container-fk text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-3">Our Story</p>
          <h1 className="font-display text-4xl sm:text-5xl">Faisal Kamir</h1>
          <p className="text-ivory/70 mt-5 leading-relaxed">
            A men's unstitched fabric house rooted in Faisalabad, Pakistan's textile capital —
            built for men who care how their clothes are made before they're even cut.
          </p>
        </div>
      </section>

      <section className="container-fk py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] overflow-hidden order-2 lg:order-1">
            <img src={shopShelvesImage(800, 600)} alt="Faisal Kamir fabric shelves — unstitched suit lengths ready for the tailoring table" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow mb-2">Where We Started</p>
            <h2 className="section-title mb-5">A House Built on Weaving Heritage</h2>
            <p className="text-stone text-sm leading-relaxed mb-4">
              Faisalabad has been the heart of Pakistan's textile industry for generations —
              its mills produce much of the fabric that ends up on tailoring tables across the
              country. Faisal Kamir was started to bring that fabric, and the knowledge behind
              it, directly to the men who wear it.
            </p>
            <p className="text-stone text-sm leading-relaxed">
              What began as a small stock of wash & wear and cotton has grown into a full
              range across six fabric families — Wash & Wear, Cotton, Boski, Khaddar, Linen
              and Premium Blends — each sourced with the same standard: it has to feel right
              in the hand before it goes to a customer.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-fk">
          <div className="text-center mb-12 max-w-xl mx-auto">
            <p className="eyebrow mb-2">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v) => (
              <div key={v.title} className="text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mb-4">
                  <v.icon size={22} className="text-gold" />
                </div>
                <h3 className="font-medium text-charcoal mb-1.5">{v.title}</h3>
                <p className="text-sm text-stone leading-relaxed max-w-[220px]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-fk py-16 sm:py-20 grid sm:grid-cols-3 gap-8 text-center">
        <div>
          <p className="font-display text-4xl text-gold">6</p>
          <p className="text-sm text-stone mt-1">Fabric Families</p>
        </div>
        <div>
          <p className="font-display text-4xl text-gold">70+</p>
          <p className="text-sm text-stone mt-1">Cities Delivered To</p>
        </div>
        <div>
          <p className="font-display text-4xl text-gold">10,000+</p>
          <p className="text-sm text-stone mt-1">Orders Fulfilled</p>
        </div>
      </section>
    </div>
  );
}
