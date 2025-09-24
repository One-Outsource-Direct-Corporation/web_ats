import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { User } from "@/features/auth/types/auth.types";
// import { fetchUserByDepartment } from "../api/prfApi";
import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

export const useUsersByDepartment = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosPrivate.get(
          `/api/user/list/${user.department}/`,
          { signal: controller.signal }
        );
        isMounted && setUsers(response.data);
      } catch (error: AxiosError | any) {
        if (error.code === "ERR_CANCELED") return; // Ignore abort errors
        setError(error.response?.data?.detail || "Failed to fetch users");
        navigate("/login", { state: { from: location }, replace: true });
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
