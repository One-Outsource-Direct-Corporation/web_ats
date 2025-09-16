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
