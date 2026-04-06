export interface PublicJobDepartment {
  id: number;
  name: string;
}

export interface PublicJobDetailResponse {
  job_title: string;
  employment_type: string | null;
  work_setup: string | null;
  department: PublicJobDepartment | null;
  description: string | null;
  responsibilities: string | null;
  qualifications: string | null;
}
