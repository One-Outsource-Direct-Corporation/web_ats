import { defaultAxios } from "@/config/axios";
import { useAuth } from "./useAuth";
import type { User } from "../types/auth.types";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { clearAllAuthStorage } from "../utils/authStorage";

const useRefreshToken = () => {
  const { setUser, setIsAuth, setPersist } = useAuth();
  const refresh = useCallback(async (): Promise<User | undefined> => {
    // console.log(
    //   "🔄 useRefreshToken.refresh() called from:",
    //   new Error().stack?.split("\n")[2]?.trim()
    // );
    try {
      const response = await defaultAxios.post("/api/auth/token/refresh/");
      setUser(response.data?.user ?? null);
      setIsAuth(true);
      return response.data?.user;
    } catch (err: unknown) {
      const axiosLikeError = err as {
        response?: {
          status?: number;
          data?: { error?: string; detail?: string };
        };
      };

      console.error("Refresh token failed: ", axiosLikeError?.response || err);

      setUser(null);
      setIsAuth(false);
      setPersist(false);
      clearAllAuthStorage();

      if (
        axiosLikeError.response?.status === 401 &&
        (axiosLikeError.response?.data?.error ||
          axiosLikeError.response?.data?.detail)
      ) {
        toast.error("Session expired. Please log in again.", {
          autoClose: false,
        });
      }
      return undefined;
    }
  }, [setIsAuth, setPersist, setUser]);

  return refresh;
};

export default useRefreshToken;
