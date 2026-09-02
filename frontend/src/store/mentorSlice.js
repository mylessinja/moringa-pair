import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createFeedback, getMyGivenFeedback } from '../services/feedbackService';

export const fetchMyFeedback = createAsyncThunk(
  'mentor/fetchMyFeedback',
  async (_, { rejectWithValue }) => {
    try {
      return await getMyGivenFeedback();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Could not load feedback'
      );
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'mentor/submitFeedback',
  async ({ studentId, sessionType, note }, { rejectWithValue }) => {
    try {
      return await createFeedback({ studentId, sessionType, note });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Could not save feedback'
      );
    }
  }
);

const mentorSlice = createSlice({
  name: 'mentor',
  initialState: {
    feedback: [],
    status: 'idle',
    error: null,
    submitStatus: 'idle',
    submitError: null,
  },
  reducers: {
    clearSubmitError: (state) => {
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyFeedback.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMyFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feedback = action.payload;
      })
      .addCase(fetchMyFeedback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(submitFeedback.pending, (state) => {
        state.submitStatus = 'loading';
        state.submitError = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.feedback.unshift(action.payload);
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.submitError = action.payload;
      });
  },
});

export const { clearSubmitError } = mentorSlice.actions;
export default mentorSlice.reducer;
