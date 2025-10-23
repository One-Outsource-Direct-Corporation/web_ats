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

// Pipeline and Team Management Types
export interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  process: string;
}

export interface Assessment {
  id: number;
  type: string;
  title: string;
  description: string;
  required: boolean;
  stage: string;
  dueDate?: string;
  timeLimit?: string;
}

// export interface PipelineStep {
//   id: number;
//   name: string;
//   type: string;
//   icon: any;
//   description?: string;
//   redactedInfo?: boolean;
//   assessments?: Assessment[];
//   teamMembers?: TeamMember[];
//   templateType?: string;
//   reminderTime?: string;
// }

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

// Form Field Status Types
export type FormFieldStatus = "required" | "optional" | "disabled";

// export interface FormFieldItem {
//   field: string;
//   status: FormFieldStatus;
//   nonNegotiable: boolean;
// }

// export interface FormFieldStatuses {
//   personal: FormFieldItem[];
//   job: FormFieldItem[];
//   education: FormFieldItem[];
//   acknowledgement: FormFieldItem[];
// }

export interface FormFields {
  name: FormFieldStatus;
  birth_date: FormFieldStatus;
  gender: FormFieldStatus;
  primary_contact_number: FormFieldStatus;
  secondary_contact_number: FormFieldStatus;
  email: FormFieldStatus;
  linkedin_profile: FormFieldStatus;
  address: FormFieldStatus;

  expect_salary: FormFieldStatus;
  willing_to_work_onsite: FormFieldStatus;
  photo_2x2: FormFieldStatus;
  upload_med_cert: FormFieldStatus;
  preferred_interview_schedule: FormFieldStatus;

  education_attained: FormFieldStatus;
  year_graduated: FormFieldStatus;
  university: FormFieldStatus;
  course: FormFieldStatus;
  work_experience: FormFieldStatus;

  how_did_you_hear_about_us: FormFieldStatus;
  agreement: FormFieldStatus;
  signature: FormFieldStatus;
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

// Time Picker Values
// export interface TimePickerValues {
//   hours: string;
//   minutes: string;
//   seconds: string;
// }

// Assessment Form Types
export interface AssessmentForm {
  type: string;
  title: string;
  description: string;
  required: boolean;
}

// Step Configuration Types
export interface StepConfig {
  number: number;
  title: string;
  active: boolean;
}

// Non-negotiable Field Types
export interface NonNegotiableField {
  category: string;
  field: string;
  type: "text" | "select" | "radio" | "checkbox" | "file" | "date" | "number";
  options?: string[];
}

// -- Refactored Types --

// Application Form
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

// Pipeline
export interface PipelineStep {
  id?: number;
  pipeline_identifier?: number; // Only for React to identify steps uniquely
  process_type: string;
  process_title: string;
  description: string;
  order: number;
  stage: number;
  // To do: Add other fields like assessments, redactedInfo, etc
}

export interface PipelineStage {
  id: number;
  name: string;
}

// Client
export interface Client {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  posted_by: string;
}

// Form Data
export interface CreatePositionFormData {
  client: number | null;
  job_title: string;
  education_level: string;
  department: string;
  other_department: string;
  experience_level: string;
  employment_type: string;
  headcount: number;
  work_setup: string;
  target_start_date: string | null;
  reason_for_posting: string;
  other_reason_for_posting: string;
  min_budget: number;
  max_budget: number;
  description: string;
  responsibilities: string;
  qualifications: string;
  working_site: string;
  posted_by?: string; // User ID, will be handled in backend
  application_form: FormFields;
  pipeline: PipelineStep[] | [];
}

// TYPES
export type FormData = CreatePositionFormData;
