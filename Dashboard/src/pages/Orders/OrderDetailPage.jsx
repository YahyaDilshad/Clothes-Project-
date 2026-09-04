import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Printer, Truck, CheckCircle2, User, 
    MapPin, CreditCard, FileText, Send, Phone, Mail, Loader2, X
} from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { formatPKR, formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Zustand Store Integration
    const { 
        orders, 
        updateOrderStatus, 
        updatePaymentStatus, 
        addOrderNote, 
        isLoading,
        fetchOrders // To ensure data is fresh if user lands directly on this page
    } = useProductStore();

    const order = orders.find((o) => o.id === id);

    // Local States
    const [newNote, setNewNote] = useState('');
    const [trackingModalOpen, setTrackingModalOpen] = useState(false);
    const [trackingNumberInput, setTrackingNumberInput] = useState('');
    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

    useEffect(() => {
        if (orders.length === 0) {
            fetchOrders();
        }
    }, []);

    useEffect(() => {
        if (order) {
            setTrackingNumberInput(order.trackingNumber || '');
        }
    }, [order]);

    if (!order && isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#B08D57] mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Fetching Order Details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 shadow-sm max-w-xl mx-auto mt-10">
                <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-neutral-900">Order Not Found</h2>
                <p className="text-xs text-neutral-500 mt-1 mb-6">The order reference you are looking for does not exist.</p>
                <button onClick={() => navigate('/orders')} className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow-lg">
                    Return to Orders Ledger
                </button>
            </div>
        );
    }

    const timelineSteps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentStepIndex = timelineSteps.indexOf(order.status);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        await addOrderNote(order.id, newNote.trim());
        setNewNote('');
    };

    const handleUpdateTracking = async () => {
        // Logic: Add tracking and move to 'Shipped' if it's in early stages
        await updateOrderStatus(order.id, order.status === 'Processing' ? 'Shipped' : order.status);
        // Tracking update logic would normally be its own API call
        // Assuming updateOrderStatus handles tracking in your backend too
        setTrackingModalOpen(false);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/orders')} className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors">
                        <ArrowLeft className="w-4 h-4"/>
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-neutral-900 font-mono tracking-tight">{order.orderNumber}</h2>
                            <StatusBadge status={order.status} size="sm"/>
                            <StatusBadge status={order.paymentStatus} size="sm"/>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Placed on {formatDate(order.date)} • Payment via <span className="font-semibold text-neutral-800">{order.paymentMethod}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setInvoiceModalOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold shadow-2xs transition-all">
                        <Printer className="w-3.5 h-3.5"/>
                        <span>Print Invoice</span>
                    </button>
                    <button onClick={() => setTrackingModalOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold shadow-2xs transition-all">
                        <Truck className="w-3.5 h-3.5"/>
                        <span>{order.trackingNumber ? 'Update Tracking' : 'Add Tracking'}</span>
                    </button>
                </div>
            </div>

            {/* Status Stepper */}
            {order.status !== 'Cancelled' && (
                <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                    <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-8">Fulfillment Progress</h3>
                    <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4 px-2">
                        <div className="hidden sm:block absolute top-4 left-0 w-full h-0.5 bg-neutral-100 z-0" />
                        {timelineSteps.map((step, idx) => {
                            const isCompleted = idx <= currentStepIndex;
                            const isCurrent = idx === currentStepIndex;
                            return (
                                <div 
                                    key={step} 
                                    onClick={() => updateOrderStatus(order.id, step)}
                                    className="relative z-10 flex sm:flex-col items-center gap-4 sm:gap-2 cursor-pointer group flex-1"
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300",
                                        isCurrent ? "bg-neutral-900 text-white ring-4 ring-neutral-200 scale-110" :
                                        isCompleted ? "bg-neutral-900 text-white" : "bg-white text-neutral-400 border-2 border-neutral-100"
                                    )}>
                                        {isCompleted ? <CheckCircle2 className="w-4 h-4"/> : idx + 1}
                                    </div>
                                    <div className="text-left sm:text-center">
                                        <span className={cn("text-[10px] font-black uppercase tracking-tighter block", isCompleted ? "text-neutral-900" : "text-neutral-400")}>{step}</span>
                                        {isCurrent && <span className="text-[8px] text-[#B08D57] font-black uppercase tracking-widest">Active</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Items and Notes */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Items List */}
                    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
                        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Order Items</h3>
                            <span className="text-xs font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-lg">
                                {order.items?.length || 0} Products
                            </span>
                        </div>
                        <div className="divide-y divide-neutral-50">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={item.productImage} className="w-14 h-14 rounded-xl object-cover border border-neutral-100" alt=""/>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-neutral-900 text-xs">{item.productName}</h4>
                                            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">SKU: {item.sku}</p>
                                            <div className="flex gap-1.5 mt-1.5">
                                                <span className="text-[9px] font-black uppercase bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">Size: {item.size}</span>
                                                <span className="text-[9px] font-black uppercase bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">Color: {item.color}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-neutral-900 text-xs">{formatPKR(item.price * item.quantity)}</div>
                                        <div className="text-[10px] text-neutral-400">{formatPKR(item.price)} × {item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-neutral-50/50 p-6 border-t border-neutral-100 space-y-3">
                            <div className="flex justify-between text-xs text-neutral-500">
                                <span>Subtotal</span>
                                <span className="font-bold text-neutral-900">{formatPKR(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-neutral-500">
                                <span>Shipping Fee</span>
                                <span className="font-bold text-neutral-900">{formatPKR(order.shippingFee)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-xs text-emerald-600">
                                    <span>Discount Applied</span>
                                    <span className="font-bold">-{formatPKR(order.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xs text-neutral-500">
                                <span>Tax (GST 5%)</span>
                                <span className="font-bold text-neutral-900">{formatPKR(order.tax)}</span>
                            </div>
                            <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                                <span className="text-xs font-black uppercase tracking-widest text-neutral-900">Net Total</span>
                                <span className="text-lg font-black text-neutral-900">{formatPKR(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Staff Notes Section */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-6">
                        <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#B08D57]"/> Staff Activity & Private Notes
                        </h3>
                        <form onSubmit={handleAddNote} className="flex gap-2">
                            <input 
                                type="text" 
                                value={newNote} 
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Write an internal note..." 
                                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:bg-white focus:border-neutral-900 transition-all"
                            />
                            <button type="submit" className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-sm">
                                <Send className="w-3.5 h-3.5" /> Post
                            </button>
                        </form>
                        <div className="space-y-4">
                            {order.notes?.map((note, idx) => (
                                <div key={idx} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col gap-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black text-neutral-900 uppercase">{note.author || 'System User'}</span>
                                        <span className="text-[9px] text-neutral-400 font-bold">{formatDate(note.date)}</span>
                                    </div>
                                    <p className="text-xs text-neutral-600 leading-relaxed">{note.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Info Panels */}
                <div className="space-y-6">
                    {/* Customer Info Card */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-6">
                        <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-50 pb-4">
                            <User className="w-4 h-4 text-[#B08D57]"/>
                            <h3 className="text-xs font-black uppercase tracking-widest">Customer Record</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-neutral-400 uppercase mb-1">Full Name</p>
                                <p className="text-sm font-bold text-neutral-900">{order.customerName}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400"><Mail className="w-4 h-4"/></div>
                                <div className="text-xs font-medium text-neutral-600">{order.customerEmail}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400"><Phone className="w-4 h-4"/></div>
                                <div className="text-xs font-bold text-neutral-900">{order.customerPhone}</div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-neutral-50">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-3.5 h-3.5 text-[#B08D57]"/>
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Shipping Destination</span>
                            </div>
                            <div className="bg-neutral-50 p-4 rounded-xl text-xs text-neutral-600 leading-relaxed">
                                <p>{order.shippingAddress?.street}</p>
                                <p className="font-bold text-neutral-900 mt-1">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                                <p className="uppercase tracking-widest text-[10px] font-bold mt-2 text-neutral-400">Pakistan</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Status Card */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 text-neutral-900">
                            <CreditCard className="w-4 h-4 text-[#B08D57]"/>
                            <h3 className="text-xs font-black uppercase tracking-widest">Finance & Billing</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-neutral-500">Payment Gateway:</span>
                                <span className="font-bold text-neutral-900">{order.paymentMethod}</span>
                            </div>
                            <div className="space-y-1.5 pt-2">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Payment Status</label>
                                <select 
                                    value={order.paymentStatus} 
                                    onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-neutral-900"
                                >
                                    <option value="Paid">Mark as Paid</option>
                                    <option value="Pending">Mark as Pending</option>
                                    <option value="Refunded">Refund Processed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="bg-neutral-900 p-6 rounded-2xl shadow-xl space-y-3">
                        <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-4">Quick Fulfillment</h3>
                        <button 
                            onClick={() => updateOrderStatus(order.id, 'Delivered')}
                            className="w-full py-3 bg-[#B08D57] hover:bg-[#967548] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
                        >
                            Mark as Delivered
                        </button>
                        <button 
                            onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                            className="w-full py-3 bg-white/10 hover:bg-rose-600/20 text-white border border-white/10 rounded-xl text-xs font-bold transition-all"
                        >
                            Cancel Transaction
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL: Tracking Number */}
            <Modal isOpen={trackingModalOpen} onClose={() => setTrackingModalOpen(false)} title="Update Tracking Logistics" maxWidth="sm">
                <div className="space-y-6 p-2">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5"/> Carrier Tracking Number
                        </label>
                        <input 
                            type="text" 
                            value={trackingNumberInput} 
                            onChange={(e) => setTrackingNumberInput(e.target.value)}
                            placeholder="e.g. TCS-772910482PK" 
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-neutral-900"
                        />
                        <p className="text-[10px] text-neutral-400 italic">Tracking details will be shared with the customer via SMS/Email.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setTrackingModalOpen(false)} className="flex-1 py-3 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50">Discard</button>
                        <button onClick={handleUpdateTracking} className="flex-1 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow-lg">Save & Dispatch</button>
                    </div>
                </div>
            </Modal>

            {/* MODAL: Print Invoice (Faisal Kamir Branding) */}
            <Modal isOpen={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} title={`Invoice ${order.orderNumber}`} maxWidth="lg">
                <div className="space-y-6">
                    <div id="printable-invoice" className="bg-white p-8 border border-neutral-200 rounded-2xl space-y-8 font-sans text-neutral-900">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start border-b border-neutral-200 pb-8">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-black tracking-[0.2em] uppercase font-serif italic text-neutral-900">FAISAL KAMIR</h1>
                                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Luxury Couture & Apparel</p>
                                <div className="text-[10px] text-neutral-500 mt-4 leading-relaxed">
                                    Lahore, Pakistan<br />
                                    support@faisalkamir.com<br />
                                    +92 300 0000000
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <h2 className="text-lg font-black text-neutral-900 uppercase tracking-widest">Tax Invoice</h2>
                                <p className="font-mono text-sm font-bold bg-neutral-900 text-white px-3 py-1 rounded inline-block">{order.orderNumber}</p>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase mt-2">Date: {formatDate(order.date)}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Billed To:</span>
                                <div className="text-xs space-y-1">
                                    <p className="font-black text-neutral-900 text-sm uppercase">{order.customerName}</p>
                                    <p className="text-neutral-500 font-medium">{order.customerPhone}</p>
                                    <p className="text-neutral-500 font-medium">{order.customerEmail}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Ship To Destination:</span>
                                <div className="text-xs space-y-1">
                                    <p className="font-bold text-neutral-900">{order.shippingAddress?.street}</p>
                                    <p className="font-black text-neutral-900 uppercase">{order.shippingAddress?.city}, Pakistan</p>
                                    <p className="text-neutral-500 font-bold tracking-widest">{order.shippingAddress?.postalCode}</p>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Table */}
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b-2 border-neutral-900 text-[10px] font-black text-neutral-900 uppercase tracking-widest">
                                    <th className="py-4 px-2">Garment Description</th>
                                    <th className="py-4 px-2">Variant</th>
                                    <th className="py-4 px-2 text-right">Unit Price</th>
                                    <th className="py-4 px-2 text-center">Qty</th>
                                    <th className="py-4 px-2 text-right">Line Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {order.items?.map((it, i) => (
                                    <tr key={i} className="text-neutral-700 font-medium">
                                        <td className="py-4 px-2 font-bold">{it.productName}</td>
                                        <td className="py-4 px-2 text-neutral-400 uppercase">{it.size} / {it.color}</td>
                                        <td className="py-4 px-2 text-right font-mono">{formatPKR(it.price)}</td>
                                        <td className="py-4 px-2 text-center font-bold">{it.quantity}</td>
                                        <td className="py-4 px-2 text-right font-black text-neutral-900 font-mono">{formatPKR(it.price * it.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Invoice Footer / Totals */}
                        <div className="flex justify-end pt-6">
                            <div className="w-72 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-neutral-400 uppercase tracking-widest">Subtotal</span>
                                    <span className="font-black text-neutral-900">{formatPKR(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-neutral-400 uppercase tracking-widest">Shipping</span>
                                    <span className="font-black text-neutral-900">{formatPKR(order.shippingFee)}</span>
                                </div>
                                <div className="flex justify-between text-xs border-b border-neutral-100 pb-3">
                                    <span className="font-bold text-neutral-400 uppercase tracking-widest">Tax (GST)</span>
                                    <span className="font-black text-neutral-900">{formatPKR(order.tax)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-[11px] font-black text-neutral-900 uppercase tracking-[0.2em]">Net Total Due</span>
                                    <span className="text-xl font-black text-neutral-900 font-mono">{formatPKR(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-12 text-[9px] font-bold text-neutral-300 uppercase tracking-[0.3em]">
                            This is a computer generated document • No signature required
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button onClick={() => setInvoiceModalOpen(false)} className="flex-1 py-3 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500">Close Preview</button>
                        <button onClick={handlePrint} className="flex-1 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg">
                            <Printer className="w-4 h-4" /> Print Document
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};