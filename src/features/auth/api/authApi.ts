import api from "@/config/axios";
import type { AuthResponse } from "../types/auth.types";
import type { AxiosError } from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<AuthResponse>("/api/auth/login/", {
      email,
      password,
    });
    return response;
  } catch (error: any) {
    // Re-throw the error so it can be handled by the calling component
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout/");
    return response;
  } catch (error: AxiosError | any) {
    throw error;
  }
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const response = await api.post("/api/auth/token/refresh/");
    return response;
  } catch (error: AxiosError | any) {
    throw error;
  }
};

// Check user authentication
export const checkAuth = async () => {
  try {
    const response = await api.post<AuthResponse>("/api/auth/check-login/");
    return response;
  } catch (error: any) {
    throw error;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError | any) => {
    if (error.response && error.response.status === 401) {
      try {
        await refreshToken();
        return Promise.resolve();
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
