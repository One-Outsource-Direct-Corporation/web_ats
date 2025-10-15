export type Job = {
  id: string;
  title: string;
  department: string;
  description?: string;
  employmentType?: string;
  status?: string;
  created?: string;
  totalCandidates?: number;
  vacancies?: number;
};

export interface JobPostingAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobPostingResponse[];
}

export interface JobPostingResponse {
  id: number;
  job_title: string;
  target_start_date: string;
  reason_for_posting: string;
  other_reason_for_posting: string;
  department_name: string;
  employment_type: string;
  work_setup: string;
  working_site: string;
  min_salary: string;
  max_salary: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  status: string;
  type: "prf" | "position";
  type_display: "PRF" | "Position";
  active: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  posted_by: number;
}
