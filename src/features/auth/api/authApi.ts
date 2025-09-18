import api from "@/config/axios";
import type { AuthResponse, LoginCredentials } from "../types/auth.types";

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

// Alternative login function that accepts credentials object
export const loginWithCredentials = async (credentials: LoginCredentials) => {
  return login(credentials.email, credentials.password);
};

// Logout function
export const logout = async () => {
  try {
    await api.post("/api/logout/");
  } catch (error) {
    // Even if logout fails on server, we clear local state
    console.warn("Server logout failed:", error);
  }
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const response = await api.post("/api/auth/token/refresh/");
    return response;
  } catch (error: any) {
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
