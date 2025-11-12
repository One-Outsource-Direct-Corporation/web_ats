import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus } from "lucide-react";
import type {
  PipelineStep,
  Assessment,
  PipelineStepLocal,
  PipelineStage,
  AssessmentLocal,
  PipelineStepInDb,
} from "@/shared/types/pipeline.types";
import { ProcessTypeSelect } from "./ProcessTypeSelect";
import { AssessmentSection } from "./AssessmentSection";
import { HiringManagerMember } from "./HiringManagerMember";
import { StageActionTemplate } from "./StageActionTemplate";
import { Field, FieldGroup, FieldLabel } from "../../ui/field";
import { Textarea } from "../../ui/textarea";
import type { User } from "@/features/auth/types/auth.types";

interface AddStepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: PipelineStage;
  stepData: Omit<PipelineStep, "id" | "tempId">;
  onStepDataChange: (
    field: keyof PipelineStep,
    value: string | number | boolean | User[] | Assessment[]
  ) => void;
  addAssessment: (assessment: AssessmentLocal) => void;
  updateAssessment: (id: string | number, data: Assessment) => void;
  deleteAssessment: (id: number | string) => void;
  addPipelineStep: (newStep: PipelineStepLocal) => void;
  editingStep?: PipelineStep | null;
  updatePipelineStep?: (id: string | number, data: PipelineStep) => void;
}

export function AddStepFormDialog({
  open,
  onOpenChange,
  stage,
  stepData,
  onStepDataChange,
  addAssessment,
  updateAssessment,
  deleteAssessment,
  addPipelineStep,
  editingStep,
  updatePipelineStep,
}: AddStepFormDialogProps) {
  const isEditing = !!editingStep;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="w-full text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg py-3 hover:border-blue-400 hover:text-blue-400 transition-colors">
          <Plus className="w-4 h-4 inline mr-1" />
          Add Step Here
        </button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] !max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-600">
            {isEditing ? `Edit ${stage.name ?? ""}` : stage.name ?? ""}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="py-4">
          {/* Process Type */}
          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Process Type
            </FieldLabel>
            <ProcessTypeSelect
              value={stepData.process_type}
              onValueChange={(value) => onStepDataChange("process_type", value)}
            />
          </Field>

          {/* Process Title */}
          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Process Title
            </FieldLabel>
            <Input
              placeholder="Enter process title"
              value={stepData.process_title}
              onChange={(e) =>
                onStepDataChange("process_title", e.target.value)
              }
            />
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </FieldLabel>
            <Textarea
              placeholder="Enter description"
              value={stepData.description}
              onChange={(e) => onStepDataChange("description", e.target.value)}
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Field>

          {/* Assessment Section */}
          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Assessment
            </FieldLabel>
            <AssessmentSection
              assessments={stepData.assessments}
              onChange={updateAssessment}
              onAdd={addAssessment}
              onDelete={deleteAssessment}
              onReorder={(reorderedAssessments) =>
                onStepDataChange("assessments", reorderedAssessments)
              }
            />
          </Field>

          <HiringManagerMember
            hiringManagers={stepData.hiring_managers}
            handleHiringManagerSelection={(manager) => {
              onStepDataChange(
                "hiring_managers",
                stepData.hiring_managers?.some((hm) => hm.id === manager.id)
                  ? stepData.hiring_managers.filter(
                      (hm) => hm.id !== manager.id
                    )
                  : [...stepData.hiring_managers, manager]
              );
            }}
          />

          <StageActionTemplate
            reminderTime={stepData.reminder || ""}
            onReminderTimeChange={(value: string) =>
              onStepDataChange("reminder", value)
            }
          />
        </FieldGroup>

        <DialogFooter>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              if (isEditing && editingStep && updatePipelineStep) {
                const stepId =
                  (editingStep as PipelineStepInDb).id ||
                  (editingStep as PipelineStepLocal).tempId;
                updatePipelineStep(stepId, {
                  ...editingStep,
                  ...stepData,
                });
              } else {
                addPipelineStep({
                  ...stepData,
                  stage: stage.id,
                  tempId: `tmp-${Date.now()}`,
                });
              }
              onOpenChange(false);
            }}
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
