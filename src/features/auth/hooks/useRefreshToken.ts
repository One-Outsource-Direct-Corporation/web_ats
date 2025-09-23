import axios from "@/config/axios";

const useRefreshToken = () => {
  const refresh = async (): Promise<string | undefined> => {
    const response = await axios.post("/api/auth/token/refresh/", {
      withCredentials: true,
    });
    return response.data?.access;
  };

  return refresh;
};

export default useRefreshToken;
