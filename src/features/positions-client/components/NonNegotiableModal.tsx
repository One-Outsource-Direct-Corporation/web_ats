import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { AlertCircle, PlusCircle, X } from "lucide-react";
import { useState } from "react";

import type {
  ApplicationFormData,
  NonNegotiableBase,
} from "../../../shared/types/application_form.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Field, FieldGroup } from "@/shared/components/ui/field";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/shared/components/ui/dialog";

import type { ValidationError } from "@/shared/utils/formValidation";

interface NonNegotiableModalProps {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
  formData: ApplicationFormData;
  setNonNegotiableValue: (
    fieldName: string,
    value: string | number | boolean
  ) => void;
  addCustomNonNegotiable: (newNonNegotiable: NonNegotiableBase) => void;
  removeNonNegotiable: (fieldName: string) => void;
  validationError?: ValidationError | null;
}

type InputType = "text" | "number" | "boolean";

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
  addCustomNonNegotiable,
  removeNonNegotiable,
  validationError,
}: NonNegotiableModalProps) => {
  // State for adding new non-negotiable
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<InputType>("text");

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

  // Check if a field has an empty value
  const hasEmptyValue = (fieldKey: string): boolean => {
    const value = getFieldValue(fieldKey);
    return value === "" || value === null || value === undefined;
  };

  const handleAddNonNegotiable = () => {
    if (!newFieldLabel.trim()) {
      alert("Please enter a field name");
      return;
    }

    // Create a field key from the label (convert to snake_case)
    const fieldKey = newFieldLabel.toLowerCase().replace(/\s+/g, "_");
    let initialValue: string | number | boolean = "";

    if (newFieldType === "boolean") {
      initialValue = false;
    } else if (newFieldType === "number") {
      initialValue = 0;
    } else {
      initialValue = "";
    }

    addCustomNonNegotiable({
      field: fieldKey,
      value: initialValue,
    });

    addCustomNonNegotiable({
      field: fieldKey,
      value: initialValue,
    });

    // Reset form
    setNewFieldLabel("");
    setNewFieldType("text");
    setShowAddForm(false);
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

  // Get custom non-negotiable fields (fields not in predefined list)
  const customNonNegotiableFields =
    formData.non_negotiable.non_negotiable.filter(
      (item) => !NON_NEGOTIABLE_FIELDS.some((field) => field.key === item.field)
    );

  // Helper to determine input type for custom field
  const getCustomFieldInputType = (fieldKey: string): InputType => {
    const item = formData.non_negotiable.non_negotiable.find(
      (nn) => nn.field === fieldKey
    );
    if (!item) return "text";

    if (typeof item.value === "boolean") return "boolean";
    if (typeof item.value === "number") return "number";
    return "text";
  };

  const renderCustomField = (fieldKey: string) => {
    const inputType = getCustomFieldInputType(fieldKey);
    let fieldValue = getFieldValue(fieldKey);
    const hasError = hasEmptyValue(fieldKey);

    // Convert label from snake_case to Title Case
    const fieldLabel = fieldKey
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <FieldGroup
        className={`border gap-4 rounded-lg p-4 relative ${
          hasError && validationError?.non_negotiable
            ? "border-red-500 bg-red-50"
            : ""
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs text-purple-600 font-medium">
              Custom Field
            </span>
            <h4 className="text-sm font-medium text-gray-800">
              {fieldLabel}
              {hasError && validationError?.non_negotiable && (
                <span className="ml-2 text-xs text-red-600 font-semibold">
                  * Required
                </span>
              )}
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeNonNegotiable(fieldKey)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {inputType === "text" && (
          <Input
            type="text"
            placeholder="Enter required value"
            value={String(fieldValue ?? "")}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className={`w-full ${
              hasError && validationError?.non_negotiable
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
        )}

        {inputType === "number" && (
          <Input
            type="number"
            placeholder="Enter minimum required value"
            value={String(fieldValue ?? "")}
            onChange={(e) =>
              handleFieldChange(fieldKey, Number(e.target.value))
            }
            className={`w-full ${
              hasError && validationError?.non_negotiable
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
        )}

        {inputType === "boolean" && (
          <Field>
            <RadioGroup
              value={String(fieldValue)}
              onValueChange={(value: string) =>
                handleFieldChange(fieldKey, value === "true")
              }
            >
              <div className="flex items-center">
                <RadioGroupItem
                  value="true"
                  id={`${fieldKey}-true`}
                  className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
                />
                <label
                  htmlFor={`${fieldKey}-true`}
                  className="text-sm cursor-pointer text-gray-700 ml-2"
                >
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem
                  value="false"
                  id={`${fieldKey}-false`}
                  className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
                />
                <label
                  htmlFor={`${fieldKey}-false`}
                  className="text-sm cursor-pointer text-gray-700 ml-2"
                >
                  No
                </label>
              </div>
            </RadioGroup>
          </Field>
        )}
      </FieldGroup>
    );
  };

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

        {validationError?.non_negotiable && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 flex items-start gap-3 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Validation Error</p>
              <p className="text-sm">
                {Array.isArray(validationError.non_negotiable)
                  ? validationError.non_negotiable[0]
                  : typeof validationError.non_negotiable === "string"
                  ? validationError.non_negotiable
                  : "Please fill in all non-negotiable fields"}
              </p>
            </div>
          </div>
        )}

        {activeNonNegotiableFields.length === 0 &&
        customNonNegotiableFields.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No non-negotiable fields have been selected. Click "Add
              Non-Negotiables" to create custom fields.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Predefined Non-Negotiable Fields */}
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
              const hasError = hasEmptyValue(fieldKey);
              return (
                <FieldGroup
                  key={`predefined-${fieldKey}-${field.label}`}
                  className={`border gap-4 rounded-lg p-4 relative ${
                    hasError && validationError?.non_negotiable
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
                >
                  <Field orientation="horizontal" className="justify-between">
                    <div>
                      <span className="text-xs text-blue-600 font-medium">
                        Application Form
                      </span>
                      <h4 className="text-sm font-medium text-gray-800">
                        {field.label}
                        {hasError && validationError?.non_negotiable && (
                          <span className="ml-2 text-xs text-red-600 font-semibold">
                            * Required
                          </span>
                        )}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNonNegotiable(fieldKey)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </Field>

                  {field.type === "number" && (
                    <Input
                      type="number"
                      placeholder={field.placeholder}
                      value={String(fieldValue ?? "")}
                      onChange={(e) =>
                        handleFieldChange(fieldKey, Number(e.target.value))
                      }
                      className={`w-full ${
                        hasError && validationError?.non_negotiable
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
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
                        <SelectTrigger
                          className={`w-full p-2 border rounded-md text-sm ${
                            hasError && validationError?.non_negotiable
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
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

            {/* Custom Non-Negotiable Fields */}
            {customNonNegotiableFields.map((item, index) => (
              <div key={`custom-${item.field}-${index}`}>
                {renderCustomField(item.field)}
              </div>
            ))}
          </div>
        )}

        {/* Add Non-Negotiable Form */}
        {showAddForm ? (
          <div className="border border-blue-300 rounded-lg p-4 space-y-4 bg-blue-50">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-800">
                Add Custom Non-Negotiable
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="field-label"
                  className="text-sm font-medium text-gray-700"
                >
                  Field Name
                </Label>
                <Input
                  id="field-label"
                  type="text"
                  placeholder="e.g., Years of Experience, Certification"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="field-type"
                  className="text-sm font-medium text-gray-700"
                >
                  Input Type
                </Label>
                <Select
                  value={newFieldType}
                  onValueChange={(value: InputType) => setNewFieldType(value)}
                >
                  <SelectTrigger id="field-type" className="w-full mt-1">
                    <SelectValue placeholder="Select input type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddNonNegotiable}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Field
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white w-full"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Non-Negotiables
          </Button>
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
