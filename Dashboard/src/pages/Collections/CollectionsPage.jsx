import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CollectionsPage = () => {
    const { 
        collections = [], 
        fetchCollections, 
        addCollection, 
        updateCollection, 
        deleteCollection, 
        isLoading 
    } = useProductStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Form States
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(''); 
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const openCreateModal = () => {
        setEditingCollection(null);
        setName('');
        setSlug('');
        setDescription('');
        setImageFile(null);
        setPreviewUrl('');
        setIsActive(true);
        setModalOpen(true);
    };

    const openEditModal = (col) => {
        setEditingCollection(col);
        setName(col.name || '');
        setSlug(col.slug || '');
        setDescription(col.description || '');
        // Backend data structure handle: col.image.url
        setPreviewUrl(col.image?.url || ''); 
        setImageFile(null);
        setIsActive(col.isActive ?? true);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug || name.toLowerCase().replace(/\s+/g, '-'));
        formData.append('description', description);
        formData.append('isActive', isActive);

        if (imageFile) {
            formData.append('image', imageFile); 
        }

        try {
            if (editingCollection) {
                await updateCollection(editingCollection._id || editingCollection.id, formData);
            } else {
                await addCollection(formData);
            }
            setModalOpen(false);
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight font-serif italic">Fashion Collections</h2>
                    <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">Manage seasonal drops and lookbooks</p>
                </div>
                <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-neutral-800 transition-all">
                    <Plus className="w-4 h-4"/>
                    <span>Create New Drop</span>
                </button>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && collections.length === 0 ? (
                   <div className="col-span-full py-20 flex flex-col items-center justify-center">
                       <Loader2 className="animate-spin text-neutral-300 w-10 h-10" />
                       <p className="text-[10px] font-bold text-neutral-400 mt-4 uppercase tracking-widest">Loading Collections...</p>
                   </div>
                ) : (
                    collections.map((col) => (
                        <div key={col._id || col.id} className="bg-white rounded-[2rem] border border-neutral-200 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl">
                            <div className="h-56 relative overflow-hidden bg-neutral-100">
                                {col.image?.url ? (
                                    <img 
                                        src={col.image.url} 
                                        alt={col.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-10 h-10 text-neutral-200" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"/>
                                <div className="absolute bottom-4 left-5 text-white">
                                    <h3 className="text-lg font-black tracking-tight">{col.name}</h3>
                                    <p className="text-[10px] font-medium opacity-70 uppercase tracking-widest">{col.slug}</p>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <StatusBadge status={col.isActive ? 'Active' : 'Inactive'} size="sm"/>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between bg-white">
                                <p className="text-[11px] text-neutral-500 line-clamp-1 flex-1 pr-4 italic">
                                    {col.description || 'No description provided.'}
                                </p>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => openEditModal(col)} className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl hover:bg-neutral-900 hover:text-white transition-all">
                                        <Edit2 className="w-3.5 h-3.5"/>
                                    </button>
                                    <button onClick={() => setDeleteTarget(col)} className="p-2.5 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                        <Trash2 className="w-3.5 h-3.5"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCollection ? 'Modify Collection' : 'Launch New Drop'}>
                <form onSubmit={handleSubmit} className="p-2 space-y-5">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Banner Image</label>
                        <div className="relative group">
                            {previewUrl ? (
                                <div className="relative h-44 w-full rounded-3xl overflow-hidden border border-neutral-200 shadow-inner">
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    <button 
                                        type="button" 
                                        onClick={() => { setImageFile(null); setPreviewUrl(''); }}
                                        className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-full shadow-xl hover:bg-rose-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-44 w-full border-2 border-dashed border-neutral-200 rounded-3xl cursor-pointer hover:bg-neutral-50 hover:border-neutral-900 transition-all">
                                    <Upload className="w-8 h-8 text-neutral-300 mb-2" />
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Upload Banner</p>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Collection Name</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none focus:border-neutral-900 transition-all" placeholder="e.g., Summer Lawn '24" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Slug (URL)</label>
                                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono outline-none" placeholder="summer-lawn-24" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</label>
                                <select 
                                    value={isActive ? 'true' : 'false'} 
                                    onChange={(e) => setIsActive(e.target.value === 'true')}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                                >
                                    <option value="true">Active / Published</option>
                                    <option value="false">Inactive / Hidden</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Description</label>
                            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-900" placeholder="Write a brief story about this collection..." />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2 text-xs font-black text-neutral-400 uppercase tracking-widest">Discard</button>
                        <button type="submit" className="px-8 py-3 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-neutral-800 transition-all">
                            {editingCollection ? 'Update Collection' : 'Launch Drop'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog 
                isOpen={Boolean(deleteTarget)} 
                onClose={() => setDeleteTarget(null)} 
                onConfirm={() => { deleteCollection(deleteTarget._id || deleteTarget.id); setDeleteTarget(null); }} 
                title="Abolish Collection" 
                message={`Are you sure you want to permanently remove "${deleteTarget?.name}"? All associations will be lost.`}
                type="danger"
            />
        </div>
    );
};