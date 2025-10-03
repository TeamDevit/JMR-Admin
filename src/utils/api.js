// src/utils/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        // Attach token if available
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Fix for file uploads - let browser set Content-Type with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error?.response?.data?.message || error.message || 'Unexpected error';
        
        // Don't toast for cancelled requests
        if (!axios.isCancel(error)) {
            toast.error(message);
        }
        
        return Promise.reject(error);
    }
);

// Helper function for common API calls
export const fetchData = async (endpoint, { method = 'GET', data = null, headers = {}, signal } = {}) => {
    try {
        const response = await api({
            url: endpoint,
            method,
            data,
            headers,
            signal,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;