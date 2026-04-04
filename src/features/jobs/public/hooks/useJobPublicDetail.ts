import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { careersService } from "@/features/jobs/public/services/careers.service";
import type { PublicJobDetailResponse } from "@/features/jobs/public/types/jobPublicDetail.types";

export const useJobPublicDetail = (jobId: string | undefined) => {
  const [jobPublicDetail, setJobPublicDetail] =
    useState<PublicJobDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobPublicDetail = async () => {
      if (!jobId) {
        setLoading(false);
        return;
      }

      try {
        const response = await careersService.getJobPublicDetailResponse({
          jobId,
        });
        setJobPublicDetail(response);
      } catch (err: unknown) {
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

    fetchJobPublicDetail();
  }, [jobId]);

  return { jobPublicDetail, loading, error };
};
