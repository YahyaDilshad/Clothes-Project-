import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
export const useProductStore = create((set, get) => ({
    // ==========================================
    // 1. GLOBAL STATES
    // ==========================================
    products: [],
    categories: [],
    returns: [],
    collections: [],
    collectionsMeta: [],
    orders: [],
    customers: [],
    inventory: [],
    expenses: [],
    returns: [],
    exchanges: [],
    staff: [],
    roles: ["Administrator", "Manager", "Support", "Inventory Staff"],
    activeRolePermissions: {},
    isLoading: false,

    // Analytics States
    revenueMetrics: {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        conversionRate: 0,
        growthPercentage: 0
    },
    revenueTimeSeriesData: { '7 Days': [], '30 Days': [], '6 Months': [] },
    revenueChartData: [],
    transactions: [],
    weeklyVelocityData: [],
       // Returns Fetch Function
    fetchReturns: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get('/api/returns');
            set({ returns: response.data.data, isLoading: false });
        } catch (error) {
            console.error("Error fetching returns:", error);
            set({ isLoading: false });
        }
    },
createExchange: async (exchangeData) => {
    try {
        const response = await axiosInstance.post('/exchanges/add', exchangeData);
        if (response.data.success) {
            // Order ka status bhi update ho jaye backend par automatically
            return { success: true, data: response.data.data };
        }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed" };
    }
},
    // Add these inside your useProductStore
fetchExchanges: async () => {
    set({ isLoading: true });
    try {
        const response = await axiosInstance.get('/exchanges');
        // Backend 'sendResponse' helper use kar raha hai isliye response.data.data check karein
        set({ exchanges: response.data.data || [], isLoading: false });
    } catch (error) {
        console.error("Fetch Exchanges Error:", error);
        set({ exchanges: [], isLoading: false });
    }
},

updateExchangeStatus: async (id, status) => {
    try {
        const response = await axiosInstance.patch(`/api/exchanges/${id}`, { status });
        if (response.data.success) {
            const updated = get().exchanges.map((ex) =>
                ex._id === id ? { ...ex, status: response.data.data.status } : ex
            );
            set({ exchanges: updated });
        }
    } catch (error) {
        console.error("Update Status Error:", error);
    }
},

deleteExchange: async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/exchanges/${id}`);
        if (response.data.success) {
            set({ exchanges: get().exchanges.filter(ex => ex._id !== id) });
        }
    } catch (error) {
        console.error("Delete Error:", error);
        alert(error.response?.data?.message || "Error deleting exchange");
    }
},
fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
        const [prod, ord, cust, inv, charts] = await Promise.all([
            axiosInstance.get(`/products`),
            axiosInstance.get(`/orders`),
            axiosInstance.get(`/customers`),
            axiosInstance.get(`/inventory`),
            axiosInstance.get(`/dashboard/charts?days=30`) // Backend query
        ]);

        const chartsData = charts.data.data; // Backend structure: { salesByDay, summary, etc }

        // Backend ke 'salesByDay' ko chart format mein convert karna
        const formattedChartData = chartsData.salesByDay.map(item => ({
            date: item._id, // Date string
            revenue: item.revenue,
            orders: item.orders
        }));

        set({ 
            products: prod.data.data || prod.data, 
            orders: ord.data.data || ord.data, 
            customers: cust.data.data || cust.data, 
            inventory: inv.data.data || inv.data, 
            
            // FIXED MAPPING:
            revenueTimeSeriesData: {
                '7 Days': formattedChartData.slice(-7),
                '30 Days': formattedChartData,
                '6 Months': formattedChartData // Backend currently sends max 365 days
            },
            weeklyVelocityData: formattedChartData.slice(-7).map(d => ({
                day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
                sales: d.orders
            })),
            isLoading: false 
        });
    } catch (err) { 
        console.error("Dashboard fetch error", err); 
        set({ isLoading: false });
    }
},
    fetchRevenueData: async () => {
    set({ isLoading: true });
    try {
        const res = await axiosInstance.get(`/revenue/analytics`);
        
        // FIX: sendResponse wrapper ki wajah se data 'res.data.data' mein hota hai
        const analyticsData = res.data.data; 

        set({ 
            // Controller flat object bhej raha hai, ussi ko metrics set karein
            revenueMetrics: analyticsData, 
            // Agar chart data nahi aa raha to empty array rakhen filhal
            revenueChartData: analyticsData.paymentBreakdown || [], 
            isLoading: false 
        });
    } catch (err) { 
        console.error("Revenue fetch error", err); 
        set({ isLoading: false }); 
    }
},

fetchTransactions: async () => {
    set({ isLoading: true });
    try {
        const res = await axiosInstance.get(`/revenue/transactions`);
        
        // FIX: res.data pura response hai, res.data.data actual array hai
        set({ 
            transactions: res.data.data || [], 
            isLoading: false 
        });
    } catch (err) { 
        console.error("Transactions fetch error", err); 
        set({ isLoading: false }); 
    }
},
    exportRevenueReport: async () => {
        try {
            const res = await axiosInstance.get(`/revenue/export`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Revenue_Report_${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(link);
            link.click();
            toast.success("Report downloaded successfully");
        } catch (err) { 
            console.error("Export failed", err); 
            toast.error("Export failed");
        }
    },

    // ==========================================
    // 3. PRODUCT ACTIONS (With Toasts)
    // ==========================================
    fetchProducts: async () => {
    set({ isLoading: true });
    try {
        const res = await axiosInstance.get('/products');
        const productData = res.data.data || res.data; 
        set({ products: productData || null , isLoading: false });
    } catch (err) { 
        console.error("Fetch products error", err); 
        set({ products: [], isLoading: false }); 
    }
},

fetchCustomers: async () => {
    set({ isLoading: true });
    try {
        const res = await axiosInstance.get('/customers');
        // Yahan 'res.data.data' nikalna zaroori hai
        const customerData = res.data.data || res.data;
        set({ 
            customers: Array.isArray(customerData) ? customerData : [], 
            isLoading: false 
        });
    } catch (err) { 
        console.error("Fetch customers error", err);
        set({ customers: [], isLoading: false }); 
    }
},
    addProduct: async (payload) => {
        const loadId = toast.loading("Publishing product...");
        try {
            const res = await axiosInstance.post(`/products/add`, payload);
            set((state) => ({ products: [res.data, ...state.products] }));
            toast.success("Product published successfully!", { id: loadId });
            return res.data;
        } catch (err) { 
            console.error("Add product error", err); 
            toast.error(err.response?.data?.message || "Error adding product", { id: loadId });
            throw err; 
        }
    },
updateProduct: async (id, payload) => {
    const loadId = toast.loading("Updating product...");
    try {
        let res;
        
        // Agar payload pehle se FormData hai (AddEdit page se aa raha hai)
        if (payload instanceof FormData) {
            res = await axiosInstance.put(`/products/update/${id}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } 
        // Agar simple object hai (List page status toggle ke liye)
        else {
            res = await axiosInstance.put(`/products/update/${id}`, payload);
        }

        const updatedData = res.data.data || res.data;

        set((state) => ({
            products: state.products.map(p => 
                (String(p._id) === String(id) || String(p.id) === String(id)) ? updatedData : p
            )
        }));

        toast.success("Product updated successfully!", { id: loadId });
        return updatedData;
    } catch (err) {
        const msg = err.response?.data?.message || "Update failed";
        toast.error(msg, { id: loadId });
        throw err;
    }
},

    deleteProduct: async (id) => {
        const loadId = toast.loading("Deleting product...");
        try {
            await axiosInstance.delete(`/products/delete/${id}`);
            set((state) => ({ products: state.products.filter(p => p.id !== id && p._id !== id) }));
            toast.success("Product deleted permanently", { id: loadId });
        } catch (err) { 
            console.error("Delete product error", err); 
            toast.error("Delete failed", { id: loadId });
        }
    },

    duplicateProduct: async (id) => {
        try {
            const res = await axiosInstance.post(`/products/duplicate/${id}`);
            set((state) => ({ products: [res.data, ...state.products] }));
            toast.success("Product duplicated successfully");
        } catch (err) { 
            console.error("Duplicate product error", err); 
            toast.error("Duplication failed");
        }
    },
fetchCategories: async () => {
    try {
        const res = await axiosInstance.get(`/categories`);
        const categories = res.data.data || [];
        set({
            categories,
        });

    } catch (err) {
        console.error(
            "Fetch categories error:",
            err.response?.data || err.message
        );
    }
},
    addCategory: async (payload) => {
        try {
            const res = await axiosInstance.post(`/categories/add`, payload);
            set((state) => ({ categories: [...state.categories, res.data] }));
            toast.success("New category added");
            return res.data;
        } catch (err) { 
            toast.error("Failed to add category");
            throw err; 
        }
    },

    updateCategory: async (id, payload) => {
        try {
            const res = await axiosInstance.put(`/categories/update/${id}`, payload);
            set((state) => ({ categories: state.categories.map(c => (c.id === id || c._id === id) ? res.data : c) }));
            toast.success("Category updated");
        } catch (err) { throw err; }
    },

    deleteCategory: async (id) => {
        try {
            await axiosInstance.delete(`/categories/delete/${id}`);
            set((state) => ({ categories: state.categories.filter(c => c.id !== id && c._id !== id) }));
            toast.success("Category deleted");
        } catch (err) { console.error(err); toast.error("Delete failed"); }
    },
    addCollection: async (formData) => {
    try {
        const res = await axiosInstance.post('/collections/add', formData); // headers automatically set ho jayenge
        console.log(res.data);
        set((state) => ({ collections: [res.data.data, ...state.collections] }));
        toast.success("Collection added!");
    } catch (err) {
        toast.error("Upload failed");
    }
    },
    fetchCollections: async () => {
    set({ isLoading: true });
    try {
        const res = await axiosInstance.get('/collections');

        // Backend ke 'sendResponse' ki wajah se humein 'res.data.data' access karna hoga
        const collectionsArray = res.data.data; 

        set({ 
            collections: res.data.data, 
            collectionsMeta: res.data.meta, // Pagination info yahan aa jayegi
            isLoading: false 
});
    } catch (err) { 
        console.error("Fetch collections error", err);
        set({ collections: [], isLoading: false }); 
    }
},
 // Returns fetch karne ka function
    fetchReturns: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get('/api/returns'); // Backend endpoint
            if (response.data.success) {
                set({ returns: response.data.data, isLoading: false });
            }
        } catch (error) {
            console.error("Error fetching returns:", error);
            set({ isLoading: false, error: error.message });
        }
    },

    // Status update karne ka function
    updateReturnStatus: async (id, status) => {
        try {
            const response = await axios.put(`/api/returns/${id}/status`, { status });
            if (response.data.success) {
                // Local state update karein taake page refresh na karna pare
                const updatedReturns = get().returns.map((ret) =>
                    ret._id === id ? { ...ret, status: response.data.data.status } : ret
                );
                set({ returns: updatedReturns });
                return { success: true };
            }
        } catch (error) {
            console.error("Error updating status:", error);
            return { success: false, error: error.message };
        }
    },
    // Update Collection Action
    updateCollection: async (id, formData) => {
        const loadId = toast.loading("Updating collection...");
        try {
            // Check karein ke payload FormData hai ya normal object
            const isFormData = formData instanceof FormData;

            const res = await axiosInstance.put(`/collections/update/${id}`, formData, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
            });

            // Backend Response: { success: true, data: { updatedObject } }
            const updatedCollection = res.data.data || res.data;

            set((state) => ({
                collections: state.collections.map((col) =>
                    (col._id === id || col.id === id) ? updatedCollection : col
                ),
            }));

            toast.success("Collection updated successfully!", { id: loadId });
            return updatedCollection;
        } catch (err) {
            console.error("Update collection error:", err);
            const errMsg = err.response?.data?.message || "Failed to update collection";
            toast.error(errMsg, { id: loadId });
            throw err;
        }
    },

    // Delete Collection Action
    deleteCollection: async (id) => {
        const loadId = toast.loading("Deleting collection...");
        try {
            await axiosInstance.delete(`/collections/delete/${id}`);

            set((state) => ({
                collections: state.collections.filter(
                    (col) => col._id !== id && col.id !== id
                ),
            }));

            toast.success("Collection deleted permanently", { id: loadId });
        } catch (err) {
            console.error("Delete collection error:", err);
            const errMsg = err.response?.data?.message || "Failed to delete collection";
            toast.error(errMsg, { id: loadId });
        }
    },
    // ==========================================
    // 5. ORDER & BILLING ACTIONS
    // ==========================================
fetchOrders: async () => {
    set({ isLoading: true });
    try {
        const res = await axiosInstance.get('/orders');
        const orderData = res.data.data || res.data; 
        set({ 
            orders: Array.isArray(orderData) ? orderData : [], 
            isLoading: false 
        });
    } catch (err) { 
        console.error("Fetch orders error", err);
        set({ orders: [], isLoading: false }); 
    }
},
    createOrder: async (payload) => {
        const loadId = toast.loading("Creating order...");
        try {
            const res = await axiosInstance.post(`/orders/add`, payload);
            const orderData = res.data.data
            set({ orders: Array.isArray(orderData) ? orderData : [] });
            toast.success("Order placed successfully!", { id: loadId });
            return res.data;
        } catch (err) { toast.error("Order failed", { id: loadId }); throw err; }
    },

    updateOrderStatus: async (id, status) => {
        try {
            const res = await axiosInstance.patch(`/orders/${id}/status`, { status });
            set((state) => ({ orders: state.orders.map(o => (o.id === id || o._id === id) ? res.data : o) }));
            toast.success(`Order status: ${status}`);
        } catch (err) { console.error(err); }
    },

    updatePaymentStatus: async (id, paymentStatus) => {
        try {
            const res = await axiosInstance.patch(`/orders/${id}/payment`, { paymentStatus });
            set((state) => ({ orders: state.orders.map(o => (o.id === id || o._id === id) ? res.data : o) }));
            toast.success(`Payment updated: ${paymentStatus}`);
        } catch (err) { console.error(err); }
    },

    addOrderNote: async (id, noteText) => {
        try {
            const res = await axiosInstance.post(`/orders/${id}/notes`, { text: noteText });
            set((state) => ({ orders: state.orders.map(o => (o.id === id || o._id === id) ? res.data : o) }));
            toast.success("Note added to order");
        } catch (err) { console.error(err); }
    },


    addCustomer: async (payload) => {
        try {
            const res = await axiosInstance.post(`/customers`, payload);
            set((state) => ({ customers: [res.data, ...state.customers] }));
            toast.success("Customer profile created");
            return res.data;
        } catch (err) { toast.error("Action failed"); throw err; }
    },

    // ==========================================
    // 7. INVENTORY ACTIONS
    // UseProductsStore.js
fetchInventory: async () => {
    set({ isLoading: true });
    try {
        const res = await axiosInstance.get(`/inventory`);
                    // Backend response format: { success: true, data: [...] }
        const inventoryData = res.data.data || []; 
        set({ inventory: inventoryData, isLoading: false });
    } catch (err) { 
        set({ isLoading: false }); 
        console.error("Fetch error:", err);
    }
},

adjustStock: async (id, newQuantity) => {
    const loadId = toast.loading("Updating inventory...");
    try {
        const res = await axiosInstance.patch(`/inventory/adjust/${id}`, { 
            quantity: Number(newQuantity) 
        });

        // Backend returns: { success: true, data: updatedItem }
        const updatedItem = res.data.data;

        set((state) => ({
            inventory: state.inventory.map((item) =>
                (item._id === id) ? { ...item, ...updatedItem } : item
            )
        }));

        toast.success("Inventory updated!", { id: loadId });
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update stock", { id: loadId });
    }
},

syncStock: async () => {
    const loadId = toast.loading("Syncing stock...");
    set({ isLoading: true });
    try {
        await axiosInstance.post(`/inventory/sync`);
        // Sync ke baad dobara fetch karein taaki updated list mile
        const res = await axiosInstance.get(`/inventory`);
        set({ inventory: res.data.data, isLoading: false });
        toast.success("Inventory synced successfully", { id: loadId });
    } catch (err) { 
        set({ isLoading: false }); 
        toast.error("Sync failed", { id: loadId }); 
    }
},

    // ==========================================
    // 8. STAFF & PERMISSIONS ACTIONS
    // ==========================================
    fetchStaff: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/staff`);
            set({ staff: res.data, isLoading: false });
        } catch (err) { set({ isLoading: false }); }
    },

    addStaff: async (payload) => {
        try {
            const res = await axiosInstance.post(`/staff/add`, payload);
            set((state) => ({ staff: [...state.staff, res.data] }));
            toast.success("New staff member added");
        } catch (err) { toast.error("Failed to add staff"); throw err; }
    },

    updateStaff: async (id, payload) => {
        try {
            const res = await axiosInstance.put(`/staff/${id}`, payload);
            set((state) => ({ staff: state.staff.map(s => (s.id === id || s._id === id) ? res.data : s) }));
            toast.success("Staff profile updated");
        } catch (err) { throw err; }
    },

    deleteStaff: async (id) => {
        try {
            await axiosInstance.delete(`/staff/${id}`);
            set((state) => ({ staff: state.staff.filter(s => s.id !== id && s._id !== id) }));
            toast.success("Staff access revoked");
        } catch (err) { console.error(err); toast.error("Delete failed"); }
    },

    saveRolePermissions: async (roleName) => {
        const { activeRolePermissions } = get();
        try {
            await axiosInstance.post(`/permissions/${roleName}`, activeRolePermissions);
            toast.success(`Permissions for ${roleName} updated!`);
        } catch (err) { toast.error("Save failed!"); }
    },

    // ==========================================
    // 9. EXPENSE ACTIONS
    // ==========================================
    fetchExpenses: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/expenses`);
            set({ expenses: res.data.data, isLoading: false });
        } catch (err) { set({ isLoading: false }); }
    },

    addExpense: async (payload) => {
        try {
            const res = await axiosInstance.post(`/expenses/add`, payload);
            set((state) => ({ expenses: [res.data, ...state.expenses] }));
            toast.success("Expense recorded");
        } catch (err) { toast.error("Failed to record expense"); throw err; }
    },

    deleteExpense: async (id) => {
        try {
            await axiosInstance.delete(`/expenses/${id}`);
            set((state) => ({ expenses: state.expenses.filter(ex => ex.id !== id && ex._id !== id) }));
            toast.success("Expense deleted");
        } catch (err) { console.error(err); }
    },

    // ==========================================
    // 10. RETURNS & EXCHANGES ACTIONS
    // ==========================================
    updateReturnStatus: async (id, status) => {
        try {
            const res = await axiosInstance.put(`/returns/${id}/status`, { status });
            set((state) => ({ returns: state.returns.map(r => (r.id === id || r._id === id) ? res.data : r) }));
            toast.success(`Return status: ${status}`);
        } catch (err) { throw err; }
    },

    updateExchangeStatus: async (id, status) => {
        try {
            const res = await axiosInstance.patch(`/exchanges/${id}`, { status });
            set((state) => ({ exchanges: state.exchanges.map(ex => (ex.id === id || ex._id === id) ? res.data : ex) }));
            toast.success(`Exchange status: ${status}`);
        } catch (err) { throw err; }
    }
}));