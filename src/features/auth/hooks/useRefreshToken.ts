import { defaultAxios } from "@/config/axios";
import { useAuth } from "./useAuth";
import type { User } from "../types/auth.types";
import { useCallback } from "react";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

const useRefreshToken = () => {
  const { setUser } = useAuth();
  const refresh = useCallback(async (): Promise<string | undefined> => {
    // console.log(
    //   "🔄 useRefreshToken.refresh() called from:",
    //   new Error().stack?.split("\n")[2]?.trim()
    // );
    try {
      const response = await defaultAxios.post("/api/auth/token/refresh/");
      setUser((prev: User | null) => {
        const obj = prev
          ? { ...prev, access: response.data?.access }
          : response.data?.user;

        if (!obj.access) {
          obj.access = response.data?.access;
        }
        return obj;
      });
      return response.data?.access;
    } catch (err: AxiosError | any) {
      console.error("Refresh token failed: ", err?.response || err);

      if (
        err.response?.status === 401 &&
        (err.response?.data?.error || err.response?.data?.detail)
      ) {
        toast.error("Session expired. Please log in again.", {
          autoClose: false,
        });
      }
    }
  }, []);

  return refresh;
};

export default useRefreshToken;
