import type {
  PipelineStep,
  PipelineStepNotificationTemplate,
} from "@/shared/types/pipeline.types";

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
  interviewer_id: number;
  passed_email_template_id?: number | null;
  failed_email_template_id?: number | null;
  assessments?: PipelineAssessmentInputPayload[];
  notification_templates?: PipelineStepNotificationTemplate[];
  is_active?: boolean;
  _delete?: boolean;
}

export type PipelineInputPayload = PipelineStepInputPayload[];

// PRF2 currently keeps pipeline form state in UI-friendly PipelineStep shape.
export type PipelineInputFormState = PipelineStep[];
