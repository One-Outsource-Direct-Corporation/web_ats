import PipelineConfiguration from "@/shared/components/reusables/PipelineConfiguration";
import { usePipeline } from "@/shared/hooks/usePipeline";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import type React from "react";
import type { ValidationError } from "@/features/prf_2/utils/validateSteps";
import { FieldError } from "@/shared/components/ui/field";

interface PRFStep05Props {
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
  errors?: ValidationError | null;
}

export default function PRFStep05({
  formData,
  updateFormData,
  errors,
}: PRFStep05Props) {
  const pipelineHandler = (updatedPipelines: PRFFormData["pipeline_input"]) => {
    updateFormData((prev) => ({
      ...prev,
      pipeline_input: updatedPipelines,
    }));
  };

  const { pipelines, addPipelineStep, updatePipelineStep, deletePipelineStep } =
    usePipeline(formData.pipeline_input, pipelineHandler);

  const pipelineErrors = errors?.pipeline ?? errors?.pipeline_input;
  const normalizedPipelineErrors = errors
    ? { ...errors, pipeline: pipelineErrors }
    : undefined;

  return (
    <div className="lg:col-span-3 space-y-6">
      {Array.isArray(pipelineErrors) &&
        pipelineErrors.length > 0 &&
        typeof pipelineErrors[0] === "string" && (
          <FieldError>{pipelineErrors[0]}</FieldError>
        )}
      <PipelineConfiguration
        pipelineSteps={pipelines}
        addPipelineStep={addPipelineStep}
        updatePipelineStep={updatePipelineStep}
        deletePipelineStep={deletePipelineStep}
        errors={normalizedPipelineErrors}
      />
    </div>
  );
}
