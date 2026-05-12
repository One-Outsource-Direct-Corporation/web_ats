export interface Comment {
  id: number;
  candidate_application: number;
  author: number | null;
  author_name: string;
  author_avatar?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  jobTitle?: string | null;
  company?: string | null;
  years?: number | null;
}

export interface PipelineStepProgress {
  pipeline_step_id: number;
  process_type: string;
  process_title: string;
  stage: number;
  order: number;
  status: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  status?: string;
  position?: string;
  department?: string;
  type?: string;
  avatar?: string;
  photo_url?: string;
  job_id?: number;
  pipeline_progress?: PipelineStepProgress[];
  work_experience?: WorkExperience[];
  resume_url?: string | null;
  resume_filename?: string | null;
  cover_letter_url?: string | null;
  cover_letter_filename?: string | null;
  med_cert_url?: string | null;
  med_cert_filename?: string | null;
  signed_offer_url?: string | null;
  signed_offer_filename?: string | null;
  application_form_snapshot?: Record<string, unknown>;
  application_form_questionnaire_snapshot?: Record<string, unknown>;
  preonboarding_documents?: PreonboardingDocument[];
}

export interface PreonboardingDocument {
  requirement_key: string;
  requirement_label: string;
  file_url?: string | null;
  filename?: string | null;
  status: string;
  submitted_at?: string | null;
}
