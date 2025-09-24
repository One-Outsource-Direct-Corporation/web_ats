import { defaultAxios } from "@/config/axios";
import { useAuth } from "./useAuth";

export const useLogout = () => {
  const { setUser } = useAuth();

  const logout = async () => {
    try {
      await defaultAxios.post("/api/auth/logout/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("persist");
    }
  };

  return { logout };
};
