import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Job } from "@/features/jobs/types/job.types";
import { getJobsResponse } from "../services/jobService";
import { queryKeys } from "@/shared/query-keys";

export function useJobsQuery() {
  return useQuery({
    queryKey: queryKeys.jobs.listing(),
    queryFn: getJobsResponse,
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
