import type { ApplicationFormBase } from "@/shared/types/application_form.types";

export interface PublicApplyJobPosting {
  id: number;
  job_title: string;
}

export type PublicQuestionType =
  | "multiple_choices"
  | "checkboxes"
  | "paragraph";

export interface PublicQuestionOption {
  value: string;
}

export interface PublicQuestionnaire {
  id: number;
  question: string;
  description?: string;
  question_type: PublicQuestionType;
  options?: Array<PublicQuestionOption | string>;
}

export interface PublicQuestionnaireSection {
  id: number;
  name: string;
  questionnaires: PublicQuestionnaire[];
}

export interface PublicApplyQuestionnaire {
  id?: number;
  name: string | null;
  template: boolean;
  sections: PublicQuestionnaireSection[];
}

export interface PublicApplyApplicationForm {
  application_form: ApplicationFormBase;
  questionnaire: PublicApplyQuestionnaire;
}

export interface PublicApplyJobDetailResponse {
  job_posting: PublicApplyJobPosting;
  application_form: PublicApplyApplicationForm;
}

export interface CandidateApplicationSubmissionPayload {
  job_posting: number;
  source?: string;
  referral_code?: string | null;
  personal_info: Record<string, unknown>;
  job_details: Record<string, unknown>;
  education_work: Record<string, unknown>;
  acknowledgement: Record<string, unknown>;
  questionnaire_answers: Record<string, unknown>;
  requirements?: Record<string, unknown>[];
}

export interface CandidateApplicationSubmissionFiles {
  resume: File;
  coverLetter?: File | null;
  photo?: File | null;
  medicalCertificate?: File | null;
}

export interface CandidateApplicationSubmissionResponse {
  id: number;
  status: string;
  tracking_code: string;
  message: string;
}

export interface CandidateApplicationTrackStatusHistoryItem {
  previous_status: string | null;
  previous_status_label: string | null;
  new_status: string;
  new_status_label: string;
  remarks: string;
  created_at: string;
}

export interface CandidateApplicationTrackPipelineStepItem {
  process_type: string;
  process_title: string;
  stage: number | null;
  order: number | null;
  status: string;
  status_label: string;
  reminder: string | null;
  started_at: string | null;
  completed_at: string | null;
  notes: string;
}

export interface CandidateApplicationTrackResponse {
  id: number;
  applicant_name: string;
  email: string;
  job_posting_id: number | null;
  job_title: string | null;
  status: string;
  status_label: string;
  source: string;
  referral_code: string | null;
  submitted_at: string;
  status_history: CandidateApplicationTrackStatusHistoryItem[];
  pipeline_steps: CandidateApplicationTrackPipelineStepItem[];
  requirements: Record<string, unknown>[];
}
