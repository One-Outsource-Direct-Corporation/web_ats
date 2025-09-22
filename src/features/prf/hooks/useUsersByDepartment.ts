import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { User } from "@/features/auth/types/auth.types";
import { fetchUserByDepartment } from "../api/prfApi";
import type { AxiosError } from "axios";

export const useUsersByDepartment = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user) {
      // Fetch users by department
      try {
        setLoading(true);
        setError(null);

        const response = fetchUserByDepartment(user.department);
        response.then((response) => setUsers(response));
      } catch (error: AxiosError | any) {
        setError(error.response?.data?.detail || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
  }, [user?.department]);

  return { users, loading, error };
};
