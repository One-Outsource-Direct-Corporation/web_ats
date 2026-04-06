import PipelineConfiguration from "@/shared/components/reusables/PipelineConfiguration";
import { usePipeline } from "@/shared/hooks/usePipeline";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import type React from "react";

interface PRFStep05Props {
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
}

export default function PRFStep05({
  formData,
  updateFormData,
}: PRFStep05Props) {
  const pipelineHandler = (updatedPipelines: PRFFormData["pipeline_input"]) => {
    updateFormData((prev) => ({
      ...prev,
      pipeline_input: updatedPipelines,
    }));
  };

  const { pipelines, addPipelineStep, updatePipelineStep, deletePipelineStep } =
    usePipeline(formData.pipeline_input, pipelineHandler);

  return (
    <div className="lg:col-span-3 space-y-6">
      <PipelineConfiguration
        pipelineSteps={pipelines}
        addPipelineStep={addPipelineStep}
        updatePipelineStep={updatePipelineStep}
        deletePipelineStep={deletePipelineStep}
      />
    </div>
  );
}
