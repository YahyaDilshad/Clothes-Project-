import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload, X, ChevronDown, Loader2 } from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { toast } from 'react-hot-toast';

export const AddEditProductPage = () => {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const { products, addProduct, updateProduct, categories, fetchCategories } = useProductStore();
    
    const fileInputRef = useRef(null);

    // Form States
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [costPrice, setCostPrice] = useState(0);
    const [price, setPrice] = useState(0);
    const [compareAtPrice, setCompareAtPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [lowStockThreshold, setLowStockThreshold] = useState(5);
    const [status, setStatus] = useState('active');
    
    // Media States
    const [imageFiles, setImageFiles] = useState([]); // New files to upload
    const [previews, setPreviews] = useState([]); // Cloudinary URLs + Local previews
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Fetch Categories and Populate Data for Editing
    useEffect(() => {
        fetchCategories();
        
        if (isEditing && id) {
            // Find product (checking both _id and id)
            const existing = products.find((p) => String(p._id) === String(id) || String(p.id) === String(id));
            
            if (existing) {
                setName(existing.name || '');
                setSku(existing.sku || '');
                setDescription(existing.description || '');
                
                // IMPORTANT: Category dropdown needs ID string to match value
                setCategory(existing.category?._id || existing.category || '');
                
                setTagsInput(Array.isArray(existing.tags) ? existing.tags.join(', ') : '');
                setCostPrice(existing.costPrice || 0);
                setPrice(existing.price || 0);
                setCompareAtPrice(existing.compareAtPrice || 0);
                setStock(existing.stock || 0);
                setLowStockThreshold(existing.lowStockThreshold || 5);
                setStatus(existing.status || 'active');
                
                // Set images previews from Cloudinary objects [{url, publicId}]
                if (existing.images && Array.isArray(existing.images)) {
                    setPreviews(existing.images.map(img => img.url));
                }
            }
        }
    }, [isEditing, id, products, fetchCategories]);

    // 2. Handle Image Selection
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(prev => [...prev, ...files]);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setPreviews(prev => [...prev, reader.result]);
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        // Note: This logic assumes new images are appended at the end of previews
        // For a more complex existing vs new image logic, you'd need separate states
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    // 3. Form Submission
    const handleSubmit = async (finalStatus = status) => {
        if (!name || !sku || !price || !category) {
            toast.error("Name, SKU, Price, and Category are required!");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();

        // Data appending
        formData.append('name', name);
        formData.append('sku', sku);
        formData.append('description', description);
        formData.append('category', category); // Sending the Category ID string
        formData.append('price', Number(price));
        formData.append('compareAtPrice', Number(compareAtPrice));
        formData.append('costPrice', Number(costPrice));
        formData.append('stock', Number(stock));
        formData.append('lowStockThreshold', Number(lowStockThreshold));
        formData.append('status', finalStatus);

        // Tags parsing
        if (tagsInput) {
            tagsInput.split(',').forEach(tag => {
                if (tag.trim()) formData.append('tags', tag.trim());
            });
        }

        // New Images appending
        imageFiles.forEach((file) => {
            formData.append('images', file);
        });

        try {
            if (isEditing) {
                await updateProduct(id, formData);
            } else {
                await addProduct(formData);
            }
            navigate('/products');
        } catch (error) {
            console.error("Submission failed", error);
            // Error toast usually handled in Store
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 px-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate('/products')} className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors">
                        <ArrowLeft className="w-4 h-4"/>
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 tracking-tight font-serif italic">
                            {isEditing ? 'Modify Product' : 'Add New Product'}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        disabled={isSubmitting}
                        type="button" 
                        onClick={() => handleSubmit('draft')} 
                        className="px-4 py-2 border border-neutral-200 rounded-xl text-xs font-bold bg-white hover:bg-neutral-50 transition-all disabled:opacity-50"
                    >
                        Save as Draft
                    </button>
                    <button 
                        disabled={isSubmitting}
                        type="button" 
                        onClick={() => handleSubmit('active')} 
                        className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        {isEditing ? 'Update Product' : 'Publish Product'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Primary Details */}
                    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b pb-3">1. Primary Details</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Product Name *</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none focus:border-neutral-900" placeholder="Product Title" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase">SKU / Model *</label>
                                    <input type="text" value={sku} onChange={(e) => setSku(e.target.value.toUpperCase())} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono outline-none focus:border-neutral-900" placeholder="SKU-001" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase">Description</label>
                                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-900" placeholder="Provide details about the product..." />
                            </div>
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b pb-3">2. Pricing (PKR)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase">Cost Price</label>
                                <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase">Sale Price *</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-[#B08D57] outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase">Regular Price</label>
                                <input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Categorization */}
                    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b pb-3">3. Categorization</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase">Category *</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase">Tags (comma separated)</label>
                                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none" placeholder="Summer, Casual, New" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Media */}
                    <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b pb-3">Images</h3>
                        <div 
                            onClick={() => fileInputRef.current.click()} 
                            className="relative h-64 w-full border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 cursor-pointer overflow-hidden transition-all"
                        >
                            {previews.length > 0 ? (
                                <img src={previews[previews.length - 1]} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-neutral-300 mb-2" />
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Click to Upload</span>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {previews.map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-lg border border-neutral-200 overflow-hidden group">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeImage(i)} 
                                        className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b pb-3">Inventory</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase">Quantity in Stock</label>
                                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase">Low Stock Threshold</label>
                                <input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};