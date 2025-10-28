export interface Applicant {
  id: string;
  name: string;
  time: string;
  avatar?: string;
  rating: number;
}

export interface StageColumnProps {
  title: string;
  id: string;
  applicants: Applicant[];
  count: number;
  isSelectionMode: boolean;
  hasSelectedApplicants: boolean;
  onColumnClick: (columnId: string) => void;
}

export interface ApplicantCardProps {
  id: string;
  name: string;
  time: string;
  avatar?: string;
  rating: number;
  isDragging?: boolean;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onLongPress?: (id: string) => void;
  onToggleSelect?: (id: string) => void;
}

export interface SidebarCandidate {
  id: string;
  name: string;
  title: string;
  stage: number;
  stageColor: "orange" | "red" | "green";
  timeAgo: string;
}

export interface DayObject {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface WeekDayObject {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  fullDate: Date;
}

export interface StageSectionProps {
  title: string;
  columns: { title: string; id: string }[];
  applicantColumns: { [key: string]: Applicant[] };
  isMultiRow?: boolean;
  selectedApplicants: Set<string>;
  isSelectionMode: boolean;
  onLongPress: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onColumnClick: (columnId: string) => void;
  navigate: any;
  jobtitle?: string;
}

export interface StageConfig {
  title: string;
  columns: { title: string; id: string }[];
  isMultiRow: boolean;
}
