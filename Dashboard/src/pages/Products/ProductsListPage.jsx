import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowUpDown, Eye, Edit2, Copy, Trash2, Package, CheckSquare, Square, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatPKR, formatDate } from '../../utils/formatters';
export const ProductsListPage = () => {
    const { products, deleteProduct, duplicateProduct, categories } = useApp();
    const navigate = useNavigate();
    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    // Table selection & pagination
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    // Dialogs
    const [deleteTarget, setDeleteTarget] = useState(null);
    // Filtered & Sorted list
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        }).sort((a, b) => {
            if (sortBy === 'newest')
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'price-asc')
                return a.salePrice - b.salePrice;
            if (sortBy === 'price-desc')
                return b.salePrice - a.salePrice;
            if (sortBy === 'name')
                return a.name.localeCompare(b.name);
            if (sortBy === 'stock')
                return b.totalStock - a.totalStock;
            if (sortBy === 'sold')
                return b.unitsSold - a.unitsSold;
            return 0;
        });
    }, [products, searchQuery, selectedCategory, selectedStatus, sortBy]);
    const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedProducts.length) {
            setSelectedIds([]);
        }
        else {
            setSelectedIds(paginatedProducts.map((p) => p.id));
        }
    };
    const toggleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        }
        else {
            setSelectedIds([...selectedIds, id]);
        }
    };
    return (<div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Product Catalog</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your fashion garments, variants, unstitched fabrics, and luxury collections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/products/new')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
            <Plus className="w-4 h-4"/>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
            <input type="text" placeholder="Search by product name, SKU, or tag..." value={searchQuery} onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
        }} className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-neutral-50/50"/>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select value={selectedCategory} onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
        }} className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 bg-white focus:outline-hidden">
              <option value="All">All Categories</option>
              {categories.map((c) => (<option key={c.id} value={c.name}>
                  {c.name}
                </option>))}
            </select>

            {/* Status Filter */}
            <select value={selectedStatus} onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
        }} className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-700 bg-white focus:outline-hidden">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 border border-neutral-200 rounded-xl bg-white text-xs font-medium text-neutral-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400"/>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent focus:outline-hidden text-neutral-800 font-semibold">
                <option value="newest">Newest Added</option>
                <option value="sold">Top Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="stock">Highest Stock</option>
                <option value="name">Product Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk selection actions */}
        {selectedIds.length > 0 && (<div className="p-2.5 bg-neutral-900 text-white rounded-xl flex items-center justify-between text-xs px-4 animate-in fade-in">
            <span className="font-semibold">{selectedIds.length} products selected</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelectedIds([])} className="text-xs text-neutral-300 hover:text-white px-2 py-1">
                Deselect All
              </button>
            </div>
          </div>)}
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
        {filteredProducts.length === 0 ? (<EmptyState icon={Package} title="No Products Found" description="Try altering your search keywords or removing active category/status filters." actionText="Create Product" onAction={() => navigate('/products/new')}/>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-150 text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="w-10 px-4 py-3.5 text-center">
                    <button type="button" onClick={toggleSelectAll} className="text-neutral-500 hover:text-neutral-900">
                      {selectedIds.length > 0 && selectedIds.length === paginatedProducts.length ? (<CheckSquare className="w-4 h-4 text-neutral-900"/>) : (<Square className="w-4 h-4"/>)}
                    </button>
                  </th>
                  <th className="px-4 py-3.5">Product & SKU</th>
                  <th className="px-3 py-3.5">Category</th>
                  <th className="px-3 py-3.5 text-right">Price</th>
                  <th className="px-3 py-3.5 text-center">Variants</th>
                  <th className="px-3 py-3.5 text-center">Total Stock</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5">Added Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {paginatedProducts.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                return (<tr key={product.id} className={`hover:bg-neutral-50/70 transition-colors ${isSelected ? 'bg-neutral-50' : ''}`}>
                      <td className="px-4 py-3.5 text-center">
                        <button type="button" onClick={() => toggleSelectOne(product.id)} className="text-neutral-500 hover:text-neutral-900">
                          {isSelected ? (<CheckSquare className="w-4 h-4 text-neutral-900"/>) : (<Square className="w-4 h-4"/>)}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}/>
                          <div className="min-w-0">
                            <div onClick={() => navigate(`/products/${product.id}`)} className="font-bold text-neutral-900 hover:text-neutral-700 cursor-pointer truncate max-w-xs">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                              SKU: {product.sku}
                            </div>
                            {product.collection && (<span className="inline-block text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded mt-1 font-medium">
                                {product.collection}
                              </span>)}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="font-semibold text-neutral-700">{product.category}</span>
                        {product.subcategory && (<span className="block text-[10px] text-neutral-400">{product.subcategory}</span>)}
                      </td>
                      <td className="px-3 py-3.5 text-right">
                        <div className="font-bold text-neutral-900">{formatPKR(product.salePrice)}</div>
                        {product.regularPrice > product.salePrice && (<span className="text-[10px] text-neutral-400 line-through">
                            {formatPKR(product.regularPrice)}
                          </span>)}
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-semibold text-[11px]">
                          {product.variants.length} Variants
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${product.totalStock === 0
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : product.totalStock <= product.lowStockThreshold
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                          {product.totalStock} units
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge status={product.status} size="sm"/>
                      </td>
                      <td className="px-3 py-3.5 text-neutral-500 text-[11px]">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => navigate(`/products/${product.id}`)} className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors" title="View Product Details">
                            <Eye className="w-4 h-4"/>
                          </button>
                          <button onClick={() => navigate(`/products/${product.id}/edit`)} className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors" title="Edit Product">
                            <Edit2 className="w-4 h-4"/>
                          </button>
                          <button onClick={() => duplicateProduct(product.id)} className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors" title="Duplicate Product">
                            <Copy className="w-4 h-4"/>
                          </button>
                          <button onClick={() => setDeleteTarget(product)} className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Delete Product">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>
          </div>)}

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredProducts.length} pageSize={pageSize} onPageChange={setCurrentPage}/>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={() => {
            if (deleteTarget) {
                deleteProduct(deleteTarget.id);
                setDeleteTarget(null);
            }
        }} title="Delete Product" message={`Are you sure you want to permanently remove "${deleteTarget?.name}"? All associated inventory records and variant SKUs will be deleted.`} confirmText="Delete Product" type="danger"/>
    </div>);
};
