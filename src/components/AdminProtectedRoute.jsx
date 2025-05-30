// src/components/AdminProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, userRole, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== "Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}