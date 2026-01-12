const API_URL = 'http://localhost:5000/api/auth';
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