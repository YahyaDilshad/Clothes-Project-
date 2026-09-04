import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance.js'; // Aapka customized axios instance

export const useProductStore = create((set, get) => ({
    // States
    products: [],
    categories: [],
    collections: [],
    orders: [],
    isLoading: false,
    error: null,

    // ==========================================
    // 1. PRODUCT ENDPOINTS (For Shop & Search)
    // ==========================================
    
    // GET: All Products (Used in Shop, Search, Wishlist)
    fetchProducts: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/products');
            // Backend format: { success: true, data: [...] }
            const productData = res.data.data || res.data;
            set({ products: productData, isLoading: false });
        } catch (err) {
            console.error("Fetch products error", err);
            set({ products: [], isLoading: false, error: err.message });
        }
    },

    // Optional: GET Single Product (Detailed fetching)
    // Agar list se filter nahi karna balkay direct API se uthana ho
    fetchProductById: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/products/${id}`);
            set({ isLoading: false });
            return res.data.data;
        } catch (err) {
            set({ isLoading: false });
            console.error("Fetch product detail error", err);
        }
    },

    // ==========================================
    // 2. CATEGORY ENDPOINTS (For Shop Filters/Sidebar)
    // ==========================================
    
    // GET: All Categories
    fetchCategories: async () => {
        try {
            const res = await axiosInstance.get('/categories');
            const categoryData = res.data.data || [];
            set({ categories: categoryData });
        } catch (err) {
            console.error("Fetch categories error", err);
        }
    },

    // ==========================================
    // 3. COLLECTION ENDPOINTS (For Home/Landing Pages)
    // ==========================================
    
    fetchCollections: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/collections');
            set({ 
                collections: res.data.data, 
                isLoading: false 
            });
        } catch (err) {
            console.error("Fetch collections error", err);
            set({ isLoading: false });
        }
    },

    // ==========================================
    // 4. ORDER ENDPOINTS (For Checkout & Success)
    // ==========================================
    
    // POST: Create Order (Used in Checkout)
    createOrder: async (orderPayload) => {
        const loadId = toast.loading("Processing your order...");
        try {
            const res = await axiosInstance.post('/orders/add', orderPayload);
            // Agar backend se data successful aata hai
            toast.success("Order placed successfully!", { id: loadId });
            return { success: true, order: res.data.data };
        } catch (err) {
            const errMsg = err.response?.data?.message || "Order failed";
            toast.error(errMsg, { id: loadId });
            return { success: false, error: errMsg };
        }
    },

    // GET: Track Order (Used in Order Success/Tracking page)
    fetchOrderById: async (orderId) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/orders/${orderId}`);
            set({ isLoading: false });
            return res.data.data;
        } catch (err) {
            set({ isLoading: false });
            toast.error("Order not found");
            return null;
        }
    },

    // ==========================================
    // 5. SEARCH & ANALYTICS (Optional for Frontend)
    // ==========================================
    
    // Agar humein backend search use karni ho instead of client-side
    searchProducts: async (query) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/products/search?q=${query}`);
            set({ isLoading: false });
            return res.data.data;
        } catch (err) {
            set({ isLoading: false });
            return [];
        }
    },
    submitContactForm: async (payload) => {
    const loadId = toast.loading("Sending your message...");
    try {
        // Aapka backend endpoint yahan aayega, e.g., /contact ya /messages
        const res = await axiosInstance.post('/contact', payload); 
        toast.success("Message sent successfully!", { id: loadId });
        return { success: true };
    } catch (err) {
        console.error("Contact form error", err);
        const errMsg = err.response?.data?.message || "Failed to send message";
        toast.error(errMsg, { id: loadId });
        return { success: false, error: errMsg };
    }
},
}));