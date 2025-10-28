/**
 * Reconstruction Type Definitions
 * Aligned with VRTravel API v1
 */

export interface ReconstructionFile {
  id: string;
  file: File;
  preview?: string;
}

export interface Scene {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  imageFilenames?: string[];
  modelFile?: string;  // Changed from modelId to modelFile (URL/path)
  colmapOutputPath?: string;  // Path to COLMAP results
  plyFilePath?: string;  // Path to PLY file for GaussianViewer
  imageCount?: number;
  status: 'idle' | 'uploading' | 'uploaded' | 
          'colmap_processing' | 'colmap_completed' | 'colmap_failed' |
          'reconstruction_processing' | 'reconstruction_completed' | 'reconstruction_failed' |
          'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSceneData {
  name: string;
  description?: string;
}

export interface UploadImagesData {
  sceneId: string;
  files: File[];
}

export interface ReconstructionResult {
  sceneId: string;
  modelPath: string;
  timestamp: string;
}

export interface ReconstructionState {
  // Local file management before upload
  files: ReconstructionFile[];
  
  // Scene management
  scenes: Scene[];
  currentScene: Scene | null;
  
  // Loading states
  isCreatingScene: boolean;
  isUploadingImages: boolean;
  isRunningReconstruction: boolean;
  isFetchingScenes: boolean;
  
  // Progress tracking
  uploadProgress: number;
  reconstructionProgress: {
    progress: number;
    message: string;
    currentStep: string;
  } | null;
  
  // Workflow tracking
  currentWorkflowStep: string | null;
  
  // Error handling
  error: string | null;
}
