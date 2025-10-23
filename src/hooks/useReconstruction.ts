/**
 * useReconstruction Hook - Simplified với Redux Saga
 * Provides reconstruction functionality aligned with VRTravel API v1
 * 
 * Workflow:
 * 1. Create scene -> createScene({ name, description })
 * 2. Add local files -> addLocalFiles([file1, file2, ...])
 * 3. Upload to scene -> uploadImages(sceneId)
 * 4. Run reconstruction -> runReconstruction(sceneId)
 * 
 * OR use full workflow:
 * - startFullWorkflow({ name, description }, files)
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import * as reconActions from '../redux/actions/reconstructionActions';
import type { CreateSceneData, Scene } from '../types';

export const useReconstruction = () => {
  const dispatch = useAppDispatch();
  const reconstruction = useAppSelector((state) => state.reconstruction);

  // Auto-load scenes on mount
  useEffect(() => {
    dispatch(reconActions.fetchScenesRequest());
  }, [dispatch]);

  /**
   * Create a new scene - Dispatch action, Saga handles API
   */
  const createScene = useCallback(
    (data: CreateSceneData) => {
      dispatch(reconActions.createSceneRequest(data));
    },
    [dispatch]
  );

  /**
   * Fetch all scenes
   */
  const refreshScenes = useCallback(() => {
    dispatch(reconActions.fetchScenesRequest());
  }, [dispatch]);

  /**
   * Fetch specific scene by ID
   */
  const getSceneById = useCallback(
    (sceneId: string) => {
      dispatch(reconActions.fetchSceneByIdRequest(sceneId));
    },
    [dispatch]
  );

  /**
   * Add files locally (before upload)
   */
  const addLocalFiles = useCallback(
    (files: File[]) => {
      dispatch(reconActions.addLocalFiles(files));
    },
    [dispatch]
  );

  /**
   * Remove file from local list
   */
  const removeLocalFile = useCallback(
    (fileId: string) => {
      dispatch(reconActions.removeLocalFile(fileId));
    },
    [dispatch]
  );

  /**
   * Clear all local files
   */
  const clearLocalFiles = useCallback(() => {
    dispatch(reconActions.clearLocalFiles());
  }, [dispatch]);

  /**
   * Upload images to a scene - Dispatch action, Saga handles upload
   */
  const uploadImages = useCallback(
    (sceneId: string, files: File[]) => {
      dispatch(reconActions.uploadImagesRequest(sceneId, files));
    },
    [dispatch]
  );

  /**
   * Run 3D reconstruction on a scene - Dispatch action, Saga handles reconstruction
   */
  const runReconstruction = useCallback(
    (sceneId: string) => {
      dispatch(reconActions.runReconstructionRequest(sceneId));
    },
    [dispatch]
  );

  /**
   * Select/set current scene
   */
  const selectScene = useCallback(
    (scene: Scene | null) => {
      dispatch(reconActions.setCurrentScene(scene));
    },
    [dispatch]
  );

  /**
   * Start full workflow (Create → Upload → Reconstruct)
   * Saga handles the entire pipeline automatically
   */
  const startFullWorkflow = useCallback(
    (data: CreateSceneData, files: File[]) => {
      dispatch(reconActions.startFullWorkflowRequest(data, files));
    },
    [dispatch]
  );

  /**
   * Cancel ongoing workflow
   */
  const cancelWorkflow = useCallback(() => {
    dispatch(reconActions.cancelWorkflow());
  }, [dispatch]);

  /**
   * Clear error
   */
  const clearReconstructionError = useCallback(() => {
    dispatch(reconActions.clearError());
  }, [dispatch]);

  return {
    // State
    files: reconstruction.files,
    scenes: reconstruction.scenes,
    currentScene: reconstruction.currentScene,
    isCreatingScene: reconstruction.isCreatingScene,
    isUploadingImages: reconstruction.isUploadingImages,
    isRunningReconstruction: reconstruction.isRunningReconstruction,
    isFetchingScenes: reconstruction.isFetchingScenes,
    uploadProgress: reconstruction.uploadProgress,
    reconstructionProgress: reconstruction.reconstructionProgress,
    currentWorkflowStep: reconstruction.currentWorkflowStep,
    error: reconstruction.error,

    // Actions
    createScene,
    refreshScenes,
    getSceneById,
    addLocalFiles,
    removeLocalFile,
    clearLocalFiles,
    uploadImages,
    runReconstruction,
    selectScene,
    startFullWorkflow,
    cancelWorkflow,
    clearError: clearReconstructionError,
  };
};
