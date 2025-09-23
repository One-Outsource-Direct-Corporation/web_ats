import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
import api from "@/config/axios";
import { useRefreshToken } from "./useRefreshToken";
import { useAuth } from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken;
  const { user, logout } = useAuth();
  // const navigate = useNavigate();
  // const location = useLocation();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${user?.access}`;
      }
      return config;
    });

    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const errorMessage = error.response.data?.error;
          // const newAccessToken = await refresh();
          // prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          // return api(prevRequest);

          if (errorMessage === "no refresh token provided") {
            // No refresh token: Logout and redirect to login
            logout(); // Clear auth state
            // navigate("/", { state: { from: location } }); // Store current path
            return Promise.reject(error);
          } else {
            // Other 401: Try refresh
            try {
              const newAccessToken = await refresh();
              if (newAccessToken) {
                prevRequest.headers[
                  "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return api(prevRequest);
              }
            } catch (refreshError) {
              // Refresh failed: Logout and redirect
              logout();
              // navigate("/", { state: { from: location } });
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseIntercept);
      api.interceptors.request.eject(requestIntercept);
    };
  }, [user, refresh]);

  return api;
};

export default useAxiosPrivate;
