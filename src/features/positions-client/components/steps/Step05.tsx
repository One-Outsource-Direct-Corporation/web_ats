import { AssessmentManagement } from "../AssessmentManagement";
import type { PipelineStep } from "../../../../shared/types/pipeline.types";

interface Step05Props {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (updatedPipelines: PipelineStep[]) => void;
}

export default function Step05({
  pipelineSteps,
  pipelineHandler,
}: Step05Props) {
  return (
    <AssessmentManagement
      pipelineSteps={pipelineSteps}
      pipelineHandler={pipelineHandler}
    />
  );
}
