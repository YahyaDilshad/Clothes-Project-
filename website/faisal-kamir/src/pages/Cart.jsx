import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, updateQty, removeFromCart, subtotal, shipping, total, amountToFreeDelivery, FREE_DELIVERY_THRESHOLD } = useCart();
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  if (items.length === 0) {
    return (
      <div className="container-fk py-20 flex flex-col items-center text-center">
        <ShoppingBag size={44} className="text-stone/40 mb-4" />
        <h1 className="font-display text-2xl text-charcoal mb-2">Your cart is empty</h1>
        <p className="text-stone text-sm mb-6 max-w-sm">Explore our fabric collection and find your next tailoring project.</p>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-fk py-12 sm:py-16">
      <h1 className="font-display text-4xl text-charcoal mb-10">Shopping Cart</h1>

      <div className="mb-8 max-w-xl">
        {amountToFreeDelivery > 0 ? (
          <p className="text-sm text-stone mb-2">
            Add <span className="text-gold font-medium">Rs. {amountToFreeDelivery.toLocaleString()}</span> more to unlock free delivery
          </p>
        ) : (
          <p className="text-sm text-charcoal font-medium mb-2">You've unlocked free delivery 🎉</p>
        )}
        <div className="h-1.5 bg-stone/15">
          <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 divide-y divide-charcoal/10 border-t border-b border-charcoal/10">
          {items.map((item) => (
            <div key={`${item.id}-${item.color}`} className="flex gap-4 sm:gap-6 py-6">
              <img src={item.image} alt={item.name} className="w-24 h-32 sm:w-28 sm:h-36 object-cover shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link to={`/product/${item.id}`} className="text-sm sm:text-base font-medium text-charcoal hover:text-gold">
                      {item.name}
                    </Link>
                    <p className="text-xs text-stone mt-1">{item.fabric} · {item.color}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.color)} aria-label="Remove item" className="text-stone hover:text-[#8a4a2e] shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-end justify-between mt-auto pt-4">
                  <div className="flex items-center border border-charcoal/20">
                    <button onClick={() => updateQty(item.id, item.color, item.qty - 1)} disabled={item.qty <= 1} className="p-2 hover:bg-ivory disabled:opacity-30" aria-label="Decrease quantity">
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.color, item.qty + 1)} className="p-2 hover:bg-ivory" aria-label="Increase quantity">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-semibold text-charcoal">Rs. {(item.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-charcoal/10 p-6 h-fit sticky top-32">
          <h2 className="font-display text-xl text-charcoal mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone">
              <span>Subtotal</span>
              <span className="text-charcoal">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone">
              <span>Shipping</span>
              <span className="text-charcoal">{shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}</span>
            </div>
            <div className="border-t border-charcoal/10 pt-3 flex justify-between font-semibold text-base text-charcoal">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary w-full mt-6">Proceed to Checkout</Link>
          <Link to="/shop" className="btn-outline w-full mt-3">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
