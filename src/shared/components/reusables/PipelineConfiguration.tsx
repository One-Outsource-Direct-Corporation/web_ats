import { Card } from "@/shared/components/ui/card";
import type {
  PipelineStage,
  PipelineStep,
  PipelineStepLocal,
} from "../../types/pipeline.types";
import { StageCard } from "./pipeline/StageCard";

interface PipelineConfigurationProps {
  pipelineSteps: PipelineStep[];
  addPipelineStep: (newStep: PipelineStepLocal) => void;
  updatePipelineStep: (id: string | number, data: PipelineStep) => void;
  deletePipelineStep: (id: string | number) => void;
  errors?: any;
  title?: string;
}

export default function PipelineConfiguration({
  pipelineSteps,
  addPipelineStep,
  updatePipelineStep,
  deletePipelineStep,
  errors,
  title = "Pipeline Configuration",
}: PipelineConfigurationProps) {
  const pipelineStages: PipelineStage[] = [
    { id: 1, name: "STAGE 01" },
    { id: 2, name: "STAGE 02" },
    { id: 3, name: "STAGE 03" },
    { id: 4, name: "STAGE 04" },
  ];
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>

      <div className="flex flex-col gap-6">
        {errors?.pipeline && typeof errors.pipeline[0] === "string" && (
          <div className="text-red-600 text-sm">
            <p>Add Pipeline Steps</p>
          </div>
        )}
        {pipelineStages.map((stage) => {
          const stageSteps = pipelineSteps.filter(
            (step) => step.stage === stage.id
          );

          return (
            <StageCard
              key={stage.id}
              stage={stage}
              steps={stageSteps}
              allSteps={pipelineSteps}
              errors={errors}
              addPipelineStep={addPipelineStep}
              updatePipelineStep={updatePipelineStep}
              deletePipelineStep={deletePipelineStep}
            />
          );
        })}
      </div>
    </Card>
  );
}
