import type { ApplicationFormData } from "../../../shared/types/application_form.types";
import type { BatchEntry, LocationEntry } from "./location_and_batch.types";
import type { PipelineStep } from "../../../shared/types/pipeline.types";

export interface StepProps {
  number: number;
  title: string;
  active: boolean;
}

export interface JobPosting {
  job_title: string | null;
  experience_level: string | null;
  department_name: string | null;
  department_name_other: string | null;
  employment_type: string | null;
  number_of_vacancies: number | null;
  work_setup: string | null;
  target_start_date: string | null;
  reason_for_posting: string | null;
  other_reason_for_posting: string | null;
  min_salary: number | null;
  max_salary: number | null;
  description: string | null;
  responsibilities: string | null;
  qualifications: string | null;
  working_site: string | null;
}

export interface JobPostingDb extends JobPosting {
  id: number;
  status: string;
  type: "client" | "prf";
  active: boolean;
  published: boolean;
  posted_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface ClientBase {
  name: string;
  email: string;
  contact_number: string;
}

export interface ClientDb extends ClientBase {
  id: number;
  posted_by: string;
}

export type Client = ClientDb | ClientBase;

export interface PositionBase {
  client: number | null;
  education_level: string | null;
}

export interface Position extends PositionBase {
  job_posting: JobPosting;
  application_form: ApplicationFormData;
  pipeline: PipelineStep[] | [];
  locations: LocationEntry[] | [];
  batches: BatchEntry[] | [];
}

export interface PositionDb extends Omit<Position, "job_posting"> {
  id: number;
  job_posting: JobPostingDb;
  posted_by: string;
  created_at: Date;
  updated_at: Date;
  type: "client";
  status: string;
  published: boolean;
  active: boolean;
}

export type PositionFormData = Position | PositionDb;
