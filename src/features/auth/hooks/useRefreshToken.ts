import { defaultAxios } from "@/config/axios";
import { useAuth } from "./useAuth";
import type { User } from "../types/auth.types";
import { useCallback } from "react";

const useRefreshToken = () => {
  const { setUser } = useAuth();
  const refresh = useCallback(async (): Promise<string | undefined> => {
    // console.log(
    //   "🔄 useRefreshToken.refresh() called from:",
    //   new Error().stack?.split("\n")[2]?.trim()
    // );
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
  }, []);

  return refresh;
};

export default useRefreshToken;
