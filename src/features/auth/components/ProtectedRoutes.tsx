import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingComponent from "@/shared/components/reusables/LoadingComponent";

export default function ProtectedRoutes({
  children,
}: {
  children: JSX.Element;
}) {
  const { isAuthenticated, isAuthChecking, user } = useAuth();

  console.log("ProtectedRoutes - isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoutes - isAuthChecking:", isAuthChecking);
  console.log("ProtectedRoutes - user:", user);

  if (isAuthChecking) return <LoadingComponent />;

  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}
