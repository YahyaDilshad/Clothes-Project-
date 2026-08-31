import React from 'react';
import { getOrderStatusBadgeVariant } from '../../utils/formatters';
import { cn } from '../../utils/cn';
export const StatusBadge = ({ status, size = 'md', className, }) => {
    const variant = getOrderStatusBadgeVariant(status);
    return (<span className={cn('inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap', size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs', variant.bg, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', variant.dot)}/>
      <span>{status}</span>
    </span>);
};
