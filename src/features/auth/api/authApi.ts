import { defaultAxios } from "@/config/axios";
import type { AuthResponse, RegisterCredentials } from "../types/auth.types";

export const login = async (email: string, password: string) => {
  return defaultAxios.post<AuthResponse>("/api/auth/login/", {
    email,
    password,
  });
};

export const registerCandidate = async (data: RegisterCredentials) => {
  return defaultAxios.post<AuthResponse>("/api/auth/candidate/register/", data);
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
