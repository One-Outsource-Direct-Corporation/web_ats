import type { DepartmentEntity } from "@/features/department";

export enum ExperienceLevel {
  ENTRY_LEVEL = "entry_level",
  JUNIOR = "junior",
  MID_LEVEL = "mid_level",
  SENIOR = "senior",
  LEAD = "lead",
  EXECUTIVE = "executive",
}

export enum EmploymentType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  TEMPORARY = "temporary",
}

export enum WorkSetup {
  ONSITE = "onsite",
  REMOTE = "remote",
  HYBRID = "hybrid",
}
export enum JobPostingStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  CLOSED = "closed",
  CANCELLED = "cancelled",
  PENDING = "pending",
  REOPENED = "reopened",
}

export enum JobPostingType {
  PRF = "prf",
  CLIENT = "client", // EXTERNAL POSTING
}

export interface JobPostingResponseMinimal {
  id: number;
  job_title: string;
  description: string;
  work_setup: string;
  employment_type: string;
  experience_level: string;
  department: DepartmentEntity;
  updated_at: string;
  posted_by: JobPostedBy | null;
  status?: JobPostingStatus | "draft";
  type?: JobPostingType;
}

export interface JobPostedBy {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  role: string;
}

export interface JobPostingCreatePayload {
  job_title: string;
  target_start_date: string;
  reason_for_posting: string;
  other_reason_for_posting: string;
  experience_level: ExperienceLevel | "";
  department: number | "";
  department_display: string | null; // For display purposes only, not sent to backend
  employment_type: EmploymentType | "";
  work_setup: WorkSetup | "";
  working_site: string;
  number_of_vacancies: number | "";
  work_schedule_from: string;
  work_schedule_to: string;
  min_salary: number | "";
  max_salary: number | "";
  description: string;
  responsibilities: string;
  qualifications: string;
  status: JobPostingStatus;
  type: JobPostingType;
}
