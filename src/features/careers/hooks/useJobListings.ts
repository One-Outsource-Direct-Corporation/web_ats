import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import type { JobData } from "../types/job.types";
import { careersService } from "@/features/careers/services/careers.service";

export const useJobListings = () => {
  const [jobListings, setJobListings] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        setLoading(true);
        const response = await careersService.getJobListingsResponse();
        setJobListings(response);
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
