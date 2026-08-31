import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Heart, ShoppingBag, User, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function AnnouncementBar() {
  return (
    <div className="bg-charcoal text-ivory text-center text-[11px] sm:text-xs tracking-wide py-2 px-4">
      Free nationwide delivery on orders above Rs. 8,000 &nbsp;·&nbsp; Cash on Delivery available across Pakistan
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, setCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory">
      <AnnouncementBar />
      <div className={`border-b border-charcoal/10 transition-shadow ${scrolled ? 'shadow-sm' : ''} bg-ivory`}>
        <div className="container-fk flex items-center justify-between h-[72px]">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="flex flex-col items-center lg:items-start leading-none">
            <span className="font-display text-2xl sm:text-[28px] tracking-wide text-charcoal">Faisal Kamir</span>
            <span className="hidden sm:block text-[10px] tracking-widest2 uppercase text-gold mt-0.5">
              Men's Unstitched Fabrics
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <NavLink
                to="/shop"
                className="flex items-center gap-1 text-sm tracking-wide uppercase text-charcoal hover:text-gold transition-colors"
              >
                Shop <ChevronDown size={14} />
              </NavLink>
              {shopOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56">
                  <div className="bg-white shadow-xl border border-charcoal/10 py-2">
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/shop/${c.slug}`}
                        className="block px-4 py-2.5 text-sm text-charcoal hover:bg-ivory hover:text-gold"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {NAV_LINKS.filter((l) => l.label !== 'Shop').map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide uppercase text-charcoal hover:text-gold transition-colors ${isActive ? 'text-gold' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <form onSubmit={onSearchSubmit} className="hidden md:flex items-center relative">
              <Search size={16} className="absolute left-3 text-stone pointer-events-none" />
              <input
                name="q"
                type="search"
                placeholder="Search fabrics..."
                className="bg-white border border-charcoal/15 pl-9 pr-3 py-2 text-sm w-48 lg:w-64 focus:outline-none focus:border-gold"
              />
            </form>
            <Link to="/search" className="md:hidden p-2" aria-label="Search">
              <Search size={20} />
            </Link>
            <Link to="/wishlist" className="relative p-2" aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-ivory text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/track-order" className="hidden sm:inline-flex p-2" aria-label="Track order">
              <User size={20} />
            </Link>
            <button className="relative p-2" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-ivory text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[82%] max-w-xs bg-ivory shadow-2xl flex flex-col animate-slideUp">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
              <span className="font-display text-xl">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-1 overflow-y-auto">
              <p className="eyebrow mb-2 mt-2">Shop by Category</p>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/shop/${c.slug}`} className="py-2.5 text-sm text-charcoal border-b border-charcoal/5">
                  {c.name}
                </Link>
              ))}
              <p className="eyebrow mb-2 mt-5">Explore</p>
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="py-2.5 text-sm text-charcoal border-b border-charcoal/5">
                  {l.label}
                </Link>
              ))}
              <Link to="/wishlist" className="py-2.5 text-sm text-charcoal border-b border-charcoal/5">Wishlist</Link>
              <Link to="/track-order" className="py-2.5 text-sm text-charcoal border-b border-charcoal/5">Track Order</Link>
              <Link to="/faq" className="py-2.5 text-sm text-charcoal border-b border-charcoal/5">FAQ</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
