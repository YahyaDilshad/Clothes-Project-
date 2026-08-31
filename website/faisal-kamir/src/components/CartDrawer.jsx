import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setCartOpen,
    updateQty,
    removeFromCart,
    subtotal,
    amountToFreeDelivery,
    FREE_DELIVERY_THRESHOLD,
  } = useCart();

  if (!isCartOpen) return null;

  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <div className="fixed inset-0 z-[95]">
      <div className="absolute inset-0 bg-charcoal/60" onClick={() => setCartOpen(false)} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white flex flex-col animate-slideInRight">
        <div className="flex items-center justify-between px-5 py-5 border-b border-charcoal/10">
          <h2 className="font-display text-xl">Your Cart ({items.length})</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={22} /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <ShoppingBag size={40} className="text-stone/40 mb-4" />
            <p className="text-charcoal font-medium mb-1">Your cart is empty</p>
            <p className="text-sm text-stone mb-6">Explore our fabrics and start building your order.</p>
            <button onClick={() => setCartOpen(false)} className="btn-primary">
              <Link to="/shop">Continue Shopping</Link>
            </button>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-charcoal/10">
              {amountToFreeDelivery > 0 ? (
                <p className="text-xs text-stone mb-2">
                  Add <span className="text-gold font-medium">Rs. {amountToFreeDelivery.toLocaleString()}</span> more for free delivery
                </p>
              ) : (
                <p className="text-xs text-charcoal mb-2 font-medium">You've unlocked free delivery 🎉</p>
              )}
              <div className="h-1.5 bg-stone/15">
                <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 divide-y divide-charcoal/10">
              {items.map((item) => (
                <div key={`${item.id}-${item.color}`} className="flex gap-4 py-5">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal line-clamp-2">{item.name}</p>
                    <p className="text-xs text-stone mt-1">{item.fabric} · {item.color}</p>
                    <p className="text-sm font-semibold text-charcoal mt-1">Rs. {item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center border border-charcoal/20">
                        <button
                          onClick={() => updateQty(item.id, item.color, item.qty - 1)}
                          className="p-1.5 hover:bg-ivory disabled:opacity-30"
                          disabled={item.qty <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.color, item.qty + 1)}
                          className="p-1.5 hover:bg-ivory"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.color)}
                        aria-label="Remove item"
                        className="text-stone hover:text-[#8a4a2e]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-5 border-t border-charcoal/10">
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-stone">Subtotal</span>
                <span className="font-semibold text-charcoal">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-outline w-full mb-3">
                View Cart
              </Link>
              <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-primary w-full">
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
