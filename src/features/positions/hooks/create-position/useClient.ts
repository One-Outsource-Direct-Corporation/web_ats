import { useState, useEffect } from "react";
import { axiosPrivate } from "@/config/axios";
import type { Client } from "../../types/createPosition";
import type { AxiosError } from "axios";

export default function useClient() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosPrivate.get("api/client");
        setClients(response.data);
      } catch (err: AxiosError | any) {
        setError(err.response?.data?.error || "Failed to fetch clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading, error };
}
