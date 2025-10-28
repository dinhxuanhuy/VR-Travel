/**
 * Reconstruction Slice - Migrated to Redux Saga
 * Actions được define riêng trong reconstructionActions.ts
 */

import { createSlice } from '@reduxjs/toolkit';
import type { ReconstructionState, ReconstructionFile } from '../../types';
import * as reconActions from '../actions/reconstructionActions';

// Helper function to get step name from progress
function getStepFromProgress(progress: number): string {
  if (progress <= 5) return 'Starting';
  if (progress <= 30) return 'COLMAP Processing';
  if (progress <= 50) return 'COLMAP Complete';
  if (progress <= 75) return '3D Reconstruction';
  if (progress < 100) return 'Finalizing';
  return 'Complete';
}

const initialState: ReconstructionState = {
  files: [],
  scenes: [],
  currentScene: null,
  isCreatingScene: false,
  isUploadingImages: false,
  isRunningReconstruction: false,
  isFetchingScenes: false,
  uploadProgress: 0,
  reconstructionProgress: null,
  currentWorkflowStep: null,
  error: null,
};

const reconstructionSlice = createSlice({
  name: 'reconstruction',
  initialState,
  reducers: {
    // Chỉ giữ utility reducers
  },
  extraReducers: (builder) => {
    builder
      // ========================================
      // CREATE SCENE
      // ========================================
      .addCase(reconActions.createSceneRequest, (state) => {
        state.isCreatingScene = true;
        state.error = null;
      })
      .addCase(reconActions.createSceneSuccess, (state, action) => {
        state.isCreatingScene = false;
        state.currentScene = action.payload;
        state.scenes.push(action.payload);
        state.error = null;
      })
      .addCase(reconActions.createSceneFailure, (state, action) => {
        state.isCreatingScene = false;
        state.error = action.payload;
      })

      // ========================================
      // FETCH SCENES
      // ========================================
      .addCase(reconActions.fetchScenesRequest, (state) => {
        state.isFetchingScenes = true;
        state.error = null;
      })
      .addCase(reconActions.fetchScenesSuccess, (state, action) => {
        state.isFetchingScenes = false;
        state.scenes = action.payload;
        state.error = null;
      })
      .addCase(reconActions.fetchScenesFailure, (state, action) => {
        state.isFetchingScenes = false;
        state.error = action.payload;
      })

      // ========================================
      // FETCH SCENE BY ID
      // ========================================
      .addCase(reconActions.fetchSceneByIdRequest, (state) => {
        state.error = null;
      })
      .addCase(reconActions.fetchSceneByIdSuccess, (state, action) => {
        state.currentScene = action.payload;
        // Update scene in list if exists
        const index = state.scenes.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.scenes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(reconActions.fetchSceneByIdFailure, (state, action) => {
        state.error = action.payload;
      })

      // ========================================
      // UPLOAD IMAGES
      // ========================================
      .addCase(reconActions.uploadImagesRequest, (state) => {
        state.isUploadingImages = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(reconActions.uploadImagesProgress, (state, action) => {
        state.uploadProgress = action.payload;
      })
      .addCase(reconActions.uploadImagesSuccess, (state, action) => {
        state.isUploadingImages = false;
        state.uploadProgress = 100;
        state.currentScene = action.payload;
        
        // Update scene in list
        const index = state.scenes.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.scenes[index] = action.payload;
        }
        
        // Clear local files after successful upload
        state.files = [];
        state.error = null;
      })
      .addCase(reconActions.uploadImagesFailure, (state, action) => {
        state.isUploadingImages = false;
        state.uploadProgress = 0;
        state.error = action.payload;
      })

      // ========================================
      // RUN RECONSTRUCTION
      // ========================================
      .addCase(reconActions.runReconstructionRequest, (state) => {
        state.isRunningReconstruction = true;
        state.reconstructionProgress = {
          progress: 0,
          message: 'Starting reconstruction...',
          currentStep: 'Initializing'
        };
        state.error = null;
      })
      .addCase(reconActions.runReconstructionProgress, (state, action) => {
        state.reconstructionProgress = {
          progress: action.payload.progress,
          message: action.payload.status,
          currentStep: getStepFromProgress(action.payload.progress)
        };
      })
      .addCase(reconActions.runReconstructionSuccess, (state, action) => {
        state.isRunningReconstruction = false;
        state.reconstructionProgress = {
          progress: 100,
          message: 'Reconstruction completed!',
          currentStep: 'Complete'
        };
        state.currentScene = action.payload;
        
        // Update scene in list
        const index = state.scenes.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.scenes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(reconActions.runReconstructionFailure, (state, action) => {
        state.isRunningReconstruction = false;
        state.reconstructionProgress = null;
        state.error = action.payload;
      })

      // ========================================
      // LOCAL FILE MANAGEMENT
      // ========================================
      .addCase(reconActions.addLocalFiles, (state, action) => {
        const newFiles: ReconstructionFile[] = action.payload.map((file, index) => ({
          id: `${Date.now()}-${index}`,
          file,
          preview: URL.createObjectURL(file),
        }));
        state.files = [...state.files, ...newFiles];
      })
      .addCase(reconActions.removeLocalFile, (state, action) => {
        state.files = state.files.filter((f) => f.id !== action.payload);
      })
      .addCase(reconActions.clearLocalFiles, (state) => {
        state.files = [];
      })

      // ========================================
      // SCENE MANAGEMENT
      // ========================================
      .addCase(reconActions.setCurrentScene, (state, action) => {
        state.currentScene = action.payload;
      })

      // ========================================
      // WORKFLOW ACTIONS
      // ========================================
      .addCase(reconActions.startFullWorkflowRequest, (state) => {
        state.currentWorkflowStep = 'creating_scene';
        state.error = null;
      })
      .addCase(reconActions.workflowStepCompleted, (state, action) => {
        state.currentWorkflowStep = action.payload.step;
      })
      .addCase(reconActions.workflowCompleted, (state, action) => {
        state.currentWorkflowStep = null;
        state.currentScene = action.payload;
        state.files = [];
        state.uploadProgress = 0;
        state.reconstructionProgress = null;
      })
      .addCase(reconActions.workflowFailure, (state, action) => {
        state.currentWorkflowStep = null;
        state.isCreatingScene = false;
        state.isUploadingImages = false;
        state.isRunningReconstruction = false;
        state.error = action.payload;
      })
      .addCase(reconActions.cancelWorkflow, (state) => {
        state.currentWorkflowStep = null;
        state.isCreatingScene = false;
        state.isUploadingImages = false;
        state.isRunningReconstruction = false;
        state.uploadProgress = 0;
        state.reconstructionProgress = null;
      })

      // ========================================
      // UTILITY ACTIONS
      // ========================================
      .addCase(reconActions.clearError, (state) => {
        state.error = null;
      })
      .addCase(reconActions.resetReconstruction, () => {
        return initialState;
      });
  },
});

export default reconstructionSlice.reducer;
