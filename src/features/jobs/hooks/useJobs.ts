import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Job } from "@/features/jobs/types/job.types";
import { getJobDetailResponse, getJobsResponse } from "../services/jobService";
import { queryKeys } from "@/shared/query-keys";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

export function useJobsQuery() {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: queryKeys.jobs.listing(),
    queryFn: () => getJobsResponse({ httpClient: axiosPrivate }),
  });
}

export function useJobDetailQuery(jobId?: string | number, includeAllStatuses?: boolean) {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId ?? "unknown", includeAllStatuses),
    queryFn: () => getJobDetailResponse(jobId as string | number, includeAllStatuses, { httpClient: axiosPrivate }),
    enabled: jobId !== undefined && jobId !== null && jobId !== "",
  });
}

export function useJobs() {
  const { data } = useJobsQuery();
  return data ?? [];
}

export function useJobByTitle(title?: string): Job | undefined {
  const jobs = useJobs();

  return useMemo(() => {
    if (!title) return undefined;
    return jobs.find((job) => job.title === title);
  }, [jobs, title]);
}

export function useJobById(jobId?: string | number): Job | undefined {
  const jobs = useJobs();

  return useMemo(() => {
    if (jobId === undefined || jobId === null || jobId === "") {
      return undefined;
    }

    return jobs.find((job) => job.id === String(jobId));
  }, [jobs, jobId]);
}
