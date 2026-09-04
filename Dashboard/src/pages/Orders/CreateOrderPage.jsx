import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Plus, Trash2, User, ShoppingBag, 
    CreditCard, Package, ChevronDown, Loader2, Info
} from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { formatPKR } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { toast } from 'react-hot-toast';

export const CreateOrderPage = () => {
    const navigate = useNavigate();
    const { products, customers, createOrder, fetchProducts, fetchCustomers, isLoading } = useProductStore();

    useEffect(() => { 
        fetchProducts();
        fetchCustomers();
    }, []);

    // Customer States
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('Lahore');

    // Order Items States
    const [orderItems, setOrderItems] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [itemQty, setItemQty] = useState(1);

    // Payment States
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [shippingFee, setShippingFee] = useState(250);
    const [discount, setDiscount] = useState(0);

    // Handle Selecting Existing Customer
    const handleSelectExistingCustomer = (id) => {
        const cust = customers.find((c) => (c._id || c.id) === id);
        if (cust) {
            setCustomerId(cust._id || cust.id);
            setCustomerName(cust.name);
            setCustomerEmail(cust.email || '');
            setCustomerPhone(cust.phone);
            setStreet(cust.address || '');
            setCity(cust.city || 'Lahore');
        }
    };

    // Find currently selected product object
    const currentProduct = useMemo(() => {
        return products.find(p => (p._id || p.id) === selectedProductId);
    }, [selectedProductId, products]);

    // Handle Adding Item to List
    const handleAddItem = () => {
        if (!selectedProductId) return toast.error("Please select a product");
        
        const prod = currentProduct;
        const variants = prod.variants || [];
        const variant = variants[selectedVariantIndex];

        // Unique ID for the row
        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            productId: prod._id || prod.id,
            productName: prod.name,
            productImage: prod.images?.[0]?.url || '',
            sku: variant?.sku || prod.sku,
            size: variant?.size || 'Standard',
            color: variant?.color || 'N/A',
            price: variant?.price || prod.price,
            quantity: Number(itemQty)
        };

        setOrderItems([...orderItems, newItem]);
        setItemQty(1);
        toast.success("Item added to order");
    };

    // Calculations
    const subtotal = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * 0.05); // 5% Tax
    const total = Math.max(0, subtotal + Number(shippingFee) + tax - Number(discount));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (orderItems.length === 0) return toast.error("Add at least one item");

        const orderPayload = {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress: { street, city, province: 'Punjab', postalCode: '54000' },
            items: orderItems.map(item => ({
                product: item.productId,
                productName: item.productName,
                sku: item.sku,
                quantity: item.quantity,
                price: item.price,
                variant: { size: item.size, color: item.color }
            })),
            subtotal,
            discount: Number(discount),
            shippingFee: Number(shippingFee),
            tax,
            total,
            paymentMethod,
            paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
            status: 'Confirmed'
        };

        try {
            const res = await createOrder(orderPayload);
            const createdOrder = res.data || res;
            navigate(`/orders/${createdOrder._id || createdOrder.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12 px-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/orders')} className="p-2.5 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 transition-all">
                    <ArrowLeft className="w-4 h-4"/>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 font-serif italic">Create New Order</h2>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-black">Manual Order Management</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Order & Customer Details */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Customer Info Section */}
                    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                            <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4 text-[#B08D57]"/> Customer Information
                            </h3>
                            <select 
                                onChange={(e) => handleSelectExistingCustomer(e.target.value)} 
                                className="px-3 py-2 border border-neutral-200 rounded-xl text-[11px] font-bold bg-neutral-50 outline-none cursor-pointer"
                            >
                                <option value="">Select Existing Customer</option>
                                {customers.map((c) => (
                                    <option key={c._id || c.id} value={c._id || c.id}>
                                        {c.name} ({c.city})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Customer Name</label>
                                <input placeholder="Full Name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold outline-none focus:border-neutral-900 transition-all" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Phone Number</label>
                                <input placeholder="03xx xxxxxxx" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold outline-none focus:border-neutral-900" />
                            </div>
                            <div className="sm:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Address / Street</label>
                                <input placeholder="House #, Street, Area" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold outline-none focus:border-neutral-900" />
                            </div>
                        </div>
                    </div>

                    {/* Product Selection Section */}
                    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
                        <h3 className="font-bold text-xs uppercase tracking-widest border-b border-neutral-100 pb-4 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-[#B08D57]"/> Select Products
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                            <div className="sm:col-span-5 space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Search Product</label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold outline-none cursor-pointer" 
                                    value={selectedProductId}
                                    onChange={(e) => {
                                        setSelectedProductId(e.target.value);
                                        setSelectedVariantIndex(0);
                                    }}
                                >
                                    <option value="">Choose a product...</option>
                                    {products.map(p => (
                                        <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Variant</label>
                                <select 
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold outline-none cursor-pointer"
                                    value={selectedVariantIndex}
                                    onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                                    disabled={!currentProduct?.variants?.length}
                                >
                                    {currentProduct?.variants?.length ? (
                                        currentProduct.variants.map((v, idx) => (
                                            <option key={idx} value={idx}>{v.size} / {v.color} - {formatPKR(v.price)}</option>
                                        ))
                                    ) : (
                                        <option value={0}>Standard (Base)</option>
                                    )}
                                </select>
                            </div>

                            <div className="sm:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Qty</label>
                                <input type="number" min="1" value={itemQty} onChange={(e) => setItemQty(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold outline-none" />
                            </div>

                            <button 
                                type="button" 
                                onClick={handleAddItem} 
                                className="sm:col-span-2 h-[42px] bg-neutral-900 text-white rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center"
                            >
                                Add
                            </button>
                        </div>

                        {/* Order Items Table */}
                        <div className="overflow-x-auto pt-4">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-neutral-50 font-black uppercase text-[9px] text-neutral-400 tracking-widest">
                                        <th className="px-4 py-3">Product Info</th>
                                        <th className="px-4 py-3">Price</th>
                                        <th className="px-4 py-3">Qty</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                        <th className="px-4 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {orderItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-10 text-center text-neutral-400 italic">No items added to this order yet.</td>
                                        </tr>
                                    ) : (
                                        orderItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-neutral-50/50">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200">
                                                            <img src={item.productImage || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-neutral-900">{item.productName}</p>
                                                            <p className="text-[9px] text-neutral-400 font-bold uppercase">{item.size} / {item.color}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 font-bold text-neutral-700">{formatPKR(item.price)}</td>
                                                <td className="px-4 py-4 font-bold">x{item.quantity}</td>
                                                <td className="px-4 py-4 text-right font-black text-neutral-900">{formatPKR(item.price * item.quantity)}</td>
                                                <td className="px-4 py-4 text-right">
                                                    <button type="button" onClick={() => setOrderItems(orderItems.filter(i => i.id !== item.id))} className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-all">
                                                        <Trash2 className="w-3.5 h-3.5"/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Side: Summary & Payment */}
                <div className="space-y-6">
                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-[#B08D57]"/> Payment & Logistics
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Payment Method</label>
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold outline-none cursor-pointer">
                                    <option value="Cash on Delivery">Cash on Delivery</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Card Payment">Card Payment</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Shipping</label>
                                    <input type="number" value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} className="w-full px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Discount</label>
                                    <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-bold outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Totals */}
                    <div className="bg-neutral-900 p-6 rounded-3xl text-white shadow-xl space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-50 border-b border-white/10 pb-4">Order Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold opacity-70">
                                <span>Subtotal</span>
                                <span>{formatPKR(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold opacity-70">
                                <span>Shipping</span>
                                <span>{formatPKR(shippingFee)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold opacity-70">
                                <span>Tax (5%)</span>
                                <span>{formatPKR(tax)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-[#B08D57]">
                                <span>Discount</span>
                                <span>-{formatPKR(discount)}</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-white/10">
                                <span className="text-xs font-black uppercase opacity-50">Grand Total</span>
                                <span className="text-2xl font-black text-white leading-none">{formatPKR(total)}</span>
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isLoading || orderItems.length === 0}
                            className="w-full py-4 bg-[#B08D57] hover:bg-[#8e7146] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Confirm Order'}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
                        <Info className="w-4 h-4 shrink-0" />
                        <p className="text-[10px] font-bold leading-tight uppercase">Confirming this order will automatically deduct stock from inventory.</p>
                    </div>
                </div>
            </form>
        </div>
    );
};