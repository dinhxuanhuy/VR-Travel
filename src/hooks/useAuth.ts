import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  getCurrentUserRequest,
  clearError,
} from '../redux/slices/authSlice';
import type { LoginCredentials, RegisterData } from '../types';

/**
 * useAuth Hook - Simplified với Redux Saga
 * Chỉ dispatch actions, Saga xử lý tất cả logic
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  // Auto-load user from token
  useEffect(() => {
    const token = localStorage.getItem('vr_travel_auth_token');
    if (token && !auth.user) {
      dispatch(getCurrentUserRequest());
    }
  }, [dispatch, auth.user]);

  /**
   * Login - Dispatch action, Saga handles API call
   */
  const login = (credentials: LoginCredentials) => {
    dispatch(loginRequest(credentials));
  };

  /**
   * Register - Dispatch action, Saga handles API call
   */
  const register = (data: RegisterData) => {
    dispatch(registerRequest(data));
  };

  /**
   * Logout - Dispatch action, Saga handles cleanup
   */
  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  /**
   * Clear error message
   */
  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    login,
    register,
    logout: handleLogout,
    clearError: handleClearError,
  };
};
