import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import type { ApplicationFormData } from "../../../shared/types/application_form.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Field, FieldGroup } from "@/shared/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/shared/components/ui/dialog";

interface NonNegotiableModalProps {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
  formData: ApplicationFormData;
  setNonNegotiableValue: (
    fieldName: string,
    value: string | number | boolean
  ) => void;
}

// Field configuration for non-negotiable requirements
const NON_NEGOTIABLE_FIELDS = [
  {
    key: "expected_salary",
    label: "Expected Salary",
    type: "number" as const,
    placeholder: "Enter minimum expected salary",
  },
  {
    key: "willing_to_work_onsite",
    label: "Willing to Work Onsite",
    type: "radio" as const,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "education_attained",
    label: "Education Attained",
    type: "select" as const,
    options: [
      { value: "high_school", label: "High School" },
      { value: "associate", label: "Associate's Degree" },
      { value: "bachelor", label: "Bachelor's Degree" },
      { value: "master", label: "Master's Degree" },
      { value: "doctorate", label: "Doctorate Degree" },
    ],
  },
  {
    key: "course",
    label: "Course",
    type: "select" as const,
    options: [
      { value: "computer_science", label: "Computer Science" },
      { value: "business_administration", label: "Business Administration" },
      { value: "psychology", label: "Psychology" },
      { value: "engineering", label: "Engineering" },
      { value: "nursing", label: "Nursing" },
      { value: "other", label: "Other" },
    ],
  },
];

export const NonNegotiableModal = ({
  show,
  onClose,
  onContinue,
  formData,
  setNonNegotiableValue,
}: NonNegotiableModalProps) => {
  const [localValues, setLocalValues] = useState<{
    [key: string]: string | number | boolean;
  }>({});

  // Initialize values from formData.non_negotiables when modal opens
  useEffect(() => {
    if (show) {
      const initialValues: { [key: string]: string | number | boolean } = {};
      formData.non_negotiables.forEach((item) => {
        initialValues[item.field] = item.value;
      });
      setLocalValues(initialValues);
    }
  }, [show, formData.non_negotiables]);

  if (!show) return null;

  const handleFieldChange = (
    fieldKey: string,
    value: string | number | boolean
  ) => {
    setLocalValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleSave = () => {
    // Save all non-negotiable values to parent state
    Object.entries(localValues).forEach(([fieldName, value]) => {
      setNonNegotiableValue(fieldName, value);
    });
    onContinue();
  };

  // Filter only fields that are marked as non-negotiable in application form
  const activeNonNegotiableFields = NON_NEGOTIABLE_FIELDS.filter((field) =>
    formData.non_negotiables.some((item) => item.field === field.key)
  );

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Non-Negotiable Requirements</DialogTitle>
          <DialogDescription>
            Set the required values for non-negotiable fields. Candidates who
            don't meet these criteria will be automatically filtered out.
          </DialogDescription>
        </DialogHeader>

        {activeNonNegotiableFields.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No non-negotiable fields have been selected.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeNonNegotiableFields.map((field) => {
              const fieldKey = String(field.key);
              return (
                <FieldGroup
                  key={fieldKey}
                  className="border gap-4 rounded-lg p-4"
                >
                  <div>
                    <span className="text-xs text-blue-600 font-medium">
                      Application Form
                    </span>
                    <h4 className="text-sm font-medium text-gray-800">
                      {field.label}
                    </h4>
                  </div>

                  {field.type === "number" && (
                    <Input
                      type="number"
                      placeholder={field.placeholder}
                      value={String(localValues[fieldKey] ?? "")}
                      onChange={(e) =>
                        handleFieldChange(fieldKey, Number(e.target.value))
                      }
                      className="w-full"
                    />
                  )}

                  {field.type === "select" && field.options && (
                    <Field>
                      <Select
                        value={String(localValues[fieldKey] ?? "")}
                        onValueChange={(value) =>
                          handleFieldChange(fieldKey, value)
                        }
                      >
                        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md text-sm">
                          <SelectValue placeholder="Select minimum requirement" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem value={option.value} key={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* If "Other" is selected, show an additional input */}
                      {localValues[fieldKey] === "other" && (
                        <Input
                          className="w-full"
                          placeholder="Please specify"
                          value={String(localValues[`${fieldKey}_other`] ?? "")}
                          onChange={(e) =>
                            handleFieldChange(
                              `${fieldKey}_other`,
                              e.target.value
                            )
                          }
                        />
                      )}
                    </Field>
                  )}

                  {field.type === "radio" && field.options && (
                    <Field>
                      {field.options.map((option) => {
                        const currentValue = localValues[fieldKey];
                        const isChecked = currentValue === option.value;
                        return (
                          <label
                            key={`${fieldKey}-${option.value}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={fieldKey}
                              value={option.value}
                              checked={isChecked}
                              onChange={(e) => {
                                handleFieldChange(fieldKey, e.target.value);
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer accent-blue-600"
                            />
                            <span className="text-sm text-gray-700">
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </Field>
                  )}
                </FieldGroup>
              );
            })}
          </div>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 flex items-start gap-3 rounded-md">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Important Note:</p>
            <p className="text-sm">
              Non-negotiable requirements will be automatically evaluated during
              the screening process. Candidates who don't meet these criteria
              will be filtered out before manual review.
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="px-4 py-2 border-gray-300">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
