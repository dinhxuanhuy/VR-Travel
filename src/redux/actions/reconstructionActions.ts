/**
 * Reconstruction Actions
 * Explicit action creators cho reconstruction workflow
 */

import { createAction } from '@reduxjs/toolkit';
import type { Scene, CreateSceneData } from '../../types';

// ========================================
// CREATE SCENE
// ========================================
export const createSceneRequest = createAction(
  'reconstruction/createSceneRequest',
  (data: CreateSceneData) => ({
    payload: data,
    meta: {
      requestId: `create-scene-${Date.now()}`,
      timestamp: Date.now(),
      sceneName: data.name,
    },
  })
);

export const createSceneSuccess = createAction(
  'reconstruction/createSceneSuccess',
  (scene: Scene, requestId?: string) => ({
    payload: scene,
    meta: {
      requestId,
      timestamp: Date.now(),
      sceneId: scene.id,
    },
  })
);

export const createSceneFailure = createAction(
  'reconstruction/createSceneFailure',
  (error: string, requestId?: string) => ({
    payload: error,
    meta: {
      requestId,
      timestamp: Date.now(),
    },
  })
);

// ========================================
// FETCH SCENES
// ========================================
export const fetchScenesRequest = createAction(
  'reconstruction/fetchScenesRequest',
  () => ({
    payload: undefined,
    meta: {
      requestId: `fetch-scenes-${Date.now()}`,
      timestamp: Date.now(),
    },
  })
);

export const fetchScenesSuccess = createAction(
  'reconstruction/fetchScenesSuccess',
  (scenes: Scene[], requestId?: string) => ({
    payload: scenes,
    meta: {
      requestId,
      timestamp: Date.now(),
      count: scenes.length,
    },
  })
);

export const fetchScenesFailure = createAction(
  'reconstruction/fetchScenesFailure',
  (error: string, requestId?: string) => ({
    payload: error,
    meta: {
      requestId,
      timestamp: Date.now(),
    },
  })
);

// ========================================
// FETCH SCENE BY ID
// ========================================
export const fetchSceneByIdRequest = createAction(
  'reconstruction/fetchSceneByIdRequest',
  (sceneId: string) => ({
    payload: { sceneId },
    meta: {
      requestId: `fetch-scene-${sceneId}-${Date.now()}`,
      timestamp: Date.now(),
      sceneId,
    },
  })
);

export const fetchSceneByIdSuccess = createAction(
  'reconstruction/fetchSceneByIdSuccess',
  (scene: Scene, requestId?: string) => ({
    payload: scene,
    meta: {
      requestId,
      timestamp: Date.now(),
      sceneId: scene.id,
    },
  })
);

export const fetchSceneByIdFailure = createAction(
  'reconstruction/fetchSceneByIdFailure',
  (error: string, sceneId: string, requestId?: string) => ({
    payload: error,
    meta: {
      requestId,
      timestamp: Date.now(),
      sceneId,
    },
  })
);

// ========================================
// UPLOAD IMAGES
// ========================================
export const uploadImagesRequest = createAction(
  'reconstruction/uploadImagesRequest',
  (sceneId: string, files: File[]) => ({
    payload: { sceneId, files },
    meta: {
      requestId: `upload-images-${sceneId}-${Date.now()}`,
      timestamp: Date.now(),
      sceneId,
      fileCount: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
    },
  })
);

export const uploadImagesProgress = createAction(
  'reconstruction/uploadImagesProgress',
  (progress: number, requestId?: string) => ({
    payload: progress,
    meta: {
      requestId,
      timestamp: Date.now(),
    },
  })
);

export const uploadImagesSuccess = createAction(
  'reconstruction/uploadImagesSuccess',
  (scene: Scene, requestId?: string) => ({
    payload: scene,
    meta: {
      requestId,
      timestamp: Date.now(),
      sceneId: scene.id,
      uploadedCount: scene.imageCount || 0,
    },
  })
);

export const uploadImagesFailure = createAction(
  'reconstruction/uploadImagesFailure',
  (error: string, sceneId: string, requestId?: string) => ({
    payload: error,
    meta: {
      requestId,
      timestamp: Date.now(),
      sceneId,
    },
  })
);

// ========================================
// RUN RECONSTRUCTION
// ========================================
export const runReconstructionRequest = createAction(
  'reconstruction/runReconstructionRequest',
  (sceneId: string) => ({
    payload: { sceneId },
    meta: {
      requestId: `reconstruct-${sceneId}-${Date.now()}`,
      timestamp: Date.now(),
      sceneId,
    },
  })
);

export const runReconstructionProgress = createAction(
  'reconstruction/runReconstructionProgress',
  (progress: number, status: string, requestId?: string) => ({
    payload: { progress, status },
    meta: {
      requestId,
      timestamp: Date.now(),
    },
  })
);

export const runReconstructionSuccess = createAction(
  'reconstruction/runReconstructionSuccess',
  (scene: Scene, requestId?: string) => ({
    payload: scene,
    meta: {
      requestId,
      timestamp: Date.now(),
      sceneId: scene.id,
      status: scene.status,
    },
  })
);

export const runReconstructionFailure = createAction(
  'reconstruction/runReconstructionFailure',
  (error: string, sceneId: string, requestId?: string) => ({
    payload: error,
    meta: {
      requestId,
      timestamp: Date.now(),
      sceneId,
    },
  })
);

// ========================================
// LOCAL FILE MANAGEMENT
// ========================================
export const addLocalFiles = createAction(
  'reconstruction/addLocalFiles',
  (files: File[]) => ({
    payload: files,
    meta: {
      timestamp: Date.now(),
      count: files.length,
    },
  })
);

export const removeLocalFile = createAction(
  'reconstruction/removeLocalFile',
  (fileId: string) => ({
    payload: fileId,
    meta: {
      timestamp: Date.now(),
    },
  })
);

export const clearLocalFiles = createAction('reconstruction/clearLocalFiles');

// ========================================
// SCENE MANAGEMENT
// ========================================
export const setCurrentScene = createAction(
  'reconstruction/setCurrentScene',
  (scene: Scene | null) => ({
    payload: scene,
    meta: {
      timestamp: Date.now(),
      sceneId: scene?.id || null,
    },
  })
);

// ========================================
// WORKFLOW ACTIONS (Full pipeline)
// ========================================
export const startFullWorkflowRequest = createAction(
  'reconstruction/startFullWorkflowRequest',
  (data: CreateSceneData, files: File[]) => ({
    payload: { data, files },
    meta: {
      requestId: `workflow-${Date.now()}`,
      timestamp: Date.now(),
      sceneName: data.name,
      fileCount: files.length,
    },
  })
);

export const workflowStepCompleted = createAction(
  'reconstruction/workflowStepCompleted',
  (step: string, data: any) => ({
    payload: { step, data },
    meta: {
      timestamp: Date.now(),
      step,
    },
  })
);

export const workflowCompleted = createAction(
  'reconstruction/workflowCompleted',
  (scene: Scene) => ({
    payload: scene,
    meta: {
      timestamp: Date.now(),
      sceneId: scene.id,
    },
  })
);

export const workflowFailure = createAction(
  'reconstruction/workflowFailure',
  (error: string, step: string) => ({
    payload: error,
    meta: {
      timestamp: Date.now(),
      failedStep: step,
    },
  })
);

export const cancelWorkflow = createAction('reconstruction/cancelWorkflow');

// ========================================
// UTILITY ACTIONS
// ========================================
export const clearError = createAction('reconstruction/clearError');

export const resetReconstruction = createAction('reconstruction/resetReconstruction');
