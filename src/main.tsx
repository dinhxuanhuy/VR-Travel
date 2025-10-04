import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * Application Entry Point
 *
 * Renders the main App component into the DOM
 * with React's StrictMode for development checks
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
