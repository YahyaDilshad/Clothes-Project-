import React, { useState } from 'react';
import { 
    Receipt, 
    Printer, 
    Download, 
    Mail, 
    User, 
    MapPin, 
    CreditCard, 
    Calendar,
    ChevronLeft,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPKR, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';

export const BillingPage = () => {
    const navigate = useNavigate();
    
    // Mock Data for the Invoice
    const [invoiceData] = useState({
        invoiceNumber: "INV-2025-0842",
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Paid",
        customer: {
            name: "Faisal Kamir",
            email: "faisal@example.com",
            phone: "+92 300 1234567",
            address: "Main Boulevard, Gulberg III, Lahore, Pakistan"
        },
        items: [
            { id: 1, name: "Premium Leather Jacket", sku: "JK-001", qty: 1, price: 12500 },
            { id: 2, name: "Cotton Slim Fit Shirt", sku: "SH-052", qty: 2, price: 3500 },
            { id: 3, name: "Formal Black Trousers", sku: "TR-088", qty: 1, price: 4500 }
        ],
        subtotal: 24000,
        tax: 1200,
        discount: 500,
        total: 24700,
        paymentMethod: "Bank Transfer (HBL)"
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
            
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold hover:bg-neutral-50 transition-all shadow-2xs">
                        <Printer className="w-3.5 h-3.5" /> Print Invoice
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm">
                        <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Invoice Main Card */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden print:shadow-none print:border-none">
                
                {/* 1. Logo & Top Header */}
                <div className="p-8 sm:p-12 border-b border-neutral-100 bg-neutral-50/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                        <div>
                            {/* Logo */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-serif font-bold text-xl">
                                        A
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tighter text-neutral-900">APEXIUMS</h2>
                                        <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Premium Storefront</p>
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">Invoice</h1>
                            <p className="text-sm text-neutral-500 mt-1">Ref: {invoiceData.invoiceNumber}</p>
                        </div>
                        
                        <div className="text-left sm:text-right space-y-2">
                            <StatusBadge status={invoiceData.status} size="lg" />
                            <div className="pt-4 text-xs space-y-1">
                                <p className="text-neutral-400 font-medium uppercase tracking-wider">Date Issued</p>
                                <p className="text-neutral-900 font-bold">{formatDate(invoiceData.date)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Billing Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 sm:p-12">
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <User className="w-3.5 h-3.5" /> Billed To
                        </h3>
                        <div>
                            <p className="text-lg font-bold text-neutral-900">{invoiceData.customer.name}</p>
                            <p className="text-sm text-neutral-600 mt-1 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-neutral-400" /> {invoiceData.customer.email}
                            </p>
                            <p className="text-sm text-neutral-600 mt-1 flex items-start gap-2 leading-relaxed">
                                <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5" /> {invoiceData.customer.address}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 md:text-right">
                        <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center md:justify-end gap-2">
                            <CreditCard className="w-3.5 h-3.5" /> Payment Method
                        </h3>
                        <div>
                            <p className="text-sm font-bold text-neutral-900">{invoiceData.paymentMethod}</p>
                            <p className="text-xs text-neutral-500 mt-1">Transaction ID: TXN-99201102</p>
                            <div className="mt-4 pt-4 border-t border-neutral-100 flex md:justify-end gap-6">
                                <div>
                                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Due Date</p>
                                    <p className="text-xs font-bold text-neutral-900">{formatDate(invoiceData.dueDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Items Table */}
                <div className="px-8 sm:px-12">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-200 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                    <th className="py-4 font-bold">Item Description</th>
                                    <th className="py-4 text-center">Qty</th>
                                    <th className="py-4 text-right">Price</th>
                                    <th className="py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {invoiceData.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-5">
                                            <p className="text-sm font-bold text-neutral-900">{item.name}</p>
                                            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{item.sku}</p>
                                        </td>
                                        <td className="py-5 text-center text-sm font-medium text-neutral-600">{item.qty}</td>
                                        <td className="py-5 text-right text-sm font-medium text-neutral-600">{formatPKR(item.price)}</td>
                                        <td className="py-5 text-right text-sm font-bold text-neutral-900">{formatPKR(item.qty * item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. Calculation Summary */}
                <div className="p-8 sm:p-12 bg-neutral-50/50 flex justify-end">
                    <div className="w-full sm:w-72 space-y-3">
                        <div className="flex justify-between text-sm text-neutral-600">
                            <span>Subtotal</span>
                            <span className="font-semibold">{formatPKR(invoiceData.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-neutral-600">
                            <span>Tax (GST)</span>
                            <span className="font-semibold">{formatPKR(invoiceData.tax)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-rose-600">
                            <span>Discount</span>
                            <span className="font-semibold">-{formatPKR(invoiceData.discount)}</span>
                        </div>
                        <div className="pt-3 border-t border-neutral-200 flex justify-between">
                            <span className="text-base font-bold text-neutral-900 uppercase tracking-tight">Grand Total</span>
                            <span className="text-xl font-black text-neutral-900">{formatPKR(invoiceData.total)}</span>
                        </div>
                        <div className="pt-4 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Fully Paid
                        </div>
                    </div>
                </div>

                {/* 5. Software Credits (User Requested) */}
                <div className="p-8 border-t border-neutral-100 bg-white">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center mb-2">
                            <Calendar className="w-4 h-4 text-neutral-400" />
                        </div>
                        <p className="text-[11px] font-bold text-neutral-900 uppercase tracking-widest">
                            Software Developed By Apexiums Technologies
                        </p>
                        <p className="text-[10px] text-neutral-500 font-mono mt-1">
                            Support: 03405542097 • www.apexiums.com
                        </p>
                    </div>
                </div>
            </div>

            {/* Print Note */}
            <p className="text-center text-[10px] text-neutral-400 uppercase tracking-widest no-print">
                This is a computer generated document. No signature required.
            </p>
        </div>
    );
};

export default BillingPage;