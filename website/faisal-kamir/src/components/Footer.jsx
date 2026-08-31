import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { CATEGORIES } from '../data/products.js';
import { WHATSAPP_LINK } from '../utils/constants.js';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory mt-24">
      <div className="container-fk py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <span className="font-display text-2xl tracking-wide">Faisal Kamir</span>
          <p className="text-ivory/60 text-sm mt-3 max-w-xs leading-relaxed">
            Premium men's unstitched fabrics — Wash & Wear, Cotton, Boski, Khaddar, Linen and
            Premium Blends, delivered nationwide across Pakistan.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a href="#" aria-label="Facebook" className="p-2 border border-ivory/20 hover:border-gold hover:text-gold transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="p-2 border border-ivory/20 hover:border-gold hover:text-gold transition-colors">
              <Instagram size={16} />
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="p-2 border border-ivory/20 hover:border-gold hover:text-gold transition-colors">
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="eyebrow text-gold mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop/${c.slug}`} className="hover:text-gold transition-colors">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm text-ivory/70">
            <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-gold transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/faq" className="hover:text-gold transition-colors">FAQs</Link></li>
            <li><Link to="/track-order" className="hover:text-gold transition-colors">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-gold mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 shrink-0" /> +92 300 1234567</li>
            <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 shrink-0" /> support@faisalkamir.pk</li>
            <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> Faisalabad, Punjab, Pakistan</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10 py-5">
        <div className="container-fk flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/50">
          <p>© {new Date().getFullYear()} Faisal Kamir. All rights reserved.</p>
          <p>Crafted for Pakistan's finest tailoring · COD available nationwide</p>
        </div>
      </div>
    </footer>
  );
}
