import { useState } from 'react';
import { Search, PackageSearch } from 'lucide-react';
import OrderTimeline from '../components/OrderTimeline.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';

const STEP_INDEX = { placed: 0, processing: 1, shipped: 2, delivered: 3 };

export default function TrackOrder() {
  const [orders] = useLocalStorage('fk_orders', []);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSearched(true);
    const found = orders.find((o) => o.id.toLowerCase() === query.trim().toLowerCase());
    setResult(found || null);
  };

  return (
    <div className="container-fk py-12 sm:py-16 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <p className="eyebrow mb-2">Order Status</p>
        <h1 className="font-display text-4xl text-charcoal">Track Your Order</h1>
        <p className="text-stone text-sm mt-3">Enter the order ID sent to you at checkout to view its status.</p>
      </div>

      <form onSubmit={onSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. FK12345678"
            className="input-fk pl-11"
          />
        </div>
        <button type="submit" className="btn-primary shrink-0">Track</button>
      </form>

      {searched && !result && (
        <div className="flex flex-col items-center text-center py-16">
          <PackageSearch size={36} className="text-stone/40 mb-4" />
          <p className="text-charcoal font-medium mb-1">No order found</p>
          <p className="text-sm text-stone">Double-check the order ID and try again, or contact support.</p>
        </div>
      )}

      {result && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-stone">Order ID</p>
              <p className="font-medium text-charcoal">{result.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone">Placed On</p>
              <p className="font-medium text-charcoal">{new Date(result.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <OrderTimeline currentStep={STEP_INDEX[result.status] ?? 0} />

          <div className="mt-12 bg-white border border-charcoal/10 divide-y divide-charcoal/10">
            {result.items.map((item) => (
              <div key={`${item.id}-${item.color}`} className="flex gap-4 p-4">
                <img src={item.image} alt={item.name} className="w-14 h-18 object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{item.name}</p>
                  <p className="text-xs text-stone mt-0.5">{item.color} × {item.qty}</p>
                </div>
                <p className="text-sm font-medium text-charcoal">Rs. {(item.price * item.qty).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
