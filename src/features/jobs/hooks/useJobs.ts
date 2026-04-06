import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Job } from "@/features/jobs/types/job.types";
import { getJobDetailResponse, getJobsResponse } from "../services/jobService";
import { queryKeys } from "@/shared/query-keys";

const normalizeJobToken = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export function useJobsQuery() {
  return useQuery({
    queryKey: queryKeys.jobs.listing(),
    queryFn: getJobsResponse,
  });
}

export function useJobDetailQuery(jobId?: string | number) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId ?? "unknown"),
    queryFn: () => getJobDetailResponse(jobId as string | number),
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

export function useJobBySlug(slug?: string): Job | undefined {
  const jobs = useJobs();

  return useMemo(() => {
    if (!slug) return undefined;

    const normalizedSlug = normalizeJobToken(slug);
    return jobs.find((job) => normalizeJobToken(job.title) === normalizedSlug);
  }, [jobs, slug]);
}
