import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface QuestionnairesSectionProps {
  includeInCandidateExperience: boolean;
  onIncludeInCandidateExperienceChange: (checked: boolean) => void;
  showTemplateOptions: boolean;
  onToggleTemplateOptions: () => void;
  onAddQuestionnaire: () => void;
}

export const QuestionnairesSection: React.FC<QuestionnairesSectionProps> = ({
  includeInCandidateExperience,
  onIncludeInCandidateExperienceChange,
  showTemplateOptions,
  onToggleTemplateOptions,
  onAddQuestionnaire,
}) => {
  return (
    <div className="mt-6">
      <h4 className="text-base font-medium text-gray-800 mb-4">
        Available Questionnaires
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        Questionnaires let you extend your Application Form with custom
        questions.
      </p>
      <div className="flex flex-col gap-3 items-start">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onToggleTemplateOptions}
            className="text-blue-600 border-blue-600 bg-transparent hover:bg-blue-50"
          >
            {showTemplateOptions ? "Hide Templates" : "Show Templates"}
          </Button>
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="include-candidate-experience"
            checked={includeInCandidateExperience}
            onCheckedChange={(checked) =>
              onIncludeInCandidateExperienceChange(checked as boolean)
            }
          />
          <label
            htmlFor="include-candidate-experience"
            className="text-sm text-gray-700"
          >
            Include in candidate experience
          </label>
        </div>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 w-[180px] mt-3"
          onClick={onAddQuestionnaire}
        >
          Add Questionnaire
        </Button>
      </div>
    </div>
  );
};
