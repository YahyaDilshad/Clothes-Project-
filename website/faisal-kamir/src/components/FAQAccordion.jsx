import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-charcoal/10 border-t border-b border-charcoal/10">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(open ? -1 : i)}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-medium text-charcoal text-[15px]">{item.q}</span>
              <ChevronDown size={18} className={`text-gold shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <p className="text-sm text-stone leading-relaxed pb-5 pr-8 animate-fadeIn">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
