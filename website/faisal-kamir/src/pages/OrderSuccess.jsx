import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Loader2 } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { WHATSAPP_LINK } from '../utils/constants.js';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { fetchOrderById } = useProductStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId).then(res => {
        setOrder(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container-fk py-16 sm:py-24 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-charcoal flex items-center justify-center mb-6">
        <CheckCircle2 size={30} className="text-gold" />
      </div>
      <h1 className="font-display text-3xl sm:text-4xl text-charcoal mb-3">Your Order Is Confirmed</h1>
      
      {orderId && (
        <p className="text-charcoal font-medium mb-8">
          Order ID: <span className="text-gold">{orderId}</span>
        </p>
      )}

      {order && (
        <div className="bg-white border border-charcoal/10 p-6 max-w-md w-full text-left mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-stone">Items</span>
            <span className="text-charcoal">{order.items?.reduce((s, i) => s + i.qty, 0)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-charcoal/10 pt-3 mt-2">
            <span>Total</span>
            <span>Rs. {order.totalAmount?.toLocaleString() || order.total?.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/track-order" className="btn-primary">Track Your Order</Link>
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}