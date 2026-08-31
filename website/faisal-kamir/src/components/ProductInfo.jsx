import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, MessageCircle, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import WishlistButton from './WishlistButton.jsx';
import { useCart } from '../context/CartContext.jsx';
import { COLORS } from '../data/products.js';
import { waProductLink } from '../utils/constants.js';

export default function ProductInfo({ product }) {
  const [color, setColor] = useState(product.color);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const swatches = COLORS.filter((c) =>
    [product.color, ...COLORS.slice(0, 3).map((s) => s.name)].includes(c.name)
  );

  const handleBuyNow = () => {
    addToCart(product, { color, qty });
    navigate('/checkout');
  };

  return (
    <div>
      <p className="eyebrow mb-2">{product.fabric}</p>
      <h1 className="font-display text-3xl sm:text-4xl text-charcoal leading-tight">{product.name}</h1>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1 text-sm text-stone">
          <Star size={15} className="fill-gold text-gold" />
          <span className="text-charcoal font-medium">{product.rating}</span>
          <span>({product.reviews} reviews)</span>
        </div>
        <span className="w-px h-4 bg-charcoal/15" />
        <span className="text-xs text-stone">SKU: {product.sku}</span>
      </div>

      <div className="flex items-baseline gap-3 mt-5">
        {product.salePrice ? (
          <>
            <span className="text-2xl font-semibold text-charcoal">Rs. {product.salePrice.toLocaleString()}</span>
            <span className="text-base text-stone line-through">Rs. {product.price.toLocaleString()}</span>
            <span className="text-xs bg-[#8a4a2e] text-ivory px-2 py-1">
              Save Rs. {(product.price - product.salePrice).toLocaleString()}
            </span>
          </>
        ) : (
          <span className="text-2xl font-semibold text-charcoal">Rs. {product.price.toLocaleString()}</span>
        )}
      </div>
      <p className="text-xs text-stone mt-1">Inclusive of all taxes · {product.length} fabric length</p>

      <p className="text-sm text-charcoal/80 leading-relaxed mt-6 max-w-md">{product.description}</p>

      <div className="mt-7">
        <p className="label-fk">Colour — <span className="text-charcoal">{color}</span></p>
        <div className="flex gap-2.5">
          {swatches.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              title={c.name}
              className={`w-9 h-9 rounded-full border-2 ${color === c.name ? 'border-gold' : 'border-transparent'}`}
              style={{ backgroundColor: c.hex }}
              aria-label={c.name}
              aria-pressed={color === c.name}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-7 text-sm">
        <div><span className="text-stone">Season</span><p className="text-charcoal font-medium">{product.season}</p></div>
        <div><span className="text-stone">Occasion</span><p className="text-charcoal font-medium">{product.occasion}</p></div>
        <div><span className="text-stone">Fabric Feel</span><p className="text-charcoal font-medium">{product.weight}</p></div>
        <div>
          <span className="text-stone">Availability</span>
          <p className={`font-medium ${product.stock > 0 ? 'text-charcoal' : 'text-[#8a4a2e]'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <div className="flex items-center border border-charcoal/20">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3.5 hover:bg-ivory" aria-label="Decrease quantity">
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="p-3.5 hover:bg-ivory" aria-label="Increase quantity">
            <Plus size={14} />
          </button>
        </div>
        <WishlistButton product={product} className="border border-charcoal/20 !bg-transparent hover:!bg-ivory" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <button
          onClick={() => addToCart(product, { color, qty })}
          disabled={product.stock === 0}
          className="btn-outline flex-1"
        >
          Add to Cart
        </button>
        <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn-primary flex-1">
          Buy Now
        </button>
      </div>

      <a
        href={waProductLink(product)}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full mt-3 bg-[#25D366] text-white py-3.5 text-sm tracking-wide uppercase font-medium hover:opacity-90 transition-opacity"
      >
        <MessageCircle size={17} /> Order on WhatsApp
      </a>

      <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-charcoal/10 text-xs text-stone">
        <div className="flex items-center gap-2"><Truck size={16} className="text-gold" /> Nationwide Delivery</div>
        <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-gold" /> Quality Guaranteed</div>
        <div className="flex items-center gap-2"><RefreshCw size={16} className="text-gold" /> Easy Exchange</div>
      </div>
    </div>
  );
}
