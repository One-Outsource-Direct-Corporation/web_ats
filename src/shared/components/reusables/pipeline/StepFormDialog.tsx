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
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import type { PipelineStep } from "@/features/positions-client/types/create_position.types";
import type { Assessment } from "./types";
import { ProcessTypeSelect } from "./ProcessTypeSelect";
import { AssessmentSection } from "./AssessmentSection";
import { TeamMemberSection } from "./TeamMemberSection";
import { StageActionTemplate } from "./StageActionTemplate";

interface StepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stageName: string;
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
  onSave: () => void;
}

export function StepFormDialog({
  open,
  onOpenChange,
  stageName,
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
  onSave,
}: StepFormDialogProps) {
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
          <DialogTitle className="text-blue-600">{stageName}</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Process Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Process Type
            </label>
            <ProcessTypeSelect
              value={stepData.process_type}
              onValueChange={(value) => onStepDataChange("process_type", value)}
            />
          </div>

          {/* Process Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Process Title
            </label>
            <Input
              placeholder="Enter process title"
              value={stepData.process_title}
              onChange={(e) =>
                onStepDataChange("process_title", e.target.value)
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={stepData.description}
              onChange={(e) => onStepDataChange("description", e.target.value)}
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Redacted Information */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={redactedInfo}
              onCheckedChange={(checked) =>
                onRedactedInfoChange(checked as boolean)
              }
            />
            <label className="text-sm text-gray-700">
              Redacted Information
            </label>
          </div>

          {/* Assessment Section */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Assessment
            </label>
            <AssessmentSection
              assessments={assessments}
              onAssessmentsChange={onAssessmentsChange}
              onAddClick={onAddAssessmentClick}
              onDeleteAssessment={onDeleteAssessment}
            />
          </div>

          {/* Team Member Section */}
          <TeamMemberSection
            selectedTeamMembers={selectedTeamMembers}
            onToggleTeamMember={onToggleTeamMember}
            searchValue={searchTeamMember}
            onSearchChange={onSearchTeamMemberChange}
            showViewTeamMember={showViewTeamMember}
            onToggleViewTeamMember={onToggleViewTeamMember}
          />

          {/* Stage Action Template */}
          <StageActionTemplate
            templateType={templateType}
            reminderTime={reminderTime}
            onTemplateTypeChange={onTemplateTypeChange}
            onReminderTimeChange={onReminderTimeChange}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
