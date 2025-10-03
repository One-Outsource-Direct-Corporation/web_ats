import { defaultAxios } from "@/config/axios";
import { useAuth } from "./useAuth";
import { useCallback } from "react";

export const useLogout = () => {
  const { setUser } = useAuth();

  const logout = useCallback(async () => {
    try {
      await defaultAxios.post("/api/auth/logout/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("persist");
      localStorage.removeItem("isAuth");
    }
  }, []);

  return { logout };
};
