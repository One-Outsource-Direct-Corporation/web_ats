import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import {
  canAccessRoute,
  getDefaultLandingPage,
} from "../utils/rolePermissions";

export default function ProtectedRoutes({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAuth();
  const location = useLocation();

  if (import.meta.env.VITE_REACT_ENV !== "production") {
    return <>{children}</>;
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // Check if user has access to the current route
  if (!canAccessRoute(location.pathname, user?.role)) {
    const defaultPage = getDefaultLandingPage(user?.role);
    return <Navigate to={defaultPage} replace />;
  }

  return <>{children}</>;
}
