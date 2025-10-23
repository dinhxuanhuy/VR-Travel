/**
 * Global Error Handler Saga
 * Centralized error handling cho tất cả failure actions
 */

import { call, put, takeEvery } from 'redux-saga/effects';
import { logoutRequest } from '../slices/authSlice';

/**
 * Worker Saga: Handle all errors
 */
function* handleErrorSaga(action: any): Generator<any, void, any> {
  const error = action.payload;
  const actionType = action.type;

  // Log error (development)
  if (import.meta.env.DEV) {
    console.error('🚨 Redux Error:', {
      type: actionType,
      error,
      meta: action.meta,
      timestamp: new Date().toISOString(),
    });
  }

  // Log to analytics (production)
  if (import.meta.env.PROD) {
    try {
      yield call(logErrorToAnalytics, {
        action: actionType,
        error: String(error),
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        meta: action.meta,
      });
    } catch (e) {
      console.error('Failed to log error to analytics:', e);
    }
  }

  // Handle specific error types
  if (typeof error === 'string') {
    // Authentication errors → auto-logout
    if (
      error.includes('401') ||
      error.includes('Unauthorized') ||
      error.includes('Token expired') ||
      error.includes('Invalid token') ||
      error.includes('Authentication failed')
    ) {
      console.log('🔒 Authentication error detected, logging out...');
      yield put(logoutRequest());
    }

    // Network errors → could show offline banner
    if (
      error.includes('Network') ||
      error.includes('Failed to fetch') ||
      error.includes('ERR_INTERNET_DISCONNECTED') ||
      error.includes('net::')
    ) {
      console.log('🌐 Network error detected');
      // TODO: dispatch action to show offline banner
      // yield put(showOfflineBanner());
    }

    // Server errors (500+) → could retry
    if (error.includes('500') || error.includes('503') || error.includes('Server error')) {
      console.log('🔥 Server error detected');
      // TODO: dispatch action to show retry option
    }
  }
}

/**
 * Mock analytics logger
 * TODO: Replace với real analytics service (Sentry, Google Analytics, etc.)
 */
function logErrorToAnalytics(errorData: any) {
  // Example: Send to Sentry
  // Sentry.captureException(new Error(errorData.error), {
  //   tags: {
  //     action: errorData.action,
  //   },
  //   extra: errorData,
  // });

  // For now, just log to console in production
  console.log('📊 Error logged to analytics:', errorData);
}

/**
 * Watcher Saga
 * Listens to all actions ending with 'Failure'
 */
export function* errorHandlerSaga() {
  yield takeEvery(
    (action: any) =>
      action.type.endsWith('Failure') ||
      action.type.endsWith('failure') ||
      action.type.endsWith('/rejected'),
    handleErrorSaga
  );
}
