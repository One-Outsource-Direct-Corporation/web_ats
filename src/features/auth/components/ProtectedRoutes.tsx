import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";

export default function ProtectedRoutes({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated, isAuthChecking } = useAuth();

  if (isAuthChecking)
    return <LoadingComponent message="Checking authentication..." />;

  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}
