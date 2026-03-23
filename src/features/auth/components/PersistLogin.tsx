import { useAuth } from "@/features/auth/hooks/useAuth";
import { checkAuth } from "@/features/auth/api/authApi";
import { useLogout } from "@/features/auth/hooks/useLogout";
import useRefreshToken from "@/features/auth/hooks/useRefreshToken";
import { clearAllAuthStorage } from "@/features/auth/utils/authStorage";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingComponent from "../../../shared/components/reusables/LoadingComponent";
import { Card } from "../../../shared/components/ui/card";
import { Button } from "../../../shared/components/ui/button";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { user, persist, setUser, setPersist, setIsAuth } = useAuth();
  const { logout } = useLogout();
  const hasInitialized = useRef(false);
  const showDevBanner = import.meta.env.VITE_REACT_ENV !== "production";

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const handlePersistLogin = async () => {
      if (!persist) {
        setUser(null);
        setIsAuth(false);
        clearAllAuthStorage();
        setIsLoading(false);
        return;
      }

      try {
        const response = await checkAuth();
        setUser(response.data?.user ?? null);
        setIsAuth(Boolean(response.data?.user));
      } catch {
        const refreshedUser = await refresh();
        if (!refreshedUser) {
          setUser(null);
          setIsAuth(false);
          setPersist(false);
          clearAllAuthStorage();
        }
      }

      setIsLoading(false);
    };

    handlePersistLogin();
  }, [persist, refresh, setIsAuth, setPersist, setUser]);

  // To do: Remove this if the view for manager is created
  if (user && user.role === "manager") {
    return (
      <>
        {showDevBanner && (
          <h1 className="text-red-600 fixed top-0 left-1/2 transform -translate-x-1/2 z-[51] pointer-events-none">
            DEV MODE ENABLED
          </h1>
        )}
        <Card className="p-6 m-6 text-center text-red-600 font-semibold">
          <h1>Managers are not authorized to access this section.</h1>
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </Card>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {showDevBanner && (
          <h1 className="text-red-600 fixed top-0 left-1/2 transform -translate-x-1/2 z-[51] pointer-events-none">
            DEV MODE ENABLED
          </h1>
        )}
        <div className="min-h-screen flex items-center justify-center">
          <LoadingComponent message="Auth checking" />
        </div>
      </>
    );
  }

  return (
    <>
      {showDevBanner && (
        <h1 className="text-red-600 fixed top-0 left-1/2 transform -translate-x-1/2 z-[51] pointer-events-none">
          DEV MODE ENABLED
        </h1>
      )}
      <Outlet />
    </>
  );
}
