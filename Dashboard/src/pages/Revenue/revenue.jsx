import React, { useState } from 'react';
import { 
    Search, Download, TrendingUp, DollarSign, 
    ArrowUpRight, BarChart3, Calendar, Filter,
    ShoppingCart, Wallet, ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPKR, formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const Revenue = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Mock Data for Chart
    const chartData = [
        { date: '01 Nov', amount: 45000 },
        { date: '05 Nov', amount: 52000 },
        { date: '10 Nov', amount: 48000 },
        { date: '15 Nov', amount: 61000 },
        { date: '20 Nov', amount: 55000 },
        { date: '25 Nov', amount: 72000 },
        { date: '30 Nov', amount: 68000 },
    ];

    // Mock Data for Transactions
    const [transactions] = useState([
        { id: "ORD-9901", customer: "Usman Ali", amount: 12500, date: "2023-11-28", method: "JazzCash", status: "Completed" },
        { id: "ORD-9902", customer: "Ibrahim Khan", amount: 8400, date: "2023-11-29", method: "Bank Transfer", status: "Completed" },
        { id: "ORD-9903", customer: "Nimra Sheikh", amount: 15000, date: "2023-11-30", method: "COD", status: "Processing" },
        { id: "ORD-9904", customer: "Bilal Raza", amount: 2200, date: "2023-11-30", method: "EasyPaisa", status: "Completed" },
    ]);

    const filteredTransactions = transactions.filter(t => 
        t.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-serif">
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600"/> Revenue Analytics
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Track your store's financial performance and growth.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-all">
                        <Download className="w-3.5 h-3.5"/>
                        <span>Export Report</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all shadow-sm">
                        <Calendar className="w-3.5 h-3.5"/>
                        <span>Last 30 Days</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign className="w-5 h-5"/></div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                            +12.5% <ArrowUpRight className="w-3 h-3"/>
                        </span>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-lg font-bold text-neutral-900">{formatPKR(842500)}</h3>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><ShoppingCart className="w-5 h-5"/></div>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Orders</p>
                    <h3 className="text-lg font-bold text-neutral-900">1,240</h3>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Wallet className="w-5 h-5"/></div>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Avg. Order Value</p>
                    <h3 className="text-lg font-bold text-neutral-900">{formatPKR(4500)}</h3>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><BarChart3 className="w-5 h-5"/></div>
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Conversion Rate</p>
                    <h3 className="text-lg font-bold text-neutral-900">3.2%</h3>
                </div>
            </div>

            {/* Revenue Chart Section */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Revenue Growth</h3>
                        <p className="text-[10px] text-neutral-500">Sales performance over the current month</p>
                    </div>
                </div>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#B08D57" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#B08D57" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} tickFormatter={(value) => `${value/1000}k`} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}
                                formatter={(value) => formatPKR(value)}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#B08D57" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-neutral-100 flex flex-col md:flex-row gap-3 justify-between items-center">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-neutral-900" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium hover:bg-neutral-50">
                        <Filter className="w-3.5 h-3.5" /> Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-bold border-b border-neutral-100">
                            <tr>
                                <th className="px-5 py-4">Transaction ID</th>
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Method</th>
                                <th className="px-5 py-4">Date</th>
                                <th className="px-5 py-4">Amount</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">View</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredTransactions.map((item) => (
                                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-5 py-4 font-bold text-neutral-900">{item.id}</td>
                                    <td className="px-5 py-4 font-medium text-neutral-700">{item.customer}</td>
                                    <td className="px-5 py-4 text-neutral-500">{item.method}</td>
                                    <td className="px-5 py-4 text-neutral-500">{formatDate(item.date)}</td>
                                    <td className="px-5 py-4 font-bold text-emerald-600">{formatPKR(item.amount)}</td>
                                    <td className="px-5 py-4"><StatusBadge status={item.status} size="sm" /></td>
                                    <td className="px-5 py-4 text-right">
                                        <button className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors">
                                            <ArrowRight className="w-4 h-4"/>
                                        </button>
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

export default Revenue; 