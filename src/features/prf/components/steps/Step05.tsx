import PipelineConfiguration from "@/shared/components/reusables/PipelineConfiguration";
import type { PipelineStep } from "../../../../shared/types/pipeline.types";
import { usePipeline } from "@/shared/hooks/usePipeline";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ValidationError } from "../../utils/validateSteps";

interface Step05Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  pipelineSteps: PipelineStep[];
  pipelineHandler: (updatedPipelines: PipelineStep[]) => void;
  errors?: ValidationError | null;
}

export default function Step05({
  goToNextStep,
  goToPreviousStep,
  pipelineSteps,
  pipelineHandler,
  errors,
}: Step05Props) {
  const { pipelines, addPipelineStep, updatePipelineStep, deletePipelineStep } =
    usePipeline(pipelineSteps, pipelineHandler);
  return (
    <div className="space-y-10">
      {errors?.pipeline &&
        Array.isArray(errors.pipeline) &&
        typeof errors.pipeline[0] === "string" && (
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
      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={goToPreviousStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          className="bg-[#0056D2] hover:bg-blue-700 text-white"
          onClick={goToNextStep}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
