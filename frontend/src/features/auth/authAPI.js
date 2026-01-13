const API_URL = import.meta.env.VITE_API_URL + '/auth';
import axios from 'axios';

export const registerUser = async (data) => {
    const res = await axios.post(`${API_URL}/register`, data, {
        withCredentials: true,
    });
    return res.data;
};

export const loginUser = async (data) => {
    const res = await axios.post(`${API_URL}/login`, data, {
        withCredentials: true,
    });
    return res.data;
};

export const logoutUser = async () => {
    const res = await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true,
    });
    return res.data;
};

export const getProfile = async () => {
    const res = await axios.get('http://localhost:5000/api/user/profile', {
        withCredentials: true,
    });
    return res.data;
};