import type { ApplicationFormData } from "./application_form.types";
import type { Assessment, PipelineStep, TeamMember } from "./pipeline.types";

// Location and Batch Management Types
export interface LocationEntry {
  id: number;
  location: string;
  headcount: number;
  deploymentDate: string;
  withBatch: boolean;
}

export interface BatchEntry {
  id: number;
  batch: number;
  headcount: number;
  deploymentDate: string;
}

// Question and Assessment Types
export interface Question {
  id: number;
  question: string;
  description: string;
  type: string;
  mode: string;
  options: string[];
  // For Parameter mode
  scorePerOption?: Array<{ option: string; score: number }>;
  parameterValue?: string;
  nonNegotiableText?: string;
  // For Multiple Choice/Checkboxes non-negotiable requirements
  nonNegotiableOptions?: Array<{
    option: string;
    required: boolean;
    requiredValue?: string;
  }>;
  required: boolean;
}

export interface QuestionnaireSection {
  id: number;
  name: string;
  questions: Question[];
}

export interface SavedQuestionnaire {
  name: string;
  sections: QuestionnaireSection[];
}

// Stage Popup Data
export interface StagePopupData {
  processType: string;
  processTitle: string;
  description: string;
  redactedInfo: boolean;
  assessments: Assessment[];
  teamMembers: TeamMember[];
  templateType: string;
  reminderTime: string;
}

// Step Component Props
export interface StepProps {
  number: number;
  title: string;
  active: boolean;
}

// Assessment Settings
export interface AssessmentSettings {
  [key: number]: {
    dueDate: string;
    timeLimit: string;
  };
}

// Step Configuration Types
export interface StepConfig {
  number: number;
  title: string;
  active: boolean;
}

export interface JobPosting {
  job_title: string | null;
  department: string | null;
  other_department: string | null;
  employment_type: string | null;
  headcount: number | null;
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
  locations_client: LocationEntry[] | [];
  batches_client: BatchEntry[] | [];
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
