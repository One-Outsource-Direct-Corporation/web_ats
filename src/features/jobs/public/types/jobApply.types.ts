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
  resume?: File | null;
  coverLetter?: File | null;
  photo?: File | null;
  medicalCertificate?: File | null;
}

export interface CandidateApplicationSubmissionResponse {
  id: number;
  status: string;
  message: string;
}
