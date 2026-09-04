import axios from 'axios';

const API_BASE_URL = 'https://clothes-project-production.up.railway.app/';

// 1. Axios instance banayein
const api = axios.create({
    baseURL: API_BASE_URL,
});

// 2. Request Interceptor: Har request se pehle localStorage se token utha kar header mein daal dega
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Login ke waqt token yahan save karna hoga
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;