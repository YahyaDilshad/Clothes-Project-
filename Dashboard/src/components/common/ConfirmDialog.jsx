import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger', }) => {
    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <AlertTriangle className="w-5 h-5 text-[#B94A48]"/>;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-[#B8863B]"/>;
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-[#3F7D5A]"/>;
            default:
                return <Info className="w-5 h-5 text-[#64748B]"/>;
        }
    };
    const getConfirmButtonClasses = () => {
        switch (type) {
            case 'danger':
                return 'bg-[#B94A48] hover:bg-[#A33D3B] text-white';
            case 'warning':
                return 'bg-[#B8863B] hover:bg-[#A17430] text-white';
            case 'success':
                return 'bg-[#3F7D5A] hover:bg-[#33684A] text-white';
            default:
                return 'bg-[#181818] hover:bg-[#2A2A2A] text-white';
        }
    };
    return (<Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm" footer={<>
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-[#181818] bg-white border border-[#E7E5E0] rounded-lg hover:bg-[#F7F6F2] transition-colors cursor-pointer">
            {cancelText}
          </button>
          <button type="button" onClick={() => {
                onConfirm();
                onClose();
            }} className={`px-4 py-2 text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer ${getConfirmButtonClasses()}`}>
            {confirmText}
          </button>
        </>}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#F7F6F2] border border-[#E7E5E0] flex items-center justify-center shrink-0">
          {getIcon()}
        </div>
        <p className="text-xs text-[#6B6B6B] leading-relaxed pt-1.5">{message}</p>
      </div>
    </Modal>);
};
