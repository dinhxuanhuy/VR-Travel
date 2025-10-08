import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Library } from "./pages/Library";
import { Reconstruction } from "./pages/Reconstruction";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./App.css";

/**
 * App Component
 *
 * Main application component for VR Travel Redux
 * Handles routing between different pages
 *
 * Routes:
 * - /: Home page with default viewer (protected)
 * - /library: Browse and view model library (protected)
 * - /reconstruction: Upload images for 3D reconstruction (protected)
 * - /login: Login and registration page
 */
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reconstruction"
        element={
          <ProtectedRoute>
            <Reconstruction />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
