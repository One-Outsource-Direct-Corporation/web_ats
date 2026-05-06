import { useEffect } from "react";
import { axiosMultipart } from "@/config/axios";
import useRefreshToken from "./useRefreshToken";
import { useLogout } from "./useLogout";
import type { AxiosRequestConfig } from "axios";

const useAxiosMultipart = () => {
  const refresh = useRefreshToken();
  const { logout } = useLogout();

  useEffect(() => {
    const requestIntercept = axiosMultipart.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosMultipart.interceptors.response.use(
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
              return axiosMultipart(prevRequest);
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
      axiosMultipart.interceptors.request.eject(requestIntercept);
      axiosMultipart.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, logout]);

  return axiosMultipart;
};

export default useAxiosMultipart;
