import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

const safeStorage = {
  getStorage() {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
    return null;
  },
  get(key) {
    const storage = this.getStorage();
    if (!storage) return null;
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      storage.setItem(key, value);
    } catch {
      // ignore storage quota or browser issues
    }
  },
  remove(key) {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      storage.removeItem(key);
    } catch {
      // ignore storage issues
    }
  },
};

const storedUser = safeStorage.get('moringaPairUser');
let initialUser = null;

try {
  initialUser = storedUser ? JSON.parse(storedUser) : null;
} catch {
  safeStorage.remove('moringaPairUser');
}

export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.signUp(userData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Sign up failed'
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
        err.response?.data?.message || 'Login failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    status: 'idle', // idle | loading | succeeded | failed
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
      safeStorage.remove('moringaPairUser');
      safeStorage.remove('moringaPairToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const user = { ...action.payload };
        delete user.token;
        state.user = user;
        safeStorage.set('moringaPairUser', JSON.stringify(user));
        if (action.payload?.token) {
          safeStorage.set('moringaPairToken', action.payload.token);
        }
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const user = { ...action.payload };
        delete user.token;
        state.user = user;
        safeStorage.set('moringaPairUser', JSON.stringify(user));
        if (action.payload?.token) {
          safeStorage.set('moringaPairToken', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;