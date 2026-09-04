import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, Plus, Trash2, Edit2, 
    Tag, Wallet, TrendingUp, X, Loader2, BarChart3, ArrowUpRight,
    Receipt
} from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatPKR } from '../../utils/formatters';

const Revenue = () => {
    // Zustand Store Integration
    const { 
        revenueMetrics,    // Analytics data (grossRevenue, netRevenue etc)
        transactions,      // List of transactions
        fetchRevenueData,  // Function to fetch analytics
        fetchTransactions, // Function to fetch table data
        isLoading 
    } = useProductStore();

    const [searchTerm, setSearchTerm] = useState("");

    // Initial Fetch
    useEffect(() => {
        if (fetchRevenueData) fetchRevenueData();
        if (fetchTransactions) fetchTransactions();
    }, []);

    // --- FIX: Safely handle transactions array ---
    const transactionList = useMemo(() => {
        // Agar backend se wrap ho kar aa raha ho
        if (transactions && transactions.data && Array.isArray(transactions.data)) {
            return transactions.data;
        }
        // Agar direct array ho
        if (Array.isArray(transactions)) {
            return transactions;
        }
        return [];
    }, [transactions]);

    // Search Logic
    const filteredTransactions = transactionList.filter(item => 
        (item.orderNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                <div className="text-serif">
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Revenue Analytics</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Financial overview and transaction history.</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all">
                        <Plus className="w-3.5 h-3.5"/>
                        <span>New Sale</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid - FIX: Added optional chaining to prevent 'toLocaleString' error */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><TrendingUp className="w-4 h-4"/></div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Gross</span>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Revenue</p>
                    <h3 className="text-xl font-black text-neutral-900">
                        {formatPKR(revenueMetrics?.grossRevenue || 0)}
                    </h3>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><BarChart3 className="w-4 h-4"/></div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Net</span>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Net Profit</p>
                    <h3 className="text-xl font-black text-neutral-900">
                        {formatPKR(revenueMetrics?.netRevenue || 0)}
                    </h3>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600"><Receipt className="w-4 h-4"/></div>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Orders Count</p>
                    <h3 className="text-xl font-black text-neutral-900">
                        {revenueMetrics?.orderCount || 0} <span className="text-xs text-neutral-400 font-medium">Invoices</span>
                    </h3>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><ArrowUpRight className="w-4 h-4"/></div>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Avg. Order Value</p>
                    <h3 className="text-xl font-black text-neutral-900">
                        {formatPKR(revenueMetrics?.avgOrderValue || 0)}
                    </h3>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search by Order ID or Customer..." 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-4 text-xs font-bold outline-none focus:border-neutral-900 transition-all" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading && filteredTransactions.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-neutral-300 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Fetching Transactions...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-bold border-b border-neutral-100">
                                <tr>
                                    <th className="px-5 py-4">Order Details</th>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Method</th>
                                    <th className="px-5 py-4">Amount</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredTransactions.map((item) => (
                                    <tr key={item._id} className="hover:bg-neutral-50/50 transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-neutral-900">{item.orderNumber}</span>
                                                <span className="text-[9px] text-neutral-400 font-mono">ID: {item._id?.slice(-6)}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-medium text-neutral-700">{item.customer?.name || 'Walk-in Customer'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="px-2 py-0.5 bg-neutral-100 rounded text-[9px] font-bold uppercase text-neutral-500">
                                                {item.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-black text-neutral-900">
                                            {formatPKR(item.total || 0)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={item.status} size="sm" />
                                        </td>
                                        <td className="px-5 py-4 text-right text-neutral-500 font-medium">
                                            {item.createdAt ? formatDate(item.createdAt) : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                {!isLoading && filteredTransactions.length === 0 && (
                    <div className="py-20 text-center text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        No transactions found for this period.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Revenue;