const API_URL = import.meta.env.VITE_API_URL + '/auth';
import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
    withCredentials: true,
});

// Add Authorization header to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const registerUser = async (data) => {
    const res = await axiosInstance.post(`${API_URL}/register`, data);
    return res.data;
};

export const loginUser = async (data) => {
    const res = await axiosInstance.post(`${API_URL}/login`, data);
    // Store token in localStorage as well
    if (res.data.user?.token) {
        localStorage.setItem('token', res.data.user.token);
    }
    return res.data;
};

export const logoutUser = async () => {
    const res = await axiosInstance.post(`${API_URL}/logout`, {});
    localStorage.removeItem('token');
    return res.data;
};

export const getProfile = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const res = await axiosInstance.get(`${API_BASE_URL}/user/profile`);
    return res.data;
};