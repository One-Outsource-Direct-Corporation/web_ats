import type { PipelineStep } from "../types/pipeline.types";

export const usePipeline = (
  pipelines: PipelineStep[],
  setPipelines: (updatedPipelines: PipelineStep[]) => void
) => {
  function addPipelineStep(data: PipelineStep) {
    const newStep: PipelineStep = {
      ...data,
      ...(data.source === "local" && {
        tempId: data.tempId || `tmp-${Date.now()}`,
      }),
    };

    setPipelines([...pipelines, newStep]);
  }

  function updatePipelineStep(id: string | number, data: PipelineStep) {
    setPipelines(
      pipelines.map((step) => {
        const stepId = step.source === "local" ? step.tempId : step.id;
        return stepId === id ? { ...step, ...data } : step;
      })
    );
  }

  function deletePipelineStep(id: string | number) {
    setPipelines(
      pipelines.filter((step) => {
        const stepId = step.source === "local" ? step.tempId : step.id;
        return stepId !== id;
      })
    );
  }

  return {
    pipelines,
    addPipelineStep,
    updatePipelineStep,
    deletePipelineStep,
  };
};
