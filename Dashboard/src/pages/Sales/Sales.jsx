import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
    Search, TrendingUp, Calendar, ChevronLeft, 
    ChevronRight, ChevronDown, ShoppingCart, 
    ArrowUpRight, Receipt, Loader2, Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/UseProductsStore.js';
import { formatPKR } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const SalesPage = () => {
    const { orders, fetchOrders, isLoading } = useProductStore();
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    // Initial Data Fetch
    useEffect(() => {
        fetchOrders();
    }, []);

    // --- 1. Month Selection Logic (Last 12 Months) ---
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

    // --- 2. Local States ---
    const [selectedMonth, setSelectedMonth] = useState(monthsOptions[0]);
    const [selectedDay, setSelectedDay] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // --- 3. Days Calculation for Horizontal Strip ---
    const daysInMonth = useMemo(() => {
        const date = new Date(selectedMonth.year, selectedMonth.month + 1, 0);
        return Array.from({ length: date.getDate() }, (_, i) => i + 1);
    }, [selectedMonth]);

    // Reset day and page when month changes
    useEffect(() => {
        setSelectedDay('All');
        setCurrentPage(1);
    }, [selectedMonth]);

    // --- 4. Filtering Logic (Matches your Backend JSON) ---
    const salesTransactions = useMemo(() => {
        // Ensure orders is an array
        const ordersArray = Array.isArray(orders) ? orders : [];

        return ordersArray.filter((o) => {
            const orderDate = new Date(o.createdAt); // Backend uses createdAt
            
            // Logic: Exclude cancelled orders from Sales ledger
            const isNotCancelled = o.status !== 'cancelled' && o.status !== 'returned';
            
            const matchesMonth = orderDate.getMonth() === selectedMonth.month && 
                               orderDate.getFullYear() === selectedMonth.year;
            
            const matchesDay = selectedDay === 'All' || orderDate.getDate() === Number(selectedDay);
            
            const matchesSearch = (o.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (o.customer?.name || 'Walk-in').toLowerCase().includes(searchQuery.toLowerCase());

            return isNotCancelled && matchesMonth && matchesDay && matchesSearch;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [orders, selectedMonth, selectedDay, searchQuery]);

    // --- 5. Metrics Calculation ---
    const totalSalesAmount = salesTransactions.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const avgOrderValue = salesTransactions.length > 0 ? totalSalesAmount / salesTransactions.length : 0;

    const paginatedSales = salesTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // --- 6. Horizontal Scroll Helper ---
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12 px-4">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 font-serif italic tracking-tight">Sales Ledger</h2>
                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mt-1">Real-time Revenue Data</p>
                </div>
                
                <div className="relative">
                    <div className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2.5 rounded-2xl shadow-sm hover:border-neutral-900 transition-all cursor-pointer">
                        <Calendar className="w-4 h-4 text-[#B08D57]" />
                        <select 
                            value={selectedMonth.key}
                            onChange={(e) => setSelectedMonth(monthsOptions.find(m => m.key === e.target.value))}
                            className="bg-transparent text-xs font-bold text-neutral-900 outline-none appearance-none pr-5 cursor-pointer"
                        >
                            {monthsOptions.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                        </select>
                        <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-4 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard label="Total Revenue" value={formatPKR(totalSalesAmount)} icon={<TrendingUp/>} color="emerald" />
                <StatCard label="Transactions" value={`${salesTransactions.length} Orders`} icon={<ShoppingCart/>} color="blue" />
                <StatCard label="Average Sale" value={formatPKR(avgOrderValue)} icon={<ArrowUpRight/>} color="gold" />
            </div>

            {/* Daily Scroll Strip */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Select Day: {selectedMonth.label}</span>
                    <div className="flex gap-1">
                        <button onClick={() => scroll('left')} className="p-1.5 hover:bg-neutral-50 rounded-lg text-neutral-400 transition-colors"><ChevronLeft className="w-4 h-4"/></button>
                        <button onClick={() => scroll('right')} className="p-1.5 hover:bg-neutral-50 rounded-lg text-neutral-400 transition-colors"><ChevronRight className="w-4 h-4"/></button>
                    </div>
                </div>
                <div 
                    ref={scrollRef}
                    className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1 items-center"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <button
                        onClick={() => setSelectedDay('All')}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[60px] h-12 rounded-xl border transition-all text-[10px] font-black uppercase",
                            selectedDay === 'All' 
                            ? "bg-neutral-900 border-neutral-900 text-white shadow-md" 
                            : "bg-neutral-50 border-transparent text-neutral-400 hover:bg-neutral-100"
                        )}
                    >
                        ALL
                    </button>
                    {daysInMonth.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[48px] h-12 rounded-xl border transition-all duration-200 text-xs font-bold",
                                selectedDay === day 
                                ? "bg-neutral-900 border-neutral-900 text-white shadow-md" 
                                : "bg-white border-neutral-100 text-neutral-500 hover:border-[#B08D57]"
                            )}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-neutral-100 bg-neutral-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input 
                            type="text" 
                            placeholder="Search by Order # or Customer..." 
                            className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium outline-none focus:border-neutral-900 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 text-neutral-400 font-black uppercase text-[9px] tracking-widest border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-4">Invoice #</th>
                                <th className="px-4 py-4">Time & Date</th>
                                <th className="px-4 py-4">Customer Details</th>
                                <th className="px-4 py-4 text-center">Qty</th>
                                <th className="px-4 py-4 text-right">Revenue</th>
                                <th className="px-4 py-4 text-center">Payment</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {isLoading && orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-24 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#B08D57] mb-2" />
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Loading Transactions...</p>
                                    </td>
                                </tr>
                            ) : paginatedSales.length > 0 ? (
                                paginatedSales.map((sale) => (
                                    <tr key={sale._id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-neutral-900 uppercase tracking-tighter">
                                            {sale.orderNumber}
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-[11px] font-bold text-neutral-900">
                                                {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-[9px] font-bold text-neutral-400 uppercase">
                                                {new Date(sale.createdAt).toLocaleDateString('en-GB')}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-bold text-neutral-900">{sale.customer?.name || 'Walk-in Customer'}</p>
                                            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-tighter">{sale.channel || 'Direct'}</p>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="px-2 py-1 bg-neutral-100 rounded-lg text-[10px] font-black text-neutral-600">
                                                {sale.items?.length || 0} U
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right font-black text-emerald-600">
                                            {formatPKR(sale.total)}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[9px] font-black uppercase",
                                                sale.paymentStatus === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            )}>
                                                {sale.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => navigate(`/orders/${sale._id}`)}
                                                className="p-2 bg-white border border-neutral-200 rounded-xl text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-all shadow-sm"
                                            >
                                                <Receipt className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-24 text-center">
                                        <Package className="w-12 h-12 text-neutral-200 mx-auto mb-3 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">No sales records found for this period.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Internal StatCard component for clean code
const StatCard = ({ label, value, icon, color }) => {
    const colorMap = {
        emerald: "bg-emerald-50 text-emerald-600",
        blue: "bg-blue-50 text-blue-600",
        gold: "bg-[#B08D57]/10 text-[#B08D57]"
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-neutral-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{label}</p>
                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{value}</h3>
            </div>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colorMap[color])}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
        </div>
    );
};

export default SalesPage;