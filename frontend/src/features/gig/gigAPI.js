import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + '/gig';

export const createGig = async (gigData) => {
  const response = await axios.post(`${API_URL}/addGig`, gigData, {
    withCredentials: true,
  });
  return response.data;
};


export const getAllGigs = async () => {
  const response = await axios.get(`${API_URL}/getAllGigs`, {
    withCredentials: true,
  });
  return response.data;
};

// Get gigs of a single user
export const getUserGigs = async () => {
  const response = await axios.get(`${API_URL}/getAllGigsOfSingleUser`, {
    withCredentials: true,
  });
  return response.data;
};

// Update gig status
export const updateGigStatus = async (gigId, status) => {
  const response = await axios.put(
    `${API_URL}/updateStatus/${gigId}`,
    { status },
    { withCredentials: true }
  );
  return response.data;
};

// Get all bids of a gig
export const getAllBidsOfGig = async (gigId) => {
  const response = await axios.get(`${API_URL}/getAllBids`, {
    params: { gigId },
    withCredentials: true,
  });
  return response.data;
};