import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gigReducer from '../features/gig/gigSlice';
import bidReducer from '../features/bid/bidSlice';
import notificationReducer from '../features/notification/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gig: gigReducer,
    bid: bidReducer,
    notification: notificationReducer,
  },
});

