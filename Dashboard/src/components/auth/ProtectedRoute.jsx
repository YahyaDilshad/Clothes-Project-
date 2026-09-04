import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js'; // Path check karein

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, token } = useAuthStore();
    const location = useLocation();

    // LocalStorage se bhi check karein taake refresh par masla na ho
    const hasToken = token || localStorage.getItem('token');

    if (!isAuthenticated && !hasToken) {
        // Agar user login nahi hai, to use login page par bhejein
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};