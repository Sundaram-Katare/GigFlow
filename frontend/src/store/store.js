import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import gigReducer from '../features/gig/gigSlice.js';

export const store = configureStore({
    reducer: {
       auth: authReducer,
       gig: gigReducer
    }
});
