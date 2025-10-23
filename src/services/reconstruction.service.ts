/**
 * Reconstruction Service
 * Handles 3D reconstruction API calls aligned with VRTravel API v1
 */

import { api } from './api.service';
import type { Scene, CreateSceneData, ReconstructionResult } from '../types/reconstruction.types';

export const reconstructionService = {
  /**
   * Create a new scene
   * POST /v1/scenes
   */
  createScene: async (data: CreateSceneData) => {
    return api.post<Scene>('/v1/scenes', data);
  },

  /**
   * Get all scenes for current user
   * GET /v1/scenes
   */
  getScenes: async () => {
    return api.get<Scene[]>('/v1/scenes');
  },

  /**
   * Get scene by ID
   * GET /v1/scenes/:id
   */
  getSceneById: async (sceneId: string) => {
    return api.get<Scene>(`/v1/scenes/${sceneId}`);
  },

  /**
   * Upload multiple images to a scene
   * POST /v1/image/upload-multiple
   */
  uploadImages: async (sceneId: string, files: File[]) => {
    const formData = new FormData();
    formData.append('sceneId', sceneId);
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    return api.post<Scene>('/v1/image/upload-multiple', formData);
  },

  /**
   * Run COLMAP reconstruction (optional step)
   * POST /v1/colmap/run/:sceneId
   */
  runColmap: async (sceneId: string) => {
    return api.post<{ sceneId: string; colmapPath: string; timestamp: string }>(
      `/v1/colmap/run/${sceneId}`,
      {}
    );
  },

  /**
   * Run 3D reconstruction from COLMAP results
   * POST /v1/reconstruction/run/:sceneId
   */
  runReconstruction: async (sceneId: string) => {
    return api.post<ReconstructionResult>(`/v1/reconstruction/run/${sceneId}`, {});
  },

  /**
   * Delete an image from scene
   * DELETE /v1/image (body: { sceneId, filename })
   */
  deleteImage: async (sceneId: string, filename: string) => {
    return api.delete<Scene>('/v1/image', { sceneId, filename });
  }
};
