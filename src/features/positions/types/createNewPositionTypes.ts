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

export interface Question {
  id: number;
  question: string;
  description: string;
  type: string;
  mode: string;
  options: string[]; // For Multiple Choice and Checkboxes
  // New: For Parameter mode
  scorePerOption?: Array<{ option: string; score: number }>; // For Multiple Choice/Checkboxes
  parameterValue?: string; // For Text Entry/Paragraph
  nonNegotiableText?: string; // For Text Entry/Paragraph (exact required text)
  // New: For Multiple Choice/Checkboxes non-negotiable requirements
  nonNegotiableOptions?: Array<{
    option: string;
    required: boolean;
    requiredValue?: string;
  }>;
  required: boolean; // General question required status
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

export interface FormData {
  jobTitle: string;
  department: string;
  employmentType: string;
  educationNeeded: string;
  workSetup: string;
  experience: string;
  headcountsNeeded: string;
  dateNeeded: string;
  reasonForHire: string;
  reasonSpecify: string;
  budgetFrom: string;
  budgetTo: string;
}

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

export interface AssessmentForm {
  type: string;
  title: string;
  description: string;
  required: boolean;
}

export interface AssessmentSettings {
  [key: number]: {
    dueDate: string;
    timeLimit: string;
  };
}

export interface TimePickerValues {
  hours: string;
  minutes: string;
  seconds: string;
}

export interface StepConfig {
  number: number;
  title: string;
  active: boolean;
}
