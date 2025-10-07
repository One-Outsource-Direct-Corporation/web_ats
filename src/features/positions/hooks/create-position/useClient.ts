import { useState, useEffect } from "react";
import type { Client } from "../../types/createPosition";
import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

export default function useClient() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosPrivate.get("api/client");
        setClients(response.data);
      } catch (err: AxiosError | any) {
        console.log(err);
        setError(err.response?.data?.error || "Failed to fetch clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading, error };
}
