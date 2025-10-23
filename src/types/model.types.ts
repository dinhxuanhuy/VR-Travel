/**
 * 3D Model Type Definitions
 */

export interface ModelFile {
  name: string;
  url: string;
  type?: 'splat' | 'ply';
  size?: number;
  uploadedAt?: string;
}

export interface ModelState {
  files: ModelFile[];
  userFiles: ModelFile[];
  selectedModel: ModelFile | null;
  loading: boolean;
  error: string | null;
}

export interface ModelUpload {
  file: File;
  username?: string;
}
