import React, { useState, useEffect } from 'react';
import { useProductStore } from '../../store/UseProductsStore.js'; // Zustand Store use karein
import { Modal } from '../common/Modal';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

export const StockAdjustmentModal = ({ isOpen, onClose, item }) => {
    // Context ki jagah Zustand Store ka function lein
    const { adjustStock } = useProductStore(); 
    
    const [adjustmentType, setAdjustmentType] = useState('Add Stock');
    const [quantity, setQuantity] = useState(10);
    const [reason, setReason] = useState('Received new stock delivery from production');
    const [notes, setNotes] = useState('');

    if (!item) return null;

    // Final Stock calculation logic
    const calculatedNewStock = adjustmentType === 'Add Stock'
        ? (item.currentStock || 0) + Number(quantity || 0)
        : adjustmentType === 'Remove Stock'
            ? Math.max(0, (item.currentStock || 0) - Number(quantity || 0))
            : Math.max(0, Number(quantity || 0)); // Manual Count

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Backend ko final calculated stock bhej rahe hain
        // Aap chaho to reason aur notes bhi bhej sakte ho agar backend support karta hai
        try {
            await adjustStock(item._id || item.id, calculatedNewStock);
            onClose();
        } catch (error) {
            console.error("Adjustment failed", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Stock Level Adjustment" subtitle={`Adjusting stock for SKU: ${item.sku}`} maxWidth="md">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Product Summary */}
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                    <img src={item.productImage || item.product?.images?.[0]} alt="" className="w-12 h-12 rounded-lg object-cover border shrink-0"/>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-neutral-900 truncate">{item.productName || item.product?.name}</h4>
                        <p className="text-neutral-500 text-[11px]">
                            Current Stock: <b className="text-neutral-900">{item.currentStock || 0}</b>
                        </p>
                    </div>
                </div>

                {/* Adjustment Tabs */}
                <div className="grid grid-cols-3 gap-2">
                    <AdjustmentTab 
                        active={adjustmentType === 'Add Stock'} 
                        onClick={() => setAdjustmentType('Add Stock')}
                        icon={<ArrowUpRight className="text-emerald-500"/>}
                        label="Add Stock"
                    />
                    <AdjustmentTab 
                        active={adjustmentType === 'Remove Stock'} 
                        onClick={() => setAdjustmentType('Remove Stock')}
                        icon={<ArrowDownRight className="text-rose-500"/>}
                        label="Remove"
                    />
                    <AdjustmentTab 
                        active={adjustmentType === 'Manual Correction'} 
                        onClick={() => {setAdjustmentType('Manual Correction'); setQuantity(item.currentStock)}}
                        icon={<RefreshCw className="text-blue-500"/>}
                        label="Manual"
                    />
                </div>

                {/* Quantity & Result */}
                <div className="grid grid-cols-2 gap-3 items-end">
                    <div>
                        <label className="block font-bold mb-1">Quantity</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                    </div>
                    <div className="p-2 bg-neutral-100 rounded-lg text-center border">
                        <span className="text-[10px] uppercase block">New Stock</span>
                        <span className="text-lg font-bold">{calculatedNewStock}</span>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-neutral-900 text-white rounded-lg">Save Adjustment</button>
                </div>
            </form>
        </Modal>
    );
};

// Helper component for Tabs
const AdjustmentTab = ({ active, onClick, icon, label }) => (
    <button type="button" onClick={onClick} className={`p-2 rounded-lg border flex flex-col items-center gap-1 ${active ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600'}`}>
        {icon}
        <span className="text-[10px] font-bold">{label}</span>
    </button>
);