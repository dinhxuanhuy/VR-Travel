import { useState } from "react";
import type { ChangeEvent } from "react";
import { NavBar } from "../components/NavBar";

/**
 * Reconstruction Page Component
 *
 * Allows users to upload files for 3D reconstruction
 * Features:
 * - Upload multiple image files
 * - Display uploaded files with preview
 * - Remove individual files
 * - Clear all files
 * - Submit files for reconstruction (API integration pending)
 *
 * Supported formats: .jpg, .jpeg, .png, .webp
 */
export const Reconstruction = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handle file selection from input
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  /**
   * Handle drag over event
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * Handle file drop
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  /**
   * Remove a specific file
   */
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  /**
   * Clear all files
   */
  const clearAllFiles = () => {
    setFiles([]);
  };

  /**
   * Submit files for reconstruction
   * TODO: Integrate with API
   */
  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please upload at least one file");
      return;
    }

    setIsUploading(true);

    try {
      // TODO: API integration
      console.log("Files to upload:", files);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        `Successfully received ${files.length} file(s) for reconstruction!`
      );
      // clearAllFiles(); // Uncomment to clear after successful upload
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Format file size to human readable string
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      <NavBar />

      <main className="container mx-auto px-4 py-4">
        {/* Page Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            3D Reconstruction
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Upload your images to create 3D Gaussian Splatting models
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Area */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Images
            </h2>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center
                transition-all duration-300 cursor-pointer
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/30"
                }
              `}
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-3">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div>
                    <p className="text-white font-semibold">
                      {isDragging
                        ? "Drop files here"
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Supported: JPG, JPEG, PNG, WEBP
                    </p>
                  </div>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Uploaded Files ({files.length})
                </h2>
                <button
                  onClick={clearAllFiles}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm
                    hover:bg-red-500/30 transition-all duration-200 flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear All
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg
                      hover:bg-gray-800 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <svg
                        className="w-8 h-8 text-blue-400 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 p-2 text-red-400 hover:bg-red-500/20 rounded-lg
                        transition-all duration-200 flex-shrink-0"
                      title="Remove file"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={files.length === 0 || isUploading}
              className={`
                px-8 py-3 rounded-lg font-semibold text-lg
                flex items-center gap-3 shadow-lg
                transition-all duration-300
                ${
                  files.length === 0 || isUploading
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 hover:-translate-y-1 hover:shadow-xl"
                }
              `}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Start Reconstruction
                </>
              )}
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Images</p>
                  <p className="text-white font-semibold">
                    {files.length} files
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Status</p>
                  <p className="text-white font-semibold">Ready</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Output</p>
                  <p className="text-white font-semibold">3D Model</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reconstruction;
