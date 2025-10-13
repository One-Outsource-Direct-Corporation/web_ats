import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { User } from "@/features/auth/types/auth.types";
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
    let isMounted = true;
    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosPrivate.get(
          `/api/user/${user.business_unit ? user.business_unit + "/" : ""}`,
          { signal: controller.signal }
        );
        console.log(response);
        isMounted && setUsers(response.data);
      } catch (error: AxiosError | any) {
        if (error.code === "ERR_CANCELED") return; // Ignore abort errors
        setError(error.response?.data?.detail || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user?.department]);

  return { users, loading, error };
};
