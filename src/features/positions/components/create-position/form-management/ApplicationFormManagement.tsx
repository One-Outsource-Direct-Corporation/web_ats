import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { FormFieldStatuses } from "../../../types/createPosition";

interface ApplicationFormManagementProps {
  formFieldStatuses: FormFieldStatuses;
  onFieldStatusChange: (
    category: "personal" | "job" | "education" | "acknowledgement",
    index: number,
    status: "required" | "optional" | "disabled"
  ) => void;
  onFieldNonNegotiableChange: (
    category: "personal" | "job" | "education" | "acknowledgement",
    index: number,
    nonNegotiable: boolean
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
  formFieldStatuses,
  onFieldStatusChange,
  onFieldNonNegotiableChange,
  includeInCandidateExperience,
  onIncludeInCandidateExperienceChange,
  showTemplateOptions,
  onToggleTemplateOptions,
  onAddQuestionnaire,
}) => {
  const renderFieldTable = (
    title: string,
    fields: any[],
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
            {fields.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="p-4 font-medium text-gray-800 w-2/5">
                  {item.field}
                </td>
                {showNonNegotiable && (
                  <td className="p-4 text-center w-1/6">
                    <Checkbox
                      checked={item.nonNegotiable}
                      onCheckedChange={(checked) =>
                        onFieldNonNegotiableChange(
                          category,
                          index,
                          checked as boolean
                        )
                      }
                    />
                  </td>
                )}
                <td className="p-4 text-center w-1/6">
                  <input
                    type="radio"
                    name={`${category}_${index}_status`}
                    value="required"
                    checked={item.status === "required"}
                    onChange={(e) =>
                      onFieldStatusChange(
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
                      onFieldStatusChange(
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
                      onFieldStatusChange(
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
    <div>
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
        {renderFieldTable(
          "Personal Information",
          formFieldStatuses.personal,
          "personal"
        )}

        {/* Job Details */}
        {renderFieldTable("Job Details", formFieldStatuses.job, "job", true)}

        {/* Work and Education */}
        {renderFieldTable(
          "Work and Education",
          formFieldStatuses.education,
          "education",
          true
        )}

        {/* Acknowledgement */}
        {renderFieldTable(
          "Acknowledgement",
          formFieldStatuses.acknowledgement,
          "acknowledgement"
        )}

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
      </div>
    </div>
  );
};
