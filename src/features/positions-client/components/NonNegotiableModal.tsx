import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { AlertCircle } from "lucide-react";

import type { ApplicationFormData } from "../../../shared/types/application_form.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
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
      { value: true, label: "Yes" },
      { value: false, label: "No" },
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
  // No local state: update parent immediately
  if (!show) return null;

  // Get value for a non-negotiable field from parent data
  const getFieldValue = (fieldKey: string) => {
    const item = formData.non_negotiable.non_negotiable.find(
      (nn) => nn.field === fieldKey
    );
    return item ? item.value : "";
  };

  // For "other" option, get value from parent data
  const getOtherValue = (fieldKey: string) => {
    const item = formData.non_negotiable.non_negotiable.find(
      (nn) => nn.field === `${fieldKey}_other`
    );
    return item ? item.value : "";
  };

  const handleFieldChange = (
    fieldKey: string,
    value: string | number | boolean
  ) => {
    setNonNegotiableValue(fieldKey, value);
  };

  const handleSave = () => {
    onContinue();
  };

  // Filter only fields that are marked as non-negotiable in application form
  const activeNonNegotiableFields = NON_NEGOTIABLE_FIELDS.filter((field) =>
    formData.non_negotiable.non_negotiable.some(
      (item) => item.field === field.key
    )
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
              let fieldValue = getFieldValue(fieldKey);
              // For boolean radio, convert string to boolean if needed
              if (
                field.type === "radio" &&
                fieldKey === "willing_to_work_onsite"
              ) {
                if (fieldValue === "true") fieldValue = true;
                if (fieldValue === "false") fieldValue = false;
              }
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
                      value={String(fieldValue ?? "")}
                      onChange={(e) =>
                        handleFieldChange(fieldKey, Number(e.target.value))
                      }
                      className="w-full"
                    />
                  )}

                  {field.type === "select" && field.options && (
                    <Field>
                      <Select
                        value={String(fieldValue ?? "")}
                        onValueChange={(value: string) =>
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
                      {fieldValue === "other" && (
                        <Input
                          className="w-full"
                          placeholder="Please specify"
                          value={String(getOtherValue(fieldKey) ?? "")}
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
                      <RadioGroup
                        value={String(fieldValue)}
                        onValueChange={(value: string) =>
                          handleFieldChange(fieldKey, value === "true")
                        }
                      >
                        {field.options.map((option) => (
                          <div
                            key={`${fieldKey}-${option.value}`}
                            className="flex items-center"
                          >
                            <RadioGroupItem
                              value={String(option.value)}
                              id={`${fieldKey}-${option.value}`}
                              className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
                            />
                            <label
                              htmlFor={`${fieldKey}-${option.value}`}
                              className="text-sm cursor-pointer text-gray-700 ml-2"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
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
