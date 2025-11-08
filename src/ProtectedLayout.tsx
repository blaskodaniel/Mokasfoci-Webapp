import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "./components/PageLoader";
import { useProtectedAuth } from "./hooks/useProtectedAuth";

// Layout for protected routes
export const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, shouldShowLoading } = useProtectedAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (shouldShowLoading) {
    return <PageLoader message="Oldal betöltése...." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
