import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { User } from "@/features/auth/types/auth.types";
import type { AxiosError } from "axios";

export const fetchUserByDepartment = async (
  department: string
): Promise<User[]> => {
  const axiosPrivate = useAxiosPrivate();
  try {
    const response = await axiosPrivate.get(`/api/user/list/${department}/`);
    return response.data;
  } catch (error: AxiosError | any) {
    console.log(error);
    throw error;
  }
};
