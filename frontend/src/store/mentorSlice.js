import { createSlice } from '@reduxjs/toolkit';
import { initialMentorFeedback } from '../features/mentor/data/mockMentorStudents';

const mentorSlice = createSlice({
  name: 'mentor',
  initialState: {
    feedback: initialMentorFeedback,
  },
  reducers: {
    addFeedback: (state, action) => {
      state.feedback.unshift(action.payload);
    },
  },
});

export const { addFeedback } = mentorSlice.actions;
export default mentorSlice.reducer;
