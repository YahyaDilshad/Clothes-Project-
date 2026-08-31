import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
export const ToastContainer = () => {
    const { toasts, removeToast } = useApp();
    if (toasts.length === 0)
        return null;
    return (<div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
            return (<div key={toast.id} className="pointer-events-auto bg-neutral-900 text-white rounded-xl p-4 shadow-xl border border-neutral-800 flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-5">
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400"/>}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400"/>}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400"/>}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400"/>}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold tracking-wide">{toast.title}</h4>
              <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors">
              <X className="w-3.5 h-3.5"/>
            </button>
          </div>);
        })}
    </div>);
};
