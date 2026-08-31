import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialOrders, initialCustomers, initialInventory, initialCategories, initialCollections, initialDiscounts, initialReturns, initialBanners, initialUsers, initialNotifications, initialStoreSettings, initialStockAdjustments, } from '../data/mockData';
const AppContext = createContext(undefined);
export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('nc_products');
        return saved ? JSON.parse(saved) : initialProducts;
    });
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('nc_orders');
        return saved ? JSON.parse(saved) : initialOrders;
    });
    const [customers, setCustomers] = useState(() => {
        const saved = localStorage.getItem('nc_customers');
        return saved ? JSON.parse(saved) : initialCustomers;
    });
    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('nc_inventory');
        return saved ? JSON.parse(saved) : initialInventory;
    });
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('nc_categories');
        return saved ? JSON.parse(saved) : initialCategories;
    });
    const [collections, setCollections] = useState(() => {
        const saved = localStorage.getItem('nc_collections');
        return saved ? JSON.parse(saved) : initialCollections;
    });
    const [discounts, setDiscounts] = useState(() => {
        const saved = localStorage.getItem('nc_discounts');
        return saved ? JSON.parse(saved) : initialDiscounts;
    });
    const [returns, setReturns] = useState(() => {
        const saved = localStorage.getItem('nc_returns');
        return saved ? JSON.parse(saved) : initialReturns;
    });
    const [banners, setBanners] = useState(() => {
        const saved = localStorage.getItem('nc_banners');
        return saved ? JSON.parse(saved) : initialBanners;
    });
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('nc_users');
        return saved ? JSON.parse(saved) : initialUsers;
    });
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('nc_notifications');
        return saved ? JSON.parse(saved) : initialNotifications;
    });
    const [storeSettings, setStoreSettings] = useState(() => {
        const saved = localStorage.getItem('nc_settings');
        return saved ? JSON.parse(saved) : initialStoreSettings;
    });
    const [stockAdjustments, setStockAdjustments] = useState(() => {
        const saved = localStorage.getItem('nc_stock_adj');
        return saved ? JSON.parse(saved) : initialStockAdjustments;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('apexiums_auth') === 'true';
    });
    const [currentUser] = useState(initialUsers[0]);
    const [toasts, setToasts] = useState([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const login = (usernameInput, passwordInput) => {
        const u = usernameInput.trim().toLowerCase();
        const p = passwordInput.trim();
        if (u === 'apexiums' && p === 'apexiums1212') {
            setIsAuthenticated(true);
            localStorage.setItem('apexiums_auth', 'true');
            showToast('Welcome Back', 'Logged in as apexiums (Super Admin). Access granted.', 'success');
            return { success: true };
        }
        return {
            success: false,
            message: 'Invalid credentials. Only username "apexiums" and password "apexiums1212" have dashboard access.',
        };
    };
    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('apexiums_auth');
        showToast('Signed Out', 'You have been signed out of Apexiums Admin.', 'info');
    };
    // Sync to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('nc_products', JSON.stringify(products));
            localStorage.setItem('nc_orders', JSON.stringify(orders));
            localStorage.setItem('nc_customers', JSON.stringify(customers));
            localStorage.setItem('nc_inventory', JSON.stringify(inventory));
            localStorage.setItem('nc_categories', JSON.stringify(categories));
            localStorage.setItem('nc_collections', JSON.stringify(collections));
            localStorage.setItem('nc_discounts', JSON.stringify(discounts));
            localStorage.setItem('nc_returns', JSON.stringify(returns));
            localStorage.setItem('nc_banners', JSON.stringify(banners));
            localStorage.setItem('nc_users', JSON.stringify(users));
            localStorage.setItem('nc_notifications', JSON.stringify(notifications));
            localStorage.setItem('nc_settings', JSON.stringify(storeSettings));
            localStorage.setItem('nc_stock_adj', JSON.stringify(stockAdjustments));
        }
        catch {
            // Ignore storage errors
        }
    }, [products, orders, customers, inventory, categories, collections, discounts, returns, banners, users, notifications, storeSettings, stockAdjustments]);
    const showToast = (title, message, type = 'success') => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        setToasts((prev) => [...prev, { id, title, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    };
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };
    // Product Methods
    const addProduct = (prodData) => {
        const newProduct = {
            ...prodData,
            id: `prod-${Date.now()}`,
            unitsSold: 0,
            revenue: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setProducts((prev) => [newProduct, ...prev]);
        // Also create inventory entries for its variants
        const newInventoryItems = prodData.variants.map((v) => ({
            id: `inv-${Date.now()}-${v.id}`,
            productId: newProduct.id,
            productName: newProduct.name,
            productImage: newProduct.images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
            sku: v.sku,
            category: newProduct.category,
            color: v.color,
            size: v.size,
            currentStock: v.stock,
            reserved: 0,
            available: v.stock,
            lowStockLimit: newProduct.lowStockThreshold || 10,
            status: v.stock === 0 ? 'Out of Stock' : v.stock <= (newProduct.lowStockThreshold || 10) ? 'Low Stock' : 'In Stock',
            lastUpdated: new Date().toISOString(),
        }));
        setInventory((prev) => [...newInventoryItems, ...prev]);
        showToast('Product Created', `Successfully added ${newProduct.name} to the catalog.`);
        return newProduct;
    };
    const updateProduct = (id, updates) => {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)));
        showToast('Product Updated', 'Product details were updated successfully.');
    };
    const deleteProduct = (id) => {
        const prod = products.find((p) => p.id === id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setInventory((prev) => prev.filter((inv) => inv.productId !== id));
        showToast('Product Deleted', `${prod?.name || 'Product'} has been removed.`);
    };
    const duplicateProduct = (id) => {
        const prod = products.find((p) => p.id === id);
        if (!prod)
            return;
        const duplicated = {
            ...prod,
            id: `prod-${Date.now()}`,
            name: `${prod.name} (Copy)`,
            sku: `${prod.sku}-COPY`,
            unitsSold: 0,
            revenue: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            variants: prod.variants.map((v) => ({
                ...v,
                id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                sku: `${v.sku}-COPY`,
                sold: 0,
            })),
        };
        setProducts((prev) => [duplicated, ...prev]);
        showToast('Product Duplicated', `Created duplicate copy of ${prod.name}`);
    };
    // Inventory Methods
    const adjustStock = (itemId, adjustmentType, quantity, reason, notes) => {
        const item = inventory.find((i) => i.id === itemId);
        if (!item)
            return;
        let newStock = item.currentStock;
        if (adjustmentType === 'Add Stock') {
            newStock += quantity;
        }
        else if (adjustmentType === 'Remove Stock') {
            newStock = Math.max(0, newStock - quantity);
        }
        else {
            newStock = Math.max(0, quantity);
        }
        const available = Math.max(0, newStock - item.reserved);
        const status = newStock === 0 ? 'Out of Stock' : newStock <= item.lowStockLimit ? 'Low Stock' : 'In Stock';
        setInventory((prev) => prev.map((i) => i.id === itemId
            ? {
                ...i,
                currentStock: newStock,
                available,
                status,
                lastUpdated: new Date().toISOString(),
            }
            : i));
        // Record adjustment
        const adjRecord = {
            id: `adj-${Date.now()}`,
            inventoryItemId: item.id,
            productName: item.productName,
            variant: `${item.size} / ${item.color}`,
            sku: item.sku,
            adjustmentType,
            quantity,
            previousStock: item.currentStock,
            newStock,
            reason,
            notes,
            adjustedBy: `${currentUser.name} (${currentUser.role})`,
            timestamp: new Date().toISOString(),
        };
        setStockAdjustments((prev) => [adjRecord, ...prev]);
        showToast('Stock Adjusted', `Updated stock for ${item.productName} (${item.sku}) to ${newStock} units.`);
    };
    // Order Methods
    const updateOrderStatus = (orderId, status, notes) => {
        setOrders((prev) => prev.map((o) => {
            if (o.id !== orderId)
                return o;
            const newTimeline = [...o.timeline];
            newTimeline.push({
                title: `Status Changed to ${status}`,
                description: notes || `Order marked as ${status} by ${currentUser.name}`,
                timestamp: new Intl.DateTimeFormat('en-PK', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }).format(new Date()),
                completed: true,
                current: true,
            });
            return {
                ...o,
                status,
                paymentStatus: status === 'Delivered' && o.paymentMethod === 'Cash on Delivery' ? 'Paid' : o.paymentStatus,
                fulfillmentStatus: status === 'Delivered' || status === 'Shipped' ? 'Fulfilled' : o.fulfillmentStatus,
                timeline: newTimeline,
            };
        }));
        showToast('Order Updated', `Order status updated to ${status}.`);
    };
    const cancelOrder = (orderId, reason) => {
        updateOrderStatus(orderId, 'Cancelled', reason || 'Order was cancelled by admin.');
        showToast('Order Cancelled', 'Order has been marked as cancelled.', 'warning');
    };
    const createOrder = (orderData) => {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const newOrder = {
            ...orderData,
            id: `ord-${Date.now()}`,
            orderNumber: `ORD-${randomSuffix}`,
            date: new Date().toISOString(),
            fulfillmentStatus: 'Unfulfilled',
            timeline: [
                {
                    title: 'Order Placed',
                    description: `Order successfully booked by ${orderData.customerName}`,
                    timestamp: new Intl.DateTimeFormat('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }).format(new Date()),
                    completed: true,
                    current: true,
                },
            ],
        };
        setOrders((prev) => [newOrder, ...prev]);
        showToast('Order Created', `Order ${newOrder.orderNumber} successfully booked.`);
        return newOrder;
    };
    // Customers
    const addCustomer = (custData) => {
        const newCust = {
            ...custData,
            id: `cust-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setCustomers((prev) => [newCust, ...prev]);
        showToast('Customer Created', `Registered ${newCust.name} in CRM directory.`);
        return newCust;
    };
    const updateCustomer = (id, updates) => {
        setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
        showToast('Customer Updated', 'Customer profile updated.');
    };
    // Categories
    const addCategory = (catData) => {
        const newCat = {
            ...catData,
            id: `cat-${Date.now()}`,
            productCount: 0,
            createdAt: new Date().toISOString(),
        };
        setCategories((prev) => [...prev, newCat]);
        showToast('Category Created', `Added category ${newCat.name}`);
    };
    const updateCategory = (id, updates) => {
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
        showToast('Category Updated', 'Category updated successfully.');
    };
    const deleteCategory = (id) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast('Category Deleted', 'Category has been removed.');
    };
    // Collections
    const addCollection = (colData) => {
        const newCol = {
            ...colData,
            id: `col-${Date.now()}`,
            productCount: 0,
        };
        setCollections((prev) => [...prev, newCol]);
        showToast('Collection Created', `Added collection ${newCol.name}`);
    };
    const updateCollection = (id, updates) => {
        setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
        showToast('Collection Updated', 'Collection updated successfully.');
    };
    const deleteCollection = (id) => {
        setCollections((prev) => prev.filter((c) => c.id !== id));
        showToast('Collection Deleted', 'Collection has been removed.');
    };
    // Discounts
    const addDiscount = (discData) => {
        const newDisc = {
            ...discData,
            id: `disc-${Date.now()}`,
            usedCount: 0,
        };
        setDiscounts((prev) => [...prev, newDisc]);
        showToast('Discount Created', `Coupon ${newDisc.code} created successfully.`);
    };
    const updateDiscount = (id, updates) => {
        setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
        showToast('Discount Updated', 'Discount coupon updated.');
    };
    const deleteDiscount = (id) => {
        setDiscounts((prev) => prev.filter((d) => d.id !== id));
        showToast('Discount Deleted', 'Coupon has been deleted.');
    };
    // Returns
    const updateReturnStatus = (returnId, status, notes) => {
        setReturns((prev) => prev.map((r) => (r.id === returnId ? { ...r, status, notes: notes || r.notes } : r)));
        showToast('Return Status Updated', `Return request marked as ${status}.`);
    };
    // Banners
    const addBanner = (bannerData) => {
        const newBanner = {
            ...bannerData,
            id: `ban-${Date.now()}`,
        };
        setBanners((prev) => [...prev, newBanner]);
        showToast('Banner Added', 'Website banner created successfully.');
    };
    const updateBanner = (id, updates) => {
        setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
        showToast('Banner Updated', 'Website banner updated.');
    };
    const deleteBanner = (id) => {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        showToast('Banner Deleted', 'Banner removed.');
    };
    // Users
    const addUser = (userData) => {
        const newUser = {
            ...userData,
            id: `usr-${Date.now()}`,
            lastLogin: 'Never',
            createdAt: new Date().toISOString(),
        };
        setUsers((prev) => [...prev, newUser]);
        showToast('User Created', `Added team member ${newUser.name} as ${newUser.role}.`);
    };
    const updateUser = (id, updates) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
        showToast('User Updated', 'User details updated.');
    };
    const deleteUser = (id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        showToast('User Deleted', 'User has been removed from team.');
    };
    // Settings
    const updateStoreSettings = (newSettings) => {
        setStoreSettings((prev) => ({
            ...prev,
            ...newSettings,
        }));
        showToast('Settings Saved', 'Store configurations updated successfully.');
    };
    // Notifications
    const markNotificationAsRead = (id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    };
    const markAllNotificationsAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        showToast('Notifications Cleared', 'All notifications marked as read.');
    };
    return (<AppContext.Provider value={{
            products,
            orders,
            customers,
            inventory,
            categories,
            collections,
            discounts,
            returns,
            banners,
            users,
            notifications,
            storeSettings,
            stockAdjustments,
            currentUser,
            toasts,
            sidebarCollapsed,
            mobileMenuOpen,
            searchModalOpen,
            isAuthenticated,
            login,
            logout,
            setSidebarCollapsed,
            setMobileMenuOpen,
            setSearchModalOpen,
            showToast,
            removeToast,
            addProduct,
            updateProduct,
            deleteProduct,
            duplicateProduct,
            adjustStock,
            updateOrderStatus,
            cancelOrder,
            createOrder,
            addCustomer,
            updateCustomer,
            addCategory,
            updateCategory,
            deleteCategory,
            addCollection,
            updateCollection,
            deleteCollection,
            addDiscount,
            updateDiscount,
            deleteDiscount,
            updateReturnStatus,
            addBanner,
            updateBanner,
            deleteBanner,
            addUser,
            updateUser,
            deleteUser,
            updateStoreSettings,
            markNotificationAsRead,
            markAllNotificationsAsRead,
        }}>
      {children}
    </AppContext.Provider>);
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
