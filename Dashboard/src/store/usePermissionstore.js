import { create } from 'zustand';
import axios from 'axios';

export const useProductStore = create((set, get) => ({
    // 1. Initial States
    roles: ['Administrator', 'Manager', 'Staff', 'Sales'], // Aapke roles
    activeRolePermissions: {}, // Initial empty object
    isLoading: false,

    // 2. Fetch Permissions for a specific role
    fetchPermissionsByRole: async (roleName) => {
        set({ isLoading: true });
        try {
            // Backend endpoint according to your API
            const response = await axios.get(`/api/permissions/${roleName}`);
            // Agar backend nahi hai to sample data set karein
            const data = response.data.data || {
                Orders: { view: true, create: true, edit: false, delete: false },
                Products: { view: true, create: true, edit: true, delete: false },
                Exchanges: { view: true, create: true, edit: false, delete: false },
                Returns: { view: true, create: true, edit: false, delete: false },
                Customers: { view: true, create: false, edit: false, delete: false }
            };
            set({ activeRolePermissions: data, isLoading: false });
        } catch (error) {
            console.error("Fetch Error:", error);
            set({ isLoading: false, activeRolePermissions: {} });
        }
    },

    // 3. Toggle Individual Permission (Frontend logic)
    togglePermission: (module, action) => {
        const currentPermissions = get().activeRolePermissions;
        const updatedModule = {
            ...currentPermissions[module],
            [action]: !currentPermissions[module][action]
        };
        
        set({
            activeRolePermissions: {
                ...currentPermissions,
                [module]: updatedModule
            }
        });
    },

    // 4. Save to Backend
    saveRolePermissions: async (roleName) => {
        set({ isLoading: true });
        try {
            const permissions = get().activeRolePermissions;
            await axios.put(`/api/permissions/${roleName}`, { permissions });
            alert("Permissions updated successfully!");
            set({ isLoading: false });
        } catch (error) {
            alert("Failed to save permissions");
            set({ isLoading: false });
        }
    }
}));