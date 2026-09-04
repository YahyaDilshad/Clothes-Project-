import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, Plus, Receipt, Trash2, Edit2, 
    Tag, Wallet, TrendingUp, X, Loader2, BarChart3
} from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatPKR } from '../../utils/formatters';

const Revenue = () => {
    // Zustand Store Integration (Ensure these exist in your store)
    const { 
        revenues, // Make sure your store has 'revenues'
        fetchRevenues, 
        addRevenue, 
        updateRevenue, 
        deleteRevenue, 
        isLoading 
    } = useProductStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRevenue, setEditingRevenue] = useState(null);
    const [formData, setFormData] = useState({ 
        source: '', amount: '', category: 'Sales', 
        date: new Date().toISOString().split('T')[0], status: 'Completed' 
    });

    useEffect(() => {
        if (fetchRevenues) fetchRevenues();
    }, []);

    // --- FIX: Extract data array safely ---
    const revenueList = useMemo(() => {
        // Agar backend se { success: true, data: [...] } aa raha hai
        if (revenues && revenues.data && Array.isArray(revenues.data)) {
            return revenues.data;
        }
        // Agar store ne direct array set kiya hai
        if (Array.isArray(revenues)) {
            return revenues;
        }
        return [];
    }, [revenues]);

    const stats = useMemo(() => {
        const total = revenueList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const thisMonth = revenueList
            .filter(r => r.status === 'Completed')
            .reduce((a, b) => a + (Number(b.amount) || 0), 0);
        const pendingCount = revenueList.filter(r => r.status?.toLowerCase() === 'pending').length;
        return { total, thisMonth, pendingCount };
    }, [revenueList]);

    const filteredRevenue = revenueList.filter(rev => 
        (rev.source || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (rev.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, amount: Number(formData.amount) };
        try {
            if (editingRevenue) {
                await updateRevenue(editingRevenue._id, payload);
            } else {
                await addRevenue(payload);
            }
            setIsModalOpen(false);
            setEditingRevenue(null);
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Revenue Tracker</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Manage and monitor business income sources.</p>
                </div>
                <button onClick={() => { setEditingRevenue(null); setIsModalOpen(true); }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all">
                    <Plus className="w-3.5 h-3.5"/>
                    <span>Add Revenue</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><TrendingUp className="w-5 h-5"/></div>
                    <div><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Revenue</p><h3 className="text-lg font-bold text-neutral-900">{formatPKR(stats.total)}</h3></div>
                </div>
                {/* ... Add other stats here ... */}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading && filteredRevenue.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
                        </div>
                    ) : (
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-bold border-b">
                                <tr>
                                    <th className="px-5 py-4">Source</th>
                                    <th className="px-5 py-4">Category</th>
                                    <th className="px-5 py-4">Amount</th>
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredRevenue.map((item) => (
                                    <tr key={item._id} className="hover:bg-neutral-50/50 group">
                                        <td className="px-5 py-4 font-bold text-neutral-900">{item.source || item.title}</td>
                                        <td className="px-5 py-4 text-neutral-500">{item.category}</td>
                                        <td className="px-5 py-4 font-black text-emerald-600">{formatPKR(item.amount)}</td>
                                        <td className="px-5 py-4 text-neutral-500">{formatDate(item.date)}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => { setEditingRevenue(item); setFormData(item); setIsModalOpen(true); }} className="p-1.5 hover:bg-neutral-100 rounded-lg"><Edit2 className="w-3.5 h-3.5"/></button>
                                                <button onClick={() => deleteRevenue(item._id)} className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg"><Trash2 className="w-3.5 h-3.5"/></button>
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

export default Revenue;