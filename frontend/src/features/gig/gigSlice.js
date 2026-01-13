// src/features/gig/gigSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createGig,
  getAllGigs,
  getUserGigs,
  updateGigStatus,
  getAllBidsOfGig,
} from "./gigAPI.js";

// Async thunks
export const addGig = createAsyncThunk(
  "gig/addGig",
  async (gigData, { rejectWithValue }) => {
    try {
      return await createGig(gigData);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAllGigs = createAsyncThunk(
  "gig/fetchAllGigs",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllGigs();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchUserGigs = createAsyncThunk(
  "gig/fetchUserGigs",
  async (_, { rejectWithValue }) => {
    try {
      return await getUserGigs();
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const changeGigStatus = createAsyncThunk(
  "gig/changeGigStatus",
  async ({ gigId, status }, { rejectWithValue }) => {
    try {
      return await updateGigStatus(gigId, status);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchGigBids = createAsyncThunk(
  "gig/fetchGigBids",
  async (gigId, { rejectWithValue }) => {
    try {
      return await getAllBidsOfGig(gigId);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Initial state
const initialState = {
  gigs: [],
  userGigs: [],
  bids: [],
  loading: false,
  error: null,
  success: false,
};

// Slice
const gigSlice = createSlice({
  name: "gig",
  initialState,
  reducers: {
    resetGigState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add gig
      .addCase(addGig.pending, (state) => {
        state.loading = true;
      })
      .addCase(addGig.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.gigs.push(action.payload.gig);
      })
      .addCase(addGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Fetch all gigs
      .addCase(fetchAllGigs.fulfilled, (state, action) => {
        state.gigs = action.payload.gigs;
      })
      // Fetch user gigs
      .addCase(fetchUserGigs.fulfilled, (state, action) => {
        state.userGigs = action.payload.gigs;
      })
      // Update gig status
      .addCase(changeGigStatus.fulfilled, (state, action) => {
        const updatedGig = action.payload.gig;
        state.gigs = state.gigs.map((gig) =>
          gig.id === updatedGig._id ? updatedGig : gig
        );
      })
      // Fetch bids
      .addCase(fetchGigBids.fulfilled, (state, action) => {
        state.bids = action.payload.bids;
      });
  },
});

export const { resetGigState } = gigSlice.actions;
export default gigSlice.reducer;