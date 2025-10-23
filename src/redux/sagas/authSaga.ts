import { call, put, takeLatest } from 'redux-saga/effects';
import { type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services';
import type { LoginCredentials, RegisterData } from '../../types';
import {
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
} from '../slices/authSlice';

/**
 * Worker Saga: Handle login
 * Xử lý toàn bộ login flow bao gồm API call, localStorage, và side effects
 */
function* loginSaga(action: PayloadAction<LoginCredentials>) {
  try {
    // Call login API
    const response: Awaited<ReturnType<typeof authService.login>> = yield call(
      authService.login,
      action.payload
    );

    if (response.success && response.data) {
      // Dispatch success action
      yield put(
        loginSuccess({
          user: response.data.user,
          token: response.data.token,
        })
      );

      // Side effect: Save to localStorage
      localStorage.setItem('vr_travel_auth_token', response.data.token);
      localStorage.setItem('vr_travel_user', JSON.stringify(response.data.user));

      // Optional: Track analytics
      console.log('Login successful:', response.data.user.username);
    } else {
      yield put(loginFailure(response.message || 'Login failed'));
    }
  } catch (error: any) {
    yield put(loginFailure(error.message || 'An error occurred during login'));
  }
}

/**
 * Worker Saga: Handle register
 */
function* registerSaga(action: PayloadAction<RegisterData>) {
  try {
    const response: Awaited<ReturnType<typeof authService.register>> = yield call(
      authService.register,
      action.payload
    );

    if (response.success && response.data) {
      yield put(
        registerSuccess({
          user: response.data.user,
          token: response.data.token,
        })
      );

      // Side effect: Save to localStorage
      localStorage.setItem('vr_travel_auth_token', response.data.token);
      localStorage.setItem('vr_travel_user', JSON.stringify(response.data.user));

      console.log('Registration successful:', response.data.user.username);
    } else {
      yield put(registerFailure(response.message || 'Registration failed'));
    }
  } catch (error: any) {
    yield put(registerFailure(error.message || 'An error occurred during registration'));
  }
}

/**
 * Worker Saga: Handle logout
 */
function* logoutSaga() {
  try {
    // Clear localStorage
    localStorage.removeItem('vr_travel_auth_token');
    localStorage.removeItem('vr_travel_user');

    // Optional: Call logout API
    // yield call(authService.logout);

    yield put(logoutSuccess());

    console.log('Logout successful');
  } catch (error: any) {
    // Even if error, still logout locally
    yield put(logoutSuccess());
  }
}

/**
 * Worker Saga: Get current user
 */
function* getCurrentUserSaga() {
  try {
    const response: Awaited<ReturnType<typeof authService.getCurrentUser>> = yield call(
      authService.getCurrentUser
    );

    if (response.success && response.data) {
      yield put(getCurrentUserSuccess(response.data));
    } else {
      yield put(getCurrentUserFailure(response.message || 'Failed to get user'));
    }
  } catch (error: any) {
    yield put(getCurrentUserFailure(error.message || 'An error occurred'));
  }
}

/**
 * Watcher Saga: Listen for auth actions
 */
export function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeLatest(getCurrentUserRequest.type, getCurrentUserSaga);
}
