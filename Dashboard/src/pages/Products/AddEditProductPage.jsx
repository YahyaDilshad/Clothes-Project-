import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, Sparkles, Truck, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const AVAILABLE_COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Navy Blue', hex: '#1e3a8a' },
    { name: 'Charcoal Grey', hex: '#4b5563' },
    { name: 'Camel Beige', hex: '#d97706' },
    { name: 'Walnut Brown', hex: '#78350f' },
    { name: 'Emerald Green', hex: '#047857' },
    { name: 'Maroon', hex: '#881337' },
];
export const AddEditProductPage = () => {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const { products, addProduct, updateProduct, categories, collections } = useApp();
    // Form State
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0]?.name || 'Kurta');
    const [subcategory, setSubcategory] = useState('Men Stitched');
    const [collection, setCollection] = useState(collections[0]?.name || 'Eid Collection 2026');
    const [brand, setBrand] = useState('Naveed & Co.');
    const [tagsInput, setTagsInput] = useState('Kurta, Cotton, Festive, New Arrival');
    // Pricing
    const [costPrice, setCostPrice] = useState(2500);
    const [regularPrice, setRegularPrice] = useState(4999);
    const [salePrice, setSalePrice] = useState(4299);
    const [tax, setTax] = useState(200);
    // Images
    const [images, setImages] = useState([
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    ]);
    const [newImageUrl, setNewImageUrl] = useState('');
    // Selected for matrix generator
    const [selectedSizes, setSelectedSizes] = useState(['S', 'M', 'L']);
    const [selectedColors, setSelectedColors] = useState(['Black']);
    // Variants list
    const [variants, setVariants] = useState([
        { id: 'v-1', color: 'Black', size: 'S', sku: 'PBK-001-S', price: 4299, stock: 20 },
        { id: 'v-2', color: 'Black', size: 'M', sku: 'PBK-001-M', price: 4299, stock: 35 },
        { id: 'v-3', color: 'Black', size: 'L', sku: 'PBK-001-L', price: 4299, stock: 12 },
    ]);
    // Inventory & Warehouse
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [warehouse, setWarehouse] = useState('Main Lahore Hub - Rack B2');
    // Shipping
    const [weight, setWeight] = useState(0.5);
    const [length, setLength] = useState(35);
    const [width, setWidth] = useState(25);
    const [height, setHeight] = useState(4);
    // Status
    const [status, setStatus] = useState('Active');
    // Populate if editing
    useEffect(() => {
        if (isEditing && id) {
            const existing = products.find((p) => p.id === id);
            if (existing) {
                setName(existing.name);
                setSku(existing.sku);
                setDescription(existing.description);
                setCategory(existing.category);
                setSubcategory(existing.subcategory || '');
                setCollection(existing.collection);
                setBrand(existing.brand);
                setTagsInput(existing.tags.join(', '));
                setCostPrice(existing.costPrice);
                setRegularPrice(existing.regularPrice);
                setSalePrice(existing.salePrice);
                setTax(existing.tax);
                setImages(existing.images);
                setVariants(existing.variants);
                setLowStockThreshold(existing.lowStockThreshold);
                setWarehouse(existing.warehouse);
                setWeight(existing.weight);
                setLength(existing.dimensions.length);
                setWidth(existing.dimensions.width);
                setHeight(existing.dimensions.height);
                setStatus(existing.status);
            }
        }
    }, [isEditing, id, products]);
    // Regenerate matrix when sizes or colors change
    const handleGenerateMatrix = () => {
        const newVariants = [];
        const baseSku = sku || 'PROD';
        selectedColors.forEach((color) => {
            selectedSizes.forEach((size) => {
                const colorCode = color.slice(0, 2).toUpperCase();
                newVariants.push({
                    id: `v-${Date.now()}-${color}-${size}`,
                    color,
                    size,
                    sku: `${baseSku}-${colorCode}-${size}`,
                    price: Number(salePrice) || 3999,
                    stock: 20,
                });
            });
        });
        if (newVariants.length > 0) {
            setVariants(newVariants);
        }
    };
    const handleUpdateVariant = (index, field, value) => {
        const updated = [...variants];
        updated[index] = { ...updated[index], [field]: value };
        setVariants(updated);
    };
    const handleRemoveVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };
    const handleAddCustomVariant = () => {
        setVariants([
            ...variants,
            {
                id: `v-${Date.now()}`,
                color: selectedColors[0] || 'Black',
                size: 'M',
                sku: `${sku || 'PROD'}-CUSTOM-${variants.length + 1}`,
                price: salePrice,
                stock: 10,
            },
        ]);
    };
    const handleAddImage = () => {
        if (newImageUrl.trim()) {
            setImages([...images, newImageUrl.trim()]);
            setNewImageUrl('');
        }
    };
    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };
    const handleSubmit = (finalStatus = status) => {
        if (!name.trim() || !sku.trim()) {
            alert('Please fill out Product Name and SKU.');
            return;
        }
        const totalStock = variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
        const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
        const productPayload = {
            name,
            sku,
            description,
            category,
            subcategory,
            collection,
            brand,
            tags,
            costPrice: Number(costPrice),
            regularPrice: Number(regularPrice),
            salePrice: Number(salePrice),
            tax: Number(tax),
            discountPercentage: regularPrice > salePrice
                ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
                : 0,
            images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'],
            totalStock,
            lowStockThreshold: Number(lowStockThreshold),
            warehouse,
            weight: Number(weight),
            dimensions: {
                length: Number(length),
                width: Number(width),
                height: Number(height),
            },
            status: finalStatus,
            variants,
        };
        if (isEditing && id) {
            updateProduct(id, productPayload);
            navigate(`/products/${id}`);
        }
        else {
            const created = addProduct(productPayload);
            navigate(`/products/${created.id}`);
        }
    };
    return (<div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/products')} className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors">
            <ArrowLeft className="w-4 h-4"/>
          </button>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              {isEditing ? 'Edit Apparel Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Specify garment specifications, pricing, size matrix, and images.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate('/products')} className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={() => handleSubmit('Draft')} className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors">
            Save as Draft
          </button>
          <button type="button" onClick={() => handleSubmit('Active')} className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
            {isEditing ? 'Update & Publish' : 'Publish Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
              1. Basic Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input type="text" required placeholder="e.g., Premium Black Kurta with Resham Embroidery" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Base SKU <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" required placeholder="e.g., PBK-001" value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-mono text-xs font-semibold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"/>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Brand Name</label>
                  <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Product Description</label>
                <textarea rows={4} placeholder="Describe the fabric weave, collar style, buttons, occasion, and wash instructions..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 leading-relaxed"/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-800 bg-white focus:outline-hidden">
                    {categories.map((c) => (<option key={c.id} value={c.name}>
                        {c.name}
                      </option>))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Subcategory</label>
                  <input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder="e.g. Men Stitched, Formal" className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Collection</label>
                  <select value={collection} onChange={(e) => setCollection(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-800 bg-white focus:outline-hidden">
                    {collections.map((col) => (<option key={col.id} value={col.name}>
                        {col.name}
                      </option>))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Tags (Comma separated)</label>
                <input type="text" placeholder="e.g. Kurta, Black, Cotton, Eid, Festive" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3 flex items-center justify-between">
              <span>2. Pricing & Costing (PKR)</span>
              <span className="text-[11px] font-semibold text-neutral-500 lowercase">
                Profit Margin: {regularPrice > costPrice ? `${Math.round(((regularPrice - costPrice) / regularPrice) * 100)}%` : '0%'}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Cost Price</label>
                <input type="number" min="0" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-hidden"/>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">Unit production cost</span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Regular Price</label>
                <input type="number" min="0" value={regularPrice} onChange={(e) => setRegularPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-hidden"/>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">List / MSRP price</span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Sale Price</label>
                <input type="number" min="0" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-emerald-700 bg-emerald-50/40 focus:outline-hidden"/>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">Actual customer checkout</span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Tax Amount</label>
                <input type="number" min="0" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-hidden"/>
                <span className="text-[10px] text-neutral-400 mt-0.5 block">GST / Sales Tax</span>
              </div>
            </div>
          </div>

          {/* Section 3: Variants Matrix Generator */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  3. Product Variants Matrix
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Select available sizes & colors to generate all SKU combinations
                </p>
              </div>

              <button type="button" onClick={handleGenerateMatrix} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl text-xs font-semibold transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-neutral-700"/>
                <span>Auto-Generate Matrix</span>
              </button>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Available Sizes</label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (<button key={size} type="button" onClick={() => setSelectedSizes(isSelected ? selectedSizes.filter((s) => s !== size) : [...selectedSizes, size])} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isSelected
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>
                      {size}
                    </button>);
        })}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Available Colors</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COLORS.map((c) => {
            const isSelected = selectedColors.includes(c.name);
            return (<button key={c.name} type="button" onClick={() => setSelectedColors(isSelected ? selectedColors.filter((col) => col !== c.name) : [...selectedColors, c.name])} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}>
                      <span className="w-3 h-3 rounded-full border border-neutral-300 shrink-0" style={{ backgroundColor: c.hex }}/>
                      <span>{c.name}</span>
                    </button>);
        })}
              </div>
            </div>

            {/* Variant Matrix Table */}
            <div className="mt-4 border border-neutral-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-200">
                  <tr>
                    <th className="px-3 py-2.5">Color</th>
                    <th className="px-3 py-2.5">Size</th>
                    <th className="px-3 py-2.5">Variant SKU</th>
                    <th className="px-3 py-2.5 text-right">Price (PKR)</th>
                    <th className="px-3 py-2.5 text-right">Stock</th>
                    <th className="w-10 px-3 py-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {variants.length === 0 ? (<tr>
                      <td colSpan={6} className="py-6 text-center text-xs text-neutral-400">
                        No variants generated. Click "Auto-Generate Matrix" above.
                      </td>
                    </tr>) : (variants.map((v, idx) => (<tr key={v.id || idx} className="hover:bg-neutral-50/50">
                        <td className="px-3 py-2 font-medium text-neutral-800">{v.color}</td>
                        <td className="px-3 py-2 font-bold text-neutral-900">{v.size}</td>
                        <td className="px-3 py-2">
                          <input type="text" value={v.sku} onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)} className="w-full font-mono text-xs px-2 py-1 border border-neutral-200 rounded-md"/>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input type="number" value={v.price} onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))} className="w-24 font-bold text-xs text-right px-2 py-1 border border-neutral-200 rounded-md"/>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input type="number" value={v.stock} onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))} className="w-20 font-bold text-xs text-right px-2 py-1 border border-neutral-200 rounded-md"/>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-neutral-400 hover:text-rose-600 p-1">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </td>
                      </tr>)))}
                </tbody>
              </table>
            </div>

            <button type="button" onClick={handleAddCustomVariant} className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 inline-flex items-center gap-1">
              <Plus className="w-3.5 h-3.5"/>
              <span>Add Custom Variant Row</span>
            </button>
          </div>
        </div>

        {/* Right 1 Column: Images, Inventory, Shipping & Status */}
        <div className="space-y-6">
          {/* Section: Status */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Product Status</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 bg-neutral-50">
              <option value="Active">Active (Visible in Store)</option>
              <option value="Draft">Draft (Hidden)</option>
              <option value="Archived">Archived (Discontinued)</option>
            </select>
          </div>

          {/* Section: Images */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Product Images Gallery
            </h3>

            {/* Main Image Preview */}
            <div className="relative aspect-4/5 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 group">
              {images[0] ? (<img src={images[0]} alt="Main Product" className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 text-xs">
                  <ImageIcon className="w-8 h-8 mb-2"/>
                  <span>No image uploaded</span>
                </div>)}
              {images[0] && (<span className="absolute bottom-2 left-2 bg-neutral-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Cover Photo
                </span>)}
            </div>

            {/* Additional Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((imgUrl, i) => (<div key={i} className="relative aspect-square rounded-lg border border-neutral-200 overflow-hidden group">
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover"/>
                  <button type="button" onClick={() => handleRemoveImage(i)} className="absolute inset-0 bg-neutral-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>))}
            </div>

            {/* Add Image URL */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="block text-[11px] font-semibold text-neutral-700">Add Image URL</label>
              <div className="flex gap-2">
                <input type="text" placeholder="https://images.unsplash.com/..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="flex-1 px-2.5 py-1.5 border border-neutral-200 rounded-lg text-xs"/>
                <button type="button" onClick={handleAddImage} className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold">
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Section: Inventory & Warehouse */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs">
              Warehouse & Inventory
            </h3>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Warehouse Location</label>
              <input type="text" value={warehouse} onChange={(e) => setWarehouse(e.target.value)} placeholder="e.g. Main Lahore Hub - Rack B2" className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Low-Stock Alert Threshold</label>
              <input type="number" min="1" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900"/>
              <span className="text-[10px] text-neutral-400 mt-0.5 block">
                Triggers notification when stock falls below this value
              </span>
            </div>
          </div>

          {/* Section: Shipping & Dimensions */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5"/>
              <span>Shipping Dimensions</span>
            </h3>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.05" min="0" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900"/>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-medium text-neutral-600 text-[10px] mb-0.5">L (cm)</label>
                <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold"/>
              </div>
              <div>
                <label className="block font-medium text-neutral-600 text-[10px] mb-0.5">W (cm)</label>
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold"/>
              </div>
              <div>
                <label className="block font-medium text-neutral-600 text-[10px] mb-0.5">H (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
