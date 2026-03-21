import { defaultAxios } from "@/config/axios";
import type { AuthResponse } from "../types/auth.types";

export const login = async (email: string, password: string) => {
  return defaultAxios.post<AuthResponse>("/api/auth/login/", {
    email,
    password,
  });
};

// Logout function
export const logout = async () => {
  return defaultAxios.post("/api/auth/logout/");
};

// Check user authentication
export const checkAuth = async (signal?: AbortSignal) => {
  return defaultAxios.get<AuthResponse>("/api/auth/check-login/", {
    signal,
  });
};

// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError | any) => {
//     if (error.response && error.response.status === 401) {
//       try {
//         await refreshToken();
//         return Promise.resolve();
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
