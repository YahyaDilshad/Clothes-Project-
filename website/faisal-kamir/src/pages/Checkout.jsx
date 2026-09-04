import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useProductStore } from '../store/useProductStore';
import { PAKISTAN_CITIES, PAKISTAN_PROVINCES } from '../utils/constants.js';

export default function Checkout() {
  const { items, getTotals, clearCart } = useCartStore();
  const { createOrder } = useProductStore();
  const { subtotal, shipping, total } = getTotals();
  
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', address: '', city: '', province: '', postalCode: '', notes: '' });
  const [payment, setPayment] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);

    const orderPayload = {
      customer: form,
      items: items.map(i => ({ productId: i.id, quantity: i.qty, color: i.color, price: i.price })),
      totalAmount: total,
      shippingFee: shipping,
      paymentMethod: payment,
    };

    const result = await createOrder(orderPayload);
    
    if (result.success) {
      clearCart();
      navigate(`/order-success?orderId=${result.order._id || result.order.id}`);
    }
    setPlacing(false);
  };

  return (
    <div className="container-fk py-12 sm:py-16">
      <h1 className="font-display text-4xl mb-10">Checkout</h1>
      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* Customer Details Form... same inputs as before */}
          <section>
            <h2 className="font-display text-xl mb-5">Shipping Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
               <input placeholder="First Name" required value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} className="input-fk" />
               <input placeholder="Last Name" required value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} className="input-fk" />
               <input placeholder="Phone" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="input-fk" />
               <input placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-fk" />
            </div>
            <div className="mt-5 space-y-5">
               <input placeholder="Address" required value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="input-fk" />
               <div className="grid grid-cols-2 gap-5">
                 <select value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="input-fk">
                   <option value="">Select City</option>
                   {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <select value={form.province} onChange={(e) => setForm({...form, province: e.target.value})} className="input-fk">
                   <option value="">Select Province</option>
                   {PAKISTAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
               </div>
            </div>
          </section>

          {/* Payment Method selection stays the same as before */}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white border p-6 h-fit sticky top-32">
          <h2 className="font-display text-xl mb-5">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 text-sm">
                <img src={item.image} className="w-12 h-16 object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-stone">{item.qty} x Rs. {item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2 text-sm mb-6">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>Rs. {total}</span></div>
          </div>
          <button type="submit" disabled={placing} className="btn-primary w-full flex justify-center items-center gap-2">
            {placing ? <><Loader2 className="animate-spin" size={18} /> Placing Order...</> : 'Confirm Order'}
          </button>
        </div>
      </form>
    </div>
  );
}