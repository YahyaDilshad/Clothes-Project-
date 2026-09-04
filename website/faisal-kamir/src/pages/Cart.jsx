import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Cart() {
  const { items, updateQty, removeFromCart, getTotals, FREE_DELIVERY_THRESHOLD } = useCartStore();
  const { subtotal, shipping, total, amountToFreeDelivery } = getTotals();
  
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  if (items.length === 0) {
    return (
      <div className="container-fk py-20 flex flex-col items-center text-center">
        <ShoppingBag size={44} className="text-stone/40 mb-4" />
        <h1 className="font-display text-2xl mb-6">Your cart is empty</h1>
        <Link to="/shop" className="btn-primary">Browse Fabrics</Link>
      </div>
    );
  }

  return (
    <div className="container-fk py-12 sm:py-16">
      <h1 className="font-display text-4xl text-charcoal mb-10">Shopping Cart</h1>

      <div className="mb-8 max-w-xl">
        <p className="text-sm text-stone mb-2">
          {amountToFreeDelivery > 0 
            ? <>Add <span className="text-gold font-medium">Rs. {amountToFreeDelivery.toLocaleString()}</span> more for free delivery</>
            : "You've unlocked free delivery! 🎉"}
        </p>
        <div className="h-1.5 bg-stone/15">
          <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 divide-y border-t border-b">
          {items.map((item) => (
            <div key={`${item.id}-${item.color}`} className="flex gap-4 py-6">
              <img src={item.image} alt={item.name} className="w-24 h-32 object-cover shrink-0" />
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <p className="font-medium">{item.name}</p>
                  <button onClick={() => removeFromCart(item.id, item.color)} className="text-stone hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-stone">{item.fabric} · {item.color}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border">
                    <button onClick={() => updateQty(item.id, item.color, item.qty - 1)} className="p-2"><Minus size={14} /></button>
                    <span className="px-4 text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.color, item.qty + 1)} className="p-2"><Plus size={14} /></button>
                  </div>
                  <p className="font-semibold text-charcoal">Rs. {(item.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border p-6 h-fit sticky top-32">
          <h2 className="font-display text-xl mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm border-b pb-4 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span></div>
          </div>
          <div className="flex justify-between font-bold text-lg mb-6"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
          <Link to="/checkout" className="btn-primary w-full block text-center">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}