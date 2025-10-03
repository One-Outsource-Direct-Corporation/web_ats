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

export interface PipelineStep {
  id: number;
  name: string;
  type: string;
  icon: any;
  description?: string;
  redactedInfo?: boolean;
  assessments?: Assessment[];
  teamMembers?: TeamMember[];
  templateType?: string;
  reminderTime?: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  steps: PipelineStep[];
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

// Form Field Status Types
export interface FormFieldStatus {
  field: string;
  status: "required" | "optional" | "disabled";
  nonNegotiable: boolean;
}

export interface FormFieldStatuses {
  personal: FormFieldStatus[];
  job: FormFieldStatus[];
  education: FormFieldStatus[];
  acknowledgement: FormFieldStatus[];
}

// Main Form Data Type
export interface CreatePositionFormData {
  job_title: string;
  education_level: string;
  department: string;
  experience_level: string;
  employment_type: string;
  headcount: string;
  work_setup: string;
  date_needed: string;
  reason_for_hiring: string;
  other_reason_for_hiring: string;
  min_budget: string;
  max_budget: string;
  description?: string;
  responsibilities?: string;
  qualifications?: string;
  location?: string;
  posted_by?: string; // User ID
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
export interface TimePickerValues {
  hours: string;
  minutes: string;
  seconds: string;
}

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

// Alternative interface names for compatibility
export type FormData = CreatePositionFormData;

// Non-negotiable Field Types
export interface NonNegotiableField {
  category: string;
  field: string;
  type: "text" | "select" | "radio" | "checkbox" | "file" | "date" | "number";
  options?: string[];
}
