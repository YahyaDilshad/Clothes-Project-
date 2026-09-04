import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Copy, Trash2, MoreVertical, Loader2, Package } from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatPKR } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const ProductsListPage = () => {
    const { 
        products = [], 
        fetchProducts, 
        deleteProduct,  
        duplicateProduct, 
        updateProduct, 
        categories = [], 
        fetchCategories,
        isLoading 
    } = useProductStore();
    
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const pageSize = 8;

    useEffect(() => { 
        fetchProducts(); 
        fetchCategories(); 
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuId(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeProducts = Array.isArray(products) ? products : [];

    // --- Filter Logic Updated ---
    const filteredProducts = useMemo(() => {
        return safeProducts.filter((p) => {
            const matchesSearch = 
                (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
            
            // Category check based on object structure
            const matchesCategory = selectedCategory === 'All' || p.category?.name === selectedCategory;
            
            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return 0;
        });
    }, [safeProducts, searchQuery, selectedCategory, sortBy]);

    const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleStatus = async (product) => {
    const id = product._id || product.id;
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    
    try {
        // Sirf status update bhej rahe hain
        await updateProduct(id, { status: newStatus });
    } catch (err) {
        console.error("Toggle status failed", err);
    }
};

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-serif">
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight italic">Product Catalog</h2>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-black">Warehouse Inventory</p>
                </div>
                <button onClick={() => navigate('/products/new')} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-lg transition-all">
                    <Plus className="w-4 h-4"/>
                    <span>Add New Product</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name or SKU..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)} 
                    className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold bg-white outline-none cursor-pointer min-w-[150px]"
                >
                    <option value="All">All Categories</option>
                    {safeCategories.map(c => (
                        <option key={c._id || c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-sm overflow-visible relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-[2rem]">
                        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50/50 text-[10px] font-black uppercase text-neutral-400 tracking-widest border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-5">Product Info</th>
                                <th className="px-4 py-5 text-right">Price</th>
                                <th className="px-4 py-5 text-center">Stock</th>
                                <th className="px-4 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest">No products found</td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product) => {
                                    const productId = product._id || product.id;
                                    const isActive = product.status === 'active';
                                    const isMenuOpen = openMenuId === productId;
                                    
                                    // --- Image & Field Logic ---
                                    const productImage = product.images?.[0]?.url || null;
                                    const price = product.price || 0;
                                    const stock = product.stock || 0;

                                    return (
                                        <tr key={productId} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl border border-neutral-200 overflow-hidden flex items-center justify-center bg-neutral-50 shrink-0">
                                                        {productImage ? (
                                                            <img src={productImage} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="w-5 h-5 text-neutral-300" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-neutral-900 truncate max-w-[200px]">{product.name}</p>
                                                        <p className="text-[10px] text-neutral-400 font-mono tracking-tighter uppercase">{product.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right font-black text-neutral-900">
                                                {formatPKR(price)}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border", 
                                                    stock <= (product.lowStockThreshold || 5) ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                )}>
                                                    {stock} Units
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <button 
                                                        onClick={() => handleToggleStatus(product)} 
                                                        className={cn("relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300", isActive ? "bg-neutral-900" : "bg-neutral-200")}
                                                    >
                                                        <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-all duration-300 shadow-sm", isActive ? "translate-x-5" : "translate-x-1")} />
                                                    </button>
                                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", isActive ? "text-neutral-900" : "text-neutral-400")}>
                                                        {product.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <button onClick={() => setOpenMenuId(isMenuOpen ? null : productId)} className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900 transition-all">
                                                    <MoreVertical className="w-4.5 h-4.5" />
                                                </button>
                                                {isMenuOpen && (
                                                    <div ref={menuRef} className="absolute right-12 top-2 w-48 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-150">
                                                        <button onClick={() => navigate(`/products/${productId}`)} className="w-full px-4 py-2 text-left text-[11px] font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> View Details</button>
                                                        <button onClick={() => navigate(`/products/${productId}/edit`)} className="w-full px-4 py-2 text-left text-[11px] font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"><Edit2 className="w-3.5 h-3.5" /> Edit Information</button>
                                                        <button onClick={() => duplicateProduct(productId)} className="w-full px-4 py-2 text-left text-[11px] font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Duplicate SKU</button>
                                                        <button onClick={() => setDeleteTarget(product)} className="w-full px-4 py-2 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Remove Product</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={Math.ceil(filteredProducts.length / pageSize)} 
                    totalItems={filteredProducts.length} 
                    pageSize={pageSize} 
                    onPageChange={setCurrentPage}
                />
            </div>

            <ConfirmDialog 
                isOpen={Boolean(deleteTarget)} 
                onClose={() => setDeleteTarget(null)} 
                onConfirm={() => { 
                    if (deleteTarget) { 
                        deleteProduct(deleteTarget._id || deleteTarget.id); 
                        setDeleteTarget(null); 
                    } 
                }} 
                title="Confirm Deletion" 
                message={`Are you sure you want to remove "${deleteTarget?.name}"? This action cannot be undone.`} 
                confirmText="Delete" 
                type="danger"
            />
        </div>
    );
};