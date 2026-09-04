import React, { useState, useEffect } from 'react';
import { Search, ArrowRightLeft, Loader2 } from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPKR, formatDate } from '../../utils/formatters';

export const ReturnsPage = () => {
    const { returns, fetchReturns, updateReturnStatus, isLoading } = useProductStore();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchReturns();
    }, []);

    const filteredReturns = returns.filter((r) => {
        // Backend data mapping handles
        const orderNum = r.order?.orderNumber || r.returnNumber || "";
        const custName = r.customer?.name || "Guest";
        // Pehle item ka naam dikhane ke liye
        const itemName = r.items?.[0]?.name || "N/A";

        const matchesTab = activeTab === 'All' || r.status.toLowerCase() === activeTab.toLowerCase();
        const matchesSearch = 
            orderNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
            custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            itemName.toLowerCase().includes(searchQuery.toLowerCase());
            
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Returns & Exchange Requests</h2>
                    <p className="text-xs text-neutral-500 mt-1">Manage order cancellations and returns.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                        {['All', 'Requested', 'Approved', 'Rejected', 'Completed'].map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)} 
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === tab ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input 
                            type="text" 
                            placeholder="Search returns..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-xs"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                        </div>
                    ) : (
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50/80 border-b text-neutral-500 uppercase text-[10px] font-bold">
                                <tr>
                                    <th className="px-5 py-3.5">Order/Return ID</th>
                                    <th className="px-4 py-3.5">Customer</th>
                                    <th className="px-4 py-3.5">Items</th>
                                    <th className="px-4 py-3.5">Reason</th>
                                    <th className="px-4 py-3.5 text-right">Refund</th>
                                    <th className="px-4 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredReturns.map((ret) => (
                                    <tr key={ret._id} className="hover:bg-neutral-50/70">
                                        <td className="px-5 py-3.5">
                                            <div className="font-bold text-neutral-900">{ret.order?.orderNumber || 'N/A'}</div>
                                            <div className="text-[10px] text-neutral-400">{formatDate(ret.createdAt)}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="font-bold">{ret.customer?.name || 'Walk-in Customer'}</div>
                                            <div className="text-[11px] text-neutral-500">{ret.customer?.phone}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {ret.items.map((item, idx) => (
                                                <div key={idx} className="text-[11px]">
                                                    {item.name} <span className="text-neutral-400">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-4 py-3.5 text-neutral-600">{ret.reason || 'No reason'}</td>
                                        <td className="px-4 py-3.5 text-right font-bold text-neutral-900">
                                            {formatPKR(ret.refundAmount)}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <StatusBadge status={ret.status} size="sm"/>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {ret.status === 'requested' && (
                                                    <>
                                                        <button 
                                                            onClick={() => updateReturnStatus(ret._id, 'approved')}
                                                            className="bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => updateReturnStatus(ret._id, 'rejected')}
                                                            className="border border-rose-200 text-rose-600 px-3 py-1 rounded-lg hover:bg-rose-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {ret.status === 'approved' && (
                                                    <button 
                                                        onClick={() => updateReturnStatus(ret._id, 'completed')}
                                                        className="bg-neutral-900 text-white px-3 py-1 rounded-lg"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};