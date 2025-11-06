import type { ApplicationFormData } from "../../../shared/types/application_form.types";
import type { BatchEntry, LocationEntry } from "./location_and_batch.types";
import type { PipelineStep } from "../../../shared/types/pipeline.types";

export interface JobPosting {
  job_title: string | null;
  department: string | null;
  other_department: string | null;
  employment_type: string | null;
  number_of_vacancies: number | null;
  work_setup: string | null;
  target_start_date: string | null;
  reason_for_posting: string | null;
  other_reason_for_posting: string | null;
  min_budget: number | null;
  max_budget: number | null;
  description: string | null;
  responsibilities: string | null;
  qualifications: string | null;
  working_site: string | null;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  contact_number: string;
  posted_by: string;
}

export interface PositionBase {
  client: number | null;
  education_level: string | null;
  experience_level: string | null;
}

export interface Position extends PositionBase {
  job_posting: JobPosting;
  application_form: ApplicationFormData;
  pipeline: PipelineStep[] | [];
  section_questionnaire: {
    // SectionQuestionnaire
    // Questionnaire
  };
  locations: LocationEntry[] | [];
  batches: BatchEntry[] | [];
}

export interface PositionDb extends Position {
  id: number;
  posted_by: string;
  created_at: Date;
  updated_at: Date;
  type: "prf" | "client";
  status: string;
  published: boolean;
  active: boolean;
}

export type PositionFormData = Position | PositionDb;
