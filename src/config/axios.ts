import axios from "axios";
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

// Attach X-Tenant-Slug header to all requests
function attachTenantHeader(instance: typeof axios) {
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

export { defaultAxios, axiosPrivate };
export default defaultAxios;
