/**
 * Reconstruction Service
 * Handles 3D reconstruction API calls aligned with VRTravel API v1
 */

import { api } from './api.service';
import type { Scene, CreateSceneData, ReconstructionResult } from '../types/reconstruction.types';

export const reconstructionService = {
  /**
   * Create a new scene
   * POST /scenes
   */
  createScene: async (data: CreateSceneData) => {
    return api.post<Scene>('/scenes', data);
  },

  /**
   * Get all scenes for current user
   * GET /scenes/user
   */
  getScenes: async () => {
    return api.get<Scene[]>('/scenes/user');
  },

  /**
   * Get scene by ID with progress information
   * GET /scenes/detail/:id
   * Returns scene data including progress for reconstruction status polling
   */
  getSceneById: async (sceneId: string) => {
    return api.get<{
      id: string;
      name: string;
      description?: string;
      ownerId: string;
      status: 'idle' | 'processing' | 'colmap_processing' | 'colmap_completed' | 
              'reconstruction_processing' | 'reconstruction_completed' | 'completed' | 'failed';
      progress: number; // 0-100
      progressMessage: string;
      currentStep: string;
      imageFilenames: string[];
      imageCount: number;
      colmapId?: string;
      hasColmap: boolean;
      modelFilePath?: string;
      plyFilePath?: string;
      hasModel: boolean;
      createdAt: string;
      updatedAt: string;
    }>(`/scenes/detail/${sceneId}`);
  },

  /**
   * Upload multiple images to a scene
   * POST /image/upload-multiple
   */
  uploadImages: async (sceneId: string, files: File[]) => {
    const formData = new FormData();
    formData.append('sceneId', sceneId);
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    return api.post<Scene>('/image/upload-multiple', formData);
  },

  /**
   * Run COLMAP reconstruction (optional step)
   * POST /colmap/run/:sceneId
   */
  runColmap: async (sceneId: string) => {
    return api.post<{ sceneId: string; colmapPath: string; timestamp: string }>(
      `/colmap/run/${sceneId}`,
      {}
    );
  },

  /**
   * Run 3D reconstruction from COLMAP results
   * POST /reconstruction/run/:sceneId
   */
  runReconstruction: async (sceneId: string) => {
    return api.post<ReconstructionResult>(`/reconstruction/run/${sceneId}`, {});
  },

  /**
   * Delete an image from scene
   * DELETE /image/delete
   */
  deleteImage: async (sceneId: string, filename: string) => {
    return api.delete<Scene>('/image/delete', { sceneId, filename });
  },

  /**
   * Run full pipeline (COLMAP + Reconstruction)
   * POST /pipeline/run/:sceneId
   */
  runFullPipeline: async (sceneId: string) => {
    return api.post<{
      sceneId: string;
      colmapOutput: any;
      modelOutput: any;
      status: string;
      duration: {
        total: string;
        colmap: string;
        reconstruction: string;
      };
      timestamp: string;
    }>(`/pipeline/run/${sceneId}`, {});
  },

  /**
   * Check scene readiness for reconstruction
   * GET /scenes/:sceneId/check
   */
  checkSceneReadiness: async (sceneId: string) => {
    return api.get<{
      sceneId: string;
      name: string;
      hasImages: boolean;
      imageCount: number;
      hasColmap: boolean;
      colmapPath: string | null;
      hasModel: boolean;
      modelId: string | null;
      canRunColmap: boolean;
      canRunReconstruction: boolean;
      status: string;
      nextStep: string;
    }>(`/scenes/${sceneId}/check`);
  }
};
