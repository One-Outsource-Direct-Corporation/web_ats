import { useEffect, useState } from "react";
import { defaultAxios } from "@/config/axios";
import type { AxiosError } from "axios";
import type { PRFFormData } from "@/features/prf/types/prf.types";
import type { PositionFormData } from "@/features/positions-client/types/create_position.types";

export const useJobDetail = (jobId: string | undefined) => {
  const [jobDetail, setJobDetail] = useState<
    PRFFormData | PositionFormData | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) return;

      try {
        const response = await defaultAxios.get(`/api/job/${jobId}/`);
        setJobDetail(response.data);
      } catch (err: AxiosError | any) {
        console.log(err);
        setError(err.response?.data?.error || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  return { jobDetail, loading, error };
};
