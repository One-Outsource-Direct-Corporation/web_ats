export interface JobPostingResponseDto {
  id: number;
  job_title: string;
  created_at: string;
  number_of_vacancies: number;
  status: string;
  department_name?: string | null;
  employment_type?: string | null;
}

export interface JobPostingListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobPostingResponseDto[];
}

export interface JobListItem {
  id: string;
  title: string;
  created: string;
  totalCandidates?: number;
  vacancies?: number;
  status?: string;
  department?: string;
  employmentType?: string;
}

export type JobQueryResult = JobListItem[];
export type Job = JobListItem;
