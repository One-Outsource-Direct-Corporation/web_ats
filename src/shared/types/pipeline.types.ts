import type { User } from "@/features/auth/types/auth.types";
import type { Questionnaire } from "@/features/positions-client/types/questionnaire.types";

interface AssessmentBase {
  type: string;
  title: string;
  description: string;
  required: boolean;
  order: number;
  questions?: Questionnaire[];
}

export interface AssessmentInDb extends AssessmentBase {
  id: number;
  _delete?: boolean;
}

export interface AssessmentLocal extends AssessmentBase {
  tempId: string;
}

export type Assessment = AssessmentInDb | AssessmentLocal;

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
  redacted: boolean;
  reminder: string;
  hiring_managers: User[] | [];
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
