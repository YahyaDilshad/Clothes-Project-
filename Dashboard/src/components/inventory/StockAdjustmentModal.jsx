import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
export const StockAdjustmentModal = ({ isOpen, onClose, item, }) => {
    const { adjustStock } = useApp();
    const [adjustmentType, setAdjustmentType] = useState('Add Stock');
    const [quantity, setQuantity] = useState(10);
    const [reason, setReason] = useState('Received new stock delivery from production');
    const [notes, setNotes] = useState('');
    if (!item)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (quantity <= 0 && adjustmentType !== 'Manual Correction')
            return;
        adjustStock(item.id, adjustmentType, Number(quantity), reason, notes);
        onClose();
    };
    const calculatedNewStock = adjustmentType === 'Add Stock'
        ? item.currentStock + Number(quantity || 0)
        : adjustmentType === 'Remove Stock'
            ? Math.max(0, item.currentStock - Number(quantity || 0))
            : Math.max(0, Number(quantity || 0));
    return (<Modal isOpen={isOpen} onClose={onClose} title="Stock Level Adjustment" subtitle={`Adjusting stock for SKU: ${item.sku}`} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Product summary card */}
        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
          <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-lg object-cover border border-neutral-200 shrink-0"/>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-neutral-900 truncate">{item.productName}</h4>
            <div className="text-neutral-500 text-[11px] flex items-center gap-2 mt-0.5">
              <span>Variant: <b className="text-neutral-700">{item.size} / {item.color}</b></span>
              <span>•</span>
              <span>Current Stock: <b className="text-neutral-900 font-bold">{item.currentStock}</b></span>
            </div>
          </div>
        </div>

        {/* Adjustment Type Tabs */}
        <div>
          <label className="block font-semibold text-neutral-700 mb-1.5">Adjustment Action</label>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => {
            setAdjustmentType('Add Stock');
            setReason('Received new batch from production');
        }} className={`p-2.5 rounded-lg border text-center font-medium flex flex-col items-center gap-1 transition-colors ${adjustmentType === 'Add Stock'
            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}>
              <ArrowUpRight className="w-4 h-4 text-emerald-400"/>
              <span>Add Stock</span>
            </button>

            <button type="button" onClick={() => {
            setAdjustmentType('Remove Stock');
            setReason('Damaged / defective item write-off');
        }} className={`p-2.5 rounded-lg border text-center font-medium flex flex-col items-center gap-1 transition-colors ${adjustmentType === 'Remove Stock'
            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}>
              <ArrowDownRight className="w-4 h-4 text-rose-400"/>
              <span>Remove Stock</span>
            </button>

            <button type="button" onClick={() => {
            setAdjustmentType('Manual Correction');
            setReason('Physical warehouse audit recount');
            setQuantity(item.currentStock);
        }} className={`p-2.5 rounded-lg border text-center font-medium flex flex-col items-center gap-1 transition-colors ${adjustmentType === 'Manual Correction'
            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}>
              <RefreshCw className="w-4 h-4 text-blue-400"/>
              <span>Manual Count</span>
            </button>
          </div>
        </div>

        {/* Quantity and Preview */}
        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              {adjustmentType === 'Manual Correction' ? 'New Total Quantity' : 'Quantity to Adjust'}
            </label>
            <input type="number" min="0" required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm font-semibold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"/>
          </div>

          <div className="p-2.5 bg-neutral-100/80 rounded-lg border border-neutral-200 text-center">
            <span className="text-[10px] text-neutral-500 block uppercase font-medium">Resulting Stock</span>
            <span className="text-base font-bold text-neutral-900">{calculatedNewStock} units</span>
          </div>
        </div>

        {/* Reason Select */}
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Primary Reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-white">
            <option value="Received new batch from production">Received new batch from production</option>
            <option value="Supplier return replacement">Supplier return replacement</option>
            <option value="Physical warehouse audit recount">Physical warehouse audit recount</option>
            <option value="Damaged / defective item write-off">Damaged / defective item write-off</option>
            <option value="Allocated for flagship store display showroom">Allocated for flagship store display showroom</option>
            <option value="Customer returned item restocked">Customer returned item restocked</option>
            <option value="Other / Custom adjustment">Other / Custom adjustment</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Internal Reference Notes (Optional)</label>
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Batch #PB-884 from Faisalabad Weaving Mill" className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-xs text-neutral-800 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"/>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
          <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 shadow-xs transition-colors">
            Save Stock Adjustment
          </button>
        </div>
      </form>
    </Modal>);
};
