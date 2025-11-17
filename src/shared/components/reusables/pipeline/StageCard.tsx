import type {
  PipelineStage,
  PipelineStep,
  PipelineStepInDb,
  PipelineStepLocal,
  Assessment,
  AssessmentLocal,
  AssessmentInDb,
} from "@/shared/types/pipeline.types";
import { StepCard } from "./StepCard";
import { AddStepFormDialog } from "./AddStepFormDialog";
import { useState } from "react";
import type { User } from "@/features/auth/types/auth.types";

interface StageCardProps {
  stage: PipelineStage;
  steps: PipelineStep[];
  allSteps: PipelineStep[];
  errors?: any;
  addPipelineStep: (newStep: PipelineStepLocal) => void;
  updatePipelineStep: (id: string | number, data: PipelineStep) => void;
  deletePipelineStep: (id: string | number) => void;
}

export function StageCard({
  stage,
  steps,
  allSteps,
  errors,
  addPipelineStep,
  updatePipelineStep,
  deletePipelineStep,
}: StageCardProps) {
  const [stepData, setStepData] = useState<Omit<PipelineStep, "id" | "tempId">>(
    {
      process_type: "",
      process_title: "",
      description: "",
      order: 0,
      stage: 0,
      reminder: "",
      hiring_managers: [],
      assessments: [],
    }
  );
  const [openDialogs, setOpenDialogs] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [editingStep, setEditingStep] = useState<PipelineStep | null>(null);

  function handleStepDataChange(
    field: keyof PipelineStep,
    value: string | number | boolean | User[] | Assessment[]
  ) {
    setStepData((prev) => ({ ...prev, [field]: value }));
  }

  function resetStepData() {
    setStepData({
      process_type: "",
      process_title: "",
      description: "",
      order: 0,
      stage: 0,
      reminder: "",
      hiring_managers: [],
      assessments: [],
    });
  }

  function handleOpenDialog(stageId: number, isOpen: boolean) {
    setOpenDialogs((prev) => ({ ...prev, [stageId]: isOpen }));
    if (!isOpen) {
      resetStepData();
      setEditingStep(null);
    }
  }

  function handleEditStep(step: PipelineStep) {
    setEditingStep(step);
    setStepData({
      process_type: step.process_type,
      process_title: step.process_title,
      description: step.description,
      order: step.order,
      stage: step.stage,
      reminder: step.reminder,
      hiring_managers: step.hiring_managers,
      assessments: step.assessments,
    });
    setOpenDialogs((prev) => ({ ...prev, [stage.id]: true }));
  }

  function handleAddAssessment(data: AssessmentLocal) {
    setStepData((prev) => ({
      ...prev,
      assessments: [...prev.assessments, data],
    }));
  }

  function handleUpdateAssessment(
    id: string | number,
    updatedData: Partial<Assessment>
  ) {
    setStepData((prev) => ({
      ...prev,
      assessments: prev.assessments.map((assessment) => {
        if ((assessment as AssessmentLocal).tempId === id) {
          return { ...assessment, ...updatedData };
        }

        if ((assessment as AssessmentInDb).id === id) {
          return { ...assessment, ...updatedData };
        }

        return assessment;
      }),
    }));
  }

  function handleDeleteAssessment(id: string | number) {
    setStepData((prev) => ({
      ...prev,
      assessments: prev.assessments
        .map((assessment) =>
          typeof id === "number" && (assessment as AssessmentInDb).id === id
            ? { ...assessment, _delete: true }
            : assessment
        )
        .filter(
          (assessment) =>
            !(
              typeof id === "string" &&
              (assessment as AssessmentLocal).tempId === id
            )
        ),
    }));
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
        {stage.name}
      </h4>

      <div className="space-y-3 mb-4">
        {steps.map((step) => {
          const stepId =
            (step as PipelineStepInDb).id || (step as PipelineStepLocal).tempId;
          // Find the global index of this step in the full pipeline array
          const globalIndex = allSteps.findIndex((s) => {
            const sId =
              (s as PipelineStepInDb).id || (s as PipelineStepLocal).tempId;
            return sId === stepId;
          });
          return (
            <StepCard
              key={stepId}
              step={step}
              errors={errors}
              index={globalIndex}
              onEdit={handleEditStep}
              onDelete={deletePipelineStep}
            />
          );
        })}
      </div>

      <AddStepFormDialog
        open={openDialogs[stage.id] || false}
        onOpenChange={(isOpen) => handleOpenDialog(stage.id, isOpen)}
        stage={stage}
        stepData={stepData}
        onStepDataChange={handleStepDataChange}
        // Spacer
        // onAssessmentsChange={onAssessmentsChange}
        addAssessment={handleAddAssessment}
        updateAssessment={handleUpdateAssessment}
        deleteAssessment={handleDeleteAssessment}
        addPipelineStep={addPipelineStep}
        editingStep={editingStep}
        updatePipelineStep={updatePipelineStep}
      />
    </div>
  );
}
