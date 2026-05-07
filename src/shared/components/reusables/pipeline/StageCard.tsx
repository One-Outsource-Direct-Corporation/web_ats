import type {
  PipelineStage,
  PipelineStep,
  PipelineStepInDb,
  PipelineStepLocal,
  Assessment,
  AssessmentLocal,
  AssessmentInDb,
  PipelineStepNotificationTemplate,
} from "@/shared/types/pipeline.types";
import type { User } from "@/features/auth/types/auth.types";
import { StepCard } from "./StepCard";
import { AddStepFormDialog } from "./AddStepFormDialog";
import { useState } from "react";
 
const PASSED_BODY =
  "Dear {{ candidate_name }},\n\n" +
  "We are pleased to inform you that you have successfully completed the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
  "We will be in touch with further details regarding the next steps.\n\n" +
  "Best regards,\n" +
  "{{ interviewer_name }}\n" +
  "{{ interviewer_role }}\n" +
  "{{ company_name }}";

const FAILED_BODY =
  "Dear {{ candidate_name }},\n\n" +
  "Thank you for your participation in the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
  "After careful consideration, we regret to inform you that you have not been successful on this occasion.\n\n" +
  "We appreciate your interest and wish you all the best in your future endeavors.\n\n" +
  "Best regards,\n" +
  "{{ interviewer_name }}\n" +
  "{{ interviewer_role }}\n" +
  "{{ company_name }}";

const DEFAULT_NOTIFICATION_TEMPLATES: PipelineStepNotificationTemplate[] = [
  {
    action_type: "send_email",
    trigger_outcome: "passed",
    subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}",
    body: PASSED_BODY,
  },
  {
    action_type: "send_email",
    trigger_outcome: "failed",
    subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}",
    body: FAILED_BODY,
  },
];

interface StageCardProps {
  stage: PipelineStage;
  steps: PipelineStep[];
  allSteps: PipelineStep[];
  errors?: unknown;
  addPipelineStep: (newStep: PipelineStepLocal) => void;
  updatePipelineStep: (id: string | number, data: PipelineStep) => void;
  deletePipelineStep: (id: string | number) => void;
  jobTitle?: string;
}

export function StageCard({
  stage,
  steps,
  allSteps,
  errors,
  addPipelineStep,
  updatePipelineStep,
  deletePipelineStep,
  jobTitle,
}: StageCardProps) {
  const [stepData, setStepData] = useState<Omit<PipelineStep, "id" | "tempId">>(
    {
      process_type: "",
      process_title: "",
      description: "",
      order: 0,
      stage: 0,
      interviewer: null,
      passedEmailTemplateId: null,
      failedEmailTemplateId: null,
      notification_templates: DEFAULT_NOTIFICATION_TEMPLATES,
      assessments: [],
    },
  );
  const [openDialogs, setOpenDialogs] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [editingStep, setEditingStep] = useState<PipelineStep | null>(null);

  function handleStepDataChange(
    field: keyof PipelineStep,
    value:
      | string
      | number
      | boolean
      | User
      | null
      | Assessment[]
      | PipelineStepNotificationTemplate[],
  ) {
    setStepData((prev) => ({ ...prev, [field]: value }));
  }
  function normalizeNotificationTemplates(
    templates?: PipelineStepNotificationTemplate[],
  ): PipelineStepNotificationTemplate[] {
    const passedTemplate = templates?.find(
      (template) => template.trigger_outcome === "passed",
    );
    const failedTemplate = templates?.find(
      (template) => template.trigger_outcome === "failed",
    );

    return [
      passedTemplate ?? DEFAULT_NOTIFICATION_TEMPLATES[0],
      failedTemplate ?? DEFAULT_NOTIFICATION_TEMPLATES[1],
    ];
  }

  function resetStepData() {
    setStepData({
      process_type: "",
      process_title: "",
      description: "",
      order: 0,
      stage: 0,
      interviewer: null,
      passedEmailTemplateId: null,
      failedEmailTemplateId: null,
      assessments: [],
      notification_templates: DEFAULT_NOTIFICATION_TEMPLATES,
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
      interviewer: step.interviewer,
      passedEmailTemplateId: step.passedEmailTemplateId ?? null,
      failedEmailTemplateId: step.failedEmailTemplateId ?? null,
      assessments: step.assessments,
      notification_templates: normalizeNotificationTemplates(
        step.notification_templates,
      ),
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
    updatedData: Partial<Assessment>,
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
            : assessment,
        )
        .filter(
          (assessment) =>
            !(
              typeof id === "string" &&
              (assessment as AssessmentLocal).tempId === id
            ),
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
        jobTitle={jobTitle}
      />
    </div>
  );
}
