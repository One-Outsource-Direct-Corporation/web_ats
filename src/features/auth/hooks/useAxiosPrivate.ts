import { useEffect } from "react";
import { axiosPrivate } from "@/config/axios";
import useRefreshToken from "./useRefreshToken";
import { useLogout } from "./useLogout";
import type { AxiosRequestConfig } from "axios";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { logout } = useLogout();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error: unknown) => {
        const axiosLikeError = error as {
          response?: { status?: number };
          config?: AxiosRequestConfig & { sent?: boolean };
        };
        const prevRequest = axiosLikeError?.config;

        if (
          axiosLikeError?.response?.status === 401 &&
          prevRequest &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;

          try {
            const refreshedUser = await refresh();
            if (refreshedUser) {
              return axiosPrivate(prevRequest);
            } else {
              await logout();
              return Promise.reject(error);
            }
          } catch (err: unknown) {
            const retryError = err as { response?: { status?: number } };
            if (retryError?.response?.status === 401) {
              await logout();
            }
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, logout]);

  return axiosPrivate;
};

export default useAxiosPrivate;
