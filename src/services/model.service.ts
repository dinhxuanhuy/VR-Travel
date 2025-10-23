import { HUGGINGFACE_CONFIG } from '../constants';
import type { ModelFile } from '../types';
import { HuggingFaceDatasetManager } from '../context/HuggingFaceDatasetManager';

const manager = new HuggingFaceDatasetManager();

export const fetchSampleModels = async (): Promise<ModelFile[]> => {
  try {
    const files = await manager.ListFolderFile(HUGGINGFACE_CONFIG.SAMPLE_FOLDER);
    
    return files
      .filter(file => 
        file.path.toLowerCase().endsWith('.splat') || 
        file.path.toLowerCase().endsWith('.ply')
      )
      .map(file => ({
        name: file.path,
        url: `${HUGGINGFACE_CONFIG.BASE_URL}/${file.path}`,
        type: file.path.toLowerCase().endsWith('.splat') ? 'splat' : 'ply',
      }));
  } catch (error) {
    console.error('Error fetching sample models:', error);
    throw new Error('Failed to fetch sample models');
  }
};

export const fetchUserModels = async (username: string): Promise<ModelFile[]> => {
  try {
    const files = await manager.ListFolderFile(username);
    
    return files
      .filter(file => 
        file.path.toLowerCase().endsWith('.splat') || 
        file.path.toLowerCase().endsWith('.ply')
      )
      .map(file => ({
        name: file.path,
        url: `${HUGGINGFACE_CONFIG.BASE_URL}/${file.path}`,
        type: file.path.toLowerCase().endsWith('.splat') ? 'splat' : 'ply',
      }));
  } catch (error) {
    console.error(`Error fetching models for user ${username}:`, error);
    return [];
  }
};

export const uploadModel = async (file: File, username: string): Promise<void> => {
  try {
    await manager.uploadFile(username, file);
  } catch (error) {
    console.error('Error uploading model:', error);
    throw new Error('Failed to upload model');
  }
};
