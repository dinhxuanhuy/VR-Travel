/**
 * Storage Utilities
 * Functions for managing localStorage
 */

import { STORAGE_KEYS } from '../constants';

/**
 * Save item to localStorage
 */
export const saveToStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Get item from localStorage
 */
export const getFromStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Remove item from localStorage
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Save auth token
 */
export const saveToken = (token: string): void => {
  saveToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Get auth token
 */
export const getToken = (): string | null => {
  return getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Remove auth token
 */
export const removeToken = (): void => {
  removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
};
