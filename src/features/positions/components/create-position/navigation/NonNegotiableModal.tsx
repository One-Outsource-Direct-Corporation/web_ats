import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { X, AlertCircle } from "lucide-react";
import type {
  FormFields,
  FormFieldNonNegotiables,
} from "@/features/positions/types/create_position.types";

interface NonNegotiableModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: {
    application_form: FormFields;
    application_form_non_negotiables: FormFieldNonNegotiables;
  };
  nonNegotiableValues: { [key: string]: any };
  setNonNegotiableValues: (values: { [key: string]: any }) => void;
}

type NonNegotiableField = {
  key: keyof FormFieldNonNegotiables;
  label: string;
  type: "text" | "select" | "radio" | "number";
  options?: string[];
};

const NON_NEGOTIABLE_FIELDS: NonNegotiableField[] = [
  {
    key: "expect_salary",
    label: "Expected Salary",
    type: "number",
  },
  {
    key: "willing_to_work_onsite",
    label: "Willing to Work Onsite",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    key: "education_attained",
    label: "Education Attained",
    type: "select",
    options: [
      "High School",
      "Associate Degree",
      "Bachelor's Degree",
      "Master's Degree",
      "Doctorate",
    ],
  },
  {
    key: "course",
    label: "Course",
    type: "text",
  },
];

export const NonNegotiableModal = ({
  show,
  onClose,
  onSave,
  formData,
  nonNegotiableValues,
  setNonNegotiableValues,
}: NonNegotiableModalProps) => {
  if (!show) return null;

  const handleFieldChange = (fieldKey: string, value: any) => {
    setNonNegotiableValues({
      ...nonNegotiableValues,
      [fieldKey]: value,
    });
  };

  // Filter only fields that are marked as non-negotiable
  const activeNonNegotiableFields = NON_NEGOTIABLE_FIELDS.filter(
    (field) => formData.application_form_non_negotiables[field.key]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h5 className="text-xl font-bold text-gray-800">
              Non-Negotiable Requirements
            </h5>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Set the required values for non-negotiable fields. Candidates who
            don't meet these criteria will be automatically filtered out.
          </p>

          {activeNonNegotiableFields.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No non-negotiable fields have been selected.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeNonNegotiableFields.map((field) => {
                const fieldKey = field.key;
                return (
                  <div key={fieldKey} className="border rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 font-medium">
                        Application Form
                      </span>
                      <h4 className="text-sm font-medium text-gray-800">
                        {field.label}
                      </h4>
                    </div>

                    {field.type === "text" && (
                      <Input
                        placeholder={`Enter required ${field.label.toLowerCase()}`}
                        value={nonNegotiableValues[fieldKey] || ""}
                        onChange={(e) =>
                          handleFieldChange(fieldKey, e.target.value)
                        }
                        className="w-full"
                      />
                    )}

                    {field.type === "number" && (
                      <Input
                        type="number"
                        placeholder={`Enter minimum ${field.label.toLowerCase()}`}
                        value={nonNegotiableValues[fieldKey] || ""}
                        onChange={(e) =>
                          handleFieldChange(fieldKey, e.target.value)
                        }
                        className="w-full"
                      />
                    )}

                    {field.type === "select" && field.options && (
                      <select
                        value={nonNegotiableValues[fieldKey] || ""}
                        onChange={(e) =>
                          handleFieldChange(fieldKey, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Select minimum requirement</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {field.type === "radio" && field.options && (
                      <div className="space-y-2">
                        {field.options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={fieldKey}
                              value={option}
                              checked={nonNegotiableValues[fieldKey] === option}
                              onChange={(e) =>
                                handleFieldChange(fieldKey, e.target.value)
                              }
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mt-6 flex items-start gap-3 rounded-md">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Important Note:</p>
              <p className="text-sm">
                Non-negotiable requirements will be automatically evaluated
                during the screening process. Candidates who don't meet these
                criteria will be filtered out before manual review.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-4 py-2 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save and Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
