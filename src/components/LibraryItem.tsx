import { useEffect, useState } from "react";
import { HuggingFaceDatasetManager } from "../context/HuggingFaceDatasetManager";
import { useAuth } from "../hooks";

/**
 * Props for LibraryItem component
 */
export interface LibraryItemProps {
  onSelectModel: (url: string) => void;
}

/**
 * File interface for model files
 */
interface File {
  name: string;
  url: string;
}

/**
 * LibraryItem Component
 *
 * Displays a list of available 3D models from Hugging Face dataset
 * Features:
 * - Sample library (default Gaussian models)
 * - User library (user-uploaded models)
 * - File selection with highlighting
 * - Refresh functionality
 * - Loading states
 */
export const LibraryItem = ({ onSelectModel }: LibraryItemProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [userFiles, setUserFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserFiles, setIsLoadingUserFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Get authenticated user
  const { user, isAuthenticated } = useAuth();

  // Initialize Hugging Face manager
  const manager = new HuggingFaceDatasetManager();

  /**
   * Fetch files from a specific folder
   */
  const fetchFiles = async (folderName: string = "Gaussian") => {
    try {
      setIsLoading(true);
      setError(null);

      const BASE_URL =
        "https://huggingface.co/datasets/XuanHuy224/GaussianSample/resolve/main";

      const constructFileUrl = (filename: string) => `${BASE_URL}/${filename}`;

      const processSplatFiles = (files: Array<{ path: string }>) =>
        files
          .filter(
            (file) =>
              file.path.toLowerCase().endsWith(".splat") ||
              file.path.toLowerCase().endsWith(".ply")
          )
          .map((file) => ({
            name: file.path,
            url: constructFileUrl(file.path),
          }));

      // Fetch sample filesquit_game()
      const fileList = await manager.ListFolderFile(folderName);
      const splatFiles = processSplatFiles(fileList);

      setFiles(splatFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to fetch files. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch user-specific files based on username
   */
  const fetchUserFiles = async (username: string) => {
    try {
      setIsLoadingUserFiles(true);
      setUserError(null);

      const BASE_URL =
        "https://huggingface.co/datasets/XuanHuy224/GaussianSample/resolve/main";

      const constructFileUrl = (filename: string) => `${BASE_URL}/${filename}`;

      const processSplatFiles = (files: Array<{ path: string }>) =>
        files
          .filter(
            (file) =>
              file.path.toLowerCase().endsWith(".splat") ||
              file.path.toLowerCase().endsWith(".ply")
          )
          .map((file) => ({
            name: file.path,
            url: constructFileUrl(file.path),
          }));

      // Fetch user-specific files from their folder
      const userFileList = await manager.ListFolderFile(username);
      const userSplatFiles = processSplatFiles(userFileList);

      setUserFiles(userSplatFiles);
    } catch (error) {
      console.error(`Error fetching files for user ${username}:`, error);
      // If folder doesn't exist or no files found, just keep userFiles empty
      setUserFiles([]);
      setUserError(null); // Don't show error, just show "No user files uploaded yet"
    } finally {
      setIsLoadingUserFiles(false);
    }
  };

  /**
   * Load sample files on component mount
   */
  useEffect(() => {
    fetchFiles();
  }, []);

  /**
   * Load user files when user is authenticated
   */
  useEffect(() => {
    if (isAuthenticated && user?.username) {
      fetchUserFiles(user.username);
    } else {
      // Clear user files if not authenticated
      setUserFiles([]);
    }
  }, [isAuthenticated, user?.username]);

  /**
   * Handle file selection
   */
  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    onSelectModel(file.url);
  };

  /**
   * File icon SVG component
   */
  const FileIcon = () => (
    <svg
      className="w-5 h-5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
      <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  );

  /**
   * Loading spinner component
   */
  const LoadingSpinner = () => (
    <div className="flex items-center space-x-2 text-gray-400">
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
      <span>Loading files...</span>
    </div>
  );

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 space-y-6 shadow-2xl border border-gray-800/50">
      {/* Sample Library Section */}
      <div className="bg-gray-800/50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-800/70">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Sample Library
          </h2>
          <button
            onClick={() => fetchFiles("Gaussian")}
            disabled={isLoading}
            className={`
              p-2 rounded-lg transition-all duration-200 
              ${
                isLoading
                  ? "opacity-50 cursor-not-allowed text-gray-500"
                  : "text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
              }
            `}
            title="Refresh"
          >
            <svg
              className={`w-4 h-4 flex-shrink-0 ${
                isLoading ? "animate-spin" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-red-400 text-sm">{error}</div>
          ) : files.length === 0 ? (
            <div className="text-gray-400 text-sm italic">
              No samples available
            </div>
          ) : (
            files.map((file, index) => (
              <div
                key={index}
                onClick={() => handleFileClick(file)}
                className={`
                  cursor-pointer px-3 py-2 rounded-lg transition-all duration-200
                  flex items-center gap-3 group
                  ${
                    selectedFile?.name === file.name
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-blue-400 hover:bg-gray-700/50 hover:text-blue-300"
                  }
                `}
              >
                <FileIcon />
                <span className="truncate text-sm">
                  {file.name.split("/").pop()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Library Section */}
      <div className="bg-gray-800/50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-800/70">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            User Library
            {isAuthenticated && user?.username && (
              <span className="text-xs text-purple-400/70 font-normal">
                ({user.username})
              </span>
            )}
          </h2>
          {isAuthenticated && user?.username && (
            <button
              onClick={() => fetchUserFiles(user.username)}
              disabled={isLoadingUserFiles}
              className={`
                p-2 rounded-lg transition-all duration-200 
                ${
                  isLoadingUserFiles
                    ? "opacity-50 cursor-not-allowed text-gray-500"
                    : "text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                }
              `}
              title="Refresh user files"
            >
              <svg
                className={`w-4 h-4 flex-shrink-0 ${
                  isLoadingUserFiles ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {!isAuthenticated ? (
            <div className="text-gray-400 text-sm italic">
              Please login to view your files
            </div>
          ) : isLoadingUserFiles ? (
            <LoadingSpinner />
          ) : userError ? (
            <div className="text-red-400 text-sm">{userError}</div>
          ) : userFiles.length === 0 ? (
            <div className="text-gray-400 text-sm italic">
              No user files uploaded yet
            </div>
          ) : (
            userFiles.map((file, index) => (
              <div
                key={index}
                onClick={() => handleFileClick(file)}
                className={`
                  cursor-pointer px-3 py-2 rounded-lg transition-all duration-200
                  flex items-center gap-3 group
                  ${
                    selectedFile?.name === file.name
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "text-purple-400 hover:bg-gray-700/50 hover:text-purple-300"
                  }
                `}
              >
                <FileIcon />
                <span className="truncate text-sm">
                  {file.name.split("/").pop()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryItem;
