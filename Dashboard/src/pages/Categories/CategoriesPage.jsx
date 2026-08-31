import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
export const CategoriesPage = () => {
    const { categories, addCategory, updateCategory, deleteCategory, products } = useApp();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    // Form State
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80');
    const [subcategoriesInput, setSubcategoriesInput] = useState('');
    const [status, setStatus] = useState('Active');
    const [featured, setFeatured] = useState(true);
    const openCreateModal = () => {
        setEditingCategory(null);
        setName('');
        setSlug('');
        setDescription('');
        setImage('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80');
        setSubcategoriesInput('Stitched, Unstitched, Festive');
        setStatus('Active');
        setFeatured(true);
        setModalOpen(true);
    };
    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setName(cat.name);
        setSlug(cat.slug);
        setDescription(cat.description || '');
        setImage(cat.image);
        setSubcategoriesInput(cat.subcategories ? cat.subcategories.join(', ') : 'Stitched, Unstitched');
        setStatus(cat.status);
        setFeatured(cat.featured);
        setModalOpen(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim())
            return;
        const subcategories = subcategoriesInput.split(',').map((s) => s.trim()).filter(Boolean);
        if (editingCategory) {
            updateCategory(editingCategory.id, {
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                description,
                image,
                subcategories,
                status,
                featured,
            });
        }
        else {
            addCategory({
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                description,
                image,
                subcategories,
                status,
                featured,
            });
        }
        setModalOpen(false);
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Categories & Departments</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Organize fashion catalog taxonomies, fabrics, stitched and unstitched lines.
          </p>
        </div>

        <button onClick={openCreateModal} className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
          <Plus className="w-4 h-4"/>
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
            const productCount = products.filter((p) => p.category === cat.name).length;
            const subcategories = cat.subcategories || ['Stitched', 'Formal'];
            return (<div key={cat.id} className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-neutral-300 transition-all">
              <div>
                {/* Category Banner Image */}
                <div className="h-40 relative bg-neutral-100 overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={cat.status} size="sm"/>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-neutral-950/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5"/>
                    <span>{productCount} Products</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">{cat.name}</h3>
                    <p className="text-[11px] text-neutral-400 font-mono">slug: /{cat.slug}</p>
                    {cat.description && (<p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>)}
                  </div>

                  {/* Subcategories */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                      Subcategories
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {subcategories.map((sub) => (<span key={sub} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[11px] font-medium rounded-md">
                          {sub}
                        </span>))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-2">
                <button type="button" onClick={() => openEditModal(cat)} className="px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors">
                  <Edit2 className="w-3.5 h-3.5"/>
                  <span>Edit</span>
                </button>
                <button type="button" onClick={() => setDeleteTarget(cat)} className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Category">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>);
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Add Category'} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Category Name *</label>
            <input type="text" required placeholder="e.g. Waistcoats" value={name} onChange={(e) => {
            setName(e.target.value);
            if (!editingCategory) {
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
            }
        }} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">URL Slug</label>
            <input type="text" placeholder="e.g. waistcoats" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-mono text-xs text-neutral-900 focus:outline-hidden"/>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Banner Image URL</label>
            <input type="text" placeholder="https://..." value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Description</label>
            <textarea rows={2} placeholder="Brief summary of fabrics and design cuts..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden"/>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Subcategories (Comma separated)</label>
            <input type="text" placeholder="Formal, Raw Silk, Jamawar, Casual" value={subcategoriesInput} onChange={(e) => setSubcategoriesInput(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-semibold text-neutral-900 bg-white">
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-neutral-200 rounded-lg font-semibold text-neutral-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold shadow-xs">
              {editingCategory ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={() => {
            if (deleteTarget) {
                deleteCategory(deleteTarget.id);
                setDeleteTarget(null);
            }
        }} title="Delete Category" message={`Are you sure you want to delete "${deleteTarget?.name}"?`} confirmText="Delete Category" type="danger"/>
    </div>);
};
