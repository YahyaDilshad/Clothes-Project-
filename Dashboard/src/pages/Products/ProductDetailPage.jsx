import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Copy, Trash2, Package, Truck, } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StockAdjustmentModal } from '../../components/inventory/StockAdjustmentModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatPKR, formatDate } from '../../utils/formatters';
export const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, deleteProduct, duplicateProduct, inventory } = useApp();
    const product = products.find((p) => p.id === id);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [stockModalItem, setStockModalItem] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    if (!product) {
        return (<div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
        <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3"/>
        <h2 className="text-lg font-bold text-neutral-900">Product Not Found</h2>
        <p className="text-xs text-neutral-500 mt-1 mb-4">
          The requested product does not exist or was removed.
        </p>
        <button onClick={() => navigate('/products')} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold">
          Return to Catalog
        </button>
      </div>);
    }
    // Simulated sales history per variant
    const variantSalesData = product.variants.map((v) => ({
        variant: `${v.size} (${v.color})`,
        sold: v.sold || Math.floor(Math.random() * 60) + 10,
        stock: v.stock,
    }));
    const handleAdjustVariant = (variantSku) => {
        const invItem = inventory.find((i) => i.sku === variantSku);
        if (invItem) {
            setStockModalItem(invItem);
        }
        else {
            // Fallback
            setStockModalItem({
                id: `temp-${variantSku}`,
                productId: product.id,
                productName: product.name,
                productImage: product.images[0],
                sku: variantSku,
                category: product.category,
                color: product.variants.find((v) => v.sku === variantSku)?.color || 'Standard',
                size: product.variants.find((v) => v.sku === variantSku)?.size || 'Standard',
                currentStock: product.variants.find((v) => v.sku === variantSku)?.stock || 0,
                reserved: 0,
                available: product.variants.find((v) => v.sku === variantSku)?.stock || 0,
                lowStockLimit: product.lowStockThreshold,
                status: 'In Stock',
                lastUpdated: new Date().toISOString(),
            });
        }
    };
    return (<div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/products')} className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors">
            <ArrowLeft className="w-4 h-4"/>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">{product.name}</h2>
              <StatusBadge status={product.status} size="sm"/>
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              SKU: {product.sku} • {product.category} • Added {formatDate(product.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/products/${product.id}/edit`)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors">
            <Edit2 className="w-3.5 h-3.5"/>
            <span>Edit Product</span>
          </button>
          <button onClick={() => duplicateProduct(product.id)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors">
            <Copy className="w-3.5 h-3.5"/>
            <span>Duplicate</span>
          </button>
          <button onClick={() => setDeleteDialogOpen(true)} className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors" title="Delete Product">
            <Trash2 className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
            <div className="aspect-4/5 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 relative">
              <img src={product.images[selectedImageIndex] || product.images[0]} alt={product.name} className="w-full h-full object-cover"/>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (<div className="grid grid-cols-4 gap-2 mt-3">
                {product.images.map((img, idx) => (<button key={idx} type="button" onClick={() => setSelectedImageIndex(idx)} className={`aspect-square rounded-lg border overflow-hidden transition-all ${selectedImageIndex === idx
                    ? 'ring-2 ring-neutral-900 border-transparent'
                    : 'border-neutral-200 opacity-70 hover:opacity-100'}`}>
                    <img src={img} alt="Thumb" className="w-full h-full object-cover"/>
                  </button>))}
              </div>)}
          </div>

          {/* Logistics & Warehouse card */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 text-xs">
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Truck className="w-4 h-4"/>
              <span>Logistics & Fulfillment</span>
            </h4>
            <div className="divide-y divide-neutral-100">
              <div className="py-2 flex justify-between">
                <span className="text-neutral-500">Warehouse:</span>
                <span className="font-semibold text-neutral-800">{product.warehouse}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-500">Weight:</span>
                <span className="font-semibold text-neutral-800">{product.weight} kg</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-500">Dimensions (L×W×H):</span>
                <span className="font-semibold text-neutral-800">
                  {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-500">Low Stock Limit:</span>
                <span className="font-bold text-amber-700">{product.lowStockThreshold} units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Product Info & Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Sale Price</span>
              <div className="text-lg font-bold text-neutral-900 mt-1">{formatPKR(product.salePrice)}</div>
              {product.regularPrice > product.salePrice && (<span className="text-[10px] text-neutral-400 line-through">
                  {formatPKR(product.regularPrice)}
                </span>)}
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Stock</span>
              <div className="text-lg font-bold text-neutral-900 mt-1">{product.totalStock} units</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Across {product.variants.length} sizes</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Units Sold</span>
              <div className="text-lg font-bold text-neutral-900 mt-1">{product.unitsSold}</div>
              <span className="text-[10px] text-neutral-500">Lifetime volume</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Revenue</span>
              <div className="text-lg font-bold text-neutral-900 mt-1">{formatPKR(product.revenue)}</div>
              <span className="text-[10px] text-neutral-500">Cumulative gross</span>
            </div>
          </div>

          {/* Description & Attributes */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Garment Details & Description
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-100 text-xs">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-semibold text-neutral-900">{product.category}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Collection</span>
                <span className="font-semibold text-neutral-900">{product.collection}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Brand</span>
                <span className="font-semibold text-neutral-900">{product.brand}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold mb-1.5">Product Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (<span key={tag} className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 rounded-md text-[11px] font-medium">
                    #{tag}
                  </span>))}
              </div>
            </div>
          </div>

          {/* Variant Inventory Table */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Variant Inventory Breakdown
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">Real-time stock distribution by size and color</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-100">
                  <tr>
                    <th className="px-5 py-3">Color</th>
                    <th className="px-3 py-3">Size</th>
                    <th className="px-3 py-3">SKU</th>
                    <th className="px-3 py-3 text-right">Price</th>
                    <th className="px-3 py-3 text-right">Stock</th>
                    <th className="px-3 py-3 text-right">Sold</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {product.variants.map((v) => {
            const status = v.stock === 0 ? 'Out of Stock' : v.stock <= product.lowStockThreshold ? 'Low Stock' : 'In Stock';
            return (<tr key={v.id} className="hover:bg-neutral-50/60">
                        <td className="px-5 py-3 font-semibold text-neutral-900">{v.color}</td>
                        <td className="px-3 py-3 font-bold text-neutral-900">{v.size}</td>
                        <td className="px-3 py-3 font-mono text-neutral-500 text-[11px]">{v.sku}</td>
                        <td className="px-3 py-3 text-right font-bold text-neutral-900">{formatPKR(v.price)}</td>
                        <td className="px-3 py-3 text-right font-extrabold text-neutral-900">{v.stock}</td>
                        <td className="px-3 py-3 text-right font-semibold text-neutral-500">{v.sold || 0}</td>
                        <td className="px-3 py-3">
                          <StatusBadge status={status} size="sm"/>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button type="button" onClick={() => handleAdjustVariant(v.sku)} className="px-2.5 py-1 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
                            Adjust Stock
                          </button>
                        </td>
                      </tr>);
        })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Sales Analytics Chart */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Variant Velocity vs. Remaining Stock
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">Sales performance across sizing options</p>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={variantSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="variant" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fill: '#64748b', fontSize: 11 }}/>
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }}/>
                  <Tooltip contentStyle={{ backgroundColor: '#171717', color: '#fff', borderRadius: '12px', fontSize: '11px' }}/>
                  <Bar dataKey="sold" fill="#171717" radius={[4, 4, 0, 0]} name="Units Sold"/>
                  <Bar dataKey="stock" fill="#a3a3a3" radius={[4, 4, 0, 0]} name="In Stock"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal isOpen={Boolean(stockModalItem)} onClose={() => setStockModalItem(null)} item={stockModalItem}/>

      {/* Delete Dialog */}
      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={() => {
            deleteProduct(product.id);
            navigate('/products');
        }} title="Delete Product" message={`Are you sure you want to permanently delete "${product.name}"?`} confirmText="Delete Product" type="danger"/>
    </div>);
};
