import React, { useState, useEffect, useMemo } from 'react';
import { Search, Package, AlertTriangle, TrendingDown, RefreshCw, Loader2 } from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { cn } from '../../utils/cn';

const Stocks = () => {
    const { inventory, fetchInventory, syncStock, isLoading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [stockModalItem, setStockModalItem] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    // Filter logic based on populated product data
    const filteredInventory = useMemo(() => {
        const invArray = Array.isArray(inventory) ? inventory : [];
        return invArray.filter(item => {
            const productName = item.product?.name?.toLowerCase() || "";
            const sku = item.sku?.toLowerCase() || "";
            const search = searchTerm.toLowerCase();
            return productName.includes(search) || sku.includes(search);
        });
    }, [inventory, searchTerm]);

    const stats = useMemo(() => {
        const invArray = Array.isArray(inventory) ? inventory : [];
        return invArray.reduce((acc, item) => {
            const stock = item.quantity || 0;
            const lowLimit = item.lowStockThreshold || 5;
            acc.totalUnits += stock;
            if (stock <= 0) acc.outOfStockItems += 1;
            else if (stock <= lowLimit) acc.lowStockItems += 1;
            return acc;
        }, { totalUnits: 0, lowStockItems: 0, outOfStockItems: 0 });
    }, [inventory]);

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 font-serif italic">Stock Inventory</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Manage your warehouse levels and stock alerts.</p>
                </div>
                <button 
                    onClick={syncStock}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    Sync Inventory
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={<Package/>} label="Total Units" value={stats.totalUnits} />
                <StatCard icon={<AlertTriangle/>} label="Low Stock" value={stats.lowStockItems} color="amber" />
                <StatCard icon={<TrendingDown/>} label="Out of Stock" value={stats.outOfStockItems} color="rose" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-neutral-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input 
                            type="text" 
                            placeholder="Search SKU or Product Name..." 
                            className="w-full pl-9 pr-4 py-2 text-xs border rounded-xl outline-none focus:ring-2 focus:ring-neutral-900/5"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500 font-bold">
                                <th className="px-6 py-4">Product Details</th>
                                <th className="px-6 py-4 text-center">Location</th>
                                <th className="px-6 py-4 text-center">Quantity</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredInventory.map((item) => {
                                // Image Handling: populated from 'product' field
                                const productImages = item.product?.images || [];
                                const productImage = productImages.length > 0 ? productImages[0].url : null;
                                 const stock = item.quantity || 0;
                                const lowLimit = item.lowStockThreshold || 5;

                                return (
                                    <tr key={item._id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                                                    {productImage ? (
                                                        <img src={productImage} alt="image" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">No Img</div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-neutral-900 truncate max-w-[250px]">
                                                        {item.product?.name || "Product Removed"}
                                                    </span>
                                                    <span className="text-[10px] text-neutral-400 font-mono uppercase">{item.sku}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs font-medium text-neutral-600">
                                            {item.location || 'Warehouse A'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={cn(
                                                    "text-sm font-black",
                                                    stock <= 0 ? "text-rose-600" : stock <= lowLimit ? "text-amber-600" : "text-neutral-900"
                                                )}>
                                                    {stock}
                                                </span>
                                                <div className="w-12 h-1 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                                                    <div 
                                                        className={cn(
                                                            "h-full rounded-full transition-all",
                                                            stock <= 0 ? "bg-rose-500" : stock <= lowLimit ? "bg-amber-500" : "bg-neutral-900"
                                                        )}
                                                        style={{ width: `${Math.min((stock / 100) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge 
                                                status={stock <= 0 ? 'Out of Stock' : stock <= lowLimit ? 'Low Stock' : 'Active'} 
                                                size="sm" 
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setStockModalItem(item)}
                                                className="px-4 py-1.5 bg-white border border-neutral-200 text-neutral-900 rounded-lg text-[11px] font-bold hover:bg-neutral-900 hover:text-white transition-all"
                                            >
                                                Adjust
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {stockModalItem && (
                <StockAdjustmentModal 
                    isOpen={Boolean(stockModalItem)} 
                    onClose={() => setStockModalItem(null)} 
                    item={stockModalItem} 
                />
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value, color = "neutral" }) => {
    const colors = {
        neutral: "bg-neutral-50 text-neutral-600 border-neutral-200",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100"
    };
    return (
        <div className={cn("p-5 rounded-2xl border bg-white flex items-center gap-4", colors[color])}>
            <div className="p-3 bg-white border rounded-xl shadow-sm">{icon}</div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</p>
                <p className="text-xl font-black">{value}</p>
            </div>
        </div>
    );
};

export default Stocks;