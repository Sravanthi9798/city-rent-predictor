import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import RentPrediction from "./pages/RentPrediction";
import MarketComparisonDashboard from "./pages/MarketComparisonDashboard";
import Register from "./pages/Register";
import LoginPage from "./pages/Login";
import RentHeatmap from "./pages/RentHeatMap";

//Simple auth check
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

//Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

// Public Route (Login/Register protection)
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? (
    <Navigate to="/rentPredictor" replace />
  ) : (
    children
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/rentPredictor"
          element={
            <ProtectedRoute>
              <RentPrediction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketcomparison"
          element={
            <ProtectedRoute>
              <MarketComparisonDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rent-heatmap"
          element={
            <ProtectedRoute>
              <RentHeatmap />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
