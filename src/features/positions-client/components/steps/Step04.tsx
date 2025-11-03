import PipelineConfiguration from "@/shared/components/reusables/PipelineConfiguration";
import type { PipelineStep } from "../../types/pipeline.types";

interface Step04Props {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (
    pipeline_identifier: string | number,
    data: PipelineStep
  ) => void;
  pipelineDeleteHandler: (pipeline_identifier: string | number) => void;
  errors?: any;
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
