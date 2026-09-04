import axios from 'axios';
import { toast } from 'react-hot-toast';

// 1. Axios Instance Create Karein
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://clothes-project-production.up.railway.app/api',
    timeout: 15000, // 15 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 2. Request Interceptor (Har request se pehle token add karne ke liye)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('fk_auth_token'); // Token localstorage se uthayen
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Agar data FormData hai (Images upload ke liye), toh axios khud content-type set kar leta hai
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor (Errors handle karne ke liye)
axiosInstance.interceptors.response.use(
    (response) => {
        // Backend agar { success: true, data: ... } bhej raha hai toh wahi return hoga
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';

        // Common Error Handling
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized: User ko logout kar dein ya login page par bhej dein
                    toast.error("Session expired. Please login again.");
                    localStorage.removeItem('fk_auth_token');
                    // window.location.href = '/login'; // Optional
                    break;
                case 403:
                    toast.error("You don't have permission to perform this action.");
                    break;
                case 404:
                    toast.error("Requested resource not found.");
                    break;
                case 429:
                    toast.error("Too many requests. Please slow down.");
                    break;
                case 500:
                    toast.error("Server error. Please try again later.");
                    break;
                default:
                    // Baqi errors store functions handle karenge toast.error ke zariye
                    break;
            }
        } else if (error.request) {
            // Network error (Server down)
            toast.error("Network error. Please check your internet connection.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;