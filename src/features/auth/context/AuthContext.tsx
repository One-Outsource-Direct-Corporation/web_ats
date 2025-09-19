import { useEffect, useCallback, useReducer, createContext } from "react";
import type { ReactNode } from "react";
import { login, checkAuth, refreshToken } from "../api/authApi";
import type {
  AuthContextType,
  LoginCredentials,
  AuthState,
  AuthResponse,
} from "../types/auth.types";
import type { AxiosError, AxiosResponse } from "axios";

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>({
  user: null,
  isAuthenticated: false,
  isAuthChecking: true,
  isLoading: false,
  login: async (
    credentials: LoginCredentials
  ): Promise<AxiosResponse<AuthResponse>> => {
    throw new Error("AuthProvider not found");
  },
  //   logout: () => {},
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
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
      };
    case "AUTH_CHECK_END":
      return {
        ...state,
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await checkAuth();

        if (response.status === 200 && response.data.user) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: response.data.user },
          });
        }
      } catch (error: AxiosError | any) {
        console.error("Auth initialization error:", error);

        // Refactor this later
        if (error.status === 401) {
          try {
            const refreshResponse = await refreshToken();
            if (refreshResponse.status === 200) {
              initializeAuth();
              return;
            }
          } catch (error: AxiosError | any) {
            console.error("Token refresh failed:", error);
          }
        }
      } finally {
        dispatch({ type: "LOGIN_FAILURE" });
        dispatch({ type: "AUTH_CHECK_END" });
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "LOGIN_START" });
      const response = await login(credentials.email, credentials.password);

      if (response.status === 200) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: response.data.user },
        });
      }

      return response;
    } catch (error: any) {
      throw error;
    } finally {
      dispatch({ type: "LOGIN_FAILURE" });
    }
  }, []);

  //   // Logout function
  //   const handleLogout = useCallback(() => {
  //     authService.logout();
  //     setAuthState({
  //       user: null,
  //       isAuthenticated: false,
  //       isLoading: false,
  //     });
  //     // Navigation will be handled by the component using this hook
  //   }, []);

  const contextValue: AuthContextType = {
    ...state,
    login: handleLogin,
    // logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Export the context for advanced usage
export { AuthContext };
