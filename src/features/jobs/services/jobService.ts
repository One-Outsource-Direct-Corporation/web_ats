import { defaultAxios } from "@/config/axios";
import type {
  JobListItem,
  JobPostingListResponseDto,
  JobPostingResponseDto,
  JobQueryResult,
} from "../types/job.types";

const toJobListItem = (jobPosting: JobPostingResponseDto): JobListItem => ({
  id: String(jobPosting.id),
  title: jobPosting.job_title,
  created: new Date(jobPosting.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }),
  vacancies: jobPosting.number_of_vacancies,
  status: jobPosting.status,
  department: jobPosting.department_name ?? undefined,
  employmentType: jobPosting.employment_type ?? undefined,
});

export async function getJobsResponse(): Promise<JobQueryResult> {
  const response =
    await defaultAxios.get<JobPostingListResponseDto>("/api/job/");
  return response.data.results.map(toJobListItem);
}
