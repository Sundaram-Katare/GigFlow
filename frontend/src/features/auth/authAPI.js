import axiosInstance from '../../utils/axiosInstance';

export const registerUser = async (data) => {
    const res = await axiosInstance.post('/auth/register', data);
    // Store token in localStorage
    if (res.data.user?.token) {
        localStorage.setItem('token', res.data.user.token);
    }
    return res.data;
};

export const loginUser = async (data) => {
    const res = await axiosInstance.post('/auth/login', data);
    // Store token in localStorage
    if (res.data.user?.token) {
        localStorage.setItem('token', res.data.user.token);
    }
    return res.data;
};

export const logoutUser = async () => {
    const res = await axiosInstance.post('/auth/logout', {});
    localStorage.removeItem('token');
    return res.data;
};

export const getProfile = async () => {
    const res = await axiosInstance.get('/user/profile');
    return res.data;
};