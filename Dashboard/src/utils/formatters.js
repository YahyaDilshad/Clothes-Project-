export function formatPKR(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) {
        return 'PKR 0';
    }
    return `PKR ${amount.toLocaleString('en-PK')}`;
}
export function formatNumber(value) {
    if (isNaN(value) || value === null || value === undefined) {
        return '0';
    }
    return value.toLocaleString('en-US');
}
export function formatDate(dateString) {
    if (!dateString)
        return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return dateString;
    return new Intl.DateTimeFormat('en-PK', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}
export function formatDateTime(dateString) {
    if (!dateString)
        return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return dateString;
    return new Intl.DateTimeFormat('en-PK', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(date);
}
export function getOrderStatusBadgeVariant(status) {
    switch (status) {
        case 'Delivered':
        case 'Completed':
        case 'Paid':
        case 'Fulfilled':
        case 'Active':
        case 'In Stock':
        case 'Approved':
            return {
                bg: 'bg-[#3F7D5A]/10 text-[#3F7D5A] border-[#3F7D5A]/20',
                text: 'text-[#3F7D5A]',
                dot: 'bg-[#3F7D5A]',
            };
        case 'Processing':
        case 'Packed':
        case 'Partially Fulfilled':
        case 'Shipped':
        case 'Confirmed':
            return {
                bg: 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20',
                text: 'text-[#64748B]',
                dot: 'bg-[#64748B]',
            };
        case 'Pending':
        case 'Requested':
        case 'Low Stock':
        case 'Upcoming':
            return {
                bg: 'bg-[#B8863B]/10 text-[#B8863B] border-[#B8863B]/20',
                text: 'text-[#B8863B]',
                dot: 'bg-[#B8863B]',
            };
        case 'Cancelled':
        case 'Rejected':
        case 'Failed':
        case 'Out of Stock':
        case 'Expired':
        case 'Disabled':
        case 'Inactive':
            return {
                bg: 'bg-[#B94A48]/10 text-[#B94A48] border-[#B94A48]/20',
                text: 'text-[#B94A48]',
                dot: 'bg-[#B94A48]',
            };
        case 'Draft':
        case 'Archived':
        default:
            return {
                bg: 'bg-[#181818]/5 text-[#6B6B6B] border-[#E7E5E0]',
                text: 'text-[#6B6B6B]',
                dot: 'bg-[#9A9A9A]',
            };
    }
}
