import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import type { PRFFormData } from "@/features/prf/types/prf.types";
import type { PositionFormData } from "@/features/external_posting";
import { careersService } from "@/features/careers/services/careers.service";

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
        const response = await careersService.getJobDetailResponse({ jobId });
        setJobDetail(response);
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
