import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { useReconstruction } from "../hooks";
import { formatFileSize } from "../utils";

export const Reconstruction = () => {
  const navigate = useNavigate();
  const {
    scenes,
    currentScene,
    isCreatingScene,
    isUploadingImages,
    isRunningReconstruction,
    reconstructionProgress,
    error,
    startFullWorkflow,
    clearLocalFiles,
    selectScene,
    clearError,
  } = useReconstruction();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sceneName, setSceneName] = useState("");
  const [sceneDescription, setSceneDescription] = useState("");
  const [step, setStep] = useState<"select" | "processing" | "complete">(
    "select"
  );

  const isLoading =
    isCreatingScene || isUploadingImages || isRunningReconstruction;

  // ✅ React to currentScene changes
  useEffect(() => {
    if (currentScene) {
      if (
        currentScene.status === "completed" ||
        currentScene.status === "reconstruction_completed"
      ) {
        setStep("complete");
      } else if (currentScene.status === "failed") {
        setStep("select");
      }
    }
  }, [currentScene]);

  // ✅ React to error changes
  useEffect(() => {
    if (error) {
      setStep("select");
    }
  }, [error]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleStartReconstruction = () => {
    if (selectedFiles.length === 0 || !sceneName) {
      return;
    }

    // ✅ Dispatch full workflow - Saga handles everything
    setStep("processing");
    startFullWorkflow(
      {
        name: sceneName,
        description: sceneDescription,
      },
      selectedFiles
    );
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setSceneName("");
    setSceneDescription("");
    setStep("select");
    clearLocalFiles();
    selectScene(null);
    clearError();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "processing":
        return "text-blue-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const handleViewModel = () => {
    if (!currentScene) return;

    // Build PLY model URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const modelUrl = `${apiBaseUrl}/v1/ply/${currentScene.id}`;

    // Navigate to Home with model URL and scene name
    navigate("/", {
      state: {
        modelUrl,
        sceneName: currentScene.name,
      },
    });
  };

  const handleViewRecentScene = (scene: any) => {
    // Only allow viewing completed scenes
    if (scene.status !== "completed" && scene.status !== "reconstruction_completed") {
      return;
    }

    // Debug log
    console.log("🔍 [View Scene] Scene data:", {
      id: scene.id,
      name: scene.name,
      status: scene.status,
      plyFilePath: scene.plyFilePath,
      hasModel: scene.hasModel
    });

    // Build PLY model URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const modelUrl = `${apiBaseUrl}/v1/ply/${scene.id}`;

    console.log("📊 [View Scene] Model URL:", modelUrl);

    // Navigate to Home with model URL and scene name
    navigate("/", {
      state: {
        modelUrl,
        sceneName: scene.name,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent mb-6">
            3D Reconstruction
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400">{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-sm text-red-300 hover:text-red-100"
              >
                Dismiss
              </button>
            </div>
          )}

          {step === "select" && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Scene Information
                </h2>
                <input
                  type="text"
                  placeholder="Enter scene name"
                  value={sceneName}
                  onChange={(e) => setSceneName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Upload Images
                </h2>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-12 h-12 text-gray-500 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-blue-400 font-medium">
                      Click to upload images
                    </span>
                    <span className="text-gray-500 text-sm mt-1">
                      or drag and drop
                    </span>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-white font-medium mb-2">
                      Selected Files ({selectedFiles.length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                        >
                          <span className="text-gray-300 text-sm truncate">
                            {file.name}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Description (Optional)
                </h2>
                <textarea
                  placeholder="Enter scene description"
                  value={sceneDescription}
                  onChange={(e) => setSceneDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                onClick={handleStartReconstruction}
                disabled={selectedFiles.length === 0 || !sceneName || isLoading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? "Starting..." : "Start Reconstruction"}
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
              <div className="text-center mb-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Processing Reconstruction
                </h2>
                <p className="text-gray-400">
                  This may take several minutes...
                </p>
              </div>

              {currentScene && (
                <div className="space-y-6">
                  {/* Scene Info */}
                  <div className="p-4 bg-gray-800/30 rounded-lg">
                    <p className="text-sm text-gray-400">Scene</p>
                    <p className="text-white font-medium">
                      {currentScene.name}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {reconstructionProgress?.message || "Processing..."}
                      </span>
                      <span className="text-sm font-semibold text-blue-400">
                        {reconstructionProgress?.progress || 0}%
                      </span>
                    </div>
                    
                    {/* Progress Bar Track */}
                    <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>
                      
                      {/* Progress Fill */}
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${reconstructionProgress?.progress || 0}%` }}
                      >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>

                    {/* Current Step */}
                    <p className="text-xs text-gray-500 text-center">
                      {reconstructionProgress?.currentStep || "Initializing..."}
                    </p>
                  </div>

                  {/* Status Details */}
                  <div className="p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-400">Status</p>
                      <p
                        className={`text-sm font-medium ${getStatusColor(
                          currentScene.status
                        )}`}
                      >
                        {currentScene.status?.toUpperCase() || "PENDING"}
                      </p>
                    </div>
                    
                    {/* Sub-status indicators */}
                    <div className="space-y-1 mt-3">
                      {isCreatingScene && (
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                          Creating scene...
                        </div>
                      )}
                      {isUploadingImages && (
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                          Uploading images...
                        </div>
                      )}
                      {isRunningReconstruction && (
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                          Running reconstruction...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Process Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-gray-800/20 rounded-lg">
                      <p className="text-gray-500 mb-1">Estimated Time</p>
                      <p className="text-white font-medium">3-5 minutes</p>
                    </div>
                    <div className="p-3 bg-gray-800/20 rounded-lg">
                      <p className="text-gray-500 mb-1">Check Interval</p>
                      <p className="text-white font-medium">Every 20 seconds</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "complete" && (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Reconstruction Complete!
                </h2>
                <p className="text-gray-400 mb-6">
                  Your 3D model has been successfully created
                </p>

                {currentScene && (
                  <div className="p-4 bg-gray-800/30 rounded-lg mb-6">
                    <p className="text-sm text-gray-400">Scene ID</p>
                    <p className="text-white font-medium">{currentScene.id}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    New Reconstruction
                  </button>
                  <button
                    onClick={handleViewModel}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                  >
                    View Model
                  </button>
                </div>
              </div>
            </div>
          )}

          {scenes.length > 0 && step === "select" && (
            <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
              <h2 className="text-xl font-semibold text-white mb-4">
                Recent Scenes
              </h2>
              <div className="space-y-3">
                {scenes.map((scene) => {
                  const isCompleted = scene.status === "completed" || 
                                     scene.status === "reconstruction_completed";
                  
                  return (
                    <div
                      key={scene.id}
                      onClick={() => isCompleted && handleViewRecentScene(scene)}
                      className={`flex items-center justify-between p-4 bg-gray-800/30 rounded-lg transition-all ${
                        isCompleted 
                          ? "hover:bg-gray-800/50 cursor-pointer hover:border hover:border-blue-500/30" 
                          : "opacity-75"
                      }`}
                      title={isCompleted ? "Click to view model" : "Scene not completed yet"}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{scene.name}</p>
                          {isCompleted && (
                            <svg 
                              className="w-4 h-4 text-blue-400" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                              />
                            </svg>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          Created:{" "}
                          {new Date(scene.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(
                          scene.status
                        )}`}
                      >
                        {scene.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
