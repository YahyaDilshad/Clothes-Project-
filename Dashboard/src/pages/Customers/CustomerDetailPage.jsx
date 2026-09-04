import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Eye, Sparkles, Loader2 } from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPKR, formatDate } from '../../utils/formatters';

const CustomerDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Zustand Store
    const { customers, orders, fetchCustomers, fetchOrders, isLoading } = useProductStore();

    useEffect(() => {
        if (customers.length === 0) fetchCustomers();
        if (orders.length === 0) fetchOrders();
    }, []);

    const customer = customers.find((c) => c.id === id);

    if (!customer && isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-400">
                <Loader2 className="w-10 h-10 animate-spin mb-3 text-[#B08D57]" />
                <p className="text-xs font-black uppercase tracking-widest">Accessing Client Profile...</p>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 max-w-lg mx-auto mt-20">
                <h2 className="text-lg font-bold text-neutral-900">Client Record Not Found</h2>
                <button onClick={() => navigate('/customers')} className="mt-5 px-6 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold">Return to Directory</button>
            </div>
        );
    }

    // Safe Filtering for Transaction History
    const customerOrders = orders.filter((o) => 
        o.customerEmail?.toLowerCase() === customer.email?.toLowerCase() ||
        o.customerPhone === customer.phone ||
        o.customerName?.toLowerCase() === customer.name?.toLowerCase()
    );

    const aov = customer.totalOrders > 0 ? Math.round(customer.totalSpent / customer.totalOrders) : 0;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/customers')} className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-all"><ArrowLeft className="w-4 h-4"/></button>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">{customer.name}</h2>
                        <StatusBadge status={customer.status} size="sm"/>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 font-medium uppercase tracking-tight">Member since {formatDate(customer.joinedDate)} • CID: {customer.id}</p>
                </div>
            </div>

            {/* Overview Card */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <img src={customer.avatar || 'https://via.placeholder.com/150'} alt="" className="w-20 h-20 rounded-3xl object-cover border border-neutral-200 bg-neutral-50 shadow-sm"/>
                        <div>
                            <h3 className="text-lg font-black text-neutral-900">{customer.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {customer.tags?.map((tag) => (
                                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                                        <Sparkles className="w-2.5 h-2.5"/>{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center border-t md:border-t-0 pt-6 md:pt-0">
                        <div><span className="text-[9px] font-bold uppercase text-neutral-400 block mb-1">Lifetime</span><span className="text-sm font-black text-neutral-900">{formatPKR(customer.totalSpent)}</span></div>
                        <div className="border-x px-6"><span className="text-[9px] font-bold uppercase text-neutral-400 block mb-1">Orders</span><span className="text-sm font-black text-neutral-900">{customer.totalOrders}</span></div>
                        <div><span className="text-[9px] font-bold uppercase text-neutral-400 block mb-1">Avg Value</span><span className="text-sm font-black text-neutral-900">{formatPKR(aov)}</span></div>
                    </div>
                </div>

                {/* Contact Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t">
                    <div className="flex items-start gap-3"><Mail className="w-4 h-4 text-neutral-300 mt-1"/><div><span className="text-neutral-400 text-[9px] uppercase font-black block">Email</span><span className="text-xs font-bold text-neutral-800">{customer.email}</span></div></div>
                    <div className="flex items-start gap-3"><Phone className="w-4 h-4 text-neutral-300 mt-1"/><div><span className="text-neutral-400 text-[9px] uppercase font-black block">Mobile</span><span className="text-xs font-bold text-neutral-800">{customer.phone}</span></div></div>
                    <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-neutral-300 mt-1"/><div><span className="text-neutral-400 text-[9px] uppercase font-black block">Last Address</span><span className="text-xs font-bold text-neutral-800">{customer.address}</span></div></div>
                </div>
            </div>

            {/* Purchase History */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-neutral-50/50 flex justify-between items-center"><h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Transaction History</h3></div>
                {customerOrders.length === 0 ? (
                    <div className="py-20 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">No transaction history found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-white"><tr className="text-[10px] font-black text-neutral-400 uppercase tracking-widest"><th className="px-6 py-4">Reference</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-right">Items</th><th className="px-6 py-4 text-right">Total</th><th className="px-6 py-4 text-center">Status</th><th></th></tr></thead>
                            <tbody className="divide-y">
                                {customerOrders.map((ord) => (
                                    <tr key={ord.id} onClick={() => navigate(`/orders/${ord.id}`)} className="group hover:bg-neutral-50 cursor-pointer transition-colors">
                                        <td className="px-6 py-4 font-black font-mono text-neutral-900">{ord.orderNumber}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-neutral-500">{formatDate(ord.date)}</td>
                                        <td className="px-6 py-4 text-right text-xs font-black">{(ord.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0)} pcs</td>
                                        <td className="px-6 py-4 text-right text-sm font-black text-neutral-900">{formatPKR(ord.total)}</td>
                                        <td className="px-6 py-4 text-center"><StatusBadge status={ord.status} size="sm"/></td>
                                        <td className="px-6 py-4"><Eye className="w-4 h-4 ml-auto text-neutral-300 group-hover:text-black"/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetailPage;