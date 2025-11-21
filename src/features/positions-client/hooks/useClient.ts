import { useState, useEffect } from "react";
import type { ClientDb } from "../types/create_position.types";
import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

export default function useClient() {
  const [clients, setClients] = useState<ClientDb[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("api/client");
      setClients(response.data);
    } catch (err: AxiosError | any) {
      console.log(err);
      setError(err.response?.data?.error || "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (import.meta.env.VITE_REACT_ENV === "development") {
      setClients([
        {
          id: 1,
          name: "Client A MockData",
          email: "clienta@example.com",
          contact_number: "1234567890",
          posted_by: "User1",
        },
        {
          id: 2,
          name: "Client B MockData",
          email: "clientb@example.com",
          contact_number: "0987654321",
          posted_by: "User2",
        },
      ]);

      return;
    }

    fetchClients();
  }, []);

  return { clients, loading, error, refetch: fetchClients };
}
