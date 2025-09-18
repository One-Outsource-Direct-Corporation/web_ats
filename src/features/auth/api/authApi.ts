import api from "@/config/axios";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login/", { email, password });
  console.log(response);
  return response.data;
};
