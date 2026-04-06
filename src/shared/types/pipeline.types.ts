import type { User } from "@/features/auth/types/auth.types";

interface FileBase {
  file: File | string;
  filename: string;
  file_extension?: string;
}

interface FileInDb extends FileBase {
  id: number;
}

export type FileI = FileInDb | FileBase;

interface AssessmentBase {
  name?: string | null; // For template assessments
  type: string | null;
  order: number;
  file: FileI | null;
}

export interface AssessmentInDb extends AssessmentBase {
  id: number;
  _delete?: boolean;
}

export interface AssessmentLocal extends AssessmentBase {
  tempId: string;
}

export type Assessment = AssessmentInDb | AssessmentLocal;

export interface AssessmentTemplate {
  id: number;
  name?: string | null;
  type: string;
  file: FileI | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AssessmentInDb[];
}

export interface PipelineStage {
  id: number;
  name: string;
}

interface PipelineStepBase {
  process_type: string;
  process_title: string;
  description: string;
  order: number;
  stage: number;
  reminder: string;
  interviewer: User | null;
  assessments: Assessment[];
}

export interface PipelineStepInDb extends PipelineStepBase {
  id: number;
  _delete?: boolean;
}

export interface PipelineStepLocal extends PipelineStepBase {
  tempId: string; // Only for React to identify steps uniquely
}

export type PipelineStep = PipelineStepInDb | PipelineStepLocal;
