import { useState, useEffect } from "react";

/**
 * NavBar Component
 *
 * A modern, responsive navigation bar with smooth animations
 * Features:
 * - Sticky positioning at the top of the viewport
 * - Glassmorphism effect with backdrop blur
 * - Responsive design for different screen sizes
 * - Smooth hover animations
 */
export const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Add padding to body to prevent content hiding behind navbar
    document.body.style.paddingTop = "64px";

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.paddingTop = "0";
    };
  }, [scrolled]);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300 ease-in-out
        ${
          scrolled
            ? "bg-gray-900/95 backdrop-blur-md shadow-2xl border-b border-gray-800/80"
            : "bg-gray-900/90 backdrop-blur-sm border-b border-gray-800/50"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Section */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div
              className="
                relative w-10 h-10 rounded-lg 
                bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700
                shadow-lg shadow-blue-500/30
                group-hover:shadow-blue-500/50 group-hover:scale-105
                transition-all duration-300
                flex items-center justify-center
              "
            >
              {/* 3D Cube Icon */}
              <svg
                className="w-6 h-6 flex-shrink-0 text-white group-hover:rotate-12 transition-transform duration-300"
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

            <div className="flex flex-col">
              <span
                className="
                  text-lg font-bold 
                  bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 
                  bg-clip-text text-transparent
                  group-hover:from-blue-300 group-hover:via-blue-400 group-hover:to-indigo-500
                  transition-all duration-300
                "
              >
                VR Travel Redux
              </span>
              <span
                className="
                  text-xs text-gray-400 
                  group-hover:text-gray-300 
                  transition-colors duration-300
                "
              >
                3D Gaussian Splatting
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {/* Home Button */}
            <button
              className="
                px-4 py-2 rounded-lg
                bg-blue-500/10 text-blue-400
                border border-blue-500/20
                hover:bg-blue-500/20 hover:border-blue-500/30
                hover:shadow-lg hover:shadow-blue-500/20
                active:scale-95
                transition-all duration-200
                flex items-center gap-2
                font-medium text-sm
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </button>

            {/* Info Button */}
            <button
              className="
                p-2 rounded-lg
                bg-gray-800/50 text-gray-400
                border border-gray-700/50
                hover:bg-gray-800 hover:text-white hover:border-gray-600
                hover:shadow-lg
                active:scale-95
                transition-all duration-200
              "
              title="Information"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            {/* Settings Button */}
            <button
              className="
                p-2 rounded-lg
                bg-gray-800/50 text-gray-400
                border border-gray-700/50
                hover:bg-gray-800 hover:text-white hover:border-gray-600
                hover:shadow-lg
                active:scale-95
                transition-all duration-200
              "
              title="Settings"
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
