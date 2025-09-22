import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { MoreHorizontal } from "lucide-react";
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
  savedQuestionnaires?: Array<{ name: string; sections: any[] }>;
  setSelectedTemplate?: (template: string) => void;
  setQuestionnaireName?: (name: string) => void;
  setSections?: (sections: any[]) => void;
  setIsTemplateSelected?: (selected: boolean) => void;
  showTemplateOptions?: boolean;
  setShowTemplateOptions?: (show: boolean) => void;
  setSavedQuestionnaires?: (
    questionnaires: Array<{ name: string; sections: any[] }>
  ) => void;
}

export default function ApplicationFormStep({
  formFieldStatuses,
  onFormFieldStatusChange,
  onFormFieldNonNegotiableChange,
  includeInCandidateExperience,
  setIncludeInCandidateExperience,
  selectedTemplate,
  onShowQuestionnaireModal,
  savedQuestionnaires = [],
  setSelectedTemplate = () => {},
  setQuestionnaireName = () => {},
  setSections = () => {},
  setIsTemplateSelected = () => {},
  showTemplateOptions = false,
  setShowTemplateOptions = () => {},
  setSavedQuestionnaires = () => {},
}: ApplicationFormStepProps) {
  const renderTableSection = (
    title: string,
    fields: typeof formFieldStatuses.personal,
    category: "personal" | "job" | "education" | "acknowledgement",
    showNonNegotiable: boolean = false
  ) => (
    <div className="mb-8">
      <h4 className="text-base font-medium text-gray-800 mb-4">{title}</h4>
      <div className="border rounded-lg overflow-x-auto w-full">
        <table className="min-w-full bg-white text-sm table-fixed">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-medium text-gray-700 w-2/5">
                Field
              </th>
              {showNonNegotiable && (
                <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                  Non-Negotiable
                </th>
              )}
              {!showNonNegotiable && (
                <th className="text-center p-4 font-medium text-gray-700 w-1/8"></th>
              )}
              <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                Required
              </th>
              <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                Optional
              </th>
              <th className="text-center p-4 font-medium text-gray-700 w-1/8">
                Disabled
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-4 font-medium text-gray-800 w-2/5">
                  {item.field}
                </td>
                {showNonNegotiable && (
                  <td className="p-4 text-center w-1/6">
                    <input
                      type="checkbox"
                      name={`${category}_${index}_non_negotiable`}
                      value="non-negotiable"
                      checked={item.nonNegotiable}
                      onChange={(e) =>
                        onFormFieldNonNegotiableChange(
                          category,
                          index,
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 bg-white border-2 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 appearance-none relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-blue-600 checked:after:text-xs checked:after:font-bold"
                    />
                  </td>
                )}
                {!showNonNegotiable && (
                  <td className="p-4 text-center w-1/6"></td>
                )}
                <td className="p-4 text-center w-1/6">
                  <input
                    type="radio"
                    name={`${category}_${index}_status`}
                    value="required"
                    checked={item.status === "required"}
                    onChange={(e) =>
                      onFormFieldStatusChange(
                        category,
                        index,
                        e.target.value as "required" | "optional" | "disabled"
                      )
                    }
                    className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                  />
                </td>
                <td className="p-4 text-center w-1/6">
                  <input
                    type="radio"
                    name={`${category}_${index}_status`}
                    value="optional"
                    checked={item.status === "optional"}
                    onChange={(e) =>
                      onFormFieldStatusChange(
                        category,
                        index,
                        e.target.value as "required" | "optional" | "disabled"
                      )
                    }
                    className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                  />
                </td>
                <td className="p-4 text-center w-1/6">
                  <input
                    type="radio"
                    name={`${category}_${index}_status`}
                    value="disabled"
                    checked={item.status === "disabled"}
                    onChange={(e) =>
                      onFormFieldStatusChange(
                        category,
                        index,
                        e.target.value as "required" | "optional" | "disabled"
                      )
                    }
                    className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      {/* Candidate Applications */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Candidate Applications
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose how candidates can apply to this position.
        </p>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="candidateApplication"
              value="external"
              defaultChecked
              className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
            />
            <span className="text-sm text-blue-600">
              External Job Posting Platforms (LinkedIn, Jobstreet, etc.)
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="candidateApplication"
              value="internal"
              className="w-4 h-4 bg-white border-2 border-gray-400 rounded-full appearance-none focus:ring-2 focus:ring-blue-500 checked:bg-white checked:border-blue-600 checked:after:content-[''] checked:after:w-2 checked:after:h-2 checked:after:bg-blue-600 checked:after:rounded-full checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:transform checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 relative"
            />
            <span className="text-sm text-gray-700">Internal Only</span>
          </label>
        </div>
      </div>

      {/* Application Form */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          Application Form
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Choose what information to collect from candidates who apply through
          your Careers Site.
        </p>

        {/* Personal Information */}
        {renderTableSection(
          "Personal Information",
          formFieldStatuses.personal,
          "personal",
          false
        )}

        {/* Job Details */}
        {renderTableSection("Job Details", formFieldStatuses.job, "job", true)}

        {/* Work and Education */}
        {renderTableSection(
          "Work and Education",
          formFieldStatuses.education,
          "education",
          true
        )}

        {/* Acknowledgement */}
        {renderTableSection(
          "Acknowledgement",
          formFieldStatuses.acknowledgement,
          "acknowledgement",
          false
        )}
      </div>

      {/* Available Questionnaires */}
      <div className="mb-6">
        <h4 className="text-base font-medium text-gray-800 mb-4">
          Available Questionnaires
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Questionnaires let you extend your Application Form with custom
          questions.
        </p>
        <div className="flex flex-col gap-3 items-start">
          {/* New flex container for the dropdown and ellipsis button */}
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white w-[400px]"
              onChange={(e) => {
                const selected = e.target.value;
                setSelectedTemplate(selected);
                if (selected !== "") {
                  const template = savedQuestionnaires.find(
                    (q) => q.name === selected
                  );
                  if (template) {
                    setQuestionnaireName(template.name);
                    setSections(template.sections);
                    setIsTemplateSelected(true);
                  } else {
                    setSections([]);
                    setQuestionnaireName("");
                    setIsTemplateSelected(false);
                  }
                } else {
                  setSections([]);
                  setQuestionnaireName("");
                  setIsTemplateSelected(false);
                }
              }}
              value={selectedTemplate}
            >
              <option value="">Select Templates</option>
              {savedQuestionnaires.map((q) => (
                <option key={q.name} value={q.name}>
                  {q.name}
                </option>
              ))}
            </select>

            {selectedTemplate && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplateOptions(!showTemplateOptions)}
                  className="p-1 h-auto"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                {showTemplateOptions && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => {
                        const template = savedQuestionnaires.find(
                          (q) => q.name === selectedTemplate
                        );
                        if (template) {
                          setQuestionnaireName(template.name);
                          setSections(template.sections);
                          setIsTemplateSelected(true);
                          onShowQuestionnaireModal();
                          setShowTemplateOptions(false);
                        }
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSavedQuestionnaires(
                          savedQuestionnaires.filter(
                            (q) => q.name !== selectedTemplate
                          )
                        );
                        setSelectedTemplate("");
                        setIsTemplateSelected(false);
                        setShowTemplateOptions(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* New Checkbox */}
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="include-candidate-experience"
              checked={includeInCandidateExperience}
              onCheckedChange={(checked) => {
                if (typeof checked === "boolean") {
                  setIncludeInCandidateExperience(checked);
                }
              }}
            />
            <Label
              htmlFor="include-candidate-experience"
              className="text-sm text-gray-700"
            >
              Include in Candidate Experience (Default)
            </Label>
          </div>

          {/* Moved Button below the checkbox */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 w-[180px] mt-3"
            onClick={() => {
              onShowQuestionnaireModal();
              setQuestionnaireName("");
              setSections([]);
              setIsTemplateSelected(false);
            }}
          >
            Add Questionnaire
          </Button>
        </div>
      </div>
    </Card>
  );
}
