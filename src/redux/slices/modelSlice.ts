/**
 * Model Slice - Migrated to Redux Saga
 * Actions được define riêng trong modelActions.ts
 */

import { createSlice } from '@reduxjs/toolkit';
import type { ModelState } from '../../types';
import * as modelActions from '../actions/modelActions';

const initialState: ModelState = {
  files: [],
  userFiles: [],
  selectedModel: null,
  loading: false,
  error: null,
};

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    // Chỉ giữ utility reducers đơn giản
  },
  extraReducers: (builder) => {
    builder
      // ========================================
      // FETCH SAMPLE MODELS
      // ========================================
      .addCase(modelActions.fetchSampleModelsRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modelActions.fetchSampleModelsSuccess, (state, action) => {
        state.loading = false;
        state.files = action.payload;
        state.error = null;
      })
      .addCase(modelActions.fetchSampleModelsFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // FETCH USER MODELS
      // ========================================
      .addCase(modelActions.fetchUserModelsRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modelActions.fetchUserModelsSuccess, (state, action) => {
        state.loading = false;
        state.userFiles = action.payload;
        state.error = null;
      })
      .addCase(modelActions.fetchUserModelsFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // UPLOAD MODEL
      // ========================================
      .addCase(modelActions.uploadModelRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modelActions.uploadModelSuccess, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(modelActions.uploadModelFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================================
      // SELECT MODEL
      // ========================================
      .addCase(modelActions.selectModel, (state, action) => {
        state.selectedModel = action.payload;
      })

      // ========================================
      // UTILITY ACTIONS
      // ========================================
      .addCase(modelActions.clearError, (state) => {
        state.error = null;
      })
      .addCase(modelActions.resetModels, () => {
        return initialState;
      });
  },
});

export default modelSlice.reducer;
