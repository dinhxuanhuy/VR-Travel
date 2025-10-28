/**
 * Image Service
 * Handles image upload and management API calls aligned with VRTravel API v1
 */

import { api } from './api.service';

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    imageFilenames: string[];
  };
}

export const imageService = {
  /**
   * Upload a single image to a scene
   * POST /image/upload
   */
  uploadSingleImage: async (sceneId: string, file: File) => {
    const formData = new FormData();
    formData.append('sceneId', sceneId);
    formData.append('file', file);

    return api.post<ImageUploadResponse>('/image/upload', formData);
  },

  /**
   * Upload multiple images to a scene
   * POST /image/upload-multiple
   */
  uploadMultipleImages: async (sceneId: string, files: File[]) => {
    const formData = new FormData();
    formData.append('sceneId', sceneId);
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    return api.post<ImageUploadResponse>('/image/upload-multiple', formData);
  },

  /**
   * Delete an image from a scene
   * DELETE /image/delete
   */
  deleteImage: async (sceneId: string, filename: string) => {
    return api.delete<ImageUploadResponse>('/image/delete', {
      sceneId,
      filename
    });
  }
};
