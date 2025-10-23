/**
 * Model Actions
 * Explicit action creators với metadata cho better tracking
 */

import { createAction } from '@reduxjs/toolkit';
import type { ModelFile } from '../../types';

// ========================================
// FETCH SAMPLE MODELS
// ========================================
export const fetchSampleModelsRequest = createAction(
  'model/fetchSampleModelsRequest',
  () => ({
    payload: undefined,
    meta: {
      requestId: `fetch-samples-${Date.now()}`,
      timestamp: Date.now(),
    },
  })
);

export const fetchSampleModelsSuccess = createAction(
  'model/fetchSampleModelsSuccess',
  (files: ModelFile[], requestId?: string) => ({
    payload: files,
    meta: {
      requestId,
      timestamp: Date.now(),
      count: files.length,
    },
  })
);

export const fetchSampleModelsFailure = createAction(
  'model/fetchSampleModelsFailure',
  (error: string, requestId?: string) => ({
    payload: error,
    meta: {
      requestId,
      timestamp: Date.now(),
    },
  })
);

// ========================================
// FETCH USER MODELS
// ========================================
export const fetchUserModelsRequest = createAction(
  'model/fetchUserModelsRequest',
  (username: string) => ({
    payload: { username },
    meta: {
      requestId: `fetch-user-${username}-${Date.now()}`,
      timestamp: Date.now(),
      username,
    },
  })
);

export const fetchUserModelsSuccess = createAction(
  'model/fetchUserModelsSuccess',
  (files: ModelFile[], username: string, requestId?: string) => ({
    payload: files,
    meta: {
      requestId,
      timestamp: Date.now(),
      username,
      count: files.length,
    },
  })
);

export const fetchUserModelsFailure = createAction(
  'model/fetchUserModelsFailure',
  (error: string, username: string, requestId?: string) => ({
    payload: error,
    meta: {
      requestId,
      timestamp: Date.now(),
      username,
    },
  })
);

// ========================================
// UPLOAD MODEL
// ========================================
export const uploadModelRequest = createAction(
  'model/uploadModelRequest',
  (file: File, username: string) => ({
    payload: { file, username },
    meta: {
      requestId: `upload-${file.name}-${Date.now()}`,
      timestamp: Date.now(),
      filename: file.name,
      filesize: file.size,
      username,
    },
  })
);

export const uploadModelSuccess = createAction(
  'model/uploadModelSuccess',
  (filename: string, username: string, requestId?: string) => ({
    payload: { filename, username },
    meta: {
      requestId,
      timestamp: Date.now(),
      filename,
      username,
    },
  })
);

export const uploadModelFailure = createAction(
  'model/uploadModelFailure',
  (error: string, filename: string, requestId?: string) => ({
    payload: error,
    meta: {
      requestId,
      timestamp: Date.now(),
      filename,
    },
  })
);

// ========================================
// SELECT MODEL
// ========================================
export const selectModel = createAction(
  'model/selectModel',
  (model: ModelFile | null) => ({
    payload: model,
    meta: {
      timestamp: Date.now(),
      modelName: model?.name || null,
    },
  })
);

// ========================================
// UTILITY ACTIONS
// ========================================
export const clearError = createAction('model/clearError');

export const resetModels = createAction('model/resetModels');
