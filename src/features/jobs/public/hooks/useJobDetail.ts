import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import type { PublicApplyJobDetailResponse } from "@/features/jobs/public/types/jobApply.types";
import { careersService } from "@/features/jobs/public/services/careers.service";

export const useJobDetail = (jobId: string | undefined) => {
  const [jobDetail, setJobDetail] =
    useState<PublicApplyJobDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) return;

      try {
        const response = await careersService.getJobDetailResponse({ jobId });
        setJobDetail(response);
      } catch (err: unknown) {
        console.log(err);
        if (isAxiosError(err)) {
          const errorData = err.response?.data as
            | { error?: string; detail?: string }
            | undefined;
          setError(
            errorData?.error || errorData?.detail || "An error occurred",
          );
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  return { jobDetail, loading, error };
};
