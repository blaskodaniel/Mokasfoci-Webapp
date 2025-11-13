import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "./components/PageLoader";
import { useAuth } from "./hooks/useAuth";

// Layout for protected routes
export const ProtectedLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <PageLoader message="Oldal betöltése...." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
