import axiosInstance from "../../utils/axiosInstance.js";

export const createGig = async (gigData) => {
  const response = await axiosInstance.post('/gig/addGig', gigData);
  return response.data;
};

export const getAllGigs = async () => {
  const response = await axiosInstance.get('/gig/getAllGigs');
  return response.data;
};

// Get gigs of a single user
export const getUserGigs = async () => {
  const response = await axiosInstance.get('/gig/getAllGigsOfSingleUser');
  return response.data;
};

// Update gig status
export const updateGigStatus = async (gigId, status) => {
  const response = await axiosInstance.put(
    `/gig/updateStatus/${gigId}`,
    { status }
  );
  return response.data;
};

// Get all bids of a gig
export const getAllBidsOfGig = async (gigId) => {
  const response = await axiosInstance.get('/gig/getAllBids', {
    params: { gigId },
  });
  return response.data;
};