import React, { useState, useEffect } from 'react';
import { 
    Search, RefreshCw, ArrowRight, Loader2, 
    CheckCircle2, Clock, Trash2, ArrowRightLeft, AlertCircle, Banknote
} from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatPKR } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const Exchange = () => {
    const { 
        exchanges = [], 
        fetchExchanges, 
        updateExchangeStatus, 
        deleteExchange, 
        isLoading 
    } = useProductStore();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchExchanges();
    }, []);

    const handleProcess = async (req) => {
        let nextStatus = "";
        if (req.status === "requested") nextStatus = "approved";
        else if (req.status === "approved") nextStatus = "completed";

        if (nextStatus) {
            await updateExchangeStatus(req._id, nextStatus);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to remove this request?")) {
            await deleteExchange(id);
        }
    };

    const filteredExchanges = (exchanges || []).filter(ex => {
        const custName = ex.customer?.name || "Guest";
        const orderID = ex.order?.orderNumber || ex.exchangeNumber || "";
        return custName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               orderID.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                        Exchange Management
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 font-medium">Monitor product swaps and price adjustments.</p>
                </div>
                <button 
                    onClick={() => fetchExchanges()}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                    <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")}/>
                    <span>Refresh</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Requested', color: 'amber', icon: Clock, status: 'requested' },
                    { label: 'Approved', color: 'blue', icon: RefreshCw, status: 'approved' },
                    { label: 'Completed', color: 'emerald', icon: CheckCircle2, status: 'completed' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                            <stat.icon className="w-5 h-5"/>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-lg font-bold text-neutral-900">
                                {exchanges?.filter(e => e.status === stat.status).length || 0}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search order or customer..." 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-bold border-b border-neutral-100">
                            <tr>
                                <th className="px-5 py-4">ID / Date</th>
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4 text-center">Swap Details (Old → New)</th>
                                <th className="px-5 py-4 text-right">Difference</th>
                                <th className="px-5 py-4 text-center">Status</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredExchanges.map((req) => (
                                <tr key={req._id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-neutral-900 font-mono">{req.exchangeNumber}</div>
                                        <div className="text-[10px] text-neutral-400 font-bold">{formatDate(req.createdAt)}</div>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-neutral-800">
                                        {req.customer?.name}
                                        <div className="text-[10px] font-medium text-neutral-500">{req.customer?.phone}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-4">
                                            {/* Old Item */}
                                            <div className="bg-rose-50 border border-rose-100 p-2 rounded-xl text-center min-w-[120px]">
                                                <p className="text-[9px] font-black text-rose-400 uppercase">Return</p>
                                                <p className="font-bold text-rose-900 truncate w-24">{req.oldItem?.name}</p>
                                                <p className="text-[10px] text-rose-600 font-bold">Qty: {req.oldItem?.quantity}</p>
                                            </div>

                                            <ArrowRight className="w-4 h-4 text-neutral-300" />

                                            {/* New Item */}
                                            <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-center min-w-[120px]">
                                                <p className="text-[9px] font-black text-emerald-400 uppercase">New</p>
                                                <p className="font-bold text-emerald-900 truncate w-24">{req.newItem?.name}</p>
                                                <p className="text-[10px] text-emerald-600 font-bold">Qty: {req.newItem?.quantity}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={cn("px-5 py-4 text-right font-black font-mono", req.priceDifference > 0 ? "text-emerald-600" : "text-rose-600")}>
                                        {req.priceDifference === 0 ? "EVEN" : formatPKR(req.priceDifference)}
                                        <div className="text-[8px] text-neutral-400 uppercase">Balance</div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <StatusBadge status={req.status} size="sm" />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleDelete(req._id)}
                                                className="p-2 hover:bg-rose-50 rounded-lg text-neutral-400 hover:text-rose-600"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                            <button 
                                                onClick={() => handleProcess(req)}
                                                disabled={req.status === "completed" || req.status === "rejected"}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
                                                    req.status === "completed" 
                                                    ? "bg-neutral-100 text-neutral-400"
                                                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                                                )}
                                            >
                                                {req.status === "requested" ? "Approve" : 
                                                 req.status === "approved" ? "Complete" : "Finished"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Exchange;