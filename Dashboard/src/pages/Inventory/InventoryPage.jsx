import React, { useState, useMemo } from 'react';
import { Boxes, Search, Download, History, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { formatDate } from '../../utils/formatters';

export const InventoryPage = () => {
    // FIX 1: Default empty arrays set kiye hain taake .length crash na kare
    const { inventory = [], stockLogs = [], categories = [] } = useApp();
    
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [selectedItemForAdjust, setSelectedItemForAdjust] = useState(null);
    const [showLogsModal, setShowLogsModal] = useState(false);

    // FIX 2: Loading guard lagaya hai agar data loading state mein ho
    if (!inventory) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs font-medium">Synchronizing warehouse data...</p>
            </div>
        );
    }

    // Metrics calculation (Ab inventory array guaranteed hai)
    const totalVariantsCount = inventory.length;
    const lowStockCount = inventory.filter((i) => i.status === 'Low Stock').length;
    const outOfStockCount = inventory.filter((i) => i.status === 'Out of Stock').length;
    const totalUnits = inventory.reduce((acc, i) => acc + (i.currentStock || 0), 0);

    // Filtered inventory logic
    const filteredInventory = useMemo(() => {
        return inventory.filter((item) => {
            const matchesTab = activeTab === 'All' || item.status === activeTab;
            const matchesSearch = 
                item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.size?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
            return matchesTab && matchesSearch && matchesCat;
        });
    }, [inventory, activeTab, searchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredInventory.length / pageSize) || 1;
    const paginatedInventory = filteredInventory.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const exportInventoryCSV = () => {
        const headers = ['Product', 'SKU', 'Category', 'Color', 'Size', 'Current Stock', 'Low Stock Limit', 'Status', 'Warehouse'];
        const rows = filteredInventory.map((i) => [
            `"${i.productName}"`,
            i.sku,
            i.category,
            i.color,
            i.size,
            i.currentStock,
            i.lowStockLimit,
            i.status,
            `"${i.warehouse || 'Main Hub'}"`,
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `inventory_audit_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Inventory & Warehouse</h2>
                    <p className="text-xs text-neutral-500 mt-1 font-medium">Real-time variant stock levels and restocking thresholds.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setShowLogsModal(true)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold shadow-sm transition-all">
                        <History className="w-4 h-4"/>
                        <span>Audit History ({stockLogs?.length || 0})</span>
                    </button>

                    <button onClick={exportInventoryCSV} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold shadow-sm transition-all">
                        <Download className="w-4 h-4"/>
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total Stock Units</span>
                    <div className="text-2xl font-bold text-neutral-900 mt-1">{totalUnits.toLocaleString()}</div>
                    <p className="text-[10px] text-neutral-500 font-medium mt-0.5">{totalVariantsCount} Active SKUs</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Healthy Status</span>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">{totalVariantsCount - lowStockCount - outOfStockCount}</div>
                    <p className="text-[10px] text-emerald-500 font-medium mt-0.5">Optimized Stock</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm border-l-4 border-l-amber-400">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Low Stock Alert</span>
                    <div className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</div>
                    <p className="text-[10px] text-amber-500 font-medium mt-0.5">Needs Attention</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm border-l-4 border-l-rose-400">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Out of Stock</span>
                    <div className="text-2xl font-bold text-rose-600 mt-1">{outOfStockCount}</div>
                    <p className="text-[10px] text-rose-500 font-medium mt-0.5">Lost Revenue Risk</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((tab) => (
                        <button key={tab} onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-neutral-900 text-white shadow-md' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 flex-1 max-w-xl">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="Search SKU or product..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all" />
                    </div>
                    <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                        className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 outline-none">
                        <option value="All">Categories</option>
                        {categories?.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {filteredInventory.length === 0 ? (
                    <EmptyState icon={Boxes} title="No Stock Records Found" description="Try adjusting your filters or search terms."/>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/50 border-b border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Product & SKU</th>
                                    <th className="px-6 py-4 text-right">Available</th>
                                    <th className="px-6 py-4 text-right">Reserved</th>
                                    <th className="px-6 py-4 text-right">Current Total</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {paginatedInventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={item.productImage} className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shadow-sm" alt="" />
                                                <div>
                                                    <p className="text-sm font-bold text-neutral-900">{item.productName}</p>
                                                    <p className="text-[10px] font-mono text-neutral-400">{item.sku} • {item.size}/{item.color}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-neutral-600">{item.available}</td>
                                        <td className="px-6 py-4 text-right font-medium text-neutral-400">{item.reserved}</td>
                                        <td className="px-6 py-4 text-right font-black text-neutral-900">{item.currentStock} Units</td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={item.status} size="sm" />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => setSelectedItemForAdjust(item)} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-[10px] font-bold hover:bg-black transition-all active:scale-95 shadow-md">
                                                Adjust Stock
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredInventory.length} pageSize={pageSize} onPageChange={setCurrentPage} />
            </div>

            {/* Modals */}
            <StockAdjustmentModal isOpen={Boolean(selectedItemForAdjust)} onClose={() => setSelectedItemForAdjust(null)} item={selectedItemForAdjust} />

            {/* Audit Logs Modal */}
            {showLogsModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-neutral-200 max-w-2xl w-full p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight">Audit Logs</h3>
                                <p className="text-xs text-neutral-500 font-medium">Physical stock adjustments history</p>
                            </div>
                            <button onClick={() => setShowLogsModal(false)} className="w-8 h-8 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors">✕</button>
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto divide-y divide-neutral-50 pr-2 custom-scrollbar">
                            {stockLogs.map((log) => (
                                <div key={log.id} className="py-4 flex justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-neutral-900 text-[11px]">{log.sku}</span>
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${log.type === 'Add Stock' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {log.type} ({log.quantity > 0 ? `+${log.quantity}` : log.quantity})
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-neutral-500 font-medium">{log.reason}</p>
                                    </div>
                                    <div className="text-right whitespace-nowrap">
                                        <p className="text-[10px] font-bold text-neutral-900">{formatDate(log.date)}</p>
                                        <p className="text-[9px] text-neutral-400 uppercase font-bold">Admin: {log.user}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowLogsModal(false)} className="w-full py-3 bg-neutral-900 text-white rounded-2xl text-xs font-bold hover:bg-black transition-all shadow-xl">Close Audit</button>
                    </div>
                </div>
            )}
        </div>
    );
};