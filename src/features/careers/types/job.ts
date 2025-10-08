import type { User } from "@/features/auth/types/auth.types";

export type ApplicationFormType = "required" | "optional" | "disabled";

export interface ApplicationForm {
  name: ApplicationFormType;
  birth_date: ApplicationFormType;
  gender: ApplicationFormType;
  primary_contact_number: ApplicationFormType;
  secondary_contact_number: ApplicationFormType;
  email: ApplicationFormType;
  linkedin_profile: ApplicationFormType;
  address: ApplicationFormType;
  expected_salary: ApplicationFormType;
  willing_to_work_onsite: ApplicationFormType;
  photo_2x2: ApplicationFormType;
  upload_med_cert: ApplicationFormType;
  preferred_interview_schedule: ApplicationFormType;
  education_attained: ApplicationFormType;
  year_graduated: ApplicationFormType;
  university: ApplicationFormType;
  course: ApplicationFormType;
  work_experience: ApplicationFormType;
  how_did_you_hear_about_us: ApplicationFormType;
  agreement: ApplicationFormType;
  signature: ApplicationFormType;
}

export interface PipelineStep {
  process_type: string;
  process_title: string;
  description: string;
  order: number;
  stage: number;
}

export interface JobData {
  id: number;
  unique_id: number;
  client: string;
  pipeline: PipelineStep[];
  application_form: ApplicationForm;
  job_title: string;
  education_level: string;
  department: string;
  experience_level: string;
  experience_level_display: string;
  employment_type: string;
  employment_type_display: string;
  headcount: number;
  work_setup: string;
  work_setup_display: string;
  date_needed: string;
  reason_for_hiring: string;
  other_reason_for_hiring?: string;
  min_budget: number;
  max_budget: number;
  description: string;
  responsibilities: string;
  qualifications: string;
  location: string;
  status: "draft" | "active" | "closed" | "cancelled";
  published: boolean;
  active: boolean;
  posted_by: User;
  created_at: string;
  updated_at: string;
}

export interface JobFilters {
  searchTerm: string;
  categoryFilter: string;
  workTypeFilter: string;
  workSetupFilter: string;
}

export type FilterType = "category" | "workType" | "workSetup";
