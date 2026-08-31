import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Plus, Download, Eye, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { formatPKR, formatDate } from '../../utils/formatters';

const CustomersListPage = () => {
    // FIX 1: Default value [] set ki hai taake undefined crash na kare
    const { customers = [], addCustomer } = useApp();
    const navigate = useNavigate();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');
    const [selectedTag, setSelectedTag] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    // Add customer modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('+92 3');
    const [newCity, setNewCity] = useState('Lahore');
    const [newAddress, setNewAddress] = useState('');
    const [newTags, setNewTags] = useState('VIP Client');

    // Loading State Guard
    if (!customers) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading Directory...</p>
            </div>
        );
    }

    // Filtered logic with safety checks
    const filteredCustomers = useMemo(() => {
        return customers.filter((c) => {
            const matchesSearch = 
                (c.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (c.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (c.phone || "").includes(searchQuery) ||
                (c.city?.toLowerCase() || "").includes(searchQuery.toLowerCase());
            
            const matchesCity = selectedCity === 'All' || c.city === selectedCity;
            // FIX 2: Added optional chaining ?. for tags
            const matchesTag = selectedTag === 'All' || c.tags?.includes(selectedTag);
            
            return matchesSearch && matchesCity && matchesTag;
        });
    }, [customers, searchQuery, selectedCity, selectedTag]);

    const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
    
    // FIX 3: Safety check before slice
    const paginatedCustomers = (filteredCustomers || []).slice(
        (currentPage - 1) * pageSize, 
        currentPage * pageSize
    );

    const handleAddCustomerSubmit = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        
        addCustomer({
            name: newName,
            email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
            phone: newPhone,
            city: newCity,
            address: newAddress || `${newCity}, Pakistan`,
            totalOrders: 0,
            totalSpent: 0,
            joinedDate: new Date().toISOString(),
            tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
            avatar: `https://ui-avatars.com/api/?name=${newName}&background=random`,
            status: 'Active',
        });
        
        setIsAddModalOpen(false);
        setNewName('');
        setNewEmail('');
        setNewAddress('');
    };

    const exportCustomersCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'City', 'Total Orders', 'Total Spent (PKR)', 'Status'];
        const rows = filteredCustomers.map((c) => [
            `"${c.name}"`,
            `"${c.email}"`,
            `"${c.phone}"`,
            `"${c.city}"`,
            c.totalOrders,
            c.totalSpent,
            c.status,
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `customers_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Customer Directory</h2>
                    <p className="text-sm text-neutral-500 mt-1 font-medium italic">
                        Managing {customers.length} client profiles & purchase velocity.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={exportCustomersCSV} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold shadow-sm transition-all">
                        <Download className="w-4 h-4"/>
                        <span>Export CSV</span>
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-lg shadow-neutral-200 transition-all active:scale-95">
                        <Plus className="w-4 h-4"/>
                        <span>Register Client</span>
                    </button>
                </div>
            </div>

            {/* 2. Advanced Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input 
                            type="text" 
                            placeholder="Search by name, email, phone or city..." 
                            value={searchQuery} 
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-700 bg-white outline-none">
                            <option value="All">All Cities</option>
                            <option value="Karachi">Karachi</option>
                            <option value="Lahore">Lahore</option>
                            <option value="Islamabad">Islamabad</option>
                        </select>

                        <select value={selectedTag} onChange={(e) => { setSelectedTag(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-700 bg-white outline-none">
                            <option value="All">All Segments</option>
                            <option value="VIP Client">VIP Client</option>
                            <option value="High Spender">High Spender</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 3. Main Data Table */}
            <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-sm overflow-hidden">
                {filteredCustomers.length === 0 ? (
                    <EmptyState icon={Users} title="No Records Found" description="Try adjusting your segment or city filters." actionText="Register Client" onAction={() => setIsAddModalOpen(true)}/>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/50 border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Customer Profile</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Contact Details</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Orders</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">Lifetime Spent</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-5 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {paginatedCustomers.map((cust) => (
                                    <tr key={cust.id} onClick={() => navigate(`/customers/${cust.id}`)} className="group hover:bg-neutral-50 transition-colors cursor-pointer">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                                                    <img src={cust.avatar} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-neutral-900 group-hover:text-black transition-colors">{cust.name}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {/* FIX 4: Safe slice for tags */}
                                                        {cust.tags?.slice(0, 1).map(tag => (
                                                            <span key={tag} className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                                                <Sparkles className="w-2.5 h-2.5" />
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        <span className="text-[10px] font-bold text-neutral-400">• {cust.city}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-bold text-neutral-800">{cust.phone}</p>
                                            <p className="text-[10px] text-neutral-400 font-medium">{cust.email}</p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="px-3 py-1 bg-neutral-100 rounded-xl text-[11px] font-black text-neutral-900">{cust.totalOrders}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-neutral-900 text-sm">
                                            {formatPKR(cust.totalSpent)}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <StatusBadge status={cust.status} size="sm" />
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end p-2 text-neutral-400 group-hover:text-black transition-colors">
                                                <Eye className="w-5 h-5" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredCustomers.length} pageSize={pageSize} onPageChange={setCurrentPage} />
            </div>

            {/* 4. Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Client" maxWidth="md">
                <form onSubmit={handleAddCustomerSubmit} className="space-y-5 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Full Name *</label>
                            <input type="text" required placeholder="Naveed Ahmed" value={newName} onChange={(e) => setNewName(e.target.value)} 
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-neutral-900/5" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <input type="text" required placeholder="+92 300 0000000" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} 
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-neutral-900/5" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Email (Optional)</label>
                        <input type="email" placeholder="client@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} 
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold outline-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">City</label>
                            <select value={newCity} onChange={(e) => setNewCity(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold outline-none">
                                <option value="Lahore">Lahore</option>
                                <option value="Karachi">Karachi</option>
                                <option value="Islamabad">Islamabad</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Tags</label>
                            <input type="text" placeholder="VIP Client, Regular" value={newTags} onChange={(e) => setNewTags(e.target.value)} 
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold outline-none" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-neutral-100">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 border border-neutral-200 rounded-2xl text-xs font-black uppercase text-neutral-500 hover:bg-neutral-50 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase shadow-xl shadow-neutral-200 transition-all active:scale-95">Register</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CustomersListPage;