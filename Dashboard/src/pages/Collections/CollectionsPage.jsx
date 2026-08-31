import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Package, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
export const CollectionsPage = () => {
    const { collections, addCollection, updateCollection, deleteCollection } = useApp();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    // Form State
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80');
    const [season, setSeason] = useState('Festive 2026');
    const [featured, setFeatured] = useState(true);
    const [status, setStatus] = useState('Active');
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10));
    const openCreateModal = () => {
        setEditingCollection(null);
        setName('');
        setSlug('');
        setDescription('');
        setImage('https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80');
        setSeason('Summer 2026');
        setFeatured(true);
        setStatus('Active');
        setStartDate(new Date().toISOString().slice(0, 10));
        setEndDate(new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10));
        setModalOpen(true);
    };
    const openEditModal = (col) => {
        setEditingCollection(col);
        setName(col.name);
        setSlug(col.slug);
        setDescription(col.description);
        setImage(col.image);
        setSeason(col.season || 'Festive');
        setFeatured(col.featured ?? true);
        setStatus(col.status);
        setStartDate(col.startDate.slice(0, 10));
        setEndDate(col.endDate.slice(0, 10));
        setModalOpen(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim())
            return;
        if (editingCollection) {
            updateCollection(editingCollection.id, {
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                description,
                image,
                season,
                featured,
                status,
                startDate,
                endDate,
            });
        }
        else {
            addCollection({
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                description,
                image,
                season,
                featured,
                status,
                startDate,
                endDate,
            });
        }
        setModalOpen(false);
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Fashion Collections & Lookbooks</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Curate couture lookbooks, seasonal drops, festive launches, and capsule wardrobes.
          </p>
        </div>

        <button onClick={openCreateModal} className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
          <Plus className="w-4 h-4"/>
          <span>New Collection Drop</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (<div key={col.id} className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden flex flex-col justify-between group hover:border-neutral-300 transition-all">
            <div>
              {/* Banner with Season Pill & Featured Star */}
              <div className="h-48 relative bg-neutral-100 overflow-hidden">
                <img src={col.image} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent"/>

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-neutral-900 text-xs font-bold rounded-lg shadow-xs">
                    {col.season || 'Seasonal Drop'}
                  </span>
                  {col.featured && (<span className="px-2.5 py-1 bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current"/>
                      <span>Featured</span>
                    </span>)}
                </div>

                <div className="absolute top-3 right-3">
                  <StatusBadge status={col.status} size="sm"/>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-bold font-serif">{col.name}</h3>
                  <p className="text-[11px] text-neutral-200 line-clamp-1">{col.description}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-neutral-400"/>
                  <span className="font-semibold text-neutral-800">{col.productCount} Garments Linked</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">slug: /{col.slug}</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-2">
              <button type="button" onClick={() => openEditModal(col)} className="px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors">
                <Edit2 className="w-3.5 h-3.5"/>
                <span>Edit Collection</span>
              </button>
              <button type="button" onClick={() => setDeleteTarget(col)} className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Collection">
                <Trash2 className="w-4 h-4"/>
              </button>
            </div>
          </div>))}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCollection ? 'Edit Collection' : 'Create Seasonal Collection'} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Collection Title *</label>
            <input type="text" required placeholder="e.g. Eid Festive Collection 2026" value={name} onChange={(e) => {
            setName(e.target.value);
            if (!editingCollection) {
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
            }
        }} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Season / Drop</label>
              <input type="text" placeholder="e.g. Summer 2026" value={season} onChange={(e) => setSeason(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">URL Slug</label>
              <input type="text" placeholder="eid-festive-2026" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-mono text-xs text-neutral-900 focus:outline-hidden"/>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Lookbook Banner Image URL</label>
            <input type="text" placeholder="https://..." value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Story / Description</label>
            <textarea rows={2} placeholder="Theme inspiration, handcrafted embroidery motifs..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden"/>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-semibold text-neutral-900 bg-white">
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"/>
                <span className="font-semibold text-neutral-800">Pin to Homepage Hero</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-neutral-200 rounded-lg font-semibold text-neutral-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold shadow-xs">
              {editingCollection ? 'Update Collection' : 'Create Drop'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={() => {
            if (deleteTarget) {
                deleteCollection(deleteTarget.id);
                setDeleteTarget(null);
            }
        }} title="Delete Collection" message={`Are you sure you want to delete "${deleteTarget?.name}"?`} confirmText="Delete Collection" type="danger"/>
    </div>);
};
