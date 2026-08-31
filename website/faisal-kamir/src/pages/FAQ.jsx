import FAQAccordion from '../components/FAQAccordion.jsx';

const FAQ_GROUPS = [
  {
    title: 'Ordering',
    items: [
      { q: 'How do I place an order?', a: 'Add your chosen fabric to the cart, proceed to checkout, fill in your delivery details, choose a payment method and place your order. You\'ll also see an order ID to track it later.' },
      { q: 'Can I order via WhatsApp instead?', a: 'Yes — every product page has an "Order on WhatsApp" button that opens a pre-filled message with the product and price, ready to send to our team.' },
      { q: 'Can I change or cancel my order after placing it?', a: 'Orders can be changed or cancelled within a few hours of placing them, before they enter processing. Contact us on WhatsApp or by phone as soon as possible.' },
    ],
  },
  {
    title: 'Fabric & Sizing',
    items: [
      { q: 'How much fabric do I need for one outfit?', a: 'Most of our unstitched pieces are 4.25m–4.5m, which comfortably covers a shalwar kameez or kurta with shalwar. For a waistcoat or extra layer, add 1–1.5m.' },
      { q: 'What\'s the difference between Wash & Wear and Cotton?', a: 'Wash & Wear is a poly-viscose blend built for crease resistance and easy care, while Cotton is a natural, breathable fibre that\'s cooler against the skin — both suit Pakistan\'s climate, but Cotton needs slightly more ironing.' },
      { q: 'Will the colour match what I see on screen?', a: 'We calibrate our product photography closely to the actual fabric, but slight variation can occur depending on your screen. If you\'re unsure, message us on WhatsApp for a closer description.' },
    ],
  },
  {
    title: 'Delivery & Payment',
    items: [
      { q: 'Do you deliver across Pakistan?', a: 'Yes, we deliver nationwide to all major cities and towns, typically within 3–7 business days depending on your location.' },
      { q: 'Is Cash on Delivery available?', a: 'Yes, COD is available on all orders across Pakistan, alongside JazzCash, Easypaisa, bank transfer and card payment.' },
      { q: 'Is delivery free?', a: 'Delivery is free on all orders above Rs. 8,000. Orders below that carry a flat shipping fee of Rs. 250.' },
    ],
  },
  {
    title: 'Returns & Exchanges',
    items: [
      { q: 'Can I return unstitched fabric?', a: 'Unstitched fabric can be exchanged within 7 days of delivery if it is unused, uncut and in its original packaging. See our Shipping & Returns page for full details.' },
      { q: 'What if I received a damaged or wrong item?', a: 'Contact us within 48 hours of delivery with photos of the item, and we\'ll arrange a replacement or refund at no extra cost.' },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="container-fk py-12 sm:py-16 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <p className="eyebrow mb-2">Help Center</p>
        <h1 className="font-display text-4xl text-charcoal">Frequently Asked Questions</h1>
      </div>
      <div className="space-y-12">
        {FAQ_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="font-display text-xl text-charcoal mb-4">{group.title}</h2>
            <FAQAccordion items={group.items} />
          </div>
        ))}
      </div>
    </div>
  );
}
