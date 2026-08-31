import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';

const ICONS = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
};

export default function Toast({ message, type = 'success', onDismiss }) {
  const Icon = ICONS[type] || CheckCircle2;
  return (
    <div
      role="status"
      className="animate-slideUp bg-charcoal text-ivory shadow-xl px-4 py-3.5 flex items-center gap-3 text-sm"
    >
      <Icon size={18} className="text-gold shrink-0" />
      <p className="flex-1">{message}</p>
      <button onClick={onDismiss} aria-label="Dismiss notification" className="text-ivory/60 hover:text-ivory">
        <X size={16} />
      </button>
    </div>
  );
}
