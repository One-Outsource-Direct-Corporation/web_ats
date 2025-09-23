import { useEffect, useReducer, createContext, useRef } from "react";
import type { ReactNode } from "react";
import type {
  AuthContextType,
  LoginCredentials,
  AuthState,
  AuthResponse,
} from "../types/auth.types";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "@/config/axios";
import useRefreshToken from "../hooks/useRefreshToken";

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>({
  user: null,
  isAuthenticated: false,
  isAuthChecking: true,
  isLoading: false,
  login: async (): Promise<AxiosResponse<AuthResponse>> => {
    throw new Error("AuthProvider not found");
  },
  logout: async (): Promise<void> => {
    throw new Error("AuthProvider not found");
  },
});

function authReducer(
  state: AuthState,
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        isAuthChecking: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthChecking: false,
      };
    case "AUTH_CHECK_END":
      return {
        ...state,
        isAuthChecking: false,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isAuthChecking: false,
      };
    default:
      return state;
  }
}

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthChecking: true,
    isAuthenticated: false,
    isLoading: false,
  });
  const refresh = useRefreshToken();

  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     try {
  //       const response = await checkAuth();

  //       if (response.status === 200 && response.data.user) {
  //         dispatch({
  //           type: "LOGIN_SUCCESS",
  //           payload: { user: response.data.user },
  //         });
  //       }
  //     } catch (error: AxiosError | any) {
  //       console.error("Auth initialization error:", error);

  //       // Refactor this later
  //       if (error.status === 401) {
  //         try {
  //           const refreshResponse = await refreshToken();
  //           if (refreshResponse.status === 200) {
  //             initializeAuth();
  //             return;
  //           }
  //         } catch (error: AxiosError | any) {
  //           console.error("Token refresh failed:", error);
  //         }
  //       }
  //     } finally {
  //       dispatch({ type: "LOGIN_FAILURE" });
  //       dispatch({ type: "AUTH_CHECK_END" });
  //     }
  //   };

  //   initializeAuth();
  // }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "LOGIN_START" });
      // const response = await login(credentials.email, credentials.password);
      const response = await axios.post<AuthResponse>(
        "/api/auth/login/",
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const obj = { ...response.data.user };
        obj["access"] = response.data.access;

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: obj },
        });
      }

      return response;
    } catch (error: any) {
      throw error;
    }
  };

  // Logout function
  const handleLogout = async () => {
    console.log("YEET");
    try {
      const response = await axios.post("/api/auth/logout/", {
        withCredentials: true,
      });

      if (response.status === 200) {
        dispatch({ type: "LOGOUT_SUCCESS" });
      }
    } catch (error: AxiosError | any) {
      if (
        error?.response?.status === 401 &&
        error?.response?.data?.detail ===
          "Authentication credentials were not provided."
      ) {
        try {
          const newAccessToken = await refresh();
          if (newAccessToken) {
            dispatch({ type: "LOGOUT_SUCCESS" });
            return;
          }
        } catch (err: AxiosError | any) {
          if (
            err?.response?.status === 401 &&
            err?.response?.data?.error === "No refresh token provided"
          ) {
            dispatch({ type: "LOGOUT_SUCCESS" });
            return;
          }

          throw err;
        }
      }
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Export the context for advanced usage
export { AuthContext };
