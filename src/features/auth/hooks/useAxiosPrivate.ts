import { useEffect } from "react";
import { axiosPrivate } from "@/config/axios";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "./useAuth";
import type { AxiosError } from "axios";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { user, logout } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${user?.access}`;
      }

      return config;
    });

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: AxiosError | any) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const errorMessage = error?.response?.data?.error;
          if (errorMessage === "No refresh token provided") {
            await logout();
            return Promise.reject(error);
          } else {
            try {
              const newAccessToken = await refresh();

              if (newAccessToken) {
                prevRequest.headers[
                  "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return axiosPrivate(prevRequest);
              }
            } catch (err) {
              console.error("Token refresh failed:", err);
              await logout();
              return Promise.reject(err);
            }
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [user, refresh, logout]);

  return axiosPrivate;
};

export default useAxiosPrivate;
