interface AssessmentBase {
  type: string;
  title: string;
  description: string;
  required: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  process: string;
}

interface AssessmentInDb extends AssessmentBase {
  id: number;
  source: "db";
}

interface AssessmentLocal extends AssessmentBase {
  localId: string;
  source: "local";
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
  assessments: Assessment[];
}

export interface PipelineStepInDb extends PipelineStepBase {
  id: number;
  source: "db";
}

export interface PipelineStepLocal extends PipelineStepBase {
  pipeline_identifier: string; // Only for React to identify steps uniquely
  source: "local";
}

export type PipelineStep = PipelineStepInDb | PipelineStepLocal;
