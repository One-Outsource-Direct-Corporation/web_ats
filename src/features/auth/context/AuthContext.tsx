import { useEffect, useReducer, createContext } from "react";
import type { ReactNode } from "react";
import { login, logout } from "../api/authApi";
// import {useRefres}
import type {
  AuthContextType,
  LoginCredentials,
  AuthState,
  AuthResponse,
} from "../types/auth.types";
import type { AxiosError, AxiosResponse } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

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
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const abortController = new AbortController();

    const initializeAuth = async () => {
      try {
        const response = await axiosPrivate.post("/api/auth/check-login/", {
          signal: abortController.signal,
        });

        if (response.status === 200 && response.data.user) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: response.data.user },
          });
        }
      } catch (error: AxiosError | any) {
        console.error("Auth initialization error:", error);
      } finally {
        dispatch({ type: "LOGIN_FAILURE" });
        dispatch({ type: "AUTH_CHECK_END" });
      }
    };

    initializeAuth();

    return () => {
      abortController.abort();
    };
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "LOGIN_START" });
      const response = await login(credentials.email, credentials.password);
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
      console.error("Login error:", error);
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  // Logout function
  const handleLogout = async () => {
    console.log("I got called");
    try {
      await logout();
      dispatch({ type: "LOGOUT_SUCCESS" });
    } catch (error: AxiosError | any) {
      // Ignore logout errors - still logout locally to clear frontend state
      console.error("Logout error:", error);
      if (error?.response?.status === 401) {
        dispatch({ type: "LOGOUT_SUCCESS" });
      }
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
