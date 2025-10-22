import PipelineConfiguration from "@/shared/components/reusables/PipelineConfiguration";
import type { PipelineStep } from "@/features/positions/types/createPosition";

interface Step04Props {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (pipeline_identifier: number, data: PipelineStep) => void;
  pipelineDeleteHandler: (pipeline_identifier: number) => void;
  errors: any;
}

export default function Step04({
  pipelineSteps,
  pipelineHandler,
  pipelineDeleteHandler,
  errors,
}: Step04Props) {
  return (
    <PipelineConfiguration
      pipelineSteps={pipelineSteps}
      pipelineHandler={pipelineHandler}
      pipelineDeleteHandler={pipelineDeleteHandler}
      errors={errors}
    />
  );
}
