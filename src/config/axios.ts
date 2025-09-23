import axios from "axios";

const BASE_URL = "http://localhost:8090/";

export default axios.create({
  baseURL: "http://localhost:8090/",
});

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:8090/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const defaultAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
