import React, { useState, useEffect } from 'react';
import { X, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { formatPKR } from '../../utils/formatters';

export const CreateExchangeModal = ({ order, onClose }) => {
    const { products, fetchProducts, createExchange } = useProductStore();
    
    const [selectedOldItem, setSelectedOldItem] = useState(null);
    const [selectedNewProduct, setSelectedNewProduct] = useState(null);
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { fetchProducts(); }, []);

    // Price Difference Calculation
    const priceDiff = (selectedNewProduct?.price || 0) - (selectedOldItem?.price || 0);

    const handleSubmit = async () => {
        if (!selectedOldItem || !selectedNewProduct) return alert("Select both items");
        
        setIsSubmitting(true);
        const payload = {
            orderId: order._id,
            oldProductId: selectedOldItem.product,
            oldQuantity: 1,
            newProductId: selectedNewProduct._id,
            newQuantity: 1,
            reason: reason
        };

        const res = await createExchange(payload);
        if (res.success) {
            alert("Exchange Created!");
            onClose();
        } else {
            alert(res.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">New Exchange Request <span className="text-neutral-400 font-mono">#{order.orderNumber}</span></h2>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X className="w-5 h-5"/></button>
                </div>

                <div className="p-6 space-y-6">
                    {/* SWAP VISUAL AREA */}
                    <div className="flex items-center justify-between gap-4 bg-neutral-50 p-6 rounded-2xl border border-dashed border-neutral-300">
                        {/* Old Item Selection */}
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase text-rose-500">Item to Return</label>
                            <select 
                                onChange={(e) => setSelectedOldItem(order.items[e.target.value])}
                                className="w-full p-3 rounded-xl border font-bold text-xs"
                            >
                                <option value="">Select from Order</option>
                                {order.items.map((item, idx) => (
                                    <option key={idx} value={idx}>{item.name} ({formatPKR(item.price)})</option>
                                ))}
                            </select>
                        </div>

                        <ArrowRight className="w-6 h-6 text-neutral-300 mt-6" />

                        {/* New Item Selection */}
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase text-emerald-500">Replacement Item</label>
                            <select 
                                onChange={(e) => setSelectedNewProduct(products.find(p => p._id === e.target.value))}
                                className="w-full p-3 rounded-xl border font-bold text-xs"
                            >
                                <option value="">Search Inventory</option>
                                {products.map((p) => (
                                    <option key={p._id} value={p._id}>{p.name} - Stock: {p.stock} ({formatPKR(p.price)})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-neutral-400">Reason for Exchange</label>
                            <textarea 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g. Size issue or fabric flaw..."
                                className="w-full p-3 rounded-xl border text-xs min-h-[80px]"
                            />
                        </div>
                        <div className="bg-neutral-900 text-white p-4 rounded-2xl flex flex-col justify-center items-center">
                            <p className="text-[10px] font-bold uppercase opacity-60">Price Difference</p>
                            <h3 className={`text-2xl font-black ${priceDiff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {priceDiff === 0 ? "No Change" : formatPKR(priceDiff)}
                            </h3>
                            <p className="text-[8px] mt-1 text-neutral-400 text-center">
                                {priceDiff > 0 ? "Customer pays extra" : "Refund / Credit Note"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-neutral-50 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-neutral-500">Cancel</button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                    >
                        {isSubmitting ? <RefreshCw className="w-3 h-3 animate-spin"/> : "Process Exchange"}
                    </button>
                </div>
            </div>
        </div>
    );
};  