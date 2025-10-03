import { useEffect, useState } from "react";
import { defaultAxios } from "@/config/axios";
import type { AxiosError } from "axios";
import type { JobData } from "../types/job";

export const useJobListings = () => {
  const [jobListings, setJobListings] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        setLoading(true);
        const response = await defaultAxios.get("/api/job/");
        setJobListings(response.data);
      } catch (err: AxiosError | any) {
        console.log(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobListings();
  }, []);

  return { jobListings, loading, error };
};
