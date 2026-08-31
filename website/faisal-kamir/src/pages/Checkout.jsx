import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Truck, Smartphone, Landmark, CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { PAKISTAN_CITIES, PAKISTAN_PROVINCES } from '../utils/constants.js';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay in cash when your order arrives.', icon: Truck },
  { id: 'jazzcash', label: 'JazzCash', desc: 'Pay instantly via JazzCash mobile wallet.', icon: Smartphone },
  { id: 'easypaisa', label: 'Easypaisa', desc: 'Pay instantly via Easypaisa mobile wallet.', icon: Smartphone },
  { id: 'bank', label: 'Bank Transfer', desc: 'Transfer directly to our business account.', icon: Landmark },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Pay securely with Visa or Mastercard.', icon: CreditCard },
];

const emptyForm = { firstName: '', lastName: '', phone: '', email: '', address: '', city: '', province: '', postalCode: '', notes: '' };

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [payment, setPayment] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [, setOrders] = useLocalStorage('fk_orders', []);
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setPlacing(true);
    const orderId = `FK${Date.now().toString().slice(-8)}`;
    const order = {
      id: orderId,
      items,
      subtotal,
      shipping,
      total,
      payment,
      customer: form,
      status: 'placed',
      createdAt: new Date().toISOString(),
    };
    setTimeout(() => {
      setOrders((prev) => [...prev, order]);
      clearCart();
      showToast('Order placed successfully!');
      navigate(`/order-success?orderId=${orderId}`);
    }, 800);
  };

  return (
    <div className="container-fk py-12 sm:py-16">
      <h1 className="font-display text-4xl text-charcoal mb-10">Checkout</h1>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="font-display text-xl text-charcoal mb-5">Customer Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label-fk" htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" required value={form.firstName} onChange={onChange} className="input-fk" />
              </div>
              <div>
                <label className="label-fk" htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" required value={form.lastName} onChange={onChange} className="input-fk" />
              </div>
              <div>
                <label className="label-fk" htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" required value={form.phone} onChange={onChange} className="input-fk" placeholder="03XX-XXXXXXX" />
              </div>
              <div>
                <label className="label-fk" htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={onChange} className="input-fk" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-5">Shipping Address</h2>
            <div className="space-y-5">
              <div>
                <label className="label-fk" htmlFor="address">Street Address</label>
                <input id="address" name="address" required value={form.address} onChange={onChange} className="input-fk" />
              </div>
              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label className="label-fk" htmlFor="city">City</label>
                  <select id="city" name="city" required value={form.city} onChange={onChange} className="input-fk">
                    <option value="">Select city</option>
                    {PAKISTAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-fk" htmlFor="province">Province</label>
                  <select id="province" name="province" required value={form.province} onChange={onChange} className="input-fk">
                    <option value="">Select province</option>
                    {PAKISTAN_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-fk" htmlFor="postalCode">Postal Code</label>
                  <input id="postalCode" name="postalCode" value={form.postalCode} onChange={onChange} className="input-fk" />
                </div>
              </div>
              <div>
                <label className="label-fk" htmlFor="notes">Order Notes (optional)</label>
                <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={onChange} className="input-fk resize-none" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-5">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-4 border p-4 cursor-pointer transition-colors ${
                    payment === m.id ? 'border-gold bg-gold/5' : 'border-charcoal/15'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                    className="accent-charcoal w-4 h-4"
                  />
                  <m.icon size={20} className="text-gold shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">{m.label}</p>
                    <p className="text-xs text-stone">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-stone mt-3 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-gold" /> Payment details are never stored — this is a demo checkout flow.
            </p>
          </section>
        </div>

        <div className="bg-white border border-charcoal/10 p-6 h-fit sticky top-32">
          <h2 className="font-display text-xl text-charcoal mb-5">Order Summary</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto pr-1 mb-5">
            {items.map((item) => (
              <div key={`${item.id}-${item.color}`} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-18 object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-charcoal line-clamp-2">{item.name}</p>
                  <p className="text-xs text-stone mt-0.5">{item.color} × {item.qty}</p>
                </div>
                <p className="text-xs font-medium text-charcoal">Rs. {(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-sm border-t border-charcoal/10 pt-4">
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
          <button type="submit" disabled={placing} className="btn-primary w-full mt-6">
            {placing ? 'Placing Order…' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
