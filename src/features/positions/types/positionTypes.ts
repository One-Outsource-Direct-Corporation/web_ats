import type { ApplicationForm } from "@/features/careers/types/job";
import type { FormFields, PipelineStep } from "./createPosition";
import type { User } from "@/features/auth/types/auth.types";
import type { JobPostingResponse } from "@/features/jobs/types/jobTypes";

export interface PositionData {
  id: number;
  unique_id: string;
  client: string;
  pipeline: PipelineStep[];
  application_form: ApplicationForm;
  job_title: string;
  education_level: string;
  department: string;
  experience_level: string;
  experience_level_display: string;
  employment_type: string;
  employment_type_display: string;
  number_of_vacancies: number;
  work_setup: string;
  work_setup_display: string;
  date_needed: string;

  reason_for_posting: string;
  other_reason_for_posting?: string;

  min_budget: number;
  max_budget: number;
  description: string;
  responsibilities: string;
  qualifications: string;
  location: string;
  status: "draft" | "active" | "closed" | "cancelled" | "pending";

  type: "position" | "prf";
  type_display: "Position" | "PRF";
  published: boolean;
  active: boolean;
  posted_by: User;
  created_at: string;
  updated_at: string;
}

export type JobPosting = PositionData;

export type TabType =
  | "drafts"
  | "on-hold"
  | "published"
  | "closed"
  | "archive"
  | "deleted";
export type PublishedSubTabType = "all" | "Internal" | "External";

export interface PositionsData {
  drafts: JobPosting[];
  "on-hold": JobPosting[];
  published: {
    Internal: JobPosting[];
    External: JobPosting[];
    all: JobPosting[];
  };
  closed: JobPosting[];
  archive: JobPosting[];
  deleted: JobPosting[];
}

export interface FilterState {
  search: string;
  selectedOffice: string;
  selectedDepartment: string;
  selectedEmploymentType: string;
}

export interface DialogConfig {
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export interface PositionsState {
  currentTab: TabType;
  publishedSubTab: PublishedSubTabType;
  selected: number[];
  showTypeDialog: boolean;
  filters: FilterState;
  positions: PositionsData;
  dialogOpen: boolean;
  dialogConfig: DialogConfig;
  currentData: JobPosting[];
  filteredPostings: JobPosting[];
}

export interface PositionsActions {
  setCurrentTab: (tab: TabType) => void;
  setPublishedSubTab: (subTab: PublishedSubTabType) => void;
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  setShowTypeDialog: (show: boolean) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  setPositions: React.Dispatch<React.SetStateAction<PositionsData>>;
  openDialog: (config: Partial<DialogConfig>) => void;
  closeDialog: () => void;
  handleSelectAllToggle: () => void;
  moveSelectedJobs: (
    sourceTabName: TabType | "publishedInternal" | "publishedExternal",
    destinationTabName:
      | TabType
      | "publishedInternal"
      | "publishedExternal"
      | "published"
  ) => void;
  handleTabChange: (value: string) => void;
}

export interface PipelineStepResponse {
  id: number;
  position: number;
  process_type_display: string;
  process_type: string;
  process_title: string;
  description: string;
  order: number;
  stage: number;
}

export interface PositionResponse {
  id: number;
  // job_posting: JobPostingResponse;
  client: number;
  client_display: string;
  application_form: FormFields & { id: number; position: number };
  pipeline: PipelineStepResponse[];
  education_level: string;
  experience_level: string;
}

export interface PositionAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobPostingResponse[];
}
