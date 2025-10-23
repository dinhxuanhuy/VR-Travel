import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, RegisterData, User } from '../../types';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

/**
 * Auth Slice với Redux Saga
 * Actions được tách biệt rõ ràng: Request → Success/Failure
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ========================================
    // LOGIN ACTIONS
    // ========================================
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // ========================================
    // REGISTER ACTIONS
    // ========================================
    registerRequest: (state, _action: PayloadAction<RegisterData>) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // ========================================
    // LOGOUT ACTIONS
    // ========================================
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    // ========================================
    // GET CURRENT USER ACTIONS
    // ========================================
    getCurrentUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCurrentUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    getCurrentUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // ========================================
    // UTILITY ACTIONS
    // ========================================
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  getCurrentUserFailure,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
