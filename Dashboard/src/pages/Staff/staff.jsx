import React, { useState, useEffect } from 'react';
import { 
    Search, UserPlus, Mail, Shield, 
    Trash2, Edit2, CheckCircle2, XCircle, 
    UserCheck, Users, ShieldAlert, X, Loader2
} from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const Staff = () => {
    // Zustand Store
    const { staff: staffList, fetchStaff, addStaff, updateStaff, deleteStaff, isLoading } = useProductStore();

    // Local States for UI
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Support', status: 'Active' });
    
    // Fetch data on mount
    useEffect(() => {
        fetchStaff();
    }, []);

    // Open Modal for Add/Edit
    const openModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setFormData({ name: member.name, email: member.email, role: member.role, status: member.status });
        } else {
            setEditingMember(null);
            setFormData({ name: '', email: '', role: 'Support', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    // Handle Form Submit (API Integration)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMember) {
                await updateStaff(editingMember.id, formData);
            } else {
                await addStaff({
                    ...formData,
                    lastActive: new Date().toISOString(),
                    avatar: `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=neutral&color=fff`
                });
            }
            setIsModalOpen(false);
        } catch (err) {
            alert("Failed to save staff member");
        }
    };

    // Delete Action
    const handleDelete = async (id) => {
        if (window.confirm("Remove this staff member?")) {
            await deleteStaff(id);
        }
    };

    const filteredStaff = staffList.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-serif">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Staff Management</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Manage roles and permissions for your team.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                    <UserPlus className="w-3.5 h-3.5"/>
                    <span>Add Staff</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600"><Users className="w-5 h-5"/></div>
                    <div><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Staff</p><h3 className="text-lg font-bold text-neutral-900">{staffList.length}</h3></div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><UserCheck className="w-5 h-5"/></div>
                    <div><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Active Now</p><h3 className="text-lg font-bold text-neutral-900">{staffList.filter(s => s.status === 'Active').length}</h3></div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><ShieldAlert className="w-5 h-5"/></div>
                    <div><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Admins</p><h3 className="text-lg font-bold text-neutral-900">{staffList.filter(s => s.role === 'Administrator').length}</h3></div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="text" placeholder="Search staff..." className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-neutral-900" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* Table / Loading State */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading && staffList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Loading Team...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-bold border-b border-neutral-100">
                                <tr>
                                    <th className="px-5 py-4">Staff Member</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Last Active</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredStaff.map((member) => (
                                    <tr key={member.id} className="hover:bg-neutral-50/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={member.avatar} alt="" className="w-8 h-8 rounded-lg border border-neutral-200 object-cover" />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-neutral-900">{member.name}</span>
                                                    <span className="text-[10px] text-neutral-500 font-mono">{member.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4"><div className="flex items-center gap-1.5 font-medium"><Shield className="w-3.5 h-3.5 text-neutral-400"/>{member.role}</div></td>
                                        <td className="px-5 py-4"><StatusBadge status={member.status} size="sm" /></td>
                                        <td className="px-5 py-4 text-neutral-500">{formatDate(member.lastActive)}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => openModal(member)} className="p-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-500 transition-colors"><Edit2 className="w-3.5 h-3.5"/></button>
                                                <button onClick={() => handleDelete(member.id)} className="p-1.5 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal - Kept Original Features */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-neutral-50/50">
                            <h3 className="font-bold text-neutral-900">{editingMember ? 'Edit Staff Member' : 'Add New Staff'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-neutral-200 rounded-full transition-colors"><X className="w-4 h-4"/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Full Name</label>
                                <input required type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-neutral-900" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Faisal Kamir" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Email Address</label>
                                <input required type="email" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-neutral-900" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@apexiums.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Role</label>
                                    <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-2 text-xs outline-none focus:border-neutral-900" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                        <option value="Administrator">Administrator</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Support">Support</option>
                                        <option value="Inventory">Inventory</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Status</label>
                                    <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-2 text-xs outline-none focus:border-neutral-900" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors">
                                    {editingMember ? 'Save Changes' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;