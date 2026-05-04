import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import {
  canAccessRoute,
  getDefaultLandingPage,
} from "../utils/rolePermissions";

interface ProtectedRoutesProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

export default function ProtectedRoutes({
  children,
  allowedRoles,
}: ProtectedRoutesProps) {
  const { user } = useAuth();
  const location = useLocation();
  const isNonProduction = import.meta.env.VITE_REACT_ENV !== "production";

  if (!user) {
    if (isNonProduction) {
      return <>{children}</>;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultPage = getDefaultLandingPage(user.role);
    return <Navigate to={defaultPage} replace />;
  }

  // Check if user has access to the current route
  if (!canAccessRoute(location.pathname, user?.role)) {
    const defaultPage = getDefaultLandingPage(user?.role);
    return <Navigate to={defaultPage} replace />;
  }

  return <>{children}</>;
}
