import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Truck, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import CollectionCard from '../components/CollectionCard.jsx';
import FabricCard from '../components/FabricCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { COLLECTIONS, REVIEWS, FABRIC_GUIDE, INSTAGRAM_POSTS } from '../data/collections.js';
import { categoryImage, shopImage } from '../data/images.js';

const OCCASION_IMAGE_SLUGS = ['premium-blends', 'boski', 'boski', 'cotton', 'premium-blends', 'wash-and-wear'];

const WHY_US = [
  { icon: Award, title: 'Premium Sourcing', desc: 'Fabric sourced from Pakistan\'s finest mills, chosen for hand-feel and finish.' },
  { icon: Truck, title: 'Nationwide Delivery', desc: 'Delivered to every major city and town across Pakistan, with COD available.' },
  { icon: ShieldCheck, title: 'Quality Assured', desc: 'Every metre inspected for weave consistency, colour fastness and finish.' },
  { icon: Headphones, title: 'Real Support', desc: 'WhatsApp and phone support from people who understand fabric and tailoring.' },
];

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const newArrivals = PRODUCTS.filter((p) => p.badge === 'New').concat(PRODUCTS.slice(0, 4)).slice(0, 8);
  const bestSellers = PRODUCTS.filter((p) => p.badge === 'Best Seller').concat(PRODUCTS.slice(4, 8)).slice(0, 8);
  const signatureProducts = PRODUCTS.filter((p) => p.badge === 'Signature');
  const winterPicks = PRODUCTS.filter((p) => p.season === 'Winter').slice(0, 4);
  const summerPicks = PRODUCTS.filter((p) => p.season === 'Summer').slice(0, 4);

  return (
    <div>
      <Hero />

      {/* New Arrivals */}
      <section className="container-fk py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow mb-2">Just In</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-sm uppercase tracking-wide text-charcoal hover:text-gold">
            View All <ArrowRight size={15} />
          </Link>
        </div>
        <ProductGrid products={newArrivals} onQuickView={setQuickViewProduct} />
      </section>

      {/* Shop by Category */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-fk">
          <div className="text-center mb-10">
            <p className="eyebrow mb-2">Curated by Fabric</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/shop/${c.slug}`} className="group text-center">
                <div className="aspect-square overflow-hidden bg-stone/10 mb-3">
                  <img
                    src={categoryImage(c.slug, 400, 400)}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors">{c.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-fk py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow mb-2">Customer Favourites</p>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1.5 text-sm uppercase tracking-wide text-charcoal hover:text-gold">
            View All <ArrowRight size={15} />
          </Link>
        </div>
        <ProductGrid products={bestSellers} onQuickView={setQuickViewProduct} />
      </section>

      {/* Featured Collections */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-fk">
          <div className="text-center mb-10">
            <p className="eyebrow mb-2">Featured</p>
            <h2 className="section-title">Our Collections</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COLLECTIONS.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="container-fk py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className="eyebrow mb-2">Dress the Moment</p>
          <h2 className="section-title">Shop by Occasion</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {['Office', 'Wedding', 'Eid', 'Everyday', 'Festive', 'Casual Friday'].map((occ, i) => (
            <Link
              key={occ}
              to={`/shop?occasion=${encodeURIComponent(occ)}`}
              className="relative aspect-[16/10] overflow-hidden group"
            >
              <img
                src={categoryImage(OCCASION_IMAGE_SLUGS[i], 600, 400)}
                alt={occ}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-charcoal/50 group-hover:bg-charcoal/60 transition-colors flex items-center justify-center">
                <span className="text-ivory font-display text-xl sm:text-2xl">{occ}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Seasonal Collections */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-fk">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <p className="eyebrow mb-2">Season Edit</p>
              <h2 className="section-title mb-6">Winter Essentials</h2>
              <ProductGrid products={winterPicks} onQuickView={setQuickViewProduct} />
              <Link to="/shop?season=Winter" className="btn-outline mt-6 inline-flex">Shop Winter</Link>
            </div>
            <div>
              <p className="eyebrow mb-2">Season Edit</p>
              <h2 className="section-title mb-6">Summer Essentials</h2>
              <ProductGrid products={summerPicks} onQuickView={setQuickViewProduct} />
              <Link to="/shop?season=Summer" className="btn-outline mt-6 inline-flex">Shop Summer</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fabric Education */}
      <section className="container-fk py-16 sm:py-20">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="eyebrow mb-2">Know Your Fabric</p>
          <h2 className="section-title mb-3">Understanding Our Weaves</h2>
          <p className="text-stone text-sm leading-relaxed">
            Every fabric behaves differently against the skin and under a tailor's needle.
            Here's a quick guide to what makes each of our six fabric families unique.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FABRIC_GUIDE.map((f, i) => (
            <FabricCard key={f.name} fabric={f} index={i} />
          ))}
        </div>
      </section>

      {/* Signature Collection */}
      <section className="bg-charcoal text-ivory py-16 sm:py-20">
        <div className="container-fk">
          <div className="text-center mb-10 max-w-xl mx-auto">
            <p className="eyebrow mb-2">The House Edit</p>
            <h2 className="section-title text-ivory mb-3">Signature Collection</h2>
            <p className="text-ivory/60 text-sm leading-relaxed">
              A tightly limited run of our finest premium blends — engineered for men who
              want their tailoring to speak quietly and carry weight.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
            {signatureProducts.map((p) => (
              <div key={p.id} className="group">
                <Link to={`/product/${p.id}`} className="block aspect-[3/4] overflow-hidden bg-ivory/10 mb-3">
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <h3 className="text-sm text-ivory">{p.name}</h3>
                <p className="text-sm text-gold mt-1">Rs. {p.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container-fk py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_US.map((item) => (
            <div key={item.title} className="text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mb-4">
                <item.icon size={22} className="text-gold" />
              </div>
              <h3 className="font-medium text-charcoal mb-1.5">{item.title}</h3>
              <p className="text-sm text-stone leading-relaxed max-w-[220px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-fk">
          <div className="text-center mb-10">
            <p className="eyebrow mb-2">Trusted Nationwide</p>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.slice(0, 6).map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="container-fk py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={shopImage(800, 600)} alt="Faisal Kamir fabric shelves — rolls of unstitched fabric ready for tailoring" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="eyebrow mb-2">Our Story</p>
            <h2 className="section-title mb-5">Built on Faisalabad's Weaving Heritage</h2>
            <p className="text-stone text-sm leading-relaxed mb-4">
              Faisal Kamir began in Faisalabad — the heart of Pakistan's textile industry —
              with a simple belief: unstitched fabric deserves the same care as a finished
              garment. We work directly with mills across Punjab to source cotton, khaddar,
              boski and premium blends that hold their shape, their colour and their character
              long after the first wash.
            </p>
            <p className="text-stone text-sm leading-relaxed mb-6">
              Today, every metre we sell is chosen with a tailor's eye — for drape, for
              hand-feel, and for how it will look stitched into a shalwar kameez, kurta or
              waistcoat.
            </p>
            <Link to="/about" className="btn-outline inline-flex">Read Our Story</Link>
          </div>
        </div>
      </section>

      <Newsletter />

      {/* Instagram / Social */}
      <section className="container-fk py-16 sm:py-20">
        <div className="text-center mb-8">
          <p className="eyebrow mb-2">@faisalkamir</p>
          <h2 className="section-title">Follow the Brand</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {INSTAGRAM_POSTS.map((post) => (
            <a key={post.id} href="#" className="aspect-square overflow-hidden block group">
              <img src={post.image} alt="Faisal Kamir on Instagram" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </a>
          ))}
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
