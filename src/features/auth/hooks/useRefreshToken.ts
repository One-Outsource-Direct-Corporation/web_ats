import { defaultAxios } from "@/config/axios";
import type { AxiosError } from "axios";

// Refresh token function
export const useRefreshToken = async () => {
  try {
    const response = await defaultAxios.post("/api/auth/token/refresh/");
    return response.data?.access;
  } catch (error: AxiosError | any) {
    throw error;
  }
};
