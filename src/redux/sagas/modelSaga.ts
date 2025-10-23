/**
 * Model Saga
 * Handles all model-related side effects
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import * as modelActions from '../actions/modelActions';
import * as modelService from '../../services/model.service';
import type { ModelFile } from '../../types';

/**
 * Worker Saga: Fetch sample models
 */
function* fetchSampleModelsSaga(action: ReturnType<typeof modelActions.fetchSampleModelsRequest>) {
  const requestId = action.meta.requestId;

  try {
    const files: ModelFile[] = yield call(modelService.fetchSampleModels);
    
    yield put(modelActions.fetchSampleModelsSuccess(files, requestId));
    
    console.log(`✅ Fetched ${files.length} sample models`);
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to fetch sample models';
    yield put(modelActions.fetchSampleModelsFailure(errorMessage, requestId));
    
    console.error('❌ Fetch sample models failed:', errorMessage);
  }
}

/**
 * Worker Saga: Fetch user models
 */
function* fetchUserModelsSaga(action: ReturnType<typeof modelActions.fetchUserModelsRequest>) {
  const { username } = action.payload;
  const requestId = action.meta.requestId;

  try {
    const files: ModelFile[] = yield call(modelService.fetchUserModels, username);
    
    yield put(modelActions.fetchUserModelsSuccess(files, username, requestId));
    
    console.log(`✅ Fetched ${files.length} models for user: ${username}`);
  } catch (error: any) {
    const errorMessage = error.message || `Failed to fetch models for user: ${username}`;
    yield put(modelActions.fetchUserModelsFailure(errorMessage, username, requestId));
    
    console.error(`❌ Fetch user models failed for ${username}:`, errorMessage);
  }
}

/**
 * Worker Saga: Upload model
 */
function* uploadModelSaga(action: ReturnType<typeof modelActions.uploadModelRequest>) {
  const { file, username } = action.payload;
  const requestId = action.meta.requestId;

  try {
    yield call(modelService.uploadModel, file, username);
    
    yield put(modelActions.uploadModelSuccess(file.name, username, requestId));
    
    // Auto-refresh user models after upload
    yield put(modelActions.fetchUserModelsRequest(username));
    
    console.log(`✅ Uploaded model: ${file.name} for user: ${username}`);
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to upload model';
    yield put(modelActions.uploadModelFailure(errorMessage, file.name, requestId));
    
    console.error(`❌ Upload model failed for ${file.name}:`, errorMessage);
  }
}

/**
 * Watcher Saga
 */
export function* modelSaga() {
  yield takeLatest(modelActions.fetchSampleModelsRequest.type, fetchSampleModelsSaga);
  yield takeLatest(modelActions.fetchUserModelsRequest.type, fetchUserModelsSaga);
  yield takeLatest(modelActions.uploadModelRequest.type, uploadModelSaga);
}
