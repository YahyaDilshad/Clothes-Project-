import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { WHATSAPP_LINK } from '../utils/constants.js';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orders] = useLocalStorage('fk_orders', []);
  const order = orders.find((o) => o.id === orderId);

  return (
    <div className="container-fk py-16 sm:py-24 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-charcoal flex items-center justify-center mb-6">
        <CheckCircle2 size={30} className="text-gold" />
      </div>
      <p className="eyebrow mb-2">Thank You</p>
      <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-3">Your Order Is Confirmed</h1>
      <p className="text-stone text-sm max-w-md mb-2">
        We've received your order and will begin processing it shortly. A confirmation has been noted
        against your phone number.
      </p>
      {orderId && (
        <p className="text-charcoal font-medium mb-8">
          Order ID: <span className="text-gold">{orderId}</span>
        </p>
      )}

      {order && (
        <div className="bg-white border border-charcoal/10 p-6 max-w-md w-full text-left mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-stone">Items</span>
            <span className="text-charcoal">{order.items.reduce((s, i) => s + i.qty, 0)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-stone">Payment Method</span>
            <span className="text-charcoal capitalize">{order.payment}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-charcoal/10 pt-3 mt-2">
            <span>Total</span>
            <span>Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/track-order" className="btn-primary">Track Your Order</Link>
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gold mt-6 hover:underline">
        <MessageCircle size={16} /> Need help? Message us on WhatsApp
      </a>
    </div>
  );
}
