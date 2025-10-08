import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App.tsx";

/**
 * Application Entry Point
 *
 * Renders the main App component into the DOM
 * with React's StrictMode for development checks,
 * BrowserRouter for routing, and AuthProvider for authentication
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
