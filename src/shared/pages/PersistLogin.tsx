import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import useRefreshToken from "@/features/auth/hooks/useRefreshToken";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { user, persist } = useAuth();
  const { logout } = useLogout();
  const hasInitialized = useRef(false);

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

      if (persist && !user?.access) {
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

  useEffect(() => {
    console.log("isLoading:", isLoading);
    console.log("user:", user);
    console.log("persist:", persist);
  }, [isLoading, user, persist]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <Outlet />;
}
