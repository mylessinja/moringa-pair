import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mentorReducer from './mentorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mentor: mentorReducer,
  },
});
