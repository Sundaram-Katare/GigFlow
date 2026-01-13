import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hireBid, createBid } from './bidAPI.js';

export const hireBidAction = createAsyncThunk(
    'bid/hireBid',
    async (bidId, { rejectWithValue }) => {
        try {
            return await hireBid(bidId);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const createBidAction = createAsyncThunk(
    'bid/createBid',
    async (bidData, { rejectWithValue }) => {
        try {
            return await createBid(bidData);
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


const initialState = {
    loading: false,
    error: null,
};

const bidSlice = createSlice({
    name: 'bid',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(hireBidAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(hireBidAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(hireBidAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(createBidAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBidAction.fulfilled, (state, action) => {
                state.loading = false;
                // optionally store the new bid
            })
            .addCase(createBidAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export default bidSlice.reducer;