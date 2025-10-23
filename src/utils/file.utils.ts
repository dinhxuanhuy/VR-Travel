/**
 * File Utilities
 * Functions for file handling and formatting
 */

/**
 * Format file size to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase();
};

/**
 * Check if file is a valid 3D model format
 */
export const isValidModelFormat = (filename: string): boolean => {
  const extension = getFileExtension(filename);
  return extension === '.splat' || extension === '.ply';
};

/**
 * Check if file is a valid image format
 */
export const isValidImageFormat = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Create object URL for file preview
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke object URL to free memory
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Convert File to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
