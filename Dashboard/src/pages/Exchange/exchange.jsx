import React, { useState } from 'react';
import { 
    Search, RefreshCw, ArrowRight, User, Package, 
    CheckCircle2, Clock, AlertCircle, Trash2, Copy, ExternalLink 
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const Exchange = () => {
    // 1. State Management (Taake buttons kaam karein)
    const [searchTerm, setSearchTerm] = useState("");
    const [exchanges, setExchanges] = useState([
        {
            id: "EX-9021",
            customer: "Hamza Ahmed",
            date: new Date().toISOString(),
            status: "Pending",
            reason: "Size too small",
            originalItem: { name: "Polo Shirt", variant: "M / Blue", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100" },
            exchangeItem: { name: "Polo Shirt", variant: "L / Blue", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100" }
        },
        {
            id: "EX-9022",
            customer: "Sara Khan",
            date: new Date().toISOString(),
            status: "Processing",
            reason: "Color difference",
            originalItem: { name: "Leather Bag", variant: "Tan", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100" },
            exchangeItem: { name: "Leather Bag", variant: "Black", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100" }
        }
    ]);

    // 2. Logic: Status Update (Process Button)
    const handleProcess = (id) => {
        setExchanges(prev => prev.map(ex => {
            if (ex.id === id) {
                const nextStatus = ex.status === "Pending" ? "Processing" : "Completed";
                return { ...ex, status: nextStatus };
            }
            return ex;
        }));
    };

    // 3. Logic: Duplicate (Copy Icon)
    const handleDuplicate = (item) => {
        const newExchange = {
            ...item,
            id: `EX-${Math.floor(Math.random() * 9000) + 1000}`, // New Random ID
            date: new Date().toISOString(),
            status: "Pending"
        };
        setExchanges([newExchange, ...exchanges]);
    };

    // 4. Logic: Delete
    const handleDelete = (id) => {
        if(window.confirm("Are you sure you want to remove this request?")) {
            setExchanges(prev => prev.filter(ex => ex.id !== id));
        }
    };

    // 5. Logic: Search Filtering
    const filteredExchanges = exchanges.filter(ex => 
        ex.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Exchange Requests</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Manage and update product replacements.</p>
                </div>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm">
                    <RefreshCw className="w-3.5 h-3.5"/>
                    <span>Refresh List</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Clock className="w-5 h-5"/></div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Pending</p>
                        <h3 className="text-lg font-bold text-neutral-900">{exchanges.filter(e => e.status === 'Pending').length}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 className="w-5 h-5"/></div>
                    <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Completed</p>
                        <h3 className="text-lg font-bold text-neutral-900">{exchanges.filter(e => e.status === 'Completed').length}</h3>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search customer or request ID..." 
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-bold border-b border-neutral-100">
                        <tr>
                            <th className="px-5 py-4">Request</th>
                            <th className="px-5 py-4">Customer</th>
                            <th className="px-5 py-4">Exchange Flow</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {filteredExchanges.map((req) => (
                            <tr key={req.id} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-5 py-4">
                                    <span className="font-bold text-neutral-900">#{req.id}</span>
                                    <div className="text-[10px] text-neutral-500">{formatDate(req.date)}</div>
                                </td>
                                <td className="px-5 py-4 font-semibold text-neutral-800">{req.customer}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-100 w-fit">
                                        <div className="flex flex-col items-center">
                                            <img src={req.originalItem.img} className="w-6 h-6 rounded border object-cover" alt=""/>
                                            <span className="text-[8px] mt-1 uppercase text-neutral-400">{req.originalItem.variant}</span>
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-neutral-300" />
                                        <div className="flex flex-col items-center">
                                            <img src={req.exchangeItem.img} className="w-6 h-6 rounded border object-cover" alt=""/>
                                            <span className="text-[8px] mt-1 uppercase text-blue-600 font-bold">{req.exchangeItem.variant}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <StatusBadge status={req.status} size="sm" />
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleDuplicate(req)}
                                            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors"
                                            title="Duplicate Request"
                                        >
                                            <Copy className="w-3.5 h-3.5"/>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(req.id)}
                                            className="p-2 hover:bg-rose-50 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
                                            title="Delete Request"
                                        >
                                            <Trash2 className="w-3.5 h-3.5"/>
                                        </button>
                                        <button 
                                            onClick={() => handleProcess(req.id)}
                                            disabled={req.status === "Completed"}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm",
                                                req.status === "Completed" 
                                                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                                : "bg-neutral-900 text-white hover:bg-neutral-800"
                                            )}
                                        >
                                            {req.status === "Pending" ? "Process" : req.status === "Processing" ? "Complete" : "Finished"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredExchanges.length === 0 && (
                    <div className="py-20 text-center text-neutral-500 text-xs">
                        No exchange requests found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exchange;