import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import * as SPLAT from "gsplat";
import { HuggingFaceDatasetManager } from "../context/HuggingFaceDatasetManager";
import { useAuth } from "../context/AuthContext";

/**
 * Status types for the viewer
 */
type ViewerStatus = "idle" | "loading" | "success" | "error";

/**
 * Props for GaussianViewer component
 */
interface GaussianViewerProps {
  defaultModelUrl?: string;
  className?: string;
}

/**
 * GaussianViewer Component
 *
 * A 3D Gaussian Splatting viewer component using the gsplat library
 *
 * Features:
 * - Load .splat and .ply file formats
 * - Interactive 3D controls (orbit, zoom, pan)
 * - File upload support
 * - Fullscreen mode
 * - Loading states with visual feedback
 * - Auto-rotation toggle
 *
 * @param defaultModelUrl - Optional URL to load a default model
 * @param className - Optional CSS classes to apply to the container
 */
export const GaussianViewer = ({
  defaultModelUrl = "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k-mini.splat",
  className = "",
}: GaussianViewerProps) => {
  // Refs for 3D scene management
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef(new SPLAT.Scene());
  const cameraRef = useRef(new SPLAT.Camera());
  const rendererRef = useRef<SPLAT.WebGLRenderer | null>(null);
  const controlsRef = useRef<any>(null);

  // Component state
  const [status, setStatus] = useState<ViewerStatus>("idle");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [modelInfo, setModelInfo] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

  // Authentication and HuggingFace manager
  const { user, isAuthenticated } = useAuth();
  const manager = new HuggingFaceDatasetManager();

  /**
   * Initialize the 3D renderer and controls, and start animation loop
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      // Create WebGL renderer
      rendererRef.current = new SPLAT.WebGLRenderer(canvasRef.current);

      // Create orbit controls for camera interaction
      controlsRef.current = new SPLAT.OrbitControls(
        cameraRef.current,
        rendererRef.current.canvas
      );

      // Animation loop
      const animate = () => {
        if (controlsRef.current && rendererRef.current) {
          // Apply auto-rotation if enabled
          if (autoRotate) {
            controlsRef.current.azimuthAngle += 0.005;
          }

          controlsRef.current.update();
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
        requestAnimationFrame(animate);
      };

      const animationFrameId = requestAnimationFrame(animate);

      return () => {
        // Cleanup resources
        cancelAnimationFrame(animationFrameId);
        if (rendererRef.current) {
          rendererRef.current.dispose();
          rendererRef.current = null;
        }
        if (controlsRef.current) {
          controlsRef.current.dispose();
          controlsRef.current = null;
        }
      };
    } catch (error) {
      console.error("Failed to initialize renderer:", error);
      setStatus("error");
    }
  }, [autoRotate]);

  /**
   * Load the default model or custom file
   */
  useEffect(() => {
    const loadModel = async () => {
      setStatus("loading");

      // Clear previous scene
      sceneRef.current.reset();
      if (rendererRef.current) {
        rendererRef.current.gl.clear(
          rendererRef.current.gl.COLOR_BUFFER_BIT |
            rendererRef.current.gl.DEPTH_BUFFER_BIT
        );
      }

      try {
        if (currentFile) {
          // Load from file
          setModelInfo(`Loading ${currentFile.name}...`);

          if (currentFile.name.endsWith(".ply")) {
            await SPLAT.PLYLoader.LoadFromFileAsync(
              currentFile,
              sceneRef.current,
              () => {}
            );
          } else if (currentFile.name.endsWith(".splat")) {
            await SPLAT.Loader.LoadFromFileAsync(
              currentFile,
              sceneRef.current,
              () => {}
            );
          } else {
            throw new Error(
              "Unsupported file format. Please use .splat or .ply files."
            );
          }

          setModelInfo(`Loaded: ${currentFile.name}`);
        } else {
          // Load from URL
          setModelInfo("Loading default model...");
          const fileExtension = defaultModelUrl.split(".").pop()?.toLowerCase();

          if (fileExtension === "ply") {
            await SPLAT.PLYLoader.LoadAsync(
              defaultModelUrl,
              sceneRef.current,
              () => {}
            );
          } else {
            await SPLAT.Loader.LoadAsync(
              defaultModelUrl,
              sceneRef.current,
              () => {}
            );
          }

          setModelInfo(`Model loaded: ${defaultModelUrl.split("/").pop()}`);
        }

        setStatus("success");
      } catch (error) {
        console.error("Error loading model:", error);
        setStatus("error");
        setModelInfo(
          `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    };

    loadModel();
  }, [currentFile, defaultModelUrl]);

  /**
   * Handle file input change
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setCurrentFile(file);
    setSaveMessage(""); // Clear previous save message
  };

  /**
   * Save current file to user's Hugging Face folder
   */
  const handleSaveToLibrary = async () => {
    if (!currentFile || !isAuthenticated || !user?.username) {
      setSaveMessage("Please login and upload a file first");
      return;
    }

    // Only allow PLY and SPLAT files
    if (
      !currentFile.name.endsWith(".ply") &&
      !currentFile.name.endsWith(".splat")
    ) {
      setSaveMessage("Only .ply and .splat files can be saved");
      return;
    }

    setIsSaving(true);
    setSaveMessage("Saving to your library...");

    try {
      // Create file path: username/filename
      const filePath = `${user.username}/${currentFile.name}`;

      console.log(`🔹 Saving file to: ${filePath}`);

      // Upload file to Hugging Face
      await manager.uploadFile(filePath, currentFile);

      setSaveMessage(`✅ Saved to your library!`);
      console.log(`✅ File saved successfully: ${filePath}`);

      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.error("❌ Error saving file:", error);
      setSaveMessage(
        `❌ Save failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // Clear error message after 5 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  /**
   * Listen for fullscreen changes
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`
        relative 
        ${
          isFullscreen
            ? "fixed inset-0 z-50 bg-black"
            : `w-full h-[calc(100vh-180px)] rounded-xl overflow-hidden ${className}`
        }
      `}
    >
      {/* Canvas for 3D rendering */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-gradient-to-b from-gray-900 to-black"
      />

      {/* Loading/Error Overlay */}
      {status !== "success" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
          <div className="bg-gray-800/95 p-6 rounded-xl shadow-2xl border border-gray-700/50 max-w-md text-center">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-4">
                {/* Animated Loading Spinner */}
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-blue-400/20 border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
                </div>

                <div className="space-y-1">
                  <p className="text-white text-xl font-bold">Loading Model</p>
                  <p className="text-blue-400 text-xs">{modelInfo}</p>
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="w-16 h-16 flex-shrink-0 text-gray-400"
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
                <p className="text-white text-xl font-bold">Ready to Load</p>
                <p className="text-gray-400 text-sm">
                  Upload a model or wait for default
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="w-16 h-16 flex-shrink-0 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-white text-xl font-bold">Loading Failed</p>
                <p className="text-red-400 text-xs">{modelInfo}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div
        className={`
          absolute ${isFullscreen ? "bottom-6" : "bottom-4"} 
          left-1/2 transform -translate-x-1/2
          flex items-center gap-2 
          bg-gray-900/95 backdrop-blur-md 
          rounded-lg p-2 
          shadow-2xl border border-gray-800/70
          transition-all duration-300
        `}
      >
        {/* Upload Button */}
        <label
          htmlFor="model-upload"
          className="
            h-10 px-4 rounded-lg cursor-pointer
            bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            text-white font-semibold text-sm
            flex items-center gap-2
            transition-all duration-200
            shadow-lg hover:shadow-blue-500/30
            hover:-translate-y-0.5
            active:scale-95
          "
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Upload
          <input
            type="file"
            id="model-upload"
            accept=".splat,.ply"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Save to Library Button */}
        {status === "success" && currentFile && isAuthenticated && (
          <button
            onClick={handleSaveToLibrary}
            disabled={isSaving}
            className={`
              h-10 px-4 rounded-lg text-sm font-semibold
              flex items-center gap-2
              transition-all duration-200
              active:scale-95
              ${
                isSaving
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30 cursor-not-allowed"
                  : "bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 hover:text-purple-300"
              }
            `}
            title="Save to your library"
          >
            <svg
              className={`w-4 h-4 flex-shrink-0 ${
                isSaving ? "animate-spin" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSaving ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                />
              )}
            </svg>
            {isSaving ? "Saving..." : "Save"}
          </button>
        )}

        {/* Auto-rotate Toggle */}
        {status === "success" && (
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`
              h-10 px-4 rounded-lg text-sm
              flex items-center gap-2
              transition-all duration-200
              active:scale-95
              ${
                autoRotate
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
            title="Auto Rotate"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
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
            {autoRotate ? "On" : "Off"}
          </button>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="
            h-10 w-10 rounded-lg
            bg-gray-800 hover:bg-gray-700
            text-gray-300 hover:text-white
            flex items-center justify-center
            transition-all duration-200
            active:scale-95
          "
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <svg
              className="w-4 h-4 flex-shrink-0"
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
          ) : (
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Model Info Display */}
      {status === "success" && modelInfo && (
        <div
          className="
            absolute top-4 left-4 
            bg-gray-900/90 backdrop-blur-sm 
            px-3 py-1.5 rounded-lg 
            border border-gray-800/50
            text-gray-300 text-xs
          "
        >
          {modelInfo}
        </div>
      )}

      {/* Save Message Display */}
      {saveMessage && (
        <div
          className={`
            absolute top-4 right-4 
            bg-gray-900/90 backdrop-blur-sm 
            px-3 py-1.5 rounded-lg 
            border border-gray-800/50
            text-xs font-medium
            ${
              saveMessage.includes("✅")
                ? "text-green-400 border-green-500/30"
                : saveMessage.includes("❌")
                ? "text-red-400 border-red-500/30"
                : "text-orange-400 border-orange-500/30"
            }
          `}
        >
          {saveMessage}
        </div>
      )}
    </div>
  );
};
