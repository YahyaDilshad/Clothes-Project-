import { Check, Package, Truck, Home, ClipboardCheck } from 'lucide-react';

const STEPS = [
  { key: 'placed', label: 'Order Placed', icon: ClipboardCheck },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

export default function OrderTimeline({ currentStep = 1 }) {
  return (
    <div className="flex items-start w-full">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i <= currentStep;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.key} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            <div className="flex flex-col items-center text-center w-20 sm:w-28">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  done ? 'bg-charcoal border-charcoal text-gold' : 'border-stone/30 text-stone/50'
                }`}
              >
                {done && i < currentStep ? <Check size={18} /> : <Icon size={17} />}
              </div>
              <span className={`text-[11px] sm:text-xs mt-2 ${done ? 'text-charcoal font-medium' : 'text-stone/60'}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 -mt-6 ${i < currentStep ? 'bg-charcoal' : 'bg-stone/20'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
