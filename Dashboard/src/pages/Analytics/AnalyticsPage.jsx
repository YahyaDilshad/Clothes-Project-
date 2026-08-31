import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, RotateCcw, } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { formatPKR } from '../../utils/formatters';
import { revenueTimeSeriesData, categoryRevenueData, cityOrdersData, paymentMethodDistribution, } from '../../data/mockData';
export const AnalyticsPage = () => {
    const [timeRange, setTimeRange] = useState('30 Days');
    const chartData = revenueTimeSeriesData[timeRange];
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Business Intelligence & Analytics</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Financial revenue velocity, regional Pakistani order density, and customer lifetime unit economics.
          </p>
        </div>

        {/* Time range switcher */}
        <div className="inline-flex p-1 bg-white rounded-xl border border-neutral-200/80 shadow-2xs">
          {['7 Days', '30 Days', '6 Months', '1 Year'].map((range) => (<button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${timeRange === range
                ? 'bg-neutral-900 text-white shadow-2xs font-bold'
                : 'text-neutral-500 hover:text-neutral-900'}`}>
              {range}
            </button>))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Average Order Value (AOV)" value="PKR 8,450" change={6.8} changeLabel="vs last month" icon={DollarSign}/>
        <StatCard title="Online Conversion Rate" value="3.42%" change={0.6} changeLabel="industry benchmark: 2.1%" icon={TrendingUp}/>
        <StatCard title="Return / Exchange Rate" value="4.10%" change={-0.8} changeLabel="down 0.8% (Healthy)" icon={RotateCcw}/>
        <StatCard title="Customer Lifetime Value" value="PKR 24,800" change={14.2} changeLabel="repeat customer metric" icon={Users}/>
      </div>

      {/* Main Revenue Chart */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Gross Revenue vs Production & Fulfillment Cost
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Tracking profit margin & top line earnings</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Net Margin: ~42.4%
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="anRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#171717" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#171717" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="anCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
              <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11 }}/>
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}/>
              <Tooltip formatter={(value, name) => [formatPKR(Number(value)), name]} contentStyle={{ backgroundColor: '#171717', color: '#fff', borderRadius: '12px', fontSize: '12px' }}/>
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="revenue" stroke="#171717" strokeWidth={2.5} fillOpacity={1} fill="url(#anRev)" name="Gross Revenue (PKR)"/>
              <Area type="monotone" dataKey="cost" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#anCost)" name="COGS & Delivery (PKR)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Category Revenue Pie & City Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share Donut */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Revenue by Garment Category
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Top product categories by gross contribution</p>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryRevenueData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                    {categoryRevenueData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
                  </Pie>
                  <Tooltip formatter={(val) => [formatPKR(Number(val)), 'Revenue']} contentStyle={{ backgroundColor: '#171717', color: '#fff', borderRadius: '12px', fontSize: '11px' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-neutral-100 text-xs">
            {categoryRevenueData.map((c) => (<div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}/>
                  <span className="text-neutral-700 font-medium">{c.name}</span>
                </div>
                <span className="font-bold text-neutral-900">{formatPKR(c.value)}</span>
              </div>))}
          </div>
        </div>

        {/* Regional City Distribution */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Regional City Demand (Pakistan)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">Top shipping destinations nationwide</p>
              </div>
              <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                Lahore #1
              </span>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityOrdersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="city" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 10 }}/>
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }}/>
                  <Tooltip formatter={(val, name) => [name === 'revenue' ? formatPKR(Number(val)) : val, name === 'revenue' ? 'Revenue' : 'Orders']} contentStyle={{ backgroundColor: '#171717', color: '#fff', borderRadius: '12px', fontSize: '11px' }}/>
                  <Bar dataKey="orders" fill="#171717" radius={[6, 6, 0, 0]} name="Orders"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Karachi & Lahore Account for 70% of volume</span>
            <span className="font-bold text-neutral-900">820 Total Shipments</span>
          </div>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
          Payment Method Breakdown (Pakistani Market Context)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentMethodDistribution.map((pm) => (<div key={pm.name} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/70">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-900 text-xs">{pm.name}</span>
                <span className="text-xs font-black text-neutral-900">{pm.percentage}%</span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${pm.percentage}%` }}/>
              </div>
              <span className="text-[11px] font-semibold text-neutral-500">
                {formatPKR(pm.amount)} processed
              </span>
            </div>))}
        </div>
      </div>
    </div>);
};
