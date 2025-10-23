/**
 * Application Constants
 */

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_VERSION = 'v1';
export const API_BASE_URL = `${API_URL}/${API_VERSION}`;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'vr_travel_auth_token',
  USER_DATA: 'vr_travel_user_data',
} as const;

// Hugging Face Configuration
export const HUGGINGFACE_CONFIG = {
  DATASET_REPO: 'XuanHuy224/GaussianSample',
  BASE_URL: 'https://huggingface.co/datasets/XuanHuy224/GaussianSample/resolve/main',
  SAMPLE_FOLDER: 'Gaussian',
} as const;

// Model Configuration
export const MODEL_CONFIG = {
  SUPPORTED_FORMATS: ['.splat', '.ply'],
  DEFAULT_MODEL_URL: 'https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k-mini.splat',
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  ACCEPTED_IMAGE_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LIBRARY: '/library',
  RECONSTRUCTION: '/reconstruction',
} as const;
