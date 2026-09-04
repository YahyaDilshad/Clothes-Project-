import React, { useState, useRef, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Package,
    X,
    Image as ImageIcon,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { cn } from '../../utils/cn';

export const CategoriesPage = () => {
    // Zustand Store Integration
    const {
        categories = [],
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        products = [],
        fetchProducts,
        isLoading
    } = useProductStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fileInputRef = useRef(null);

    // Initial Data Fetching
    useEffect(() => {
        fetchCategories();

        if (products.length === 0) {
            fetchProducts();
        }
    }, []);

    // --- Options for Size/Specs ---
    const sizeOptions = [
        "Standard",
        "Small (S)",
        "Medium (M)",
        "Large (L)",
        "Extra Large (XL)",
        "Unstitched (3PC)",
        "Unstitched (2PC)",
        "Kurti / Single",
        "A4 (Catalogs)",
        "Free Size",
        "Custom Fit"
    ];

    // Form State
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');

    // IMPORTANT:
    // imagePreview = sirf preview ke liye
    // imageFile = actual File jo backend ko jayegi
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [sizeSpecs, setSizeSpecs] = useState('Standard');
    const [subcategoriesInput, setSubcategoriesInput] = useState('');
    const [status, setStatus] = useState('Active');

    // =========================================================
    // IMAGE CHANGE
    // =========================================================
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Actual file save karo
        setImageFile(file);

        // Base64 mat banao.
        // Browser ka temporary object URL preview ke liye use karo.
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    // =========================================================
    // CREATE MODAL
    // =========================================================
    const openCreateModal = () => {
        setEditingCategory(null);

        setName('');
        setSlug('');
        setDescription('');
        setImagePreview(null);
        setImageFile(null);
        setSizeSpecs('Standard');
        setSubcategoriesInput('');
        setStatus('Active');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setModalOpen(true);
    };

    // =========================================================
    // EDIT MODAL
    // =========================================================
    const openEditModal = (cat) => {
        setEditingCategory(cat);

        setName(cat.name || '');
        setSlug(cat.slug || '');
        setDescription(cat.description || '');

        // Existing Cloudinary image sirf preview ke liye
        setImagePreview(
            cat.image?.url ||
            cat.image ||
            null
        );

        // Existing image ko File state mein mat rakho.
        // Nayi image select hone par hi imageFile set hoga.
        setImageFile(null);

        setSizeSpecs(cat.sizeSpecs || 'Standard');

        setSubcategoriesInput(
            Array.isArray(cat.subcategories)
                ? cat.subcategories.join(', ')
                : ''
        );

        setStatus(cat.status || 'Active');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setModalOpen(true);
    };

    // =========================================================
    // SUBMIT
    // =========================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) return;

        const subcategories = subcategoriesInput
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        // =====================================================
        // IMPORTANT:
        // JSON object nahi banana.
        // FormData banana hai because image actual File hai.
        // =====================================================
        const formData = new FormData();

        formData.append('name', name.trim());

        formData.append(
            'slug',
            slug.trim() ||
            name
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
        );

        formData.append('description', description || '');

        formData.append('sizeSpecs', sizeSpecs);

        formData.append(
            'subcategories',
            JSON.stringify(subcategories)
        );

        formData.append('status', status);

        // =====================================================
        // ONLY send image if user selected a NEW file
        // =====================================================
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            // Check for both id and _id
            const idToUpdate =
                editingCategory?.id ||
                editingCategory?._id;

            if (editingCategory) {
                await updateCategory(
                    idToUpdate,
                    formData
                );
            } else {
                await addCategory(formData);
            }

            setModalOpen(false);

            // Reset image state
            setImageFile(null);
            setImagePreview(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error) {
            console.error(
                "Submission failed",
                error
            );
        }
    };

    // Ensure categories is always an array
    const safeCategories = Array.isArray(categories)
        ? categories
        : [];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight font-serif italic">
                        Categories & Lines
                    </h2>

                    <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-medium">
                        Faisal Kamir Catalog Management
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                </button>
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />

                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">
                        Syncing Catalogs...
                    </p>
                </div>
            ) : safeCategories.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-neutral-200">
                    <Package className="w-12 h-12 text-neutral-200 mx-auto mb-4" />

                    <h3 className="text-sm font-bold text-neutral-900">
                        No Categories Found
                    </h3>

                    <p className="text-xs text-neutral-500 mt-1">
                        Start by adding your first product line.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {safeCategories.map((cat) => {

                        const productCount =
                            products?.filter(
                                (p) => p.category === cat.name
                            ).length || 0;

                        const catId =
                            cat.id ||
                            cat._id;

                        // Support both:
                        // image: "url"
                        // image: { url, publicId }
                        const categoryImage =
                            cat.image?.url ||
                            cat.image ||
                            null;

                        return (
                            <div
                                key={catId}
                                className="bg-white rounded-3xl border border-neutral-200 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
                            >

                                <div className="h-44 relative bg-neutral-100 overflow-hidden">

                                    {categoryImage ? (
                                        <img
                                            src={categoryImage}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-10 h-10 text-neutral-300" />
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4">
                                        <StatusBadge
                                            status={cat.status}
                                            size="sm"
                                        />
                                    </div>

                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-black uppercase text-neutral-900 border border-white/20">
                                        Spec: {cat.sizeSpecs}
                                    </div>

                                    <div className="absolute bottom-4 left-4 bg-neutral-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                                        <Package className="w-3 h-3" />
                                        {productCount} Items
                                    </div>

                                </div>

                                <div className="p-6 flex-1 space-y-4">

                                    <h3 className="text-lg font-bold text-neutral-900">
                                        {cat.name}
                                    </h3>

                                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                                        {cat.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {cat.subcategories?.map(
                                            (sub, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold rounded-lg"
                                                >
                                                    {sub}
                                                </span>
                                            )
                                        )}
                                    </div>

                                </div>

                                <div className="px-6 py-4 border-t border-neutral-50 bg-neutral-50/50 flex items-center justify-end gap-2">

                                    <button
                                        onClick={() =>
                                            openEditModal(cat)
                                        }
                                        className="p-2 bg-white border border-neutral-200 rounded-xl text-neutral-500 hover:text-neutral-900 transition-colors shadow-sm"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() =>
                                            setDeleteTarget(cat)
                                        }
                                        className="p-2 bg-white border border-neutral-200 rounded-xl text-neutral-400 hover:text-rose-600 transition-colors shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={
                    editingCategory
                        ? 'Modify Category'
                        : 'Create Category'
                }
                maxWidth="md"
            >

                <form
                    onSubmit={handleSubmit}
                    className="p-2 space-y-5"
                >

                    {/* IMAGE */}
                    <div className="space-y-2 text-center">

                        <div
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="relative h-44 w-full border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-all cursor-pointer overflow-hidden group"
                        >

                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                />
                            ) : (
                                <div className="p-4 flex flex-col items-center">

                                    <ImageIcon className="w-8 h-8 text-neutral-300 mb-2" />

                                    <span className="text-[11px] font-bold text-neutral-500">
                                        Click to Upload Category Banner
                                    </span>

                                </div>
                            )}

                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                            onChange={handleImageChange}
                        />

                    </div>

                    {/* NAME + SIZE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="space-y-1">

                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                Category Name
                            </label>

                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-neutral-900 transition-all"
                            />

                        </div>

                        <div className="space-y-1 relative">

                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                Size / Spec Option
                            </label>

                            <div className="relative">

                                <select
                                    value={sizeSpecs}
                                    onChange={(e) =>
                                        setSizeSpecs(e.target.value)
                                    }
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-neutral-900 appearance-none transition-all cursor-pointer"
                                >
                                    {sizeOptions.map((opt) => (
                                        <option
                                            key={opt}
                                            value={opt}
                                        >
                                            {opt}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />

                            </div>

                        </div>

                    </div>

                    {/* SUBCATEGORIES */}
                    <div className="space-y-1">

                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                            Subcategories (Comma separated)
                        </label>

                        <input
                            type="text"
                            placeholder="Formal, Festive, Casual"
                            value={subcategoriesInput}
                            onChange={(e) =>
                                setSubcategoriesInput(
                                    e.target.value
                                )
                            }
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-neutral-900"
                        />

                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-1">

                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                            Description
                        </label>

                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-neutral-900"
                        />

                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-3 pt-4">

                        <button
                            type="button"
                            onClick={() =>
                                setModalOpen(false)
                            }
                            className="flex-1 py-3 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 shadow-lg transition-all"
                        >
                            {editingCategory
                                ? 'Update Line'
                                : 'Create Line'}
                        </button>

                    </div>

                </form>

            </Modal>

            {/* DELETE */}
            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                onClose={() =>
                    setDeleteTarget(null)
                }
                onConfirm={() => {

                    const idToDelete =
                        deleteTarget.id ||
                        deleteTarget._id;

                    deleteCategory(idToDelete);

                    setDeleteTarget(null);
                }}
                title="Delete Line"
                message={`Are you sure you want to remove the "${deleteTarget?.name}" catalog line?`}
                confirmText="Delete Now"
                type="danger"
            />

        </div>
    );
};