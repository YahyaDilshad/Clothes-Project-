import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';


export const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    // Direct check karein localStorage taake delay na ho
    isAuthenticated: !!localStorage.getItem('token'), 
    isLoading: false,
    error: null,

    // 1. LOGIN FUNCTION
    login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
        const res = await axiosInstance.post(`/auth/login`, { username, password });
        const { token, user } = res.data;

        // 1. Pehle LocalStorage update karein
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('user token' , token);

        // 2. Phir Zustand state update karein
        set({ 
            user: user, 
            token: token, 
            isAuthenticated: true, // Yeh lazmi true karein
            isLoading: false 
        });

        return { success: true };
    } catch (err) {
        set({ 
            error: err.response?.data?.message || "Login failed", 
            isLoading: false,
            isAuthenticated: false // Error par false rakhein
        });
        return { success: false };
    }
},
    // 2. SIGNUP FUNCTION
    signUp: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.post(`/auth/register`, userData);
            // Agar aap signup ke baad direct login karwana chahte hain:
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            set({ user, token, isAuthenticated: true, isLoading: false });
            return { success: true };
        } catch (err) {
            const errMsg = err.response?.data?.message || "Registration failed.";
            set({ error: errMsg, isLoading: false });
            return { success: false, message: errMsg };
        }
    },

    // 3. UPDATE PASSWORD FUNCTION
    updatePassword: async (oldPassword, newPassword) => {
        set({ isLoading: true, error: null });
        const { token } = get();
        try {
            await axiosInstance.patch(`/auth/update-password`, 
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            set({ isLoading: false });
            return { success: true, message: "Password updated successfully!" };
        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to update password.";
            set({ error: errMsg, isLoading: false });
            return { success: false, message: errMsg };
        }
    },

    // 4. LOGOUT
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    }
}));