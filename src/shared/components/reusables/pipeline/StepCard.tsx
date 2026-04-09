import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import formatName from "@/shared/utils/formatName";
import type {
  PipelineStep,
  PipelineStepInDb,
  PipelineStepLocal,
} from "@/shared/types/pipeline.types";
import { ProcessTypeIcon } from "./ProcessTypeIcon";

interface StepCardProps {
  step: PipelineStep;
  errors?: unknown;
  index: number;
  onEdit?: (step: PipelineStep) => void;
  onDelete?: (id: string | number) => void;
}

export function StepCard({
  step,
  errors,
  index,
  onEdit,
  onDelete,
}: StepCardProps) {
  const pipelineIdentifier =
    (step as PipelineStepInDb).id || (step as PipelineStepLocal).tempId;

  const pipelineErrors =
    errors && typeof errors === "object"
      ? ((errors as { pipeline?: unknown; pipeline_input?: unknown })
          .pipeline ??
        (errors as { pipeline?: unknown; pipeline_input?: unknown })
          .pipeline_input)
      : undefined;

  const stepPipelineErrors =
    pipelineErrors && typeof pipelineErrors === "object"
      ? (pipelineErrors as Record<number, unknown>)[index]
      : undefined;

  return (
    <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
      {stepPipelineErrors && typeof stepPipelineErrors === "object" && (
        <div className="text-red-600 text-sm mb-2">
          {Object.entries(stepPipelineErrors as Record<string, unknown>).map(
            ([field, fieldErrors]) => {
              let errorMessage = "";
              if (field === "process_type") {
                errorMessage = "Process type is required";
              } else if (field === "process_title") {
                errorMessage = "Process title is required";
              } else if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                errorMessage = fieldErrors[0];
              }
              return errorMessage ? (
                <p key={field + index} className="mb-1">
                  {errorMessage}
                </p>
              ) : null;
            },
          )}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProcessTypeIcon
            processType={step.process_type}
            className="text-blue-600"
          />
          <span className="text-sm font-medium">
            {formatName(step.process_type)}
          </span>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="icon" onClick={() => onEdit?.(step)}>
            <Edit />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete?.(pipelineIdentifier)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {step.description && (
        <p className="text-xs text-gray-600 mt-2">{step.process_title}</p>
      )}
    </div>
  );
}
