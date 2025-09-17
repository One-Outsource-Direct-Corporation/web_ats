// Dashboard feature types
export type EventType = "phone" | "phone-red" | "notebookpen" | "clipboard";
export type StatusType = "Interview" | "Assessment" | "Offer Sent" | string;

export interface EventIconProps {
  type: EventType;
  className?: string;
}

export interface JobData {
  job: string;
  candidates: number;
  vacancies: number;
  expiration: string;
}

export interface OngoingProcess {
  name: string;
  job: string;
  status: StatusType;
  avatar: string;
}

export interface Event {
  event: string;
  candidate: string;
  avatar: string;
  type: EventType;
}

export interface WeekDay {
  day: string;
  date: string;
  events: Event[];
}

export interface Metric {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export interface InterviewSession {
  time: string;
  type: string;
  job: string;
  candidate: string;
  duration: string;
  location: string;
}

export interface InterviewDay {
  date: string;
  sessions: InterviewSession[];
}
