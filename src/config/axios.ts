import axios, { type AxiosInstance } from "axios";
import { getTenantSlug } from "@/shared/utils/tenant";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const defaultAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosMultipart = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach X-Tenant-Slug header to all requests
function attachTenantHeader(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => {
      const slug = getTenantSlug();
      if (slug) {
        config.headers["X-Tenant-Slug"] = slug;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

attachTenantHeader(defaultAxios);
attachTenantHeader(axiosPrivate);
attachTenantHeader(axiosMultipart);

export { defaultAxios, axiosPrivate, axiosMultipart };
export default defaultAxios;
