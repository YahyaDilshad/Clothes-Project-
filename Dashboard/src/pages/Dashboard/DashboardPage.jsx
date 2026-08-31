import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  Eye, 
  Plus, 
  ChevronRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { formatPKR, formatDate } from '../../utils/formatters';
import { revenueTimeSeriesData, weeklySalesByDay } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const { products, orders, customers, inventory } = useApp();
    const [timeRange, setTimeRange] = useState('7 Days');
    const [selectedStockItem, setSelectedStockItem] = useState(null);
    const navigate = useNavigate();

    // Metrics calculation
    const totalRevenue = orders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((acc, o) => acc + o.total, 0) + 1245000;
    const totalOrdersCount = orders.length + 1114;
    const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed').length;
    const lowStockItems = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock');

    const topProducts = [...products]
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, 5);

    const recentOrders = [...orders].slice(0, 5);
    const chartData = revenueTimeSeriesData[timeRange];

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
            {/* Top Banner / Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm transition-all">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-[#181818] tracking-tight">Executive Overview</h2>
                        <span className="px-2.5 py-1 text-[10px] font-bold bg-[#3F7D5A]/10 text-[#3F7D5A] border border-[#3F7D5A]/20 rounded-lg uppercase">
                            Live System
                        </span>
                    </div>
                    <p className="text-sm text-[#6B6B6B] mt-1 font-medium">
                        Real-time operations and store velocity analytics.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/products/new')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#181818] hover:bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-neutral-200 transition-all active:scale-95 cursor-pointer">
                        <Plus className="w-4 h-4 text-[#B08D57]"/>
                        <span>New Product</span>
                    </button>
                    <button onClick={() => navigate('/orders')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-50 text-[#181818] border border-neutral-200 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer">
                        <span>Manage Orders</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards - Updated Grid to show 4 cards in a row on Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard title="Total Revenue" value={formatPKR(totalRevenue)} change={18.6} icon={DollarSign}/>
                <StatCard title="Total Orders" value={totalOrdersCount.toLocaleString()} change={12.4} icon={ShoppingBag} onClick={() => navigate('/orders')}/>
                <StatCard title="Total Customers" value={(customers.length + 885).toLocaleString()} change={8.2} icon={Users} onClick={() => navigate('/customers')}/>
                <StatCard title="Total Products" value={products.length.toString()} icon={Package} onClick={() => navigate('/products')}/>
                <StatCard title="Pending Orders" value={pendingOrdersCount.toString()} badge="Due" badgeColor="bg-[#B8863B]/15 text-[#B8863B]" icon={Clock} onClick={() => navigate('/orders')}/>
                <StatCard title="Low Stock" value={lowStockItems.length.toString()} badge="Replenish" badgeColor="bg-[#B94A48]/15 text-[#B94A48]" icon={AlertTriangle} onClick={() => navigate('/inventory')}/>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-[#181818] uppercase tracking-widest">Revenue Analytics</h3>
                            <p className="text-xs text-[#6B6B6B] mt-1 font-medium">Gross revenue in PKR</p>
                        </div>
                        <div className="inline-flex p-1 bg-neutral-100 rounded-xl border border-neutral-200">
                            {['7 Days', '30 Days', '6 Months', '1 Year'].map((range) => (
                                <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${timeRange === range ? 'bg-white text-[#181818] shadow-sm' : 'text-[#6B6B6B] hover:text-[#181818]'}`}>
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#B08D57" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#B08D57" stopOpacity={0.0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0"/>
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#999', fontSize: 11 }} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#999', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={{ backgroundColor: '#181818', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#B08D57" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                    <h3 className="text-sm font-bold text-[#181818] uppercase tracking-widest mb-6">Weekly Velocity</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklySalesByDay}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0"/>
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#999', fontSize: 11 }} tickFormatter={(val) => val.slice(0, 3)}/>
                                <Tooltip cursor={{fill: '#F9F9F9'}} contentStyle={{ backgroundColor: '#181818', border: 'none', borderRadius: '12px', color: '#fff' }}/>
                                <Bar dataKey="sales" fill="#181818" radius={[6, 6, 0, 0]} barSize={28}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* FULL WIDTH COLUMN SECTION (Top Selling & Recent Orders) */}
            <div className="flex flex-col gap-6">
                
                {/* Top Selling Products - 100% Width */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden w-full transition-all hover:border-neutral-300/50">
                    <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Top Selling Products</h3>
                            <p className="text-xs text-neutral-500 mt-1">High-grossing inventory items</p>
                        </div>
                        <button onClick={() => navigate('/products')} className="text-xs font-bold text-[#B08D57] hover:text-black flex items-center gap-1 transition-colors">
                            View All Catalog <ChevronRight className="w-4 h-4"/>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white text-neutral-400 uppercase text-[10px] font-bold tracking-widest">
                                <tr className="border-b border-neutral-50">
                                    <th className="px-6 py-4">Product Details</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-right">Units Sold</th>
                                    <th className="px-6 py-4 text-right">Total Revenue</th>
                                    <th className="px-6 py-4 text-center">Stock Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {topProducts.map((prod) => (
                                    <tr key={prod.id} onClick={() => navigate(`/products/${prod.id}`)} className="group hover:bg-neutral-50/50 cursor-pointer transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
                                                    <img src={prod.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-neutral-900">{prod.name}</p>
                                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">SKU: {prod.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500 font-medium">{prod.category}</td>
                                        <td className="px-6 py-4 text-right font-bold text-neutral-900 text-sm">{prod.unitsSold}</td>
                                        <td className="px-6 py-4 text-right font-bold text-neutral-900 text-sm">{formatPKR(prod.revenue)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${prod.totalStock <= prod.lowStockThreshold ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                {prod.totalStock} Units
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders - 100% Width */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden w-full transition-all hover:border-neutral-300/50">
                    <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
                        <div>
                            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Recent Transactions</h3>
                            <p className="text-xs text-neutral-500 mt-1">Real-time incoming customer orders</p>
                        </div>
                        <button onClick={() => navigate('/orders')} className="text-xs font-bold text-[#B08D57] hover:text-black flex items-center gap-1 transition-colors">
                            Manage Ledger <ChevronRight className="w-4 h-4"/>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white text-neutral-400 uppercase text-[10px] font-bold tracking-widest">
                                <tr className="border-b border-neutral-50">
                                    <th className="px-6 py-4">Order Reference</th>
                                    <th className="px-6 py-4">Customer Info</th>
                                    <th className="px-6 py-4 text-right">Order Value</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {recentOrders.map((ord) => (
                                    <tr key={ord.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-neutral-900 font-mono tracking-tighter uppercase">{ord.orderNumber}</p>
                                            <p className="text-[10px] text-neutral-400 font-medium">{formatDate(ord.date)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-neutral-900">{ord.customerName}</p>
                                            <p className="text-[10px] text-neutral-400 uppercase tracking-tighter">{ord.shippingAddress.city}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-neutral-900 text-sm">{formatPKR(ord.total)}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={ord.status} size="sm"/>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => navigate(`/orders/${ord.id}`)} className="p-2.5 text-neutral-400 hover:text-black hover:bg-white border border-transparent hover:border-neutral-200 rounded-xl transition-all shadow-none hover:shadow-sm">
                                                <Eye className="w-4.5 h-4.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Stock Adjustment Modal */}
            <StockAdjustmentModal isOpen={Boolean(selectedStockItem)} onClose={() => setSelectedStockItem(null)} item={selectedStockItem}/>
        </div>
    );
};