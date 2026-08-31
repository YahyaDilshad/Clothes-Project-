import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';
export const StatCard = ({ id, title, value, change, changeLabel = 'vs last month', icon: Icon, badge, badgeColor = 'bg-[#F7F6F2] text-[#6B6B6B] border border-[#E7E5E0]', onClick, }) => {
    const isPositive = change !== undefined && change >= 0;
    return (<div id={id} onClick={onClick} className={cn('relative bg-white border border-[#E7E5E0] rounded-xl p-5 shadow-xs transition-all duration-200', onClick ? 'cursor-pointer hover:border-[#181818]/30 hover:shadow-sm' : '')}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B]">{title}</span>
        <div className="flex items-center gap-1.5">
          {badge && (<span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-md', badgeColor)}>
              {badge}
            </span>)}
          <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] text-[#181818] flex items-center justify-center border border-[#E7E5E0]">
            <Icon className="w-4 h-4 text-[#181818]"/>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-[#181818]">{value}</div>

        {change !== undefined && (<div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className={cn('inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded text-[11px]', isPositive ? 'text-[#3F7D5A] bg-[#3F7D5A]/10' : 'text-[#B94A48] bg-[#B94A48]/10')}>
              {isPositive ? (<TrendingUp className="w-3 h-3 text-[#3F7D5A]"/>) : (<TrendingDown className="w-3 h-3 text-[#B94A48]"/>)}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-[#9A9A9A] text-[11px]">{changeLabel}</span>
          </div>)}
      </div>
    </div>);
};
