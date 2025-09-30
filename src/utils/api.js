// src/utils/api.js - COMPLETE FIX FOR 401 UNAUTHORIZED

import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000/api/v1/modules'; 
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

// Attach JWT if available (example: token in localStorage)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // or your auth storage

    // 🛑 FIX FOR 401 UNAUTHORIZED: Token must be attached!
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // 🛑 FIX FOR MULTER UPLOAD: Conditionally remove Content-Type for file uploads
    if (config.data instanceof FormData) {
        // The browser must set the Content-Type header to include the boundary
        delete config.headers['Content-Type']; 
    }
    
    return config;
}, 
(err) => Promise.reject(err));

// Global response interceptor for nicer toasts on errors
api.interceptors.response.use(
    (res) => res,
    (error) => {
        const message = error?.response?.data?.message || error.message || 'Unexpected error';
        // Avoid spamming toasts for cancelled requests
        if (!axios.isCancel(error)) toast.error(message);
        return Promise.reject(error);
    }
);

export const fetchData = async (endpoint, { method = 'GET', data = null, headers = {}, signal } = {}) => {
    try {
        const response = await api({
            url: endpoint,
            method,
            data,
            headers,
            signal, // support AbortController
        });
        return response.data;
    } catch (error) {
        // rethrow so UI can handle it (we already toasted above)
        throw error;
    }
};

export default api;