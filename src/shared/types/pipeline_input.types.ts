import type { PipelineStep } from "@/shared/types/pipeline.types";

export interface PipelineAssessmentInputPayload {
  id?: number;
  name?: string | null;
  type: string | null;
  order: number;
  file_id?: number;
  is_required?: boolean;
  is_active?: boolean;
  _delete?: boolean;
}

export interface PipelineStepInputPayload {
  id?: number;
  stage: number;
  order: number;
  process_type: string;
  process_title: string;
  reminder?: string;
  interviewer_id: number;
  assessments?: PipelineAssessmentInputPayload[];
  is_active?: boolean;
  _delete?: boolean;
}

export type PipelineInputPayload = PipelineStepInputPayload[];

// PRF2 currently keeps pipeline form state in UI-friendly PipelineStep shape.
export type PipelineInputFormState = PipelineStep[];
