import { Card } from "@/shared/components/ui/card";
import type {
  PipelineStage,
  PipelineStep,
  PipelineStepLocal,
  PipelineStepInDb,
} from "../../types/pipeline.types";
import { StageCard } from "./pipeline/StageCard";

interface PipelineConfigurationProps {
  pipelineSteps: PipelineStep[];
  addPipelineStep: (newStep: PipelineStepLocal) => void;
  updatePipelineStep: (id: string | number, data: PipelineStep) => void;
  deletePipelineStep: (id: string | number) => void;
  errors?: unknown;
  title?: string;
  jobTitle?: string;
}

export default function PipelineConfiguration({
  pipelineSteps,
  addPipelineStep,
  updatePipelineStep,
  deletePipelineStep,
  errors,
  title = "Pipeline Configuration",
  jobTitle,
}: PipelineConfigurationProps) {
  const pipelineStages: PipelineStage[] = [
    { id: 1, name: "STAGE 01" },
    { id: 2, name: "STAGE 02" },
    { id: 3, name: "STAGE 03" },
    { id: 4, name: "STAGE 04" },
  ];

  const pipelineErrors =
    errors && typeof errors === "object"
      ? ((errors as { pipeline?: unknown; pipeline_input?: unknown })
          .pipeline ??
        (errors as { pipeline?: unknown; pipeline_input?: unknown })
          .pipeline_input)
      : undefined;

  const normalizedErrors =
    errors && typeof errors === "object"
      ? {
          ...(errors as Record<string, unknown>),
          pipeline: pipelineErrors,
        }
      : errors;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>

      <div className="flex flex-col gap-6">
        {Array.isArray(pipelineErrors) &&
          typeof pipelineErrors[0] === "string" && (
            <div className="text-red-600 text-sm">
              <p>Add Pipeline Steps</p>
            </div>
          )}
        {pipelineStages.map((stage) => {
          const stageSteps = pipelineSteps
            .filter((step) => step.stage === stage.id)
            .filter((step) => !(step as PipelineStepInDb)._delete);

          return (
            <StageCard
              key={stage.id}
              stage={stage}
              steps={stageSteps}
              allSteps={pipelineSteps}
              errors={normalizedErrors}
              addPipelineStep={addPipelineStep}
              updatePipelineStep={updatePipelineStep}
              deletePipelineStep={deletePipelineStep}
              jobTitle={jobTitle}
            />
          );
        })}
      </div>
    </Card>
  );
}
