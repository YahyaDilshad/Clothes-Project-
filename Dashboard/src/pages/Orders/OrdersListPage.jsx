import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Download, Eye, ShoppingBag, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { formatPKR, formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const ORDER_STATUS_TABS = [
    'All',
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
];

export const OrdersListPage = () => {
    const { orders, updateOrderStatus } = useApp();
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    // --- States ---
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
    const [selectedDate, setSelectedDate] = useState('All'); // New Date Filter State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    // --- Date Strip Logic (Last 14 Days) ---
    const dateStrip = useMemo(() => {
        return Array.from({ length: 14 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        });
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // --- Updated Filter Logic ---
    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const matchesTab = activeTab === 'All' || o.status === activeTab;
            const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPayment = selectedPaymentMethod === 'All' || o.paymentMethod === selectedPaymentMethod;
            const matchesPayStatus = selectedPaymentStatus === 'All' || o.paymentStatus === selectedPaymentStatus;
            
            // New Date Matching Logic
            const matchesDate = selectedDate === 'All' || o.date.startsWith(selectedDate);

            return matchesTab && matchesSearch && matchesPayment && matchesPayStatus && matchesDate;
        });
    }, [orders, activeTab, searchQuery, selectedPaymentMethod, selectedPaymentStatus, selectedDate]);

    const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const exportOrdersCSV = () => {
        const headers = ['Order Number', 'Date', 'Customer Name', 'Total (PKR)'];
        const rows = filteredOrders.map((o) => [o.orderNumber, o.date, o.customerName, o.total]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `orders_${selectedDate}.csv`);
        link.click();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#181818] tracking-tight font-serif">Orders Management</h2>
                    <p className="text-xs text-[#6B6B6B] mt-1">Track fulfillment stages and manage customer shipments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={exportOrdersCSV} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F7F6F2] border border-[#E7E5E0] text-[#181818] rounded-lg text-xs font-medium transition-colors cursor-pointer">
                        <Download className="w-3.5 h-3.5 text-[#B08D57]"/>
                        <span>Export CSV</span>
                    </button>
                    <button onClick={() => navigate('/orders/new')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#181818] hover:bg-[#2A2A2A] text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer">
                        <Plus className="w-3.5 h-3.5 text-[#B08D57]"/>
                        <span>Create Order</span>
                    </button>
                </div>
            </div>

            {/* MODERN DATE STRIP SELECTOR */}
            <div className="bg-white p-3 rounded-xl border border-[#E7E5E0] shadow-sm relative">
                <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-[#B08D57]" /> Date Wise Filtering
                    </span>
                    <div className="flex gap-1">
                        <button onClick={() => scroll('left')} className="p-1 rounded-md hover:bg-[#F7F6F2] text-[#6B6B6B]"><ChevronLeft className="w-4 h-4"/></button>
                        <button onClick={() => scroll('right')} className="p-1 rounded-md hover:bg-[#F7F6F2] text-[#6B6B6B]"><ChevronRight className="w-4 h-4"/></button>
                    </div>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Option for ALL Dates */}
                    <button
                        onClick={() => { setSelectedDate('All'); setCurrentPage(1); }}
                        className={cn(
                            "flex flex-col items-center min-w-[70px] py-2 px-3 rounded-xl border transition-all text-[11px] font-bold",
                            selectedDate === 'All' 
                            ? "bg-[#181818] border-[#181818] text-white shadow-md" 
                            : "bg-[#F7F6F2] border-transparent text-[#6B6B6B] hover:bg-[#E7E5E0]"
                        )}
                    >
                        <span>ALL</span>
                        <span className="text-[9px] opacity-60">Orders</span>
                    </button>

                    {dateStrip.map((date) => {
                        const d = new Date(date);
                        const isSelected = selectedDate === date;
                        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                        const dayNum = d.getDate();

                        return (
                            <button
                                key={date}
                                onClick={() => { setSelectedDate(date); setCurrentPage(1); }}
                                className={cn(
                                    "flex flex-col items-center min-w-[65px] py-2 px-3 rounded-xl border transition-all duration-200",
                                    isSelected 
                                    ? "bg-[#181818] border-[#181818] text-white shadow-md" 
                                    : "bg-white border-[#E7E5E0] text-[#6B6B6B] hover:border-[#B08D57] hover:text-[#181818]"
                                )}
                            >
                                <span className="text-[9px] uppercase tracking-tighter mb-0.5">{dayName}</span>
                                <span className="text-xs font-bold">{dayNum}</span>
                                {isSelected && <div className="w-1 h-1 bg-[#B08D57] rounded-full mt-1" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#E7E5E0]">
                {ORDER_STATUS_TABS.map((tab) => {
                    const count = tab === 'All' ? orders.length : orders.filter((o) => o.status === tab).length;
                    return (
                        <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }} className={`px-3.5 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${activeTab === tab ? 'border-[#181818] text-[#181818] bg-white font-semibold' : 'border-transparent text-[#6B6B6B] hover:text-[#181818]'}`}>
                            <span>{tab}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${activeTab === tab ? 'bg-[#181818] text-white' : 'bg-[#F7F6F2] text-[#6B6B6B]'}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-xl border border-[#E7E5E0] space-y-3 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-[#9A9A9A] absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input type="text" placeholder="Search customer or order number..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="w-full pl-9 pr-4 py-2 border border-[#E7E5E0] rounded-lg text-xs font-medium text-[#181818] bg-[#F7F6F2] focus:outline-none"/>
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={selectedPaymentMethod} onChange={(e) => { setSelectedPaymentMethod(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-[#E7E5E0] rounded-lg text-xs font-medium bg-[#F7F6F2] outline-none cursor-pointer">
                            <option value="All">All Payments</option>
                            <option value="Cash on Delivery (COD)">COD</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#E7E5E0] overflow-hidden shadow-sm">
                {filteredOrders.length === 0 ? (
                    <EmptyState icon={ShoppingBag} title="No Orders Found" description={`No orders found for the selected filters or date.`} actionText="Clear Filters" onAction={() => { setSelectedDate('All'); setActiveTab('All'); setSearchQuery(''); }}/>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#F7F6F2] border-b border-[#E7E5E0] text-[#6B6B6B] uppercase tracking-wider text-[10px] font-bold">
                                <tr>
                                    <th className="px-5 py-3.5">Order ID</th>
                                    <th className="px-4 py-3.5">Date</th>
                                    <th className="px-4 py-3.5">Customer</th>
                                    <th className="px-4 py-3.5 text-right">Total</th>
                                    <th className="px-4 py-3.5">Payment</th>
                                    <th className="px-4 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E7E5E0]">
                                {paginatedOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#F7F6F2]/50 cursor-pointer transition-colors" onClick={() => navigate(`/orders/${order.id}`)}>
                                        <td className="px-5 py-3.5 font-mono font-bold text-[#181818]">{order.orderNumber}</td>
                                        <td className="px-4 py-3.5 text-[#6B6B6B]">{formatDate(order.date)}</td>
                                        <td className="px-4 py-3.5 font-medium text-[#181818]">{order.customerName}</td>
                                        <td className="px-4 py-3.5 text-right font-bold">{formatPKR(order.total)}</td>
                                        <td className="px-4 py-3.5"><StatusBadge status={order.paymentStatus} size="sm"/></td>
                                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                                            <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="px-2 py-1 bg-[#F7F6F2] border border-[#E7E5E0] rounded-md text-[10px] font-bold outline-none cursor-pointer">
                                                {ORDER_STATUS_TABS.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#181818] hover:bg-white transition-all border border-transparent hover:border-[#E7E5E0]">
                                                <Eye className="w-4 h-4"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredOrders.length} pageSize={pageSize} onPageChange={setCurrentPage}/>
            </div>
        </div>
    );
};