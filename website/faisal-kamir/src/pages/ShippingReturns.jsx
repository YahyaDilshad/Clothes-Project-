import { useEffect } from 'react';
import { Truck, RefreshCw, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

export default function ShippingReturns() {
  const { policies, fetchPolicies, isLoading } = useProductStore();

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  if (isLoading && !policies) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  // Data structure fallback (Backend se aane wala data)
  const shippingData = policies?.shipping || {
    title: "Shipping",
    content: "We deliver nationwide across Pakistan, to all major cities and towns, through trusted courier partners.",
    details: [
      "Standard delivery: 3–5 business days for major cities.",
      "Other cities and towns: 4–7 business days.",
      "Free delivery on all orders above Rs. 8,000. A flat Rs. 250 fee applies below that.",
      "Cash on Delivery (COD) is available nationwide.",
    ]
  };

  const returnsData = policies?.returns || {
    title: "Returns & Exchanges",
    content: "Because our fabric is sold unstitched, we handle returns a little differently.",
    details: [
      "Exchanges are accepted within 7 days of delivery.",
      "Fabric that has been cut cannot be returned or exchanged.",
      "Damaged or incorrect items are eligible for replacement.",
      "Refunds are processed within 5–7 business days.",
    ]
  };

  return (
    <div className="container-fk py-12 sm:py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <p className="eyebrow mb-2">Policies</p>
        <h1 className="font-display text-4xl text-charcoal">Shipping & Returns</h1>
      </div>

      {/* Shipping Section */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-3 mb-4">
          <Truck size={22} className="text-gold" />
          <h2 className="font-display text-2xl text-charcoal">{shippingData.title}</h2>
        </div>
        <div className="space-y-4 text-sm text-stone leading-relaxed">
          <p>{shippingData.content}</p>
          <ul className="space-y-2.5 list-disc pl-5">
            {shippingData.details.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Returns Section */}
      <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw size={22} className="text-gold" />
          <h2 className="font-display text-2xl text-charcoal">{returnsData.title}</h2>
        </div>
        <div className="space-y-4 text-sm text-stone leading-relaxed">
          <p>{returnsData.content}</p>
          <ul className="space-y-2.5 list-disc pl-5">
            {returnsData.details.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fixed Info Cards */}
      <div className="grid sm:grid-cols-2 gap-6 mt-10">
        <div className="bg-white border border-charcoal/10 p-6 flex gap-4 hover:border-gold/50 transition-colors">
          <Clock size={24} className="text-gold shrink-0" />
          <div>
            <h3 className="font-medium text-charcoal mb-1">Processing Time</h3>
            <p className="text-sm text-stone leading-relaxed">
              {policies?.processingTime || "Orders are processed within 24–48 hours of confirmation."}
            </p>
          </div>
        </div>
        
        <div className="bg-white border border-charcoal/10 p-6 flex gap-4 hover:border-gold/50 transition-colors">
          <ShieldCheck size={24} className="text-gold shrink-0" />
          <div>
            <h3 className="font-medium text-charcoal mb-1">Quality Guarantee</h3>
            <p className="text-sm text-stone leading-relaxed">
              {policies?.qualityGuarantee || "Every fabric is inspected before packing for weave consistency."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}