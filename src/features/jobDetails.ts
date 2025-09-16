import { useEffect, useState } from "react";
import type { Job } from "../entities/Job";
import { getJobs } from "../services/jobService";

export function useJobByTitle(title?: string): Job | undefined {
  const [job, setJob] = useState<Job | undefined>(undefined);
  useEffect(() => {
    if (!title) return;
    getJobs().then((jobs) => {
      setJob(jobs.find((j) => j.title === title));
    });
  }, [title]);
  return job;
}
