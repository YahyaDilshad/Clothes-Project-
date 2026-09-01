import React, { useState } from 'react';
import { 
    Search, 
    Filter, 
    ArrowUpDown, 
    Package, 
    AlertTriangle, 
    TrendingDown, 
    RefreshCw, 
    Plus, 
    Download,
    ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { formatPKR } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const Stocks = () => {
    const { inventory, products } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [stockModalItem, setStockModalItem] = useState(null);

    // Filter logic
    const filteredInventory = inventory.filter(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats calculations
    const totalUnits = inventory.reduce((acc, item) => acc + item.currentStock, 0);
    const lowStockItems = inventory.filter(i => i.status === 'Low Stock').length;
    const outOfStockItems = inventory.filter(i => i.status === 'Out of Stock').length;

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight text-serif">Stock Inventory</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Manage and monitor real-time stock levels across all variants.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Sync Stock</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600"><Package className="w-5 h-5" /></div>
                        <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Inventory</span>
                            <div className="text-lg font-bold text-neutral-900">{totalUnits} Units</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><AlertTriangle className="w-5 h-5" /></div>
                        <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Low Stock Alerts</span>
                            <div className="text-lg font-bold text-amber-600">{lowStockItems} Items</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><TrendingDown className="w-5 h-5" /></div>
                        <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Out of Stock</span>
                            <div className="text-lg font-bold text-rose-600">{outOfStockItems} SKU</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Plus className="w-5 h-5" /></div>
                        <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Restocked (30d)</span>
                            <div className="text-lg font-bold text-emerald-600">420 Units</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
                {/* Search & Filter bar */}
                <div className="p-4 border-b border-neutral-100 bg-neutral-50/30 flex flex-col md:flex-row gap-3 justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input 
                            type="text" 
                            placeholder="Search product or SKU..." 
                            className="w-full bg-white border border-neutral-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium hover:bg-neutral-50">
                            <Filter className="w-3.5 h-3.5" /> Filter
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium hover:bg-neutral-50">
                            <ArrowUpDown className="w-3.5 h-3.5" /> Sort
                        </button>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-100">
                            <tr>
                                <th className="px-5 py-4">Product Info</th>
                                <th className="px-4 py-4">Variant</th>
                                <th className="px-4 py-4">Category</th>
                                <th className="px-4 py-4 text-center">In Stock</th>
                                <th className="px-4 py-4">Stock Status</th>
                                <th className="px-5 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0">
                                                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-neutral-900 line-clamp-1">{item.productName}</span>
                                                <span className="text-[10px] text-neutral-500 font-mono tracking-tight uppercase">{item.sku}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-md font-semibold text-[10px]">
                                                {item.size}
                                            </span>
                                            <span className="text-neutral-400">•</span>
                                            <span className="text-neutral-600 font-medium">{item.color}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-neutral-500">{item.category}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col items-center gap-1 min-w-[80px]">
                                            <span className={cn(
                                                "font-extrabold text-sm",
                                                item.currentStock <= item.lowStockLimit ? "text-amber-600" : "text-neutral-900"
                                            )}>
                                                {item.currentStock}
                                            </span>
                                            <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden max-w-[60px]">
                                                <div 
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        item.currentStock === 0 ? "bg-rose-500" : item.currentStock <= item.lowStockLimit ? "bg-amber-500" : "bg-neutral-900"
                                                    )}
                                                    style={{ width: `${Math.min((item.currentStock / 50) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={item.status} size="sm" />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button 
                                            onClick={() => setStockModalItem(item)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-[11px] font-bold hover:bg-neutral-800 transition-colors"
                                        >
                                            Adjust
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reuse Stock Adjustment Modal */}
            <StockAdjustmentModal 
                isOpen={Boolean(stockModalItem)} 
                onClose={() => setStockModalItem(null)} 
                item={stockModalItem} 
            />
        </div>
    );
};

export default Stocks;