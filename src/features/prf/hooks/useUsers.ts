import { useState, useEffect, useRef } from "react";
import type { User } from "@/features/auth/types/auth.types";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { usersDev } from "../data/users-dev";

export const useUsersByDepartment = ({
  business_unit,
  department_name,
  email,
  include,
}: {
  business_unit: string;
  department_name: string;
  email?: string;
  include?: string;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const controllerRef = useRef<AbortController | null>(null);

  const fetchUsers = async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      if (import.meta.env.VITE_REACT_ENV === "development") {
        setUsers(usersDev());
        return;
      }

      const response = await axiosPrivate.get(
        `/api/user/?${business_unit ? `business_unit=${business_unit}&` : ""}${
          department_name ? `department=${department_name}&` : ""
        }${email ? `email=${email}&` : ""}${
          include ? `include_role=${include}` : ""
        }`,
        {
          signal: controllerRef.current.signal,
        }
      );
      setUsers(response.data);
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") return; // Ignore abort errors
      setError(error.response?.data?.detail || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [business_unit, department_name, email]);

  return { users, loading, error, refetch: fetchUsers };
};

export const useUsers = ({ position = "" }: { position?: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const controllerRef = useRef<AbortController | null>(null);

  // TODO: Add filtering by position in API

  const fetchUsers = async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    try {
      setLoading(true);
      setError(null);

      if (import.meta.env.VITE_REACT_ENV === "development") {
        const filteredUsers = usersDev().filter(
          (user) => user.role === position
        );
        setUsers(filteredUsers);
        return;
      }

      const response = await axiosPrivate.get(`/api/user/`, {
        signal: controllerRef.current.signal,
      });
      setUsers(response.data);
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") return;
      setError(error.response?.data?.detail || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};
