import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Plus, Download, Eye, Sparkles, Loader2 } from 'lucide-react';
import { useProductStore } from '../../store/UseProductsStore.js';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { formatPKR, formatDate } from '../../utils/formatters';

const CustomersListPage = () => {
    const { customers, fetchCustomers, addCustomer, isLoading } = useProductStore();
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchCustomers();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');
    const [selectedTag, setSelectedTag] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('+92 3');
    const [newCity, setNewCity] = useState('Lahore');
    const [newAddress, setNewAddress] = useState('');
    const [newTags, setNewTags] = useState('VIP Client');

    const filteredCustomers = useMemo(() => {
        return customers.filter((c) => {
            const matchesSearch = 
                (c.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (c.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                (c.phone || "").includes(searchQuery) ||
                (c.city?.toLowerCase() || "").includes(searchQuery.toLowerCase());
            const matchesCity = selectedCity === 'All' || c.city === selectedCity;
            const matchesTag = selectedTag === 'All' || c.tags?.includes(selectedTag);
            return matchesSearch && matchesCity && matchesTag;
        });
    }, [customers, searchQuery, selectedCity, selectedTag]);

    const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleAddCustomerSubmit = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        
        try {
            await addCustomer({
                name: newName,
                email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
                phone: newPhone,
                city: newCity,
                address: newAddress || `${newCity}, Pakistan`,
                totalOrders: 0,
                totalSpent: 0,
                joinedDate: new Date().toISOString(),
                tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
                avatar: `https://ui-avatars.com/api/?name=${newName}&background=181818&color=fff`,
                status: 'Active',
            });
            setIsAddModalOpen(false);
            setNewName(''); setNewEmail(''); setNewAddress('');
        } catch (error) {
            alert("Failed to register client");
        }
    };

    const exportCustomersCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'City', 'Orders', 'Spent', 'Status'];
        const rows = filteredCustomers.map(c => [`"${c.name}"`, `"${c.email}"`, `"${c.phone}"`, `"${c.city}"`, c.totalOrders, c.totalSpent, c.status]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', `customers_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Customer Directory</h2>
                    <p className="text-sm text-neutral-500 mt-1 font-medium italic">Managing {customers.length} client profiles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={exportCustomersCSV} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold shadow-sm">
                        <Download className="w-4 h-4"/><span>Export CSV</span>
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-neutral-200 active:scale-95 transition-all">
                        <Plus className="w-4 h-4"/><span>Register Client</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                    <input type="text" placeholder="Search by name, email, phone or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none" />
                </div>
                <div className="flex gap-2">
                    <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="px-4 py-2.5 border rounded-xl text-[11px] font-black uppercase bg-white"><option value="All">All Cities</option><option value="Karachi">Karachi</option><option value="Lahore">Lahore</option></select>
                    <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="px-4 py-2.5 border rounded-xl text-[11px] font-black uppercase bg-white"><option value="All">All Segments</option><option value="VIP Client">VIP Client</option></select>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-sm overflow-hidden">
                {isLoading && customers.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#B08D57]"/><p className="text-xs font-black uppercase mt-2 text-neutral-400 tracking-widest">Fetching Client Records...</p></div>
                ) : filteredCustomers.length === 0 ? (
                    <EmptyState icon={Users} title="No Records Found" />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/50 border-b"><tr className="text-[10px] font-black text-neutral-400 uppercase tracking-widest"><th className="px-6 py-5">Profile</th><th className="px-6 py-5">Contact</th><th className="px-6 py-5 text-right">Orders</th><th className="px-6 py-5 text-right">Spent</th><th className="px-6 py-5 text-center">Status</th><th className="px-6 py-5"></th></tr></thead>
                            <tbody className="divide-y">
                                {paginatedCustomers.map((cust) => (
                                    <tr key={cust.id} onClick={() => navigate(`/customers/${cust.id}`)} className="group hover:bg-neutral-50 cursor-pointer">
                                        <td className="px-6 py-5"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl overflow-hidden border shadow-sm"><img src={cust.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110" /></div><div><p className="text-sm font-black text-neutral-900">{cust.name}</p><p className="text-[10px] font-bold text-neutral-400">{cust.city}</p></div></div></td>
                                        <td className="px-6 py-5"><p className="text-xs font-bold">{cust.phone}</p><p className="text-[10px] text-neutral-400">{cust.email}</p></td>
                                        <td className="px-6 py-5 text-right"><span className="px-3 py-1 bg-neutral-100 rounded-xl text-[11px] font-black">{cust.totalOrders}</span></td>
                                        <td className="px-6 py-5 text-right font-black text-sm">{formatPKR(cust.totalSpent)}</td>
                                        <td className="px-6 py-5 text-center"><StatusBadge status={cust.status} size="sm" /></td>
                                        <td className="px-6 py-5 text-right"><Eye className="w-5 h-5 text-neutral-300 group-hover:text-black ml-auto" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredCustomers.length / pageSize)} totalItems={filteredCustomers.length} pageSize={pageSize} onPageChange={setCurrentPage} />
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Client" maxWidth="md">
                <form onSubmit={handleAddCustomerSubmit} className="space-y-5 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border rounded-2xl text-xs font-bold outline-none" />
                        <input required placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border rounded-2xl text-xs font-bold outline-none" />
                    </div>
                    <input type="email" placeholder="Email (Optional)" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-4 py-3 bg-neutral-50 border rounded-2xl text-xs font-bold outline-none" />
                    <div className="flex gap-3 pt-4"><button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 border rounded-2xl text-xs font-black uppercase text-neutral-500">Cancel</button><button type="submit" className="flex-1 py-3 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase shadow-xl shadow-neutral-200">Register</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default CustomersListPage;