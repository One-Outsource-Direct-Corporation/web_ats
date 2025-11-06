import PipelineConfiguration from "@/shared/components/reusables/PipelineConfiguration";
import type { PipelineStep } from "../../../../shared/types/pipeline.types";
import { usePipeline } from "@/shared/hooks/usePipeline";

interface Step04Props {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (updatedPipelines: PipelineStep[]) => void;
  errors?: any;
}

export default function Step04({
  pipelineSteps,
  pipelineHandler,
  errors,
}: Step04Props) {
  const { pipelines, addPipelineStep, updatePipelineStep, deletePipelineStep } =
    usePipeline(pipelineSteps, pipelineHandler);
  return (
    <PipelineConfiguration
      pipelineSteps={pipelines}
      addPipelineStep={addPipelineStep}
      updatePipelineStep={updatePipelineStep}
      deletePipelineStep={deletePipelineStep}
      errors={errors}
    />
  );
}
