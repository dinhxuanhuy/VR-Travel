import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { Reconstruction } from "./pages/Reconstruction";
import "./App.css";

/**
 * App Component
 *
 * Main application component for VR Travel Redux
 * Handles routing between different pages
 *
 * Routes:
 * - /: Home page with default viewer
 * - /library: Browse and view model library
 * - /reconstruction: Upload images for 3D reconstruction
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/reconstruction" element={<Reconstruction />} />
    </Routes>
  );
}

export default App;
