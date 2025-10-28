/**
 * Model 3D Service
 * Handles 3D model API calls aligned with VRTravel API v1
 */

import { api } from './api.service';

export interface Model3DUploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    url: string;
  };
}

export const model3dService = {
  /**
   * Upload a 3D model file (.gaussian, .ply, etc.)
   * POST /model3d/upload
   */
  uploadModel: async (file: File) => {
    const formData = new FormData();
    formData.append('model', file);

    return api.post<Model3DUploadResponse>('/model3d/upload', formData);
  },

  /**
   * Download a 3D model by filename
   * GET /model3d/download/:filename
   */
  downloadModel: async (filename: string): Promise<Blob> => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/v1/model3d/download/${filename}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to download model');
    }

    return await response.blob();
  },

  /**
   * Get model URL for viewing
   * Returns the full URL to access the model
   */
  getModelUrl: (filename: string): string => {
    return `${import.meta.env.VITE_API_URL}/v1/model3d/download/${filename}`;
  }
};
