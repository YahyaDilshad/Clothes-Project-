import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, Eye, ShoppingBag, Calendar, 
    ChevronLeft, ChevronRight, ChevronDown, Loader2, RefreshCw, ArrowRightLeft 
} from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { formatPKR, formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { CreateExchangeModal } from '../Exchange/CreateExchangeModal.jsx'; // Modal Import karein

// Backend model ke statuses ke mutabiq tabs
const ORDER_STATUS_TABS = ['All', 'pending', 'processing', 'completed', 'cancelled', 'exchange'];

export const OrdersListPage = () => {
    const { orders, fetchOrders, updateOrderStatus, isLoading } = useProductStore();
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    // Modal State
    const [selectedOrderForExchange, setSelectedOrderForExchange] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const monthsOptions = useMemo(() => {
        const res = [];
        for (let i = 0; i < 12; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            res.push({
                label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
                month: d.getMonth(),
                year: d.getFullYear(),
                key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            });
        }
        return res;
    }, []);

    const [selectedMonth, setSelectedMonth] = useState(monthsOptions[0]);
    const [selectedDay, setSelectedDay] = useState('All');
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const daysInMonth = useMemo(() => {
        const date = new Date(selectedMonth.year, selectedMonth.month + 1, 0);
        return Array.from({ length: date.getDate() }, (_, i) => i + 1);
    }, [selectedMonth]);

    useEffect(() => { setSelectedDay('All'); setCurrentPage(1); }, [selectedMonth]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            scrollRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - 150 : scrollLeft + 150, behavior: 'smooth' });
        }
    };

    // Updated Filtering: Backend fields ke mutabiq (createdAt aur customer.name)
    const filteredOrders = useMemo(() => {
        return (orders || []).filter((o) => {
            const orderDate = new Date(o.createdAt);
            const matchesMonth = orderDate.getMonth() === selectedMonth.month && orderDate.getFullYear() === selectedMonth.year;
            const matchesDay = selectedDay === 'All' || orderDate.getDate() === Number(selectedDay);
            const matchesTab = activeTab === 'All' || o.status === activeTab;
            
            const custName = o.customer?.name || "Walk-in";
            const orderNum = o.orderNumber || "";
            
            const matchesSearch = orderNum.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 custName.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesMonth && matchesDay && matchesTab && matchesSearch;
        });
    }, [orders, selectedMonth, selectedDay, activeTab, searchQuery]);

    const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-6">
            {/* Exchange Modal Logic */}
            {selectedOrderForExchange && (
                <CreateExchangeModal 
                    order={selectedOrderForExchange} 
                    onClose={() => {
                        setSelectedOrderForExchange(null);
                        fetchOrders(); // Refresh list after exchange
                    }} 
                />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#181818] font-serif italic">Orders Ledger</h2>
                    <p className="text-xs text-[#6B6B6B] mt-1 uppercase tracking-widest font-medium">Manage store fulfillment & exchanges</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => fetchOrders()} className="p-2 bg-white border border-[#E7E5E0] rounded-xl hover:bg-neutral-50">
                        <RefreshCw className={cn("w-4 h-4 text-[#181818]", isLoading && "animate-spin")} />
                    </button>
                    <div className="relative bg-white border border-[#E7E5E0] px-3 py-2 rounded-xl shadow-sm">
                        <select value={selectedMonth.key} onChange={(e) => setSelectedMonth(monthsOptions.find(m => m.key === e.target.value))} className="bg-transparent text-xs font-bold text-[#181818] outline-none appearance-none pr-5">
                            {monthsOptions.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
                        </select>
                        <ChevronDown className="w-3 h-3 text-[#9A9A9A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <button onClick={() => navigate('/orders/new')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#181818] text-white rounded-xl text-xs font-bold shadow-sm">
                        <Plus className="w-3.5 h-3.5 text-[#B08D57]"/>New Order
                    </button>
                </div>
            </div>

            {/* Day Strip */}
            <div className="bg-white p-3 rounded-2xl border border-[#E7E5E0] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-[#9A9A9A] uppercase tracking-widest">
                        Day Selection: <span className="text-[#181818]">{selectedMonth.label}</span>
                    </span>
                    <div className="flex gap-1">
                        <button onClick={() => scroll('left')} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4"/></button>
                        <button onClick={() => scroll('right')} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"><ChevronRight className="w-4 h-4"/></button>
                    </div>
                </div>
                <div ref={scrollRef} className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1" style={{ scrollbarWidth: 'none' }}>
                    <button onClick={() => setSelectedDay('All')} className={cn("min-w-[60px] h-14 rounded-xl border transition-all text-[11px] font-black uppercase", selectedDay === 'All' ? "bg-[#181818] text-white" : "bg-[#F7F6F2] text-[#9A9A9A]")}>ALL</button>
                    {daysInMonth.map((day) => (<button key={day} onClick={() => setSelectedDay(day)} className={cn("min-w-[50px] h-14 rounded-xl border transition-all", selectedDay === day ? "bg-[#181818] text-white scale-105 shadow-lg" : "bg-white border-[#E7E5E0] text-[#6B6B6B]")}><span className="text-xs font-black">{day}</span></button>))}
                </div>
            </div>

            {/* Search and Tabs */}
            <div className="bg-white p-2 rounded-2xl border border-[#E7E5E0] shadow-sm space-y-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Customer Name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#F7F6F2] border-transparent rounded-xl text-xs font-bold focus:bg-white focus:border-[#E7E5E0] outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {ORDER_STATUS_TABS.map((tab) => (
                        <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }} className={cn("px-4 py-2 text-[10px] font-black uppercase whitespace-nowrap rounded-lg transition-all", activeTab === tab ? 'bg-[#181818] text-white' : 'text-[#9A9A9A] hover:bg-neutral-50')}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-[#E7E5E0] shadow-sm overflow-hidden">
                {isLoading && orders.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-[#B08D57] mb-2"/>
                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Loading Ledger...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <EmptyState icon={ShoppingBag} title="No Orders Found" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#F7F6F2] border-b text-[#9A9A9A] uppercase text-[9px] font-black">
                                <tr>
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-4 py-4">Date</th>
                                    <th className="px-4 py-4">Customer</th>
                                    <th className="px-4 py-4 text-right">Value</th>
                                    <th className="px-4 py-4">Payment</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {paginatedOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-bold text-[#181818]">{order.orderNumber}</td>
                                        <td className="px-4 py-4 text-[#6B6B6B] font-medium">{formatDate(order.createdAt)}</td>
                                        <td className="px-4 py-4 font-bold text-[#181818]">{order.customer?.name || "Walk-in Customer"}</td>
                                        <td className="px-4 py-4 text-right font-black text-[#181818]">{formatPKR(order.total)}</td>
                                        <td className="px-4 py-4"><StatusBadge status={order.paymentStatus} size="sm"/></td>
                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)} 
                                                className="bg-[#F7F6F2] border-none rounded-lg text-[9px] font-black uppercase outline-none px-2 py-1 cursor-pointer hover:bg-[#E7E5E0] transition-colors"
                                            >
                                                {ORDER_STATUS_TABS.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* EXCHANGE BUTTON: Sirf completed ya confirmation ke baad allow karein agar chahein */}
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedOrderForExchange(order);
                                                    }}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    title="Exchange Order"
                                                >
                                                    <ArrowRightLeft className="w-4 h-4"/>
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/orders/${order._id}`)} 
                                                    className="p-2 text-[#181818] hover:bg-neutral-100 rounded-xl transition-all"
                                                >
                                                    <Eye className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={Math.ceil(filteredOrders.length / pageSize)} 
                    totalItems={filteredOrders.length} 
                    pageSize={pageSize} 
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};