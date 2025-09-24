import { useEffect } from "react";
import { axiosPrivate } from "@/config/axios";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "./useAuth";
import type { AxiosError } from "axios";
import { useLogout } from "./useLogout";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { user } = useAuth();
  const { logout } = useLogout();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user?.access}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: AxiosError | any) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            const newAccessToken = await refresh();
            if (newAccessToken) {
              prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevRequest);
            } else {
              await logout();
              return Promise.reject(error);
            }
          } catch (err: AxiosError | any) {
            if (err?.response?.status === 401) {
              await logout();
            }

            return Promise.reject(err);
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
