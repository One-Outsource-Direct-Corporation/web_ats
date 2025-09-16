import { useState, useEffect } from "react";
import type { Job } from "../entities/Job";
import { getJobs } from "../services/jobService";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    getJobs().then(setJobs);
  }, []);
  return jobs;
}
