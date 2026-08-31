import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Eye, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPKR, formatDate } from '../../utils/formatters';

 const CustomerDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // FIX 1: Default empty arrays taake undefined ka masla na ho
    const { customers = [], orders = [] } = useApp();

    // Data Loading check
    if (customers.length === 0 && orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs font-medium">Loading client profile...</p>
            </div>
        );
    }

    const customer = customers.find((c) => c.id === id);

    if (!customer) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 mx-auto max-w-lg mt-10">
                <h2 className="text-lg font-bold text-neutral-900">Customer Not Found</h2>
                <p className="text-xs text-neutral-500 mt-1">The client record you are looking for does not exist.</p>
                <button onClick={() => navigate('/customers')} className="mt-5 px-6 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-neutral-200">
                    Return to Customers
                </button>
            </div>
        );
    }

    // FIX 2: Safe Filtering (Checking if fields exist)
    const customerOrders = orders.filter((o) => 
        o.customerEmail?.toLowerCase() === customer.email?.toLowerCase() ||
        o.customerPhone === customer.phone ||
        o.customerName?.toLowerCase() === customer.name?.toLowerCase()
    );

    const aov = customer.totalOrders > 0
        ? Math.round(customer.totalSpent / customer.totalOrders)
        : customer.totalSpent;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/customers')} className="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-all shadow-sm">
                    <ArrowLeft className="w-4 h-4"/>
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">{customer.name}</h2>
                        <StatusBadge status={customer.status} size="sm"/>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 font-medium uppercase tracking-tight">
                        Member since {formatDate(customer.joinedDate)} • Client ID: {customer.id}
                    </p>
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <img src={customer.avatar || 'https://via.placeholder.com/150'} alt="" className="w-20 h-20 rounded-2xl object-cover border border-neutral-200 shadow-sm bg-neutral-50"/>
                        <div>
                            <h3 className="text-lg font-black text-neutral-900">{customer.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {/* FIX 3: Safe map using optional chaining */}
                                {customer.tags?.map((tag) => (
                                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black bg-neutral-100 text-neutral-700 uppercase tracking-wider">
                                        <Sparkles className="w-3 h-3 text-neutral-400"/>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 pt-6 md:pt-0 border-neutral-100">
                        <div className="px-4 text-center">
                            <span className="text-[9px] font-bold uppercase text-neutral-400 tracking-widest block mb-1">Lifetime Spend</span>
                            <span className="text-sm font-black text-neutral-900">{formatPKR(customer.totalSpent)}</span>
                        </div>
                        <div className="px-4 text-center border-x border-neutral-100">
                            <span className="text-[9px] font-bold uppercase text-neutral-400 tracking-widest block mb-1">Orders</span>
                            <span className="text-sm font-black text-neutral-900">{customer.totalOrders}</span>
                        </div>
                        <div className="px-4 text-center">
                            <span className="text-[9px] font-bold uppercase text-neutral-400 tracking-widest block mb-1">Avg Value</span>
                            <span className="text-sm font-black text-neutral-900">{formatPKR(aov)}</span>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-100">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-neutral-50 rounded-lg text-neutral-400"><Mail className="w-4 h-4"/></div>
                        <div>
                            <span className="text-neutral-400 text-[9px] uppercase font-black tracking-widest block">Email</span>
                            <span className="text-xs font-bold text-neutral-800">{customer.email}</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-neutral-50 rounded-lg text-neutral-400"><Phone className="w-4 h-4"/></div>
                        <div>
                            <span className="text-neutral-400 text-[9px] uppercase font-black tracking-widest block">Mobile</span>
                            <span className="text-xs font-bold text-neutral-800">{customer.phone}</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-neutral-50 rounded-lg text-neutral-400"><MapPin className="w-4 h-4"/></div>
                        <div>
                            <span className="text-neutral-400 text-[9px] uppercase font-black tracking-widest block">Last Address</span>
                            <span className="text-xs font-bold text-neutral-800">{customer.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order History Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-100 bg-neutral-50/30">
                    <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Transaction History</h3>
                    <p className="text-xs text-neutral-500 font-medium mt-1">Detailed list of all previous orders.</p>
                </div>

                {customerOrders.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">No transaction history available</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Order</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Items</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Total</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {customerOrders.map((ord) => (
                                    <tr key={ord.id} onClick={() => navigate(`/orders/${ord.id}`)} className="group hover:bg-neutral-50 transition-colors cursor-pointer">
                                        <td className="px-6 py-4 text-sm font-black text-neutral-900 font-mono">{ord.orderNumber}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-neutral-500">{formatDate(ord.date)}</td>
                                        <td className="px-6 py-4 text-right text-xs font-bold text-neutral-800">
                                            {/* FIX 4: Safe items reduce */}
                                            {(ord.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0)} pcs
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-black text-neutral-900">{formatPKR(ord.total)}</td>
                                        <td className="px-6 py-4 text-center"><StatusBadge status={ord.status} size="sm"/></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end p-2 text-neutral-400 group-hover:text-black transition-colors"><Eye className="w-4 h-4"/></div>
                                        </td>
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

export default CustomerDetailPage