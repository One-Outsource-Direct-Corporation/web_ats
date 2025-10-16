import { useState, useEffect } from "react";
import type { Job } from "@/features/jobs/types/jobTypes";
import { getJobs } from "../services/jobService";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    getJobs().then(setJobs);
  }, []);
  return jobs;
}

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
