import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import useRefreshToken from "@/features/auth/hooks/useRefreshToken";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingComponent from "../components/reusables/LoadingComponent";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { user, persist, isAuth } = useAuth();
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

  if (isLoading) {
    return <LoadingComponent message="Auth checking" />;
  }

  return <Outlet />;
}
