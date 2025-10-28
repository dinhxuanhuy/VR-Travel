import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { GaussianViewer } from "../components/GaussianViewer";

/**
 * Home Page Component
 *
 * Main landing page for VR Travel Redux
 * A simplified, modern 3D Gaussian Splatting viewer application
 *
 * Features:
 * - Default model viewer
 * - Auto-load model from reconstruction (via URL state)
 * - Success message when coming from reconstruction
 *
 * Structure:
 * - NavBar: Top navigation with branding and controls
 * - Hero Section: Title and description
 * - GaussianViewer: Main 3D model viewer component
 * - Info Cards: Feature highlights
 */
export const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [modelUrl, setModelUrl] = useState<string>(
    "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k-mini.splat"
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sceneName, setSceneName] = useState<string>("");

  // Check if redirected from reconstruction with model URL
  useEffect(() => {
    const state = location.state as any;
    if (state?.modelUrl) {
      setModelUrl(state.modelUrl);
      setSceneName(state.sceneName || "Your Model");
      setShowSuccessMessage(true);

      // Clear location state
      navigate(location.pathname, { replace: true, state: {} });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-4">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-4 bg-green-500/10 border border-green-500/50 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-green-400 font-semibold">
                  🎉 Reconstruction Complete!
                </h3>
                <p className="text-green-300/80 text-sm mt-1">
                  Your 3D model "<strong>{sceneName}</strong>" has been successfully created
                  and is now displaying below.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-400/70 hover:text-green-400 transition-colors ml-auto"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Hero Section - Compact */}
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            3D Gaussian Splatting Viewer
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {showSuccessMessage
              ? `Viewing: ${sceneName}`
              : "Upload your models or explore the default scene"}
          </p>
        </div>

        {/* 3D Viewer Section - Larger */}
        <div className="w-full">
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-3 border border-gray-800/50 shadow-2xl">
            <GaussianViewer key={modelUrl} defaultModelUrl={modelUrl} className="shadow-xl" />
          </div>
        </div>

        {/* Info Cards - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {/* Card 1: Upload */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 p-2 bg-blue-500/10 rounded-lg w-8 h-8 flex items-center justify-center">
                <svg
                  className="w-4 h-4 flex-shrink-0 text-blue-400"
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
              </div>
              <h3 className="text-sm font-semibold text-white">
                Upload .splat / .ply
              </h3>
            </div>
          </div>

          {/* Card 2: Interact */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 p-2 bg-green-500/10 rounded-lg w-8 h-8 flex items-center justify-center">
                <svg
                  className="w-4 h-4 flex-shrink-0 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Orbit, Zoom, Pan Controls
              </h3>
            </div>
          </div>

          {/* Card 3: Explore */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 p-2 bg-purple-500/10 rounded-lg w-8 h-8 flex items-center justify-center">
                <svg
                  className="w-4 h-4 flex-shrink-0 text-purple-400"
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
              <h3 className="text-sm font-semibold text-white">
                Fullscreen & Auto-rotate
              </h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
