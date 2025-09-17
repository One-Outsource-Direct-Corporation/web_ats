// PRF feature types
export interface AssessmentTypes {
  technical: boolean;
  language: boolean;
  cognitive: boolean;
  personality: boolean;
  behavioral: boolean;
  cultural: boolean;
}

export interface HardwareRequired {
  desktop: boolean;
  handset: boolean;
  headset: boolean;
  laptop: boolean;
}

export interface SoftwareRequired {
  [key: string]: boolean;
}

export interface FormData {
  jobTitle: string;
  targetStartDate: string;
  numberOfVacancies: string;
  reasonForPosting: string;
  otherReasonForPosting: string;
  businessUnit: string;
  departmentName: string;
  interviewLevels: number;
  immediateSupervisor: string;
  hiringManagers: string[];
  contractType: string;
  workArrangement: string;
  category: string;
  position: string;
  workingSite: string;
  workScheduleFrom: string;
  workScheduleTo: string;
  jobDescription: string;
  responsibilities: string;
  qualifications: string;
  nonNegotiables: string;
  salaryBudget: string;
  isSalaryRange: boolean;
  minSalary: string;
  maxSalary: string;
  assessmentRequired: string;
  assessmentTypes: AssessmentTypes;
  otherAssessment: string;
  hardwareRequired: HardwareRequired;
  softwareRequired: SoftwareRequired;
}

export type FormDataType = FormData;
