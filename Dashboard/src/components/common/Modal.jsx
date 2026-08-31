import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'lg', footer, }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
    }[maxWidth];
    return (<div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" onClick={onClose}/>

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div className={cn('relative w-full transform rounded-xl bg-white text-left shadow-xl transition-all border border-[#E7E5E0] overflow-hidden', maxWidthClasses)} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#E7E5E0] px-6 py-4 bg-[#F7F6F2]/50">
            <div>
              <h3 className="text-sm font-semibold text-[#181818]">{title}</h3>
              {subtitle && <p className="text-xs text-[#6B6B6B] mt-0.5">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-[#6B6B6B] hover:bg-[#F7F6F2] hover:text-[#181818] transition-colors cursor-pointer">
              <X className="w-4 h-4"/>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[calc(85vh-130px)] overflow-y-auto">{children}</div>

          {/* Footer */}
          {footer && (<div className="border-t border-[#E7E5E0] bg-[#F7F6F2]/50 px-6 py-3.5 flex items-center justify-end gap-2.5">
              {footer}
            </div>)}
        </div>
      </div>
    </div>);
};
