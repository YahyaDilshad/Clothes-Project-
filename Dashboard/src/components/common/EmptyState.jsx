import React from 'react';
import { PackageOpen } from 'lucide-react';
export const EmptyState = ({ icon: Icon = PackageOpen, title, description, actionText, onAction, }) => {
    return (<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#F7F6F2] border border-[#E7E5E0] flex items-center justify-center text-[#6B6B6B] mb-4 shadow-xs">
        <Icon className="w-6 h-6 stroke-[1.5]"/>
      </div>
      <h3 className="text-sm font-semibold text-[#181818]">{title}</h3>
      <p className="text-xs text-[#6B6B6B] max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (<button onClick={onAction} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#181818] rounded-lg hover:bg-[#2A2A2A] shadow-xs transition-colors cursor-pointer">
          {actionText}
        </button>)}
    </div>);
};
