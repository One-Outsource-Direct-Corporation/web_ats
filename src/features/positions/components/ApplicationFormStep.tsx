import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Plus, Settings, Eye } from "lucide-react";
import type { FormFieldStatuses } from "../types/createNewPositionTypes";

interface ApplicationFormStepProps {
  formFieldStatuses: FormFieldStatuses;
  onFormFieldStatusChange: (
    category: "personal" | "job" | "education" | "acknowledgement",
    index: number,
    status: "required" | "optional" | "disabled"
  ) => void;
  onFormFieldNonNegotiableChange: (
    category: "personal" | "job" | "education" | "acknowledgement",
    index: number,
    nonNegotiable: boolean
  ) => void;
  includeInCandidateExperience: boolean;
  setIncludeInCandidateExperience: (include: boolean) => void;
  selectedTemplate: string;
  onShowQuestionnaireModal: () => void;
  onPreview: () => void;
}

export default function ApplicationFormStep({
  formFieldStatuses,
  onFormFieldStatusChange,
  onFormFieldNonNegotiableChange,
  includeInCandidateExperience,
  setIncludeInCandidateExperience,
  selectedTemplate,
  onShowQuestionnaireModal,
  onPreview,
}: ApplicationFormStepProps) {
  const renderFormSection = (
    title: string,
    fields: typeof formFieldStatuses.personal,
    category: "personal" | "job" | "education" | "acknowledgement"
  ) => (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">{title}</h4>
      {fields.map((field, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
        >
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700">{field.field}</span>
            {field.nonNegotiable && (
              <Badge variant="secondary" className="text-xs">
                Non-negotiable
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-xs text-gray-500">Non-negotiable</label>
              <Checkbox
                checked={field.nonNegotiable}
                onCheckedChange={(checked) =>
                  onFormFieldNonNegotiableChange(
                    category,
                    index,
                    checked as boolean
                  )
                }
              />
            </div>
            <div className="flex space-x-1">
              {["required", "optional", "disabled"].map((status) => (
                <Button
                  key={status}
                  variant={field.status === status ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-2 py-1 h-6"
                  onClick={() =>
                    onFormFieldStatusChange(
                      category,
                      index,
                      status as "required" | "optional" | "disabled"
                    )
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-6">
            Application Form Configuration
          </h3>

          {/* Form Field Sections */}
          <div className="space-y-8">
            {renderFormSection(
              "Personal Information",
              formFieldStatuses.personal,
              "personal"
            )}
            {renderFormSection("Job Details", formFieldStatuses.job, "job")}
            {renderFormSection(
              "Work and Education",
              formFieldStatuses.education,
              "education"
            )}
            {renderFormSection(
              "Acknowledgement",
              formFieldStatuses.acknowledgement,
              "acknowledgement"
            )}
          </div>
        </div>

        {/* Questionnaire Section */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              Additional Questionnaire
            </h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeInCandidate"
                checked={includeInCandidateExperience}
                onCheckedChange={setIncludeInCandidateExperience}
              />
              <label
                htmlFor="includeInCandidate"
                className="text-sm text-gray-600"
              >
                Include in candidate experience
              </label>
            </div>
          </div>

          {selectedTemplate ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-blue-900">
                    Selected Template
                  </h5>
                  <p className="text-sm text-blue-700">{selectedTemplate}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShowQuestionnaireModal}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">
                    No questionnaire template selected
                  </h5>
                  <p className="text-sm text-gray-500">
                    Create a custom questionnaire or select from templates
                  </p>
                </div>
                <Button onClick={onShowQuestionnaireModal} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Questionnaire
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Form
          </Button>
        </div>
      </div>
    </Card>
  );
}
