import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, User, ShoppingBag, CreditCard, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPKR } from '../../utils/formatters';
export const CreateOrderPage = () => {
    const navigate = useNavigate();
    const { products, customers, createOrder } = useApp();
    // Customer Form
    const [customerId, setCustomerId] = useState(customers[0]?.id || 'cust-1');
    const [customerName, setCustomerName] = useState(customers[0]?.name || '');
    const [customerEmail, setCustomerEmail] = useState(customers[0]?.email || '');
    const [customerPhone, setCustomerPhone] = useState(customers[0]?.phone || '+92 300 ');
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
    const [discountAmount, setDiscountAmount] = useState(0);
    // Auto-fill from customer selection
    const handleSelectExistingCustomer = (id) => {
        const cust = customers.find((c) => c.id === id);
        if (cust) {
            setCustomerId(cust.id);
            setCustomerName(cust.name);
            setCustomerEmail(cust.email);
            setCustomerPhone(cust.phone);
            setStreet(cust.address);
            setCity(cust.city);
        }
    };
    const handleAddItem = () => {
        const prod = products.find((p) => p.id === selectedProductId);
        if (!prod)
            return;
        const variant = prod.variants.find((v) => v.sku === selectedVariantSku) || prod.variants[0];
        const newItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            productId: prod.id,
            productName: prod.name,
            productImage: prod.images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
            variantSku: variant.sku,
            size: variant.size,
            color: variant.color,
            price: variant.price,
            quantity: Number(itemQty),
            total: variant.price * Number(itemQty),
        };
        setOrderItems([...orderItems, newItem]);
    };
    const handleRemoveItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };
    // Totals
    const subtotal = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const total = Math.max(0, subtotal + shippingFee + tax - discountAmount);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (orderItems.length === 0) {
            alert('Please add at least one product item to the order.');
            return;
        }
        const created = createOrder({
            customerId: customerId || 'cust-1',
            customerName,
            customerEmail: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
            customerPhone,
            shippingAddress: {
                street: street || 'Main Boulevard, Gulberg III',
                city,
                province,
                postalCode,
            },
            items: orderItems,
            subtotal,
            discountAmount,
            shippingFee,
            tax,
            total,
            paymentMethod,
            paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
            status: 'Confirmed',
        });
        navigate(`/orders/${created.id}`);
    };
    const selectedProduct = products.find((p) => p.id === selectedProductId);
    return (<div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/orders')} className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 transition-colors">
          <ArrowLeft className="w-4 h-4"/>
        </button>
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Create Manual Order</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Book phone orders, showroom custom appointments, and VIP client requests.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-2">
              <User className="w-4 h-4"/>
              <span>Customer & Destination</span>
            </h3>

            {/* Quick autofill from existing customer */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-500">Quick Select:</span>
              <select onChange={(e) => handleSelectExistingCustomer(e.target.value)} className="px-2.5 py-1 border border-neutral-200 rounded-lg text-xs bg-neutral-50 font-medium">
                <option value="">Select Existing Customer</option>
                {customers.map((c) => (<option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input type="text" required placeholder="e.g. Usman Tariq" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input type="text" required placeholder="+92 300 1234567" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
              <input type="email" placeholder="usman@example.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Street Address</label>
              <input type="text" placeholder="House #12, Street 4, Sector F-7/2" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 bg-white focus:outline-hidden">
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Sialkot">Sialkot</option>
                <option value="Quetta">Quetta</option>
                <option value="Gujranwala">Gujranwala</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Items Selector */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-2 border-b border-neutral-100 pb-3">
            <ShoppingBag className="w-4 h-4"/>
            <span>Add Products & Line Items</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Select Product</label>
              <select value={selectedProductId} onChange={(e) => {
            setSelectedProductId(e.target.value);
            const p = products.find((prod) => prod.id === e.target.value);
            if (p && p.variants[0]) {
                setSelectedVariantSku(p.variants[0].sku);
            }
        }} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 bg-white">
                {products.map((p) => (<option key={p.id} value={p.id}>
                    {p.name} — {formatPKR(p.salePrice)}
                  </option>))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Variant Size/Color</label>
              <select value={selectedVariantSku} onChange={(e) => setSelectedVariantSku(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 bg-white">
                {selectedProduct?.variants.map((v) => (<option key={v.sku} value={v.sku}>
                    {v.size} / {v.color} ({v.stock} in stock)
                  </option>))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Quantity</label>
              <div className="flex gap-2">
                <input type="number" min="1" value={itemQty} onChange={(e) => setItemQty(Number(e.target.value))} className="w-20 px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900"/>
                <button type="button" onClick={handleAddItem} className="flex-1 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold flex items-center justify-center gap-1 shadow-xs">
                  <Plus className="w-3.5 h-3.5"/>
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Selected Items Table */}
          <div className="mt-4 border border-neutral-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-200">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Size / Color</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Line Total</th>
                  <th className="w-10 p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orderItems.length === 0 ? (<tr>
                    <td colSpan={6} className="py-6 text-center text-neutral-400">
                      No items added yet. Use the dropdown above to add garments.
                    </td>
                  </tr>) : (orderItems.map((item, idx) => (<tr key={idx} className="hover:bg-neutral-50/50">
                      <td className="p-3 font-semibold text-neutral-900">{item.productName}</td>
                      <td className="p-3 text-neutral-600">{item.size} / {item.color}</td>
                      <td className="p-3 text-right font-medium">{formatPKR(item.price)}</td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right font-bold text-neutral-900">
                        {formatPKR(item.price * item.quantity)}
                      </td>
                      <td className="p-3 text-center">
                        <button type="button" onClick={() => handleRemoveItem(idx)} className="text-neutral-400 hover:text-rose-600 p-1">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </td>
                    </tr>)))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment & Financial Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-2">
              <CreditCard className="w-4 h-4"/>
              <span>Payment & Shipping Options</span>
            </h3>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 bg-white">
                <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                <option value="Bank Transfer">Direct Bank Transfer (IBFT)</option>
                <option value="JazzCash">JazzCash Mobile Account</option>
                <option value="Easypaisa">Easypaisa</option>
                <option value="Card">Credit / Debit Card</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Shipping Fee (PKR)</label>
                <input type="number" value={shippingFee} onChange={(e) => setShippingFee(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900"/>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Discount (PKR)</label>
                <input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-bold text-neutral-900"/>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2 text-xs flex flex-col justify-between">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs">Summary</h3>
            <div className="space-y-2 divide-y divide-neutral-100">
              <div className="flex justify-between text-neutral-600 pt-1">
                <span>Subtotal ({orderItems.length} items):</span>
                <span className="font-semibold text-neutral-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 pt-1">
                <span>Shipping Fee:</span>
                <span className="font-semibold text-neutral-900">{formatPKR(shippingFee)}</span>
              </div>
              {discountAmount > 0 && (<div className="flex justify-between text-emerald-700 pt-1">
                  <span>Discount:</span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>)}
              <div className="flex justify-between text-neutral-600 pt-1">
                <span>GST Tax (5%):</span>
                <span className="font-semibold text-neutral-900">{formatPKR(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Order Total:</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button type="button" onClick={() => navigate('/orders')} className="w-1/3 py-2.5 border border-neutral-200 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                Cancel
              </button>
              <button type="submit" className="w-2/3 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold shadow-xs transition-colors">
                Confirm & Create Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>);
};
