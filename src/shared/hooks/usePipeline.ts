import type {
  PipelineStep,
  PipelineStepInDb,
  PipelineStepLocal,
} from "../types/pipeline.types";

export const usePipeline = (
  pipelines: PipelineStep[],
  setPipelines: (updatedPipelines: PipelineStep[]) => void
) => {
  function addPipelineStep(newStep: PipelineStepLocal) {
    const stepsInStage = pipelines.filter((s) => s.stage === newStep.stage);
    const nextOrder = stepsInStage.length + 1;

    const stepToAdd = {
      ...newStep,
      order: nextOrder,
    };
    setPipelines([...pipelines, stepToAdd]);
  }

  function updatePipelineStep(
    id: string | number,
    data: Partial<PipelineStep>
  ) {
    setPipelines(
      pipelines.map((step) => {
        if ((step as PipelineStepLocal).tempId === id) {
          return { ...step, ...data };
        }

        if ((step as PipelineStepInDb).id === id) {
          return { ...step, ...data };
        }
        return step;
      })
    );
  }

  function deletePipelineStep(id: string | number) {
    setPipelines(
      pipelines
        .map((step) =>
          typeof id === "number" && (step as PipelineStepInDb).id === id
            ? { ...step, _delete: true }
            : step
        )
        .filter(
          (step) =>
            !(
              typeof id === "string" &&
              (step as PipelineStepLocal).tempId === id
            )
        )
    );
  }

  return {
    pipelines,
    addPipelineStep,
    updatePipelineStep,
    deletePipelineStep,
  };
};
