import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Percent, DollarSign, Truck, Copy, Calendar, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatPKR, formatDate } from '../../utils/formatters';
export const DiscountsPage = () => {
    const { discounts, addDiscount, updateDiscount, deleteDiscount, showToast } = useApp();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    // Form State
    const [code, setCode] = useState('');
    const [type, setType] = useState('Percentage');
    const [value, setValue] = useState(15);
    const [minOrderAmount, setMinOrderAmount] = useState(5000);
    const [usageLimit, setUsageLimit] = useState(200);
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
    const [status, setStatus] = useState('Active');
    const openCreateModal = () => {
        setEditingDiscount(null);
        setCode('FESTIVE20');
        setType('Percentage');
        setValue(20);
        setMinOrderAmount(6000);
        setUsageLimit(150);
        setStartDate(new Date().toISOString().slice(0, 10));
        setEndDate(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
        setStatus('Active');
        setModalOpen(true);
    };
    const openEditModal = (d) => {
        setEditingDiscount(d);
        setCode(d.code);
        setType(d.type);
        setValue(d.value);
        setMinOrderAmount(d.minOrderAmount);
        setUsageLimit(d.usageLimit);
        setStartDate(d.startDate.slice(0, 10));
        setEndDate(d.endDate.slice(0, 10));
        setStatus(d.status);
        setModalOpen(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!code.trim())
            return;
        if (editingDiscount) {
            updateDiscount(editingDiscount.id, {
                code: code.toUpperCase(),
                type,
                value: Number(value),
                minOrderAmount: Number(minOrderAmount),
                usageLimit: Number(usageLimit),
                startDate,
                endDate,
                status,
            });
        }
        else {
            addDiscount({
                code: code.toUpperCase(),
                type,
                value: Number(value),
                minOrderAmount: Number(minOrderAmount),
                usageLimit: Number(usageLimit),
                startDate,
                endDate,
                status,
            });
        }
        setModalOpen(false);
    };
    const copyCouponCode = (couponCode) => {
        navigator.clipboard.writeText(couponCode);
        showToast('Code Copied', `Coupon code "${couponCode}" copied to clipboard.`);
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Discounts & Promo Coupons</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Create promotional voucher codes, percentage discounts, and free shipping vouchers.
          </p>
        </div>

        <button onClick={openCreateModal} className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
          <Plus className="w-4 h-4"/>
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-150 text-neutral-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-5 py-3.5">Coupon Code</th>
                <th className="px-4 py-3.5">Discount Benefit</th>
                <th className="px-4 py-3.5 text-right">Min. Spend</th>
                <th className="px-4 py-3.5 text-center">Usage Count</th>
                <th className="px-4 py-3.5">Valid Duration</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {discounts.map((d) => (<tr key={d.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200 text-xs">
                        {d.code}
                      </span>
                      <button type="button" onClick={() => copyCouponCode(d.code)} className="text-neutral-400 hover:text-neutral-900 p-1" title="Copy Code">
                        <Copy className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {d.type === 'Percentage' && <Percent className="w-4 h-4 text-neutral-700"/>}
                      {d.type === 'Fixed' && <DollarSign className="w-4 h-4 text-neutral-700"/>}
                      {d.type === 'Free Shipping' && <Truck className="w-4 h-4 text-neutral-700"/>}
                      <span className="font-bold text-neutral-900">
                        {d.type === 'Percentage'
                ? `${d.value}% Off`
                : d.type === 'Fixed'
                    ? `${formatPKR(d.value)} Flat Discount`
                    : 'Free Nationwide Shipping'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-neutral-700">
                    {d.minOrderAmount > 0 ? formatPKR(d.minOrderAmount) : 'No Minimum'}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="font-bold text-neutral-900">{d.usedCount}</span>
                    <span className="text-neutral-400 text-[11px]"> / {d.usageLimit}</span>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-500 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-400"/>
                      <span>
                        {formatDate(d.startDate)} – {formatDate(d.endDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={d.status} size="sm"/>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEditModal(d)} className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors" title="Edit Coupon">
                        <Edit2 className="w-4 h-4"/>
                      </button>
                      <button onClick={() => setDeleteTarget(d)} className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete Coupon">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingDiscount ? 'Edit Coupon Promo' : 'Create Voucher Promo'} maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Coupon Code (Uppercase) *</label>
            <input type="text" required placeholder="e.g. EID2026" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-mono font-bold text-neutral-900 focus:outline-hidden"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Discount Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-semibold text-neutral-900 bg-white">
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed">Fixed Amount (PKR)</option>
                <option value="Free Shipping">Free Shipping</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                {type === 'Percentage' ? 'Discount Percentage (%)' : 'Discount Amount (PKR)'}
              </label>
              <input type="number" disabled={type === 'Free Shipping'} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:outline-hidden disabled:bg-neutral-100"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Minimum Cart Spend (PKR)</label>
              <input type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Total Usage Limit</label>
              <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-neutral-900"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Expiration Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-neutral-900"/>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-semibold text-neutral-900 bg-white">
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-neutral-200 rounded-lg font-semibold text-neutral-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold shadow-xs">
              {editingDiscount ? 'Update Coupon' : 'Create Voucher'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={() => {
            if (deleteTarget) {
                deleteDiscount(deleteTarget.id);
                setDeleteTarget(null);
            }
        }} title="Delete Coupon" message={`Are you sure you want to delete coupon "${deleteTarget?.code}"?`} confirmText="Delete Coupon" type="danger"/>
    </div>);
};
