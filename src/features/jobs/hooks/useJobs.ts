import { useState, useEffect } from "react";
import type { Job } from "@/features/jobs/types/Job";
import { getJobs } from "../../../services/jobService";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    getJobs().then(setJobs);
  }, []);
  return jobs;
}
