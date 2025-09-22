import api from "@/config/axios";
import type { User } from "@/features/auth/types/auth.types";
import type { AxiosError } from "axios";

export const fetchUserByDepartment = async (
  department: string
): Promise<User[]> => {
  try {
    const response = await api.get(`/api/user/list/${department}/`);
    return response.data;
  } catch (error: AxiosError | any) {
    throw error;
  }
};
