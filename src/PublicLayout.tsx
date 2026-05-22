import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import PageLoader from "./components/PageLoader";

export default function PublicRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  // Ha be van jelentkezve → irány a főoldal
  if (user) return <Navigate to="/" replace />;

  // Egyébként mehet a login/register oldal
  return <Outlet />;
}
