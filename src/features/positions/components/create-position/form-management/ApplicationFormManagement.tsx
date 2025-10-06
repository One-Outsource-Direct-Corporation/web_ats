import React from "react";
import { CandidateApplicationType } from "./CandidateApplicationType";
import { FormFieldsTable } from "./FormFieldsTable";
import { QuestionnairesSection } from "./QuestionnairesSection";
import { FIELD_CONFIGS } from "../../../constants/formFieldsConfig";
import type { CreatePositionFormData } from "../../../types/createPosition";

interface ApplicationFormManagementProps {
  formData: CreatePositionFormData;
  onFieldStatusChange: (
    fieldKey: string,
    status: "required" | "optional" | "disabled"
  ) => void;
  includeInCandidateExperience: boolean;
  onIncludeInCandidateExperienceChange: (checked: boolean) => void;
  showTemplateOptions: boolean;
  onToggleTemplateOptions: () => void;
  onAddQuestionnaire: () => void;
}

export const ApplicationFormManagement: React.FC<
  ApplicationFormManagementProps
> = ({
  formData,
  onFieldStatusChange,
  includeInCandidateExperience,
  onIncludeInCandidateExperienceChange,
  showTemplateOptions,
  onToggleTemplateOptions,
  onAddQuestionnaire,
}) => {
  return (
    <div>
      <CandidateApplicationType />

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Application Form
        </h3>
        <p className="text-sm text-gray-600">
          Choose what information to collect from candidates who apply through
          your Careers Site.
        </p>

        <FormFieldsTable
          title="Personal Information"
          fields={FIELD_CONFIGS.personal}
          formData={formData}
          onFieldStatusChange={onFieldStatusChange}
        />

        <FormFieldsTable
          title="Job Details"
          fields={FIELD_CONFIGS.job}
          formData={formData}
          onFieldStatusChange={onFieldStatusChange}
        />

        <FormFieldsTable
          title="Work and Education"
          fields={FIELD_CONFIGS.education}
          formData={formData}
          onFieldStatusChange={onFieldStatusChange}
        />

        <FormFieldsTable
          title="Acknowledgement"
          fields={FIELD_CONFIGS.acknowledgement}
          formData={formData}
          onFieldStatusChange={onFieldStatusChange}
        />

        <QuestionnairesSection
          includeInCandidateExperience={includeInCandidateExperience}
          onIncludeInCandidateExperienceChange={
            onIncludeInCandidateExperienceChange
          }
          showTemplateOptions={showTemplateOptions}
          onToggleTemplateOptions={onToggleTemplateOptions}
          onAddQuestionnaire={onAddQuestionnaire}
        />
      </div>
    </div>
  );
};
