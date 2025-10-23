/**
 * useModels Hook - Simplified với Redux Saga
 * Chỉ dispatch actions, Saga xử lý tất cả logic
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import * as modelActions from '../redux/actions/modelActions';
import type { ModelFile } from '../types';

export const useModels = () => {
  const dispatch = useAppDispatch();
  const model = useAppSelector((state) => state.model);
  const user = useAppSelector((state) => state.auth.user);

  // Auto-fetch sample models on mount
  useEffect(() => {
    dispatch(modelActions.fetchSampleModelsRequest());
  }, [dispatch]);

  // Auto-fetch user models when user changes
  useEffect(() => {
    if (user?.username) {
      dispatch(modelActions.fetchUserModelsRequest(user.username));
    }
  }, [dispatch, user?.username]);

  /**
   * Select a model
   */
  const selectModel = useCallback(
    (selectedModel: ModelFile | null) => {
      dispatch(modelActions.selectModel(selectedModel));
    },
    [dispatch]
  );

  /**
   * Upload model - Dispatch action, Saga handles upload
   */
  const uploadModel = useCallback(
    (file: File) => {
      if (!user?.username) {
        throw new Error('User not authenticated');
      }
      dispatch(modelActions.uploadModelRequest(file, user.username));
    },
    [dispatch, user?.username]
  );

  /**
   * Refresh all models
   */
  const refreshModels = useCallback(() => {
    dispatch(modelActions.fetchSampleModelsRequest());
    if (user?.username) {
      dispatch(modelActions.fetchUserModelsRequest(user.username));
    }
  }, [dispatch, user?.username]);

  /**
   * Clear error
   */
  const clearModelError = useCallback(() => {
    dispatch(modelActions.clearError());
  }, [dispatch]);

  return {
    // State
    files: model.files,
    userFiles: model.userFiles,
    selectedModel: model.selectedModel,
    loading: model.loading,
    error: model.error,

    // Actions
    selectModel,
    uploadModel,
    refreshModels,
    clearError: clearModelError,
  };
};
