import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Download, Eye, ShoppingBag, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { formatPKR, formatDate } from '../../utils/formatters';
const ORDER_STATUS_TABS = [
    'All',
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
];
export const OrdersListPage = () => {
    const { orders, updateOrderStatus } = useApp();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    // Filtered orders
    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const matchesTab = activeTab === 'All' || o.status === activeTab;
            const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPayment = selectedPaymentMethod === 'All' || o.paymentMethod === selectedPaymentMethod;
            const matchesPayStatus = selectedPaymentStatus === 'All' || o.paymentStatus === selectedPaymentStatus;
            return matchesTab && matchesSearch && matchesPayment && matchesPayStatus;
        });
    }, [orders, activeTab, searchQuery, selectedPaymentMethod, selectedPaymentStatus]);
    const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const exportOrdersCSV = () => {
        const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Payment Method', 'Payment Status', 'Order Status', 'Total (PKR)'];
        const rows = filteredOrders.map((o) => [
            o.orderNumber,
            o.date,
            `"${o.customerName}"`,
            `"${o.customerPhone}"`,
            `"${o.shippingAddress.city}"`,
            o.paymentMethod,
            o.paymentStatus,
            o.status,
            o.total,
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#181818] tracking-tight font-serif">Orders Management</h2>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Track customer orders, shipments, COD cash collections, and fulfillment stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={exportOrdersCSV} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F7F6F2] border border-[#E7E5E0] text-[#181818] rounded-lg text-xs font-medium transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-[#B08D57]"/>
            <span>Export CSV</span>
          </button>
          <button onClick={() => navigate('/orders/new')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#181818] hover:bg-[#2A2A2A] text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5 text-[#B08D57]"/>
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#E7E5E0]">
        {ORDER_STATUS_TABS.map((tab) => {
            const count = tab === 'All'
                ? orders.length
                : orders.filter((o) => o.status === tab).length;
            return (<button key={tab} onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                }} className={`px-3.5 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${activeTab === tab
                    ? 'border-[#181818] text-[#181818] bg-white font-semibold'
                    : 'border-transparent text-[#6B6B6B] hover:text-[#181818]'}`}>
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${activeTab === tab ? 'bg-[#181818] text-white' : 'bg-[#F7F6F2] text-[#6B6B6B]'}`}>
                {count}
              </span>
            </button>);
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#E7E5E0] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#9A9A9A] absolute left-3.5 top-1/2 -translate-y-1/2"/>
            <input type="text" placeholder="Search by Order ID (#ORD-...), customer name, phone, or city..." value={searchQuery} onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
        }} className="w-full pl-9 pr-4 py-2 border border-[#E7E5E0] rounded-lg text-xs font-medium text-[#181818] placeholder:text-[#9A9A9A] focus:outline-hidden bg-[#F7F6F2]"/>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Payment Method */}
            <select value={selectedPaymentMethod} onChange={(e) => {
            setSelectedPaymentMethod(e.target.value);
            setCurrentPage(1);
        }} className="px-3 py-2 border border-[#E7E5E0] rounded-lg text-xs font-medium text-[#181818] bg-[#F7F6F2] focus:outline-hidden cursor-pointer">
              <option value="All">All Payment Methods</option>
              <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="JazzCash">JazzCash</option>
              <option value="EasyPaisa">EasyPaisa</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
            </select>

            {/* Payment Status */}
            <select value={selectedPaymentStatus} onChange={(e) => {
            setSelectedPaymentStatus(e.target.value);
            setCurrentPage(1);
        }} className="px-3 py-2 border border-[#E7E5E0] rounded-lg text-xs font-medium text-[#181818] bg-[#F7F6F2] focus:outline-hidden cursor-pointer">
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E7E5E0] overflow-hidden">
        {filteredOrders.length === 0 ? (<EmptyState icon={ShoppingBag} title="No Orders Found" description="No orders match your filter criteria. Try adjusting the search query or status tab." actionText="Create Manual Order" onAction={() => navigate('/orders/new')}/>) : (<div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#E7E5E0] text-[#6B6B6B] uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Customer & City</th>
                  <th className="px-4 py-3.5">Items</th>
                  <th className="px-4 py-3.5 text-right">Total Amount</th>
                  <th className="px-4 py-3.5">Payment Method</th>
                  <th className="px-4 py-3.5">Payment</th>
                  <th className="px-4 py-3.5">Fulfillment Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E0]">
                {paginatedOrders.map((order) => (<tr key={order.id} className="hover:bg-[#F7F6F2] cursor-pointer transition-colors" onClick={() => navigate(`/orders/${order.id}`)}>
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-semibold text-[#181818] text-xs">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#6B6B6B] text-[11px]">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-[#181818]">{order.customerName}</div>
                      <div className="text-[11px] text-[#6B6B6B]">
                        {order.customerPhone} • <span className="text-[#181818] font-medium">{order.shippingAddress.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2 overflow-hidden">
                          {order.items.slice(0, 2).map((item, idx) => (<img key={idx} src={item.productImage} alt={item.productName} className="w-7 h-7 rounded-md object-cover border border-white"/>))}
                        </div>
                        <span className="text-[11px] text-[#6B6B6B] font-medium">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} pcs
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-[#181818]">
                      {formatPKR(order.total)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-[#6B6B6B] font-medium">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.paymentStatus} size="sm"/>
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="px-2 py-1 bg-[#F7F6F2] border border-[#E7E5E0] rounded-md text-xs font-medium text-[#181818] focus:outline-hidden cursor-pointer">
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => navigate(`/orders/${order.id}`)} className="p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#181818] hover:bg-[#F7F6F2] transition-colors cursor-pointer" title="View Full Order & Invoice">
                        <Eye className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}

        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredOrders.length} pageSize={pageSize} onPageChange={setCurrentPage}/>
      </div>
    </div>);
};
