import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, ShoppingBag, Clock, AlertTriangle, 
  Calendar, Eye, Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar 
} from 'recharts';

import { useProductStore } from '../../store/UseProductsStore.js';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPKR } from '../../utils/formatters';
import { cn } from '../../utils/cn'; // FIXED: Added missing import

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { 
        orders, inventory, 
        revenueTimeSeriesData, 
        weeklyVelocityData,    
        fetchDashboardData, 
        isLoading 
    } = useProductStore();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const [timeRange, setTimeRange] = useState('7 Days');
    
    // Month Filter Logic
    const months = useMemo(() => {
        const result = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            result.push({
                label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
                month: d.getMonth(),
                year: d.getFullYear()
            });
        }
        return result;
    }, []);

    const [activeMonth, setActiveMonth] = useState(months[0]);

    // Filtered orders using 'createdAt' from your backend data
    const filteredOrders = useMemo(() => {
        const ordersArray = Array.isArray(orders) ? orders : [];
        return ordersArray.filter(order => {
            const dateToUse = order.createdAt || order.date;
            if (!dateToUse) return false;
            
            const orderDate = new Date(dateToUse);
            return orderDate.getMonth() === activeMonth.month && 
                   orderDate.getFullYear() === activeMonth.year;
        });
    }, [orders, activeMonth]);

    // Revenue calculation
    const monthlyRevenue = useMemo(() => {
        return filteredOrders
            .filter((o) => o.status?.toLowerCase() !== 'cancelled')
            .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    }, [filteredOrders]);

    // Low stock calculation based on 'quantity' and 'lowStockThreshold'
    const lowStockItemsCount = useMemo(() => {
        const invArray = Array.isArray(inventory) ? inventory : [];
        return invArray.filter(
            (i) => Number(i.quantity) <= (Number(i.lowStockThreshold) || 5)
        ).length;
    }, [inventory]);

    const recentOrders = useMemo(() => filteredOrders.slice(0, 5), [filteredOrders]);

    // Safety check for chart data
    const chartData = useMemo(() => {
        return revenueTimeSeriesData?.[timeRange] || [];
    }, [revenueTimeSeriesData, timeRange]);

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 font-serif italic tracking-tight">Store Overview</h2>
                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Faisal Kamir Admin Suite</p>
                </div>

                <div className="flex items-center gap-3 bg-white border border-neutral-200 px-4 py-2.5 rounded-2xl shadow-sm">
                    <Calendar className="w-4 h-4 text-[#B08D57]" />
                    <select 
                        value={JSON.stringify(activeMonth)}
                        onChange={(e) => setActiveMonth(JSON.parse(e.target.value))}
                        className="bg-transparent text-xs font-bold text-neutral-900 outline-none appearance-none cursor-pointer"
                    >
                        {months.map((m, idx) => (
                            <option key={idx} value={JSON.stringify(m)}>{m.label}</option>
                        ))}
                    </select>
                </div>
            </div>
      
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard title={`${activeMonth.label.split(' ')[0]} Revenue`} value={formatPKR(monthlyRevenue)} icon={DollarSign} />
                <StatCard title="Total Orders" value={filteredOrders.length.toString()} icon={ShoppingBag} onClick={() => navigate('/orders')} />
                <StatCard title="Pending Orders" value={filteredOrders.filter(o => o.status?.toLowerCase() === 'pending').length.toString()} icon={Clock} onClick={() => navigate('/orders')} />
                <StatCard title="Low Stock Items" value={lowStockItemsCount.toString()} icon={AlertTriangle} onClick={() => navigate('/inventory')} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest">Revenue Analytics</h3>
                        <div className="inline-flex p-1 bg-neutral-50 rounded-xl border border-neutral-100">
                            {['7 Days', '30 Days', '6 Months'].map((range) => (
                                <button 
                                    key={range} 
                                    onClick={() => setTimeRange(range)} 
                                    className={cn(
                                        "px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all", 
                                        timeRange === range ? "bg-white text-neutral-900 shadow-sm border border-neutral-100" : "text-neutral-400 hover:text-neutral-600"
                                    )}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-neutral-300" /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#B08D57" stopOpacity={0.2}/><stop offset="95%" stopColor="#B08D57" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5"/>
                                    <XAxis dataKey="date" tick={{ fill: '#999', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#999', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#B08D57" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Weekly Velocity Bar Chart */}
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                    <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-6">Weekly Velocity</h3>
                    <div className="h-72 w-full">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-neutral-300" /></div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyVelocityData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5"/>
                                    <XAxis dataKey="day" tick={{ fill: '#999', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#F9F9F9'}} contentStyle={{ borderRadius: '12px', border: 'none' }}/>
                                    <Bar dataKey="sales" fill="#181818" radius={[4, 4, 0, 0]} barSize={20}/>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-100">
                    <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 text-neutral-400 uppercase text-[9px] font-bold tracking-widest border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4 text-right">Value</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50 text-xs">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-neutral-400 italic font-medium uppercase tracking-widest text-[10px]">No orders found for this month</td>
                                </tr>
                            ) : (
                                recentOrders.map((ord) => (
                                    <tr key={ord._id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-neutral-900 uppercase tracking-tighter">
                                            {ord.orderNumber}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-neutral-900">{ord.customer?.name || "Walk-in Customer"}</p>
                                            <p className="text-[10px] text-neutral-400 uppercase tracking-tighter font-bold">{ord.paymentMethod}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-neutral-900">
                                            {formatPKR(ord.total)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={ord.status} size="sm"/>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => navigate(`/orders/${ord._id}`)} 
                                                className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};