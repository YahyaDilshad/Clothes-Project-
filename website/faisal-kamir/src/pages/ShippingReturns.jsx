import { Truck, RefreshCw, Clock, ShieldCheck } from 'lucide-react';

export default function ShippingReturns() {
  return (
    <div className="container-fk py-12 sm:py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <p className="eyebrow mb-2">Policies</p>
        <h1 className="font-display text-4xl text-charcoal">Shipping & Returns</h1>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Truck size={22} className="text-gold" />
          <h2 className="font-display text-2xl text-charcoal">Shipping</h2>
        </div>
        <div className="space-y-4 text-sm text-stone leading-relaxed">
          <p>We deliver nationwide across Pakistan, to all major cities and towns, through trusted courier partners.</p>
          <ul className="space-y-2.5 list-disc pl-5">
            <li>Standard delivery: 3–5 business days for Karachi, Lahore, Islamabad, Rawalpindi and Faisalabad.</li>
            <li>Other cities and towns: 4–7 business days.</li>
            <li>Free delivery on all orders above Rs. 8,000. A flat Rs. 250 fee applies below that.</li>
            <li>Cash on Delivery (COD) is available on every order, nationwide.</li>
            <li>You'll receive an order ID at checkout — use it on our Track Order page to check status any time.</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw size={22} className="text-gold" />
          <h2 className="font-display text-2xl text-charcoal">Returns & Exchanges</h2>
        </div>
        <div className="space-y-4 text-sm text-stone leading-relaxed">
          <p>Because our fabric is sold unstitched and by the metre, we handle returns a little differently from finished garments.</p>
          <ul className="space-y-2.5 list-disc pl-5">
            <li>Exchanges are accepted within 7 days of delivery, provided the fabric is unused, uncut and in its original packaging.</li>
            <li>Fabric that has been cut or handed to a tailor cannot be returned or exchanged.</li>
            <li>Damaged, defective or incorrect items are eligible for a full replacement or refund — contact us within 48 hours of delivery with photos.</li>
            <li>Refunds are processed to your original payment method, or as store credit for COD orders, within 5–7 business days of approval.</li>
          </ul>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-6 mt-10">
        <div className="bg-white border border-charcoal/10 p-6 flex gap-4">
          <Clock size={24} className="text-gold shrink-0" />
          <div>
            <h3 className="font-medium text-charcoal mb-1">Processing Time</h3>
            <p className="text-sm text-stone leading-relaxed">Orders are processed within 24–48 hours of confirmation, before dispatch.</p>
          </div>
        </div>
        <div className="bg-white border border-charcoal/10 p-6 flex gap-4">
          <ShieldCheck size={24} className="text-gold shrink-0" />
          <div>
            <h3 className="font-medium text-charcoal mb-1">Quality Guarantee</h3>
            <p className="text-sm text-stone leading-relaxed">Every fabric is inspected before packing — if something isn't right, we'll make it right.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
