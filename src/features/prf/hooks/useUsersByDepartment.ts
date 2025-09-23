import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { User } from "@/features/auth/types/auth.types";
// import { fetchUserByDepartment } from "../api/prfApi";
import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

export const useUsersByDepartment = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      const response = await axiosPrivate.get(
        `/api/user/list/${user.department}/`
      );
      setUsers(response.data);
    };

    if (user) {
      // Fetch users by department
      try {
        fetchUsers();
      } catch (error: AxiosError | any) {
        setError(error.response?.data?.detail || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
  }, [user?.department]);

  return { users, loading, error };
};
