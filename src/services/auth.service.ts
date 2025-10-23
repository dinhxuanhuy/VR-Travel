import { api } from './api.service';
import type { LoginCredentials, RegisterData, AuthResponse, UserResponse } from '../types';
import { saveToken, getToken, removeToken } from '../utils/storage.utils';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return api.post<AuthResponse['data']>('/auth/login', credentials);
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return api.post<AuthResponse['data']>('/auth/register', data);
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  return api.get<UserResponse['data']>('/auth/me');
};

export const logout = (): void => {
  removeToken();
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export { saveToken, getToken, removeToken };