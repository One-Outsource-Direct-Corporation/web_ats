import PipelineConfiguration from "@/shared/components/reusables/PipelineConfiguration";
import type { PipelineStep } from "../../../../shared/types/pipeline.types";
import { usePipeline } from "@/shared/hooks/usePipeline";
import type { ValidationError } from "../../utils/validateSteps";

interface Step04Props {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (updatedPipelines: PipelineStep[]) => void;
  errors?: ValidationError | null;
}

export default function Step04({
  pipelineSteps,
  pipelineHandler,
  errors,
}: Step04Props) {
  const { pipelines, addPipelineStep, updatePipelineStep, deletePipelineStep } =
    usePipeline(pipelineSteps, pipelineHandler);

  return (
    <div>
      {errors?.pipeline && Array.isArray(errors.pipeline) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.pipeline[0]}</p>
        </div>
      )}
      <PipelineConfiguration
        pipelineSteps={pipelines}
        addPipelineStep={addPipelineStep}
        updatePipelineStep={updatePipelineStep}
        deletePipelineStep={deletePipelineStep}
        errors={errors}
      />
    </div>
  );
}
