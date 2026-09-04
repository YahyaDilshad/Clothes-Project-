import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Copy, Trash2, Package, Truck, Loader2 } from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatPKR, formatDate } from '../../utils/formatters';

export const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, deleteProduct, duplicateProduct, isLoading } = useProductStore();
    
    // 1. Robust Product Finding
    const product = products.find((p) => String(p._id) === String(id) || String(p.id) === String(id));
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
    
    // 3. Loading State
    if (isLoading && !product) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-neutral-400" />
                <p className="mt-4 text-sm font-medium text-neutral-500">Fetching Product Details...</p>
            </div>
        );
    }

    // 4. Not Found State
    if (!product) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 mt-10">
                <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3"/>
                <h2 className="text-lg font-bold text-neutral-900">Product Not Found</h2>
                <button 
                    onClick={() => navigate('/products')} 
                    className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold"
                >
                    Return to Catalog
                </button>
            </div>
        );
    }

    // Image helper: Get current image URL
    const currentImage = product.images?.[selectedImageIndex]?.url || 'https://via.placeholder.com/400x500?text=No+Image';

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/products')} className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors">
                        <ArrowLeft className="w-4 h-4"/>
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">{product.name}</h2>
                            <StatusBadge status={product.status} size="sm"/>
                        </div>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">
                            SKU: {product.sku || 'N/A'} • {product.category?.name || 'No Category'} • Added {formatDate(product.createdAt)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/products/${product._id || product.id}/edit`)} className="px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors">
                        <Edit2 className="w-3.5 h-3.5 inline mr-1.5"/> Edit
                    </button>
                    <button onClick={() => duplicateProduct(product._id || product.id)} className="px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors">
                        <Copy className="w-3.5 h-3.5 inline mr-1.5"/> Duplicate
                    </button>
                    <button onClick={() => setDeleteDialogOpen(true)} className="p-2 bg-white border border-neutral-200 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors">
                        <Trash2 className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Media & Logistics */}
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                        <div className="aspect-[4/5] rounded-xl bg-neutral-100 overflow-hidden relative border border-neutral-100">
                            <img 
                                src={currentImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-4 gap-2 mt-3">
                            {(product.images || []).map((img, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setSelectedImageIndex(idx)} 
                                    className={`aspect-square rounded-lg border overflow-hidden transition-all ${selectedImageIndex === idx ? 'ring-2 ring-neutral-900 border-transparent' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img.url} className="w-full h-full object-cover" alt={`view-${idx}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3 text-xs">
                        <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <Truck className="w-4 h-4"/> Logistics
                        </h4>
                        <div className="divide-y divide-neutral-100">
                            <div className="py-2 flex justify-between"><span>Warehouse:</span><span className="font-bold">{product.warehouse || 'Main'}</span></div>
                            <div className="py-2 flex justify-between"><span>Weight:</span><span className="font-bold">{product.weight || 0} kg</span></div>
                            <div className="py-2 flex justify-between"><span>Low Stock:</span><span className="font-bold text-amber-600">{product.lowStockThreshold || 5} units</span></div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Info & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <MetricCard label="Sale Price" value={formatPKR(product.price || 0)} />
                        <MetricCard label="Total Stock" value={`${product.stock || 0} units`} />
                        <MetricCard label="Units Sold" value={product.unitsSold || 0} />
                        <MetricCard label="Total Revenue" value={formatPKR(product.revenue || 0)} />
                    </div>

                    {/* Description Section */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider">Description</h3>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                            {product.description || 'No description provided for this product.'}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                            {(product.tags || []).length > 0 ? (
                                product.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-neutral-100 rounded-md text-[10px] font-bold text-neutral-600">#{tag}</span>
                                ))
                            ) : (
                                <span className="text-[10px] text-neutral-400 italic">No tags</span>
                            )}
                        </div>
                    </div>

                    {/* Variants Table */}
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-neutral-100">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Inventory Breakdown</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-neutral-50 text-[10px] font-bold uppercase text-neutral-400 border-b border-neutral-100">
                                    <tr>
                                        <th className="px-5 py-3">Variant</th>
                                        <th className="px-3 py-3 text-right">Price</th>
                                        <th className="px-3 py-3 text-right">Stock</th>
                                        <th className="px-5 py-3 text-right">Sold</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {(product.variants || []).length > 0 ? (
                                        product.variants.map((v, idx) => (
                                            <tr key={v._id || v.id || idx} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-5 py-3 font-bold text-neutral-800">
                                                    {v.color || 'N/A'} / {v.size || 'N/A'}
                                                </td>
                                                <td className="px-3 py-3 text-right font-bold text-neutral-700">
                                                    {formatPKR(v.price || product.price || 0)}
                                                </td>
                                                <td className={`px-3 py-3 text-right font-black ${v.stock < 5 ? 'text-rose-500' : 'text-neutral-900'}`}>
                                                    {v.stock || 0}
                                                </td>
                                                <td className="px-5 py-3 text-right text-neutral-500">{v.sold || 0}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-5 py-8 text-center text-neutral-400 italic">
                                                No variants available for this product.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog 
                isOpen={deleteDialogOpen} 
                onClose={() => setDeleteDialogOpen(false)} 
                onConfirm={() => { deleteProduct(product._id || product.id); navigate('/products'); }} 
                title="Delete Product" 
                message={`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`} 
                type="danger"
            />
        </div>
    );
};

const MetricCard = ({ label, value }) => (
    <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{label}</span>
        <div className="text-lg font-bold text-neutral-900 mt-1">{value}</div>
    </div>
);