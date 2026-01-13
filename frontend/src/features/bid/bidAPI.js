import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bid';

export const hireBid = async (bidId) => {
    const res = await axios.put(`${API_URL}/hireBid`, { bidId }, {
        withCredentials: true,
    });
    return res.data;
};

export const createBid = async (bidData) => {
  const res = await axios.post(`${API_URL}/addBid`, bidData, {
    withCredentials: true,
  });
  return res.data;
};