import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, User, ShoppingBag, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPKR } from '../../utils/formatters';

export const CreateOrderPage = () => {
    const navigate = useNavigate();
    const { products, customers, createOrder } = useApp();

    // Customer Form
    const [customerId, setCustomerId] = useState(customers[0]?.id || '');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('Lahore');
    const [province, setProvince] = useState('Punjab');
    const [postalCode, setPostalCode] = useState('54000');

    // Order Items
    const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
    const [selectedVariantSku, setSelectedVariantSku] = useState(products[0]?.variants[0]?.sku || '');
    const [itemQty, setItemQty] = useState(1);
    const [orderItems, setOrderItems] = useState([]);

    // Shipping & Payment
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [shippingFee, setShippingFee] = useState(250);
    const [discount, setDiscount] = useState(0); // Renamed to 'discount' to match Detail page

    // Auto-fill from customer selection
    const handleSelectExistingCustomer = (id) => {
        const cust = customers.find((c) => c.id === id);
        if (cust) {
            setCustomerId(cust.id);
            setCustomerName(cust.name);
            setCustomerEmail(cust.email || '');
            setCustomerPhone(cust.phone);
            setStreet(cust.address || '');
            setCity(cust.city || 'Lahore');
        }
    };

    const handleAddItem = () => {
        const prod = products.find((p) => p.id === selectedProductId);
        if (!prod) return;
        
        const variant = prod.variants.find((v) => v.sku === selectedVariantSku) || prod.variants[0];
        
        const newItem = {
            id: `item-${Date.now()}`,
            productId: prod.id,
            productName: prod.name,
            productImage: prod.images[0],
            sku: variant.sku, // Replaced variantSku with sku for consistency
            size: variant.size,
            color: variant.color,
            price: variant.price,
            quantity: Number(itemQty),
        };
        setOrderItems([...orderItems, newItem]);
    };

    const handleRemoveItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    // Totals Logic
    const subtotal = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const total = Math.max(0, subtotal + shippingFee + tax - discount);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (orderItems.length === 0) {
            alert('Please add at least one product item to the order.');
            return;
        }

        // Generate a new Order
        const newOrder = {
            id: `ord-${Date.now()}`, // Creating ID here just in case
            orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toISOString(),
            customerId: customerId || 'guest',
            customerName,
            customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
            customerPhone,
            shippingAddress: {
                street: street || 'N/A',
                city,
                province,
                postalCode,
            },
            items: orderItems,
            subtotal,
            discount,
            shippingFee,
            tax,
            total,
            paymentMethod,
            paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
            status: 'Confirmed',
            notes: []
        };

        try {
            const created = createOrder(newOrder);
            // Agar createOrder context se object return kar raha hai toh uska ID use karein
            const orderId = created?.id || newOrder.id;
            navigate(`/orders/${orderId}`);
        } catch (error) {
            console.error("Order Creation Failed:", error);
            alert("Could not create order. Please check console.");
        }
    };

    const selectedProduct = products.find((p) => p.id === selectedProductId);

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/orders')} className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors">
                    <ArrowLeft className="w-4 h-4"/>
                </button>
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Create Manual Order</h2>
                    <p className="text-xs text-neutral-500 mt-0.5 font-serif italic">Book manual orders for phone or VIP clients.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information Card */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                        <h3 className="font-bold text-neutral-900 text-xs flex items-center gap-2 uppercase tracking-widest">
                            <User className="w-4 h-4 text-[#B08D57]"/> Customer Details
                        </h3>
                        <select onChange={(e) => handleSelectExistingCustomer(e.target.value)} className="px-3 py-1.5 border border-neutral-200 rounded-xl text-[11px] bg-neutral-50 outline-none">
                            <option value="">Select Existing Customer</option>
                            {customers.map((c) => (<option key={c.id} value={c.id}>{c.name} ({c.city})</option>))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Name *</label>
                            <input required type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-900" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Phone *</label>
                            <input required type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-900" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Email</label>
                            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-900" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Address</label>
                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-900" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">City</label>
                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-neutral-900" />
                        </div>
                    </div>
                </div>

                {/* Product Selection */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-neutral-900 text-xs flex items-center gap-2 uppercase tracking-widest border-b border-neutral-100 pb-3">
                        <ShoppingBag className="w-4 h-4 text-[#B08D57]"/> Order Items
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                        <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Product</label>
                            <select value={selectedProductId} onChange={(e) => {
                                setSelectedProductId(e.target.value);
                                const p = products.find(prod => prod.id === e.target.value);
                                if (p?.variants[0]) setSelectedVariantSku(p.variants[0].sku);
                            }} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none">
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Variant</label>
                            <select value={selectedVariantSku} onChange={(e) => setSelectedVariantSku(e.target.value)} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none">
                                {selectedProduct?.variants.map(v => <option key={v.sku} value={v.sku}>{v.size} / {v.color}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <input type="number" min="1" value={itemQty} onChange={(e) => setItemQty(e.target.value)} className="w-16 px-2 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-center outline-none" />
                            <button type="button" onClick={handleAddItem} className="flex-1 bg-neutral-900 text-white rounded-xl text-[11px] font-bold hover:bg-neutral-800 transition-all">Add</button>
                        </div>
                    </div>

                    {/* Table of Items */}
                    <div className="mt-4 border border-neutral-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 text-neutral-400 uppercase text-[9px] font-bold">
                                <tr>
                                    <th className="p-3">Item</th>
                                    <th className="p-3">Price</th>
                                    <th className="p-3">Qty</th>
                                    <th className="p-3 text-right">Total</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {orderItems.map((item, idx) => (
                                    <tr key={idx} className="text-neutral-700">
                                        <td className="p-3 font-semibold">{item.productName} ({item.size})</td>
                                        <td className="p-3">{formatPKR(item.price)}</td>
                                        <td className="p-3">{item.quantity}</td>
                                        <td className="p-3 text-right font-bold">{formatPKR(item.price * item.quantity)}</td>
                                        <td className="p-3 text-right"><button type="button" onClick={() => handleRemoveItem(idx)}><Trash2 className="w-3.5 h-3.5 text-rose-500"/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Final Totals & Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-widest flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#B08D57]"/> Payment & Shipping</h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Method</label>
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none">
                                    <option value="Cash on Delivery">Cash on Delivery</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Shipping</label>
                                    <input type="number" value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Discount</label>
                                    <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900 p-6 rounded-2xl text-white shadow-lg space-y-4 flex flex-col justify-between">
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between opacity-70"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
                            <div className="flex justify-between opacity-70"><span>Tax (5%)</span><span>{formatPKR(tax)}</span></div>
                            <div className="flex justify-between opacity-70"><span>Shipping</span><span>{formatPKR(shippingFee)}</span></div>
                            {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>-{formatPKR(discount)}</span></div>}
                            <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-2 mt-2"><span>Total</span><span>{formatPKR(total)}</span></div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => navigate('/orders')} className="flex-1 py-3 border border-white/20 rounded-xl text-xs font-bold hover:bg-white/5">Cancel</button>
                            <button type="submit" className="flex-1 py-3 bg-white text-neutral-900 rounded-xl text-xs font-bold hover:bg-neutral-100">Confirm Order</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};