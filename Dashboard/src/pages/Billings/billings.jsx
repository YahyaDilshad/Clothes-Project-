import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, Plus, Trash2, Printer, 
    User, CreditCard, X, ShoppingCart,
    DollarSign, Percent, Calculator, ChevronLeft, Receipt, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/UseProductsStore.js';
import { formatPKR } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const BillingPage = () => {
    const navigate = useNavigate();
    
    // Zustand Store
    const { 
        products, 
        customers, 
        fetchProducts, 
        fetchCustomers, 
        createOrder, 
        isLoading 
    } = useProductStore();

    // --- Local States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [billItems, setBillItems] = useState([]);
    const [taxRate, setTaxRate] = useState(17); 
    const [discount, setDiscount] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Initial Data Fetch
    useEffect(() => {
        if (products.length === 0) fetchProducts();
        if (customers.length === 0) fetchCustomers();
    }, []);

    // Set default customer once loaded
    useEffect(() => {
        if (customers.length > 0 && !selectedCustomer) {
            setSelectedCustomer(customers[0]);
        }
    }, [customers]);

    // --- Search Logic (Intelligent Search) ---
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
    }, [searchQuery, products]);

    // --- Cart Actions ---
    const addItem = (product) => {
        const existing = billItems.find(item => item.id === product.id);
        if (existing) {
            setBillItems(billItems.map(item => 
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            ));
        } else {
            setBillItems([...billItems, {
                id: product.id,
                name: product.name,
                sku: product.sku,
                price: product.salePrice,
                qty: 1
            }]);
        }
        setSearchQuery("");
    };

    const removeItem = (id) => setBillItems(billItems.filter(item => item.id !== id));

    const updateQty = (id, newQty) => {
        if (newQty < 1) return;
        setBillItems(billItems.map(item => 
            item.id === id ? { ...item, qty: newQty } : item
        ));
    };

    // --- Calculations ---
    const subtotal = billItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const grandTotal = subtotal + taxAmount - discount;

    // --- Complete Transaction & Print ---
    const handleCompleteTransaction = async () => {
        if (billItems.length === 0) return;

        const orderPayload = {
            orderNumber: `INV-${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString(),
            customerId: selectedCustomer?.id || 'walk-in',
            customerName: selectedCustomer?.name || 'Walk-in Customer',
            customerPhone: selectedCustomer?.phone || 'N/A',
            items: billItems.map(item => ({
                productId: item.id,
                productName: item.name,
                sku: item.sku,
                price: item.price,
                quantity: item.qty
            })),
            subtotal,
            tax: taxAmount,
            discount,
            total: grandTotal,
            paymentMethod: 'Cash', // Default to Cash for POS
            paymentStatus: 'Paid',
            status: 'Delivered' // Finalized POS sale
        };

        try {
            await createOrder(orderPayload);
            window.print(); // Trigger Print
            setBillItems([]); // Reset Cart
            setDiscount(0);
        } catch (error) {
            alert("Failed to sync transaction with server.");
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 pb-12 min-h-screen">
            
            {/* 1. TOP SEARCH BAR */}
            <div className="flex flex-col sm:flex-row gap-4 items-center no-print">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50">
                    <ChevronLeft className="w-5 h-5 text-neutral-600" />
                </button>
                
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-[#B08D57]" />
                    <input 
                        type="text" 
                        placeholder="Search Product by Name or SKU (e.g. Kurta, Festive)..."
                        className="w-full bg-white border border-neutral-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-[#181818] transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                            {searchResults.map(p => (
                                <button key={p.id} onClick={() => addItem(p)} className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 border-b border-neutral-50 last:border-none">
                                    <div className="flex items-center gap-4">
                                        <img src={p.images?.[0]} className="w-10 h-10 rounded-lg object-cover border" alt="" />
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-neutral-900">{p.name}</p>
                                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">{p.sku}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-[#B08D57]">{formatPKR(p.salePrice)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* 2. BILLING ITEMS TABLE */}
                <div className="lg:col-span-8 bg-white rounded-[2rem] border border-neutral-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col no-print">
                    <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" /> Live Invoice Cart
                        </h3>
                        <span className="text-[10px] font-black bg-neutral-900 text-white px-3 py-1 rounded-full">{billItems.length} Units</span>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 text-[9px] font-black uppercase text-neutral-400 border-b">
                                <tr>
                                    <th className="px-6 py-4">Item Description</th>
                                    <th className="px-6 py-4 text-center">Quantity</th>
                                    <th className="px-6 py-4 text-right">Price</th>
                                    <th className="px-6 py-4 text-right">Subtotal</th>
                                    <th className="px-6 py-4 text-center"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {billItems.map(item => (
                                    <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-neutral-900">{item.name}</p>
                                            <p className="text-[10px] text-neutral-400 font-mono uppercase">{item.sku}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold hover:bg-black hover:text-white transition-all">-</button>
                                                <span className="text-xs font-black w-4 text-center">{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold hover:bg-black hover:text-white transition-all">+</button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-xs font-bold text-neutral-500">{formatPKR(item.price)}</td>
                                        <td className="px-6 py-4 text-right text-sm font-black text-neutral-900">{formatPKR(item.price * item.qty)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => removeItem(item.id)} className="p-2 text-neutral-300 hover:text-rose-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {billItems.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center py-32 text-neutral-300 space-y-4">
                                <Receipt className="w-16 h-16 opacity-10" />
                                <p className="text-xs font-bold uppercase tracking-widest italic">Terminal Ready. Search items to begin.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. RIGHT SIDE: CUSTOMER & CALCULATIONS */}
                <div className="lg:col-span-4 space-y-6 no-print">
                    
                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-[2rem] border border-neutral-200 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                            <User className="w-4 h-4" /> Client Profiling
                        </h3>
                        <select 
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                            value={selectedCustomer?.id || ""}
                            onChange={(e) => setSelectedCustomer(customers.find(c => c.id === e.target.value))}
                        >
                            <option value="">Walk-in Customer</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {selectedCustomer && (
                            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                <p className="text-xs font-black text-neutral-900">{selectedCustomer.name}</p>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">{selectedCustomer.phone}</p>
                            </div>
                        )}
                    </div>

                    {/* Grand Summary Panel */}
                    <div className="bg-neutral-900 p-8 rounded-[2.5rem] text-white shadow-2xl space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Order Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center opacity-60 text-xs font-bold uppercase tracking-tighter">
                                <span>Gross Subtotal</span>
                                <span className="font-mono">{formatPKR(subtotal)}</span>
                            </div>

                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold opacity-60 uppercase"><Percent className="w-3.5 h-3.5" /> GST (%)</div>
                                <input type="number" className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-right text-xs font-black outline-none focus:border-[#B08D57]" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                            </div>

                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold opacity-60 uppercase"><DollarSign className="w-3.5 h-3.5" /> Discount</div>
                                <input type="number" className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-right text-xs font-black outline-none focus:border-[#B08D57]" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-neutral-500">Tax Payable</span>
                                    <span className="text-sm font-black text-[#B08D57] font-mono">+{formatPKR(taxAmount)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Net Amount</span>
                                    <span className="text-4xl font-black font-serif italic text-[#B08D57]">{formatPKR(grandTotal)}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleCompleteTransaction}
                                disabled={billItems.length === 0 || isLoading}
                                className="w-full py-5 bg-[#B08D57] hover:bg-[#967548] disabled:opacity-30 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                                Complete & Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. HIDDEN PRINT LAYOUT (Faisal Kamir Original Receipt) */}
            <div className="hidden print:block fixed inset-0 bg-white p-8 font-sans">
                <div className="text-center border-b pb-6 mb-6">
                    <h1 className="text-2xl font-black tracking-widest uppercase italic font-serif">FAISAL KAMIR</h1>
                    <p className="text-[10px] uppercase font-bold text-neutral-500">Luxury Premium Fabrics</p>
                    <p className="text-[9px] mt-1">Lahore, Pakistan • +92 300 0000000</p>
                </div>
                
                <div className="flex justify-between text-[10px] font-bold uppercase mb-6">
                    <div>
                        <p>Invoice: INV-{Date.now().toString().slice(-6)}</p>
                        <p>Customer: {selectedCustomer?.name || 'Walk-in'}</p>
                    </div>
                    <div className="text-right">
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <p>Time: {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>

                <table className="w-full text-[10px] mb-6">
                    <thead className="border-b-2 border-black">
                        <tr>
                            <th className="py-2 text-left">Item Description</th>
                            <th className="py-2 text-center">Qty</th>
                            <th className="py-2 text-right">Price</th>
                            <th className="py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                        {billItems.map(item => (
                            <tr key={item.id}>
                                <td className="py-2">{item.name}</td>
                                <td className="py-2 text-center">{item.qty}</td>
                                <td className="py-2 text-right">{formatPKR(item.price)}</td>
                                <td className="py-2 text-right font-bold">{formatPKR(item.price * item.qty)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-48 space-y-1 text-[10px]">
                        <div className="flex justify-between"><span>Subtotal:</span><span>{formatPKR(subtotal)}</span></div>
                        <div className="flex justify-between"><span>GST ({taxRate}%):</span><span>{formatPKR(taxAmount)}</span></div>
                        {discount > 0 && <div className="flex justify-between"><span>Discount:</span><span>-{formatPKR(discount)}</span></div>}
                        <div className="flex justify-between font-black text-xs border-t border-black pt-2 mt-2">
                            <span>TOTAL:</span><span>{formatPKR(grandTotal)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center border-t pt-4">
                    <p className="text-[9px] font-bold uppercase tracking-widest italic">Thank you for shopping at Faisal Kamir</p>
                    <p className="text-[8px] text-neutral-400 mt-1">Exchange possible within 7 days with original receipt.</p>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;