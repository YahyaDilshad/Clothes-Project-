import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Truck, CheckCircle2, User, MapPin, CreditCard, FileText, Send, Phone, Mail, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { formatPKR, formatDate } from '../../utils/formatters';
export const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { orders, updateOrderStatus, updatePaymentStatus, addOrderNote } = useApp();
    const order = orders.find((o) => o.id === id);
    const [newNote, setNewNote] = useState('');
    const [trackingModalOpen, setTrackingModalOpen] = useState(false);
    const [trackingNumberInput, setTrackingNumberInput] = useState(order?.trackingNumber || '');
    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
    if (!order) {
        return (<div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900">Order Not Found</h2>
        <button onClick={() => navigate('/orders')} className="mt-3 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold">
          Return to Orders
        </button>
      </div>);
    }
    const timelineSteps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentStepIndex = timelineSteps.indexOf(order.status);
    const handleAddNote = (e) => {
        e.preventDefault();
        if (!newNote.trim())
            return;
        addOrderNote(order.id, newNote.trim());
        setNewNote('');
    };
    const handlePrint = () => {
        window.print();
    };
    return (<div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/orders')} className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors">
            <ArrowLeft className="w-4 h-4"/>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900 font-mono tracking-tight">
                {order.orderNumber}
              </h2>
              <StatusBadge status={order.status} size="sm"/>
              <StatusBadge status={order.paymentStatus} size="sm"/>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Placed on {formatDate(order.date)} • Payment via <span className="font-semibold text-neutral-800">{order.paymentMethod}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setInvoiceModalOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors">
            <Printer className="w-3.5 h-3.5"/>
            <span>Print Invoice</span>
          </button>

          <button type="button" onClick={() => setTrackingModalOpen(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors">
            <Truck className="w-3.5 h-3.5"/>
            <span>{order.trackingNumber ? 'Update Tracking' : 'Add Tracking'}</span>
          </button>
        </div>
      </div>

      {/* Order Status Stepper Card */}
      {order.status !== 'Cancelled' && (<div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-6">
            Fulfillment Progress
          </h3>
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Progress line */}
            <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-0.5 bg-neutral-200 -translate-y-1/2 z-0"/>

            {timelineSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (<div key={step} onClick={() => updateOrderStatus(order.id, step)} className="relative z-10 flex sm:flex-col items-center gap-3 sm:gap-2 cursor-pointer group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${isCurrent
                        ? 'bg-neutral-900 text-white ring-4 ring-neutral-200'
                        : isCompleted
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-400 border border-neutral-200'}`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4"/> : idx + 1}
                  </div>
                  <div className="text-left sm:text-center">
                    <span className={`text-xs font-bold block ${isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                      {step}
                    </span>
                    {isCurrent && (<span className="text-[10px] text-neutral-500 font-medium">Active Stage</span>)}
                  </div>
                </div>);
            })}
          </div>

          {order.trackingNumber && (<div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-neutral-50 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-700"/>
                <span className="text-neutral-500">Tracking Code (Leopards / TCS):</span>
                <span className="font-mono font-bold text-neutral-900">{order.trackingNumber}</span>
              </div>
              <span className="text-emerald-700 font-semibold">Courier Dispatched</span>
            </div>)}
        </div>)}

      {/* Main Grid: Items on Left, Customer/Financials on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Order Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
              <span className="text-xs text-neutral-500 font-medium">{order.items.length} unique products</span>
            </div>

            <div className="divide-y divide-neutral-100">
              {order.items.map((item, idx) => (<div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.productImage} alt={item.productName} className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"/>
                    <div className="min-w-0">
                      <h4 className="font-bold text-neutral-900 text-xs truncate">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        SKU: {item.sku}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px]">
                        <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-semibold">
                          Size: {item.size}
                        </span>
                        <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-semibold">
                          Color: {item.color}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 text-xs">
                    <div className="font-bold text-neutral-900">
                      {formatPKR(item.price * item.quantity)}
                    </div>
                    <div className="text-neutral-500 text-[11px]">
                      {formatPKR(item.price)} × {item.quantity}
                    </div>
                  </div>
                </div>))}
            </div>

            {/* Financial Totals Breakdown */}
            <div className="bg-neutral-50/60 p-5 border-t border-neutral-100 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">{formatPKR(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (<div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({order.couponCode || 'Promotional'})</span>
                  <span>-{formatPKR(order.discount)}</span>
                </div>)}

              <div className="flex justify-between text-neutral-600">
                <span>Shipping & Delivery (Nationwide Flat)</span>
                <span className="font-semibold text-neutral-900">
                  {order.shippingFee === 0 ? 'FREE' : formatPKR(order.shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Sales Tax (GST)</span>
                <span className="font-semibold text-neutral-900">{formatPKR(order.tax)}</span>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-extrabold text-neutral-900">
                <span>Total Amount</span>
                <span>{formatPKR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Internal Notes & Activity Log */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4"/>
              <span>Internal Order Notes & Timeline</span>
            </h3>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input type="text" placeholder="Add private staff note (e.g. customer called for size confirmation)..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="flex-1 px-3.5 py-2 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"/>
              <button type="submit" className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                <Send className="w-3.5 h-3.5"/>
                <span>Post Note</span>
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {order.notes.map((n) => (<div key={n.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                    <span className="font-bold text-neutral-900">{n.author}</span>
                    <span>{formatDate(n.date)}</span>
                  </div>
                  <p className="text-neutral-700 leading-relaxed">{n.text}</p>
                </div>))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Payment Details */}
        <div className="space-y-6">
          {/* Customer Details Card */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-2">
              <User className="w-4 h-4"/>
              <span>Customer Information</span>
            </h3>

            <div className="space-y-2">
              <div className="font-bold text-neutral-900 text-sm">{order.customerName}</div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Mail className="w-3.5 h-3.5 text-neutral-400"/>
                <span>{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Phone className="w-3.5 h-3.5 text-neutral-400"/>
                <span>{order.customerPhone}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-3 border-t border-neutral-100">
              <div className="font-bold text-neutral-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5"/>
                <span>Shipping Address</span>
              </div>
              <div className="text-neutral-600 leading-relaxed">
                <p>{order.shippingAddress.street}</p>
                <p className="font-semibold text-neutral-800">
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-2">
              <CreditCard className="w-4 h-4"/>
              <span>Payment Details</span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Method:</span>
                <span className="font-bold text-neutral-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Status:</span>
                <select value={order.paymentStatus} onChange={(e) => updatePaymentStatus(order.id, e.target.value)} className="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded font-semibold text-xs text-neutral-800">
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              {order.transactionId && (<div className="flex justify-between">
                  <span className="text-neutral-500">Txn ID:</span>
                  <span className="font-mono text-neutral-700">{order.transactionId}</span>
                </div>)}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs">Order Actions</h3>
            <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors">
              Mark as Delivered
            </button>
            <button onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="w-full py-2 bg-white hover:bg-rose-50 border border-neutral-200 text-rose-600 font-semibold rounded-xl transition-colors">
              Cancel Order
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Number Modal */}
      <Modal isOpen={trackingModalOpen} onClose={() => setTrackingModalOpen(false)} title="Fulfillment & Tracking Code" maxWidth="sm">
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Courier Tracking Number (TCS / Leopards / Trax / Call Courier)
            </label>
            <input type="text" placeholder="e.g. TCS-772910482PK" value={trackingNumberInput} onChange={(e) => setTrackingNumberInput(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-mono text-xs text-neutral-900 focus:outline-hidden"/>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setTrackingModalOpen(false)} className="px-4 py-2 border border-neutral-200 rounded-lg">
              Cancel
            </button>
            <button onClick={() => {
            order.trackingNumber = trackingNumberInput;
            if (order.status === 'Processing' || order.status === 'Confirmed') {
                updateOrderStatus(order.id, 'Shipped');
            }
            setTrackingModalOpen(false);
        }} className="px-4 py-2 bg-neutral-900 text-white font-semibold rounded-lg">
              Save Tracking
            </button>
          </div>
        </div>
      </Modal>

      {/* Printable Invoice Modal */}
      <Modal isOpen={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} title={`Invoice ${order.orderNumber}`} maxWidth="lg" footer={<>
            <button onClick={() => setInvoiceModalOpen(false)} className="px-4 py-2 border border-neutral-200 rounded-lg text-xs font-semibold">
              Close
            </button>
            <button onClick={handlePrint} className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5"/>
              <span>Print Document</span>
            </button>
          </>}>
        <div className="p-4 border border-neutral-200 rounded-xl bg-white text-xs space-y-6 printable-area">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
            <div>
              <h1 className="text-lg font-black tracking-wider text-neutral-900 font-serif">
                NAVEED & CO.
              </h1>
              <p className="text-[11px] text-neutral-500">Haute Couture & Luxury Apparel</p>
              <p className="text-[11px] text-neutral-500">Lahore, Pakistan • NTN: 8941204-7</p>
            </div>
            <div className="text-right">
              <h2 className="text-base font-bold text-neutral-900">INVOICE / PACKING SLIP</h2>
              <p className="font-mono text-neutral-600">{order.orderNumber}</p>
              <p className="text-[11px] text-neutral-400">Date: {formatDate(order.date)}</p>
            </div>
          </div>

          {/* Bill To / Ship To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                Billed To:
              </span>
              <p className="font-bold text-neutral-900">{order.customerName}</p>
              <p className="text-neutral-600">{order.customerPhone}</p>
              <p className="text-neutral-600">{order.customerEmail}</p>
            </div>
            <div>
              <span className="font-bold text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                Ship To:
              </span>
              <p className="text-neutral-800">{order.shippingAddress.street}</p>
              <p className="font-semibold text-neutral-900">
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p className="text-neutral-600">Pakistan</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] font-bold text-neutral-500 uppercase">
                <th className="p-2">Item Description</th>
                <th className="p-2">Variant</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {order.items.map((it, i) => (<tr key={i}>
                  <td className="p-2 font-medium">{it.productName}</td>
                  <td className="p-2 text-neutral-500">{it.size} / {it.color}</td>
                  <td className="p-2 text-right">{formatPKR(it.price)}</td>
                  <td className="p-2 text-center">{it.quantity}</td>
                  <td className="p-2 text-right font-bold">{formatPKR(it.price * it.quantity)}</td>
                </tr>))}
            </tbody>
          </table>

          {/* Invoice Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span>{formatPKR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping:</span>
                <span>{formatPKR(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (<div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-{formatPKR(order.discount)}</span>
                </div>)}
              <div className="flex justify-between text-neutral-600">
                <span>Tax (GST):</span>
                <span>{formatPKR(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 border-t border-neutral-200 pt-1 text-sm">
                <span>Total Due:</span>
                <span>{formatPKR(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-neutral-400 pt-4 border-t border-neutral-100">
            Thank you for choosing Naveed & Co. • For customer support contact +92 300 1234567
          </div>
        </div>
      </Modal>
    </div>);
};
