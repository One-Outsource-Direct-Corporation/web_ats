// Types and interfaces for Positions feature

export interface BaseJobPosting {
  id: number;
  title: string;
  department: string;
  description: string;
  status?: string;
  assignee?: string;
  progress?: { completed: number; total: number };
  link?: string;
  type?: "Internal" | "External";
}

export type JobPosting = BaseJobPosting;

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
