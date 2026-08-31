import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Lock, UserCheck, Mail, Clock, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
export const UsersRolesPage = () => {
    const { users, addUser, updateUser, deleteUser, currentUser } = useApp();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Staff');
    const [status, setStatus] = useState('Active');
    const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
    const openCreateModal = () => {
        setEditingUser(null);
        setName('');
        setEmail('');
        setRole('Staff');
        setStatus('Active');
        setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
        setModalOpen(true);
    };
    const openEditModal = (u) => {
        setEditingUser(u);
        setName(u.name);
        setEmail(u.email);
        setRole(u.role);
        setStatus(u.status);
        setAvatar(u.avatar);
        setModalOpen(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim())
            return;
        if (editingUser) {
            updateUser(editingUser.id, {
                name,
                email,
                role,
                status,
                avatar,
            });
        }
        else {
            addUser({
                name,
                email,
                role,
                status,
                avatar,
                permissions: role === 'Super Admin' ? ['all'] : ['orders:read', 'orders:write', 'products:read'],
            });
        }
        setModalOpen(false);
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Staff & Permissions Management</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Control access roles, assign warehouse managers, and supervise admin accounts.
          </p>
        </div>

        <button onClick={openCreateModal} className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
          <Plus className="w-4 h-4"/>
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Roles Legend Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Super Admin</span>
            <Shield className="w-4 h-4 text-neutral-900"/>
          </div>
          <p className="text-[11px] text-neutral-500">Unrestricted full control across all store operations.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Admin</span>
            <Lock className="w-4 h-4 text-neutral-700"/>
          </div>
          <p className="text-[11px] text-neutral-500">Manage orders, catalog, coupons, and returns.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Manager</span>
            <UserCheck className="w-4 h-4 text-neutral-700"/>
          </div>
          <p className="text-[11px] text-neutral-500">Inventory audits, fulfillment, and customer support.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">Staff</span>
            <Clock className="w-4 h-4 text-neutral-500"/>
          </div>
          <p className="text-[11px] text-neutral-500">Dispatch packing, scanning, and order tracking view.</p>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-150 text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-5 py-3.5">Team Member</th>
                <th className="px-4 py-3.5">Assigned Role</th>
                <th className="px-4 py-3.5">Account Status</th>
                <th className="px-4 py-3.5">Last Login</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((u) => (<tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-neutral-200"/>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-900">{u.name}</span>
                          {u.id === currentUser.id && (<span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-md text-[10px] font-bold">
                              You
                            </span>)}
                        </div>
                        <div className="flex items-center gap-1 text-neutral-500 text-[11px]">
                          <Mail className="w-3 h-3 text-neutral-400"/>
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                      <Shield className="w-3 h-3 text-neutral-600"/>
                      <span>{u.role}</span>
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <StatusBadge status={u.status} size="sm"/>
                  </td>

                  <td className="px-4 py-3.5 text-neutral-500 font-mono text-[11px]">
                    {u.lastLogin}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEditModal(u)} className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors" title="Edit User">
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      {u.id !== currentUser.id && (<button onClick={() => setDeleteTarget(u)} className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Remove User">
                          <Trash2 className="w-4 h-4"/>
                        </button>)}
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Edit Staff Account' : 'Invite New Team Member'} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Full Name *</label>
            <input type="text" required placeholder="e.g. Asad Qureshi" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Official Email Address *</label>
            <input type="email" required placeholder="asad@naveedco.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">System Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-semibold text-neutral-900 bg-white">
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Account Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-semibold text-neutral-900 bg-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Avatar URL</label>
            <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-neutral-900"/>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-neutral-200 rounded-lg font-semibold text-neutral-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold shadow-xs">
              {editingUser ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={() => {
            if (deleteTarget) {
                deleteUser(deleteTarget.id);
                setDeleteTarget(null);
            }
        }} title="Revoke Team Member" message={`Are you sure you want to remove ${deleteTarget?.name} from staff access?`} confirmText="Remove Access" type="danger"/>
    </div>);
};
