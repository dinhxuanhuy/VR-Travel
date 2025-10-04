import { listFiles, uploadFile } from "@huggingface/hub";

/**
 * HuggingFaceDatasetManager Class
 * 
 * Manages interactions with Hugging Face datasets
 * Features:
 * - List all files in a dataset
 * - List files in a specific folder
 * - Upload files to the dataset
 */
export class HuggingFaceDatasetManager {
  private repoId: string;
  private accessToken: string;
  
  constructor() {
    this.repoId = "XuanHuy224/GaussianSample";
    this.accessToken = import.meta.env.VITE_HUGGING_FACE_API_KEY;
  }

  /**
   * List all files in the dataset recursively
   * @returns Array of files with path and size
   */
  async listAllFiles(): Promise<{ path: string, size: number }[]> {
    try {
      const files = await listFiles({
        repo: { type: "dataset", name: this.repoId },
        accessToken: this.accessToken,
        recursive: true,
      });

      const fileList = [];
      for await (const file of files) {
        fileList.push(file);
      }
      return fileList;
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }

  /**
   * List files in a specific folder
   * @param folderName - Name of the folder to list files from
   * @returns Array of files with path and size
   */
  async ListFolderFile(folderName: string): Promise<{ path: string, size: number }[]> {
    try {
      const files = await listFiles({
        repo: { type: "dataset", name: this.repoId },
        accessToken: this.accessToken,
        recursive: true,
        path: folderName,
      });
      
      const fileList = [];
      for await (const file of files) {
        fileList.push(file);
      }
      return fileList;
    } catch (error) { 
      console.error(`Error listing files in folder ${folderName}:`, error);
      throw error;
    }
  }

  /**
   * Upload a file to the dataset
   * @param filePath - Path where the file will be stored
   * @param fileContent - File content as Blob
   */
  async uploadFile(filePath: string, fileContent: Blob): Promise<void> {
    try {
      await uploadFile({
        repo: { type: "dataset", name: this.repoId },
        accessToken: this.accessToken,
        file: {
          path: filePath,
          content: fileContent
        }
      });
      console.log(`File ${filePath} uploaded successfully.`);
    } catch (error) {
      console.error(`Error uploading file ${filePath}:`, error);
      throw error;
    }
  }
}
