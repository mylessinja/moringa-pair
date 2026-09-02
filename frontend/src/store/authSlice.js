import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

const storedUser = localStorage.getItem('moringaPairUser');
const hasToken = Boolean(localStorage.getItem('moringaPairToken'));
let initialUser = null;
// Only restore user if a token exists — otherwise force re-login
if (hasToken && storedUser) {
  try {
    initialUser = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('moringaPairUser');
  }
} else {
  localStorage.removeItem('moringaPairUser');
  localStorage.removeItem('moringaPairToken');
}

export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.signUp(userData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Sign up failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Login failed'
      );
    }
  }
);

export const googleLoginUser = createAsyncThunk(
  'auth/googleLoginUser',
  async (idToken, { rejectWithValue }) => {
    try {
      return await authService.googleLogin(idToken);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || err.message || 'Google login failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      authService.logout();
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = 'loading';
      state.error = null;
    };
    const rejected = (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    };
    const fulfilled = (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
      localStorage.setItem('moringaPairUser', JSON.stringify(action.payload));
    };

    builder
      .addCase(signUpUser.pending, pending)
      .addCase(signUpUser.fulfilled, fulfilled)
      .addCase(signUpUser.rejected, rejected)
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(googleLoginUser.pending, pending)
      .addCase(googleLoginUser.fulfilled, fulfilled)
      .addCase(googleLoginUser.rejected, rejected);
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
