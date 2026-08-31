import React, { useState, useEffect } from 'react';
import { Store, Truck, CreditCard, Bell, Save, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsPage = () => {
    const { settings, updateSettings, showToast } = useApp();
    const [activeTab, setActiveTab] = useState('Store');

    // Safe State Initialization
    // Humne default values rakhi hain taake agar settings na mile to crash na ho
    const [brandName, setBrandName] = useState(settings?.storeName || '');
    const [tagline, setTagline] = useState(settings?.tagline || '');
    const [email, setEmail] = useState(settings?.email || '');
    const [phone, setPhone] = useState(settings?.phone || '');
    const [address, setAddress] = useState(settings?.address || '');
    const [currency, setCurrency] = useState(settings?.currency || 'PKR');

    // Shipping
    const [standardDeliveryFee, setStandardDeliveryFee] = useState(settings?.shipping?.standardDeliveryFee || 0);
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings?.shipping?.freeShippingThreshold || 0);
    const [primaryCourier, setPrimaryCourier] = useState(settings?.shipping?.primaryCourier || 'TCS Express');

    // Payments
    const [codEnabled, setCodEnabled] = useState(settings?.payments?.codEnabled ?? true);
    const [bankTransferEnabled, setBankTransferEnabled] = useState(settings?.payments?.bankTransferEnabled ?? false);
    const [jazzcashEnabled, setJazzcashEnabled] = useState(settings?.payments?.jazzcashEnabled ?? false);
    const [easypaisaEnabled, setEasypaisaEnabled] = useState(settings?.payments?.easypaisaEnabled ?? false);
    const [bankDetails, setBankDetails] = useState(settings?.payments?.bankDetails || '');

    // Notifications
    const [orderConfirmationSms, setOrderConfirmationSms] = useState(settings?.notifications?.orderConfirmationSms ?? true);
    const [orderDispatchedSms, setOrderDispatchedSms] = useState(settings?.notifications?.orderDispatchedSms ?? true);
    const [orderConfirmationEmail, setOrderConfirmationEmail] = useState(settings?.notifications?.orderConfirmationEmail ?? true);

    // Agar settings load nahi hui to loading spinner dikhao
    if (!settings) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs font-medium">Loading configurations...</p>
            </div>
        );
    }

    const handleSave = (e) => {
        if (e) e.preventDefault();
        
        updateSettings({
            storeName: brandName,
            tagline,
            email,
            phone,
            address,
            currency,
            shipping: {
                standardDeliveryFee: Number(standardDeliveryFee),
                freeShippingThreshold: Number(freeShippingThreshold),
                primaryCourier,
            },
            payments: {
                codEnabled,
                bankTransferEnabled,
                jazzcashEnabled,
                easypaisaEnabled,
                bankDetails,
            },
            notifications: {
                orderConfirmationSms,
                orderDispatchedSms,
                orderConfirmationEmail,
            },
        });
        showToast('Settings Saved', 'System configurations updated successfully.');
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">System & Brand Settings</h2>
                    <p className="text-xs text-neutral-500 mt-1 font-medium">
                        Configure Pakistani logistics, payment channels, and SMS triggers.
                    </p>
                </div>

                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-lg shadow-neutral-200 transition-all active:scale-95">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto no-scrollbar">
                {[
                    { id: 'Store', icon: Store, label: 'Store Info' },
                    { id: 'Shipping', icon: Truck, label: 'Shipping' },
                    { id: 'Payments', icon: CreditCard, label: 'Payments' },
                    { id: 'Notifications', icon: Bell, label: 'Alerts' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-neutral-900 text-white shadow-md'
                                : 'text-neutral-500 hover:bg-neutral-100'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {/* Tab 1: Store Information */}
                {activeTab === 'Store' && (
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Brand Name *</label>
                                <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-neutral-900 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Tagline</label>
                                <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-medium text-neutral-600 focus:ring-2 focus:ring-neutral-900 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Support Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-neutral-900 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Hotline Phone</label>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-neutral-900 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Currency</label>
                                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-bold text-neutral-900 bg-white outline-none">
                                    <option value="PKR">PKR (₨)</option>
                                    <option value="USD">USD ($)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Head Office Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-neutral-900 outline-none" />
                        </div>
                    </div>
                )}

                {/* Tab 2: Shipping */}
                {activeTab === 'Shipping' && (
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Delivery Fee (PKR)</label>
                                <input type="number" value={standardDeliveryFee} onChange={(e) => setStandardDeliveryFee(Number(e.target.value))} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-bold text-neutral-900 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Free Shipping Above (PKR)</label>
                                <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-bold text-neutral-900 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Logistics Partner</label>
                            <select value={primaryCourier} onChange={(e) => setPrimaryCourier(e.target.value)} className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl font-bold text-neutral-900 bg-white outline-none">
                                <option value="TCS Express">TCS Express</option>
                                <option value="Leopards Courier">Leopards Courier</option>
                                <option value="Trax Logistics">Trax Express</option>
                                <option value="PostEx">PostEx</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Tab 3: Payments */}
                {activeTab === 'Payments' && (
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                        {[
                            { id: 'cod', label: 'Cash on Delivery', state: codEnabled, set: setCodEnabled },
                            { id: 'bank', label: 'Direct Bank Transfer', state: bankTransferEnabled, set: setBankTransferEnabled },
                            { id: 'jazz', label: 'JazzCash / EasyPaisa', state: jazzcashEnabled, set: setJazzcashEnabled }
                        ].map((pay) => (
                            <label key={pay.id} className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-2xl border border-neutral-200 cursor-pointer transition-colors">
                                <span className="text-sm font-bold text-neutral-800">{pay.label}</span>
                                <input type="checkbox" checked={pay.state} onChange={(e) => pay.set(e.target.checked)} className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-0" />
                            </label>
                        ))}

                        {bankTransferEnabled && (
                            <div className="pt-4 border-t border-neutral-100">
                                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Corporate Bank Details</label>
                                <textarea rows={3} value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} className="w-full px-4 py-3 border border-neutral-200 rounded-xl font-mono text-xs text-neutral-700 bg-neutral-50 outline-none" placeholder="Account Title, IBAN, Bank Name..." />
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 4: Notifications */}
                {activeTab === 'Notifications' && (
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                        {[
                            { label: 'SMS on Order Confirmation', state: orderConfirmationSms, set: setOrderConfirmationSms },
                            { label: 'SMS on Dispatch (Tracking)', state: orderDispatchedSms, set: setOrderDispatchedSms },
                            { label: 'Email HTML Invoices', state: orderConfirmationEmail, set: setOrderConfirmationEmail }
                        ].map((notif, idx) => (
                            <label key={idx} className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-2xl border border-neutral-200 cursor-pointer transition-colors">
                                <span className="text-sm font-bold text-neutral-800">{notif.label}</span>
                                <input type="checkbox" checked={notif.state} onChange={(e) => notif.set(e.target.checked)} className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-0" />
                            </label>
                        ))}
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <button onClick={handleSave} className="px-8 py-3 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95">
                        Save All Configurations
                    </button>
                </div>
            </div>
        </div>
    );
};