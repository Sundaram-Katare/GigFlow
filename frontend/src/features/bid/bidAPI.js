import axiosInstance from '../../utils/axiosInstance.js';

export const hireBid = async (bidId) => {
    const res = await axiosInstance.put('/bid/hireBid', { bidId });
    return res.data;
};

export const createBid = async (bidData) => {
  const res = await axiosInstance.post('/bid/addBid', bidData);
  return res.data;
};