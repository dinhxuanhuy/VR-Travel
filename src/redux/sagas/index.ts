/**
 * Root Saga
 * Combines all sagas và runs them concurrently
 */

import { all, fork } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { modelSaga } from './modelSaga';
import { reconstructionSaga } from './reconstructionSaga';
import { errorHandlerSaga } from './errorHandlerSaga';

/**
 * Root Saga - Runs all sagas in parallel
 */
export function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(modelSaga),
    fork(reconstructionSaga),
    fork(errorHandlerSaga), // ✅ Global error handler
  ]);
}
