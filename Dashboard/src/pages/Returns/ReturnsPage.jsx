import React, { useState } from 'react';
import { Search, ArrowRightLeft, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPKR, formatDate } from '../../utils/formatters';
export const ReturnsPage = () => {
    const { returns, updateReturnStatus } = useApp();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const filteredReturns = returns.filter((r) => {
        const matchesTab = activeTab === 'All' || r.status === activeTab;
        const matchesSearch = r.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.productName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Returns & Exchange Requests</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage garment size exchanges, fabric flaw inspections, and reverse courier logistics.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Requested', 'Approved', 'Rejected', 'Completed'].map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                {tab}
              </button>))}
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
            <input type="text" placeholder="Search by Order ID, customer name, or item..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden bg-neutral-50/50"/>
          </div>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-150 text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Item & Variant</th>
                <th className="px-4 py-3.5">Request Type</th>
                <th className="px-4 py-3.5">Reason</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredReturns.map((ret) => (<tr key={ret.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-neutral-900">{ret.orderNumber}</span>
                    <span className="block text-[10px] text-neutral-400">{formatDate(ret.requestDate)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-neutral-900">{ret.customerName}</div>
                    <div className="text-[11px] text-neutral-500">{ret.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-neutral-900">{ret.productName}</div>
                    <div className="text-[11px] text-neutral-500">
                      Variant: <span className="font-medium text-neutral-700">{ret.variant}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${ret.type === 'Exchange'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-purple-50 text-purple-700'}`}>
                      <ArrowRightLeft className="w-3 h-3"/>
                      <span>{ret.type}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-600 max-w-xs">{ret.reason}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-neutral-900">
                    {formatPKR(ret.amount)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={ret.status} size="sm"/>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ret.status === 'Requested' ? (<>
                          <button type="button" onClick={() => updateReturnStatus(ret.id, 'Approved')} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors">
                            Approve
                          </button>
                          <button type="button" onClick={() => updateReturnStatus(ret.id, 'Rejected')} className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-neutral-200 text-rose-600 rounded-lg text-xs font-semibold transition-colors">
                            Reject
                          </button>
                        </>) : ret.status === 'Approved' ? (<button type="button" onClick={() => updateReturnStatus(ret.id, 'Completed')} className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors">
                          Mark Completed
                        </button>) : (<span className="text-[11px] text-neutral-400 font-medium">Closed</span>)}
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
