import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, ShoppingBag, Users, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { formatPKR } from '../../utils/formatters';
export const GlobalSearchModal = () => {
    const { searchModalOpen, setSearchModalOpen, products, orders, customers } = useApp();
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchModalOpen(true);
            }
            if (e.key === 'Escape' && searchModalOpen) {
                setSearchModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchModalOpen, setSearchModalOpen]);
    useEffect(() => {
        if (searchModalOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
        else {
            setQuery('');
        }
    }, [searchModalOpen]);
    if (!searchModalOpen)
        return null;
    const cleanQuery = query.toLowerCase().trim();
    const matchingProducts = cleanQuery
        ? products.filter((p) => p.name.toLowerCase().includes(cleanQuery) ||
            p.sku.toLowerCase().includes(cleanQuery) ||
            p.category.toLowerCase().includes(cleanQuery) ||
            p.tags.some((t) => t.toLowerCase().includes(cleanQuery))).slice(0, 4)
        : [];
    const matchingOrders = cleanQuery
        ? orders.filter((o) => o.orderNumber.toLowerCase().includes(cleanQuery) ||
            o.customerName.toLowerCase().includes(cleanQuery) ||
            o.customerPhone.toLowerCase().includes(cleanQuery) ||
            o.items.some((item) => item.productName.toLowerCase().includes(cleanQuery))).slice(0, 4)
        : [];
    const matchingCustomers = cleanQuery
        ? customers.filter((c) => c.name.toLowerCase().includes(cleanQuery) ||
            c.email.toLowerCase().includes(cleanQuery) ||
            c.phone.toLowerCase().includes(cleanQuery) ||
            c.city.toLowerCase().includes(cleanQuery)).slice(0, 4)
        : [];
    const hasResults = matchingProducts.length > 0 || matchingOrders.length > 0 || matchingCustomers.length > 0;
    return (<div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs transition-opacity" onClick={() => setSearchModalOpen(false)}/>

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24 text-center">
        <div className="relative w-full max-w-2xl transform rounded-xl bg-white text-left shadow-xl transition-all border border-[#E7E5E0] overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Search input bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E7E5E0] bg-[#F7F6F2]/50">
            <Search className="w-4 h-4 text-[#6B6B6B] shrink-0"/>
            <input ref={inputRef} type="text" placeholder="Search products, SKUs, orders, customers, phone numbers..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-xs font-medium text-[#181818] placeholder:text-[#9A9A9A] focus:outline-hidden"/>
            {query && (<button onClick={() => setQuery('')} className="p-1 rounded-md text-[#6B6B6B] hover:text-[#181818] hover:bg-[#E7E5E0]">
                <X className="w-3.5 h-3.5"/>
              </button>)}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-[#6B6B6B] bg-white rounded border border-[#E7E5E0]">
              ESC
            </kbd>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {!query ? (<div className="py-8 text-center text-xs text-[#9A9A9A]">
                Type something to search products, orders, and customer records...
              </div>) : !hasResults ? (<div className="py-8 text-center text-xs text-[#6B6B6B]">
                No matching results found for <span className="font-semibold text-[#181818]">"{query}"</span>
              </div>) : (<>
                {/* Products */}
                {matchingProducts.length > 0 && (<div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B] px-2 mb-1.5 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#B08D57]"/>
                      Products
                    </div>
                    <div className="space-y-1">
                      {matchingProducts.map((p) => (<div key={p.id} onClick={() => {
                        navigate(`/products/${p.id}`);
                        setSearchModalOpen(false);
                    }} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F7F6F2] cursor-pointer transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-[#E7E5E0] shrink-0"/>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#181818] truncate">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-[#6B6B6B]">
                                SKU: {p.sku} • {p.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#181818]">
                              {formatPKR(p.salePrice)}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#9A9A9A] group-hover:translate-x-0.5 transition-transform"/>
                          </div>
                        </div>))}
                    </div>
                  </div>)}

                {/* Orders */}
                {matchingOrders.length > 0 && (<div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B] px-2 mb-1.5 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#B08D57]"/>
                      Orders
                    </div>
                    <div className="space-y-1">
                      {matchingOrders.map((o) => (<div key={o.id} onClick={() => {
                        navigate(`/orders/${o.id}`);
                        setSearchModalOpen(false);
                    }} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F7F6F2] cursor-pointer transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-[#F7F6F2] flex items-center justify-center text-[#181818] font-mono text-xs font-semibold border border-[#E7E5E0] shrink-0">
                              {o.orderNumber.replace('#', '')}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#181818] truncate">
                                {o.orderNumber} — {o.customerName}
                              </p>
                              <p className="text-[11px] text-[#6B6B6B]">
                                {o.shippingAddress.city} • {o.status} • {o.paymentMethod}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#181818]">
                              {formatPKR(o.total)}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#9A9A9A] group-hover:translate-x-0.5 transition-transform"/>
                          </div>
                        </div>))}
                    </div>
                  </div>)}

                {/* Customers */}
                {matchingCustomers.length > 0 && (<div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B] px-2 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#B08D57]"/>
                      Customers
                    </div>
                    <div className="space-y-1">
                      {matchingCustomers.map((c) => (<div key={c.id} onClick={() => {
                        navigate(`/customers/${c.id}`);
                        setSearchModalOpen(false);
                    }} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F7F6F2] cursor-pointer transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-[#E7E5E0] shrink-0"/>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#181818] truncate">
                                {c.name}
                              </p>
                              <p className="text-[11px] text-[#6B6B6B]">
                                {c.phone} • {c.city} • {c.totalOrders} Orders
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 flex items-center gap-2">
                            <span className="text-xs font-medium text-[#181818]">
                              {formatPKR(c.totalSpent)}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#9A9A9A] group-hover:translate-x-0.5 transition-transform"/>
                          </div>
                        </div>))}
                    </div>
                  </div>)}
              </>)}
          </div>

          {/* Footer prompt */}
          <div className="px-4 py-2.5 bg-[#F7F6F2] border-t border-[#E7E5E0] flex items-center justify-between text-[11px] text-[#6B6B6B]">
            <span>Search Apexiums Catalog & Orders Database</span>
            <span className="font-medium text-[#181818]">Quick Navigation</span>
          </div>
        </div>
      </div>
    </div>);
};
