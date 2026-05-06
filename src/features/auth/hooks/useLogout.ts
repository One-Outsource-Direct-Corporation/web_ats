import { defaultAxios } from "@/config/axios";
import { useAuth } from "./useAuth";
import { useCallback } from "react";
import { clearAllAuthStorage } from "../utils/authStorage";

export const useLogout = () => {
  const { setUser, setIsAuth } = useAuth();

  const logout = useCallback(async () => {
    try {
      await defaultAxios.post("/api/auth/logout/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsAuth(false);
      clearAllAuthStorage();
    }
  }, [setIsAuth, setUser]);

  return { logout };
};
