import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import useRefreshToken from "@/features/auth/hooks/useRefreshToken";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingComponent from "../../../shared/components/reusables/LoadingComponent";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { user, persist, isAuth } = useAuth();
  const { logout } = useLogout();
  const hasInitialized = useRef(false);

  if (import.meta.env.VITE_REACT_ENV !== "production") {
    return (
      <>
        <h1 className="text-red-600 fixed top-0 left-1/2 transform -translate-x-1/2 z-[51] pointer-events-none">
          DEV MODE ENABLED
        </h1>{" "}
        <Outlet />
      </>
    );
  }

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const handlePersistLogin = async () => {
      if (!persist && !user) {
        try {
          await logout();
        } catch (err) {
          console.log("Logout failed or no tokens to clear");
        }
        setIsLoading(false);
        return;
      }

      if (persist && isAuth && !user?.access) {
        try {
          await refresh();
        } catch (err) {
          console.error("Token refresh failed:", err);
        }
      }

      setIsLoading(false);
    };

    handlePersistLogin();
  }, []);

  // To do: Remove this if the view for manager is created
  if (user && user.role === "manager") {
    return (
      <Card className="p-6 m-6 text-center text-red-600 font-semibold">
        <h1>Managers are not authorized to access this section.</h1>
        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingComponent message="Auth checking" />
      </div>
    );
  }

  return <Outlet />;
}
