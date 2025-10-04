import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { LibraryItem } from "../components/LibraryItem";
import { GaussianViewer } from "../components/GaussianViewer";

/**
 * Library Page Component
 *
 * Displays a library of 3D Gaussian Splatting models
 * Features:
 * - Browse sample models
 * - Browse user-uploaded models
 * - View selected model in 3D viewer
 *
 * Layout:
 * - Left sidebar: Model library list
 * - Right main area: 3D model viewer
 */
export const Library = () => {
  const [selectedModelUrl, setSelectedModelUrl] = useState<
    string | undefined
  >();

  const handleModelSelect = (url: string) => {
    setSelectedModelUrl(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black">
      <NavBar />

      <main className="container mx-auto px-4 py-4">
        {/* Page Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Model Library
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Browse and explore your 3D Gaussian Splatting models
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Library List */}
          <div className="lg:w-1/3 overflow-y-auto">
            <LibraryItem onSelectModel={handleModelSelect} />
          </div>

          {/* Right Main Area - Viewer */}
          <div className="lg:w-2/3 h-full">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-800/50 shadow-2xl h-full">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Model Viewer
              </h2>

              <div className="h-[calc(100%-3rem)]">
                {selectedModelUrl ? (
                  <GaussianViewer
                    defaultModelUrl={selectedModelUrl}
                    className="shadow-xl"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-700/50">
                    <div className="text-center space-y-3">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-600"
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
                      <p className="text-gray-400 text-lg font-semibold">
                        No Model Selected
                      </p>
                      <p className="text-gray-500 text-sm">
                        Select a model from the library to view it here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Library;
