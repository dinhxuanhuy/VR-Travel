/**
 * Scene Service
 * Handles scene management API calls aligned with VRTravel API v1
 */

import { api } from './api.service';
import type { Scene, CreateSceneData } from '../types/reconstruction.types';

export interface UpdateSceneModelData {
  modelFilePath: string;
}

export const sceneService = {
  /**
   * Create a new scene
   * POST /scenes
   */
  createScene: async (data: CreateSceneData) => {
    return api.post<{ message: string; id: string }>('/scenes', data);
  },

  /**
   * Get scene by ID
   * GET /scenes/detail/:id
   */
  getSceneById: async (sceneId: string) => {
    return api.get<Scene>(`/scenes/detail/${sceneId}`);
  },

  /**
   * Get all scenes for current user
   * GET /scenes/user
   */
  getUserScenes: async () => {
    return api.get<Scene[]>('/scenes/user');
  },

  /**
   * Update scene's 3D model path
   * PUT /scenes/:sceneId/model
   */
  updateSceneModel: async (sceneId: string, data: UpdateSceneModelData) => {
    return api.put<{ message: string; scene: Scene }>(
      `/scenes/${sceneId}/model`,
      data
    );
  }
};
