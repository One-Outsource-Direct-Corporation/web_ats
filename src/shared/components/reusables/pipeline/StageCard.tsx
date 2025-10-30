import type {
  PipelineStep,
  PipelineStage,
} from "@/features/positions-client/types/create_position.types";
import { StepCard } from "./StepCard";
import { StepFormDialog } from "./StepFormDialog";
import type { Assessment } from "./types";

interface StageCardProps {
  stage: PipelineStage;
  steps: PipelineStep[];
  errors?: any;
  dialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  stepData: PipelineStep;
  onStepDataChange: (field: string, value: string) => void;
  redactedInfo: boolean;
  onRedactedInfoChange: (checked: boolean) => void;
  assessments: Assessment[];
  onAssessmentsChange: (assessments: Assessment[]) => void;
  onDeleteAssessment: (id: number) => void;
  onAddAssessmentClick: () => void;
  selectedTeamMembers: number[];
  onToggleTeamMember: (memberId: number) => void;
  searchTeamMember: string;
  onSearchTeamMemberChange: (value: string) => void;
  showViewTeamMember: boolean;
  onToggleViewTeamMember: () => void;
  templateType: string;
  onTemplateTypeChange: (value: string) => void;
  reminderTime: string;
  onReminderTimeChange: (value: string) => void;
  onSaveStep: () => void;
  onEditStep: (pipelineIdentifier: number) => void;
  onDeleteStep: (pipelineIdentifier: number) => void;
}

export function StageCard({
  stage,
  steps,
  errors,
  dialogOpen,
  onDialogOpenChange,
  stepData,
  onStepDataChange,
  redactedInfo,
  onRedactedInfoChange,
  assessments,
  onAssessmentsChange,
  onDeleteAssessment,
  onAddAssessmentClick,
  selectedTeamMembers,
  onToggleTeamMember,
  searchTeamMember,
  onSearchTeamMemberChange,
  showViewTeamMember,
  onToggleViewTeamMember,
  templateType,
  onTemplateTypeChange,
  reminderTime,
  onReminderTimeChange,
  onSaveStep,
  onEditStep,
  onDeleteStep,
}: StageCardProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
        {stage.name}
      </h4>

      <div className="space-y-3 mb-4">
        {steps.map((step, index) => (
          <StepCard
            key={step.id || step.pipeline_identifier}
            step={step}
            errors={errors}
            index={index}
            onEdit={onEditStep}
            onDelete={onDeleteStep}
          />
        ))}
      </div>

      <StepFormDialog
        open={dialogOpen}
        onOpenChange={onDialogOpenChange}
        stageName={stage.name}
        stepData={stepData}
        onStepDataChange={onStepDataChange}
        redactedInfo={redactedInfo}
        onRedactedInfoChange={onRedactedInfoChange}
        assessments={assessments}
        onAssessmentsChange={onAssessmentsChange}
        onDeleteAssessment={onDeleteAssessment}
        onAddAssessmentClick={onAddAssessmentClick}
        selectedTeamMembers={selectedTeamMembers}
        onToggleTeamMember={onToggleTeamMember}
        searchTeamMember={searchTeamMember}
        onSearchTeamMemberChange={onSearchTeamMemberChange}
        showViewTeamMember={showViewTeamMember}
        onToggleViewTeamMember={onToggleViewTeamMember}
        templateType={templateType}
        onTemplateTypeChange={onTemplateTypeChange}
        reminderTime={reminderTime}
        onReminderTimeChange={onReminderTimeChange}
        onSave={onSaveStep}
      />
    </div>
  );
}
