import React, { useState } from 'react';
import { 
    Search, Plus, Receipt, Trash2, Edit2, 
    Calendar, Tag, DollarSign, Wallet, 
    TrendingDown, X, Filter
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate, formatPKR } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const Expense = () => {
    // 1. States
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Marketing', date: new Date().toISOString().split('T')[0], status: 'Paid' });
    
    const [expensesList, setExpensesList] = useState([
        { id: "EXP-101", title: "Office Rent - Nov", amount: 45000, category: "Rent", date: "2023-11-01", status: "Paid" },
        { id: "EXP-102", title: "Facebook Ads Budget", amount: 15000, category: "Marketing", date: "2023-11-05", status: "Paid" },
        { id: "EXP-103", title: "Electricity Bill", amount: 8200, category: "Utilities", date: "2023-11-10", status: "Pending" }
    ]);

    // 2. Add/Edit Modal Logic
    const openModal = (expense = null) => {
        if (expense) {
            setEditingExpense(expense);
            setFormData({ ...expense });
        } else {
            setEditingExpense(null);
            setFormData({ title: '', amount: '', category: 'Marketing', date: new Date().toISOString().split('T')[0], status: 'Paid' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingExpense) {
            setExpensesList(prev => prev.map(ex => ex.id === editingExpense.id ? { ...ex, ...formData, amount: Number(formData.amount) } : ex));
        } else {
            const newExpense = {
                ...formData,
                id: `EXP-${Math.floor(Math.random() * 900) + 100}`,
                amount: Number(formData.amount)
            };
            setExpensesList([newExpense, ...expensesList]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this expense record?")) {
            setExpensesList(prev => prev.filter(ex => ex.id !== id));
        }
    };

    // 3. Calculations
    const totalExpense = expensesList.reduce((acc, curr) => acc + curr.amount, 0);
    const filteredExpenses = expensesList.filter(ex => 
        ex.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        ex.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-serif">
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Expense Management</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Track and manage your business expenditures.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                    <Plus className="w-3.5 h-3.5"/>
                    <span>Add Expense</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600"><Wallet className="w-5 h-5"/></div>
                    <div><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Expenses</p><h3 className="text-lg font-bold text-neutral-900">{formatPKR(totalExpense)}</h3></div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600"><TrendingDown className="w-5 h-5"/></div>
                    <div><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Paid This Month</p><h3 className="text-lg font-bold text-neutral-900">{formatPKR(expensesList.filter(e => e.status === 'Paid').reduce((a, b) => a + b.amount, 0))}</h3></div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Receipt className="w-5 h-5"/></div>
                    <div><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Pending Bills</p><h3 className="text-lg font-bold text-neutral-900">{expensesList.filter(e => e.status === 'Pending').length} Entries</h3></div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="text" placeholder="Search expenses..." className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-neutral-900" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50 text-neutral-500 uppercase text-[10px] font-bold border-b border-neutral-100">
                            <tr>
                                <th className="px-5 py-4">Expense Details</th>
                                <th className="px-5 py-4">Category</th>
                                <th className="px-5 py-4">Amount</th>
                                <th className="px-5 py-4">Date</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredExpenses.map((item) => (
                                <tr key={item.id} className="hover:bg-neutral-50/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-neutral-900">{item.title}</span>
                                            <span className="text-[10px] text-neutral-400 font-mono">{item.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md font-medium text-[10px]">
                                            <Tag className="w-3 h-3"/> {item.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-neutral-900">{formatPKR(item.amount)}</td>
                                    <td className="px-5 py-4 text-neutral-500">{formatDate(item.date)}</td>
                                    <td className="px-5 py-4"><StatusBadge status={item.status} size="sm" /></td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button onClick={() => openModal(item)} className="p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"><Edit2 className="w-3.5 h-3.5"/></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- ADD/EDIT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-neutral-50/50">
                            <h3 className="font-bold text-neutral-900">{editingExpense ? 'Edit Expense Record' : 'Add New Expense'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-neutral-200 rounded-full transition-colors"><X className="w-4 h-4"/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Expense Title</label>
                                <input required type="text" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-neutral-900" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Office Stationery" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Amount (PKR)</label>
                                    <input required type="number" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-neutral-900" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Date</label>
                                    <input required type="date" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs outline-none focus:border-neutral-900" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Category</label>
                                    <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-2 text-xs outline-none focus:border-neutral-900" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                        <option value="Salary">Salary</option>
                                        <option value="Rent">Rent</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Utilities">Utilities</option>
                                        <option value="Inventory">Inventory</option>
                                        <option value="Misc">Misc</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Status</label>
                                    <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-2 text-xs outline-none focus:border-neutral-900" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors">
                                    {editingExpense ? 'Update Expense' : 'Save Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expense;