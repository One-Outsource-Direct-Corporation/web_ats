import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { AlertCircle, X } from "lucide-react";

import type { ApplicationFormData } from "@/shared/types/application_form.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Checkbox } from "@/shared/components/ui/checkbox";
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

import type { ValidationError } from "@/shared/utils/formValidation";

interface NonNegotiableModalProps {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
  formData: ApplicationFormData;
  setNonNegotiableValue: (
    fieldName: string,
    value: string | number | boolean,
  ) => void;
  removeNonNegotiable: (fieldName: string) => void;
  setQuestionnaireNonNegotiableValue: (
    sectionKey: number | string,
    questionKey: number | string,
    value: string | number | boolean | string[],
  ) => void;
  validationError?: ValidationError | null;
}

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

type QuestionnaireNonNegotiableEntry = {
  sectionKey: number | string;
  sectionName: string;
  questionKey: number | string;
  questionText: string;
  questionType: "multiple_choices" | "checkboxes" | "paragraph";
  options: string[];
  value: string | number | boolean | string[] | null | undefined;
};

const hasEmptyValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return value === "" || value === null || value === undefined;
};

const normalizeQuestionOptions = (options: unknown): string[] => {
  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .map((option) => {
      if (typeof option === "string") {
        return option.trim();
      }

      if (
        typeof option === "object" &&
        option !== null &&
        "value" in option &&
        typeof (option as { value?: unknown }).value === "string"
      ) {
        return ((option as { value: string }).value ?? "").trim();
      }

      return "";
    })
    .filter((option) => option.length > 0);
};

export const NonNegotiableModal = ({
  show,
  onClose,
  onContinue,
  formData,
  setNonNegotiableValue,
  removeNonNegotiable,
  setQuestionnaireNonNegotiableValue,
  validationError,
}: NonNegotiableModalProps) => {
  if (!show) return null;

  const getFieldValue = (fieldKey: string) => {
    const item = formData.non_negotiable.non_negotiable.find(
      (nn) => nn.field === fieldKey,
    );
    return item ? item.value : "";
  };

  const getOtherValue = (fieldKey: string) => {
    const item = formData.non_negotiable.non_negotiable.find(
      (nn) => nn.field === `${fieldKey}_other`,
    );
    return item ? item.value : "";
  };

  const handleFieldChange = (
    fieldKey: string,
    value: string | number | boolean,
  ) => {
    setNonNegotiableValue(fieldKey, value);
  };

  const hasApplicationFormError = (fieldKey: string): boolean =>
    hasEmptyValue(getFieldValue(fieldKey));

  const activeNonNegotiableFields = NON_NEGOTIABLE_FIELDS.filter((field) =>
    formData.non_negotiable.non_negotiable.some((item) => item.field === field.key),
  );

  const legacyCustomNonNegotiableFields =
    formData.non_negotiable.non_negotiable.filter(
      (item) => !NON_NEGOTIABLE_FIELDS.some((field) => field.key === item.field),
    );

  const questionnaireNonNegotiableFields: QuestionnaireNonNegotiableEntry[] =
    formData.questionnaire.sections.flatMap((section) => {
      const sectionKey =
        (section as { id?: number; tempId?: string }).id ??
        (section as { id?: number; tempId?: string }).tempId;

      if (sectionKey === undefined) {
        return [];
      }

      return section.questionnaires
        .filter((question) => question.is_non_negotiable)
        .map((question) => {
          const questionKey =
            (question as { id?: number; tempId?: string }).id ??
            (question as { id?: number; tempId?: string }).tempId;

          if (questionKey === undefined) {
            return null;
          }

          return {
            sectionKey,
            sectionName: section.name,
            questionKey,
            questionText: question.question,
            questionType: question.question_type,
            options: normalizeQuestionOptions(question.options),
            value: question.non_negotiable_value,
          };
        })
        .filter(
          (
            item,
          ): item is QuestionnaireNonNegotiableEntry =>
            item !== null,
        );
    });

  const hasQuestionnaireError = (
    entry: QuestionnaireNonNegotiableEntry,
  ): boolean => hasEmptyValue(entry.value);

  const handleQuestionnaireCheckboxOptionChange = (
    entry: QuestionnaireNonNegotiableEntry,
    optionValue: string,
    checked: boolean,
  ) => {
    const currentValues = Array.isArray(entry.value) ? entry.value : [];

    const updatedValues = checked
      ? Array.from(new Set([...currentValues, optionValue]))
      : currentValues.filter((item) => item !== optionValue);

    setQuestionnaireNonNegotiableValue(
      entry.sectionKey,
      entry.questionKey,
      updatedValues,
    );
  };

  const hasNoConfiguredFields =
    activeNonNegotiableFields.length === 0 &&
    questionnaireNonNegotiableFields.length === 0 &&
    legacyCustomNonNegotiableFields.length === 0;

  const hasQuestionnaireValidationError = Boolean(validationError?.questionnaire);

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl! w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Non-Negotiable Requirements</DialogTitle>
          <DialogDescription>
            Configure required values for application form fields and questionnaire
            items marked as non-negotiable.
          </DialogDescription>
        </DialogHeader>

        {validationError?.non_negotiable && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 flex items-start gap-3 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Validation Error</p>
              <p className="text-sm">
                {Array.isArray(validationError.non_negotiable)
                  ? validationError.non_negotiable[0]
                  : typeof validationError.non_negotiable === "string"
                    ? validationError.non_negotiable
                    : "Please fill in all application-form non-negotiable fields"}
              </p>
            </div>
          </div>
        )}

        {validationError?.questionnaire && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 flex items-start gap-3 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Questionnaire Validation Error</p>
              <p className="text-sm">
                {Array.isArray(validationError.questionnaire)
                  ? validationError.questionnaire[0]
                  : typeof validationError.questionnaire === "string"
                    ? validationError.questionnaire
                    : "Please fill in all questionnaire non-negotiable values"}
              </p>
            </div>
          </div>
        )}

        {hasNoConfiguredFields ? (
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
              if (
                field.type === "radio" &&
                fieldKey === "willing_to_work_onsite"
              ) {
                if (fieldValue === "true") fieldValue = true;
                if (fieldValue === "false") fieldValue = false;
              }
              const hasError = hasApplicationFormError(fieldKey);
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
                      {fieldValue === "other" && (
                        <Input
                          className="w-full"
                          placeholder="Please specify"
                          value={String(getOtherValue(fieldKey) ?? "")}
                          onChange={(e) =>
                            handleFieldChange(
                              `${fieldKey}_other`,
                              e.target.value,
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

            {questionnaireNonNegotiableFields.map((entry) => {
              const hasError = hasQuestionnaireError(entry);
              const selectedCheckboxValues = Array.isArray(entry.value)
                ? entry.value
                : [];

              return (
                <FieldGroup
                  key={`questionnaire-${entry.sectionKey}-${entry.questionKey}`}
                  className={`border gap-4 rounded-lg p-4 relative ${
                    hasError && hasQuestionnaireValidationError
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
                >
                  <div>
                    <span className="text-xs text-blue-600 font-medium">
                      Questionnaire - {entry.sectionName}
                    </span>
                    <h4 className="text-sm font-medium text-gray-800">
                      {entry.questionText}
                      {hasError && hasQuestionnaireValidationError && (
                        <span className="ml-2 text-xs text-red-600 font-semibold">
                          * Required
                        </span>
                      )}
                    </h4>
                  </div>

                  {entry.questionType === "paragraph" && (
                    <Input
                      type="text"
                      placeholder="Enter required answer"
                      value={String(entry.value ?? "")}
                      onChange={(event) =>
                        setQuestionnaireNonNegotiableValue(
                          entry.sectionKey,
                          entry.questionKey,
                          event.target.value,
                        )
                      }
                    />
                  )}

                  {entry.questionType === "multiple_choices" && (
                    <Select
                      value={
                        typeof entry.value === "string" ? entry.value : ""
                      }
                      onValueChange={(value: string) =>
                        setQuestionnaireNonNegotiableValue(
                          entry.sectionKey,
                          entry.questionKey,
                          value,
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select required option" />
                      </SelectTrigger>
                      <SelectContent>
                        {entry.options.map((optionValue) => (
                          <SelectItem value={optionValue} key={optionValue}>
                            {optionValue}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {entry.questionType === "checkboxes" && (
                    <div className="space-y-2">
                      {entry.options.map((optionValue) => (
                        <div key={optionValue} className="flex items-center gap-2">
                          <Checkbox
                            id={`questionnaire-nn-${entry.questionKey}-${optionValue}`}
                            checked={selectedCheckboxValues.includes(optionValue)}
                            onCheckedChange={(checked) =>
                              handleQuestionnaireCheckboxOptionChange(
                                entry,
                                optionValue,
                                Boolean(checked),
                              )
                            }
                          />
                          <label
                            htmlFor={`questionnaire-nn-${entry.questionKey}-${optionValue}`}
                            className="text-sm cursor-pointer text-gray-700"
                          >
                            {optionValue}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldGroup>
              );
            })}

            {legacyCustomNonNegotiableFields.length > 0 && (
              <FieldGroup className="border gap-3 rounded-lg p-4 bg-amber-50 border-amber-200">
                <div>
                  <span className="text-xs text-amber-700 font-semibold">
                    Legacy Custom Non-Negotiables
                  </span>
                  <p className="text-sm text-amber-800">
                    These entries were saved in the old flow and are shown for
                    reference.
                  </p>
                </div>
                <div className="space-y-2">
                  {legacyCustomNonNegotiableFields.map((item, index) => (
                    <div
                      key={`${item.field}-${index}`}
                      className="text-sm text-amber-900"
                    >
                      <span className="font-semibold">{item.field}:</span>{" "}
                      {Array.isArray(item.value)
                        ? item.value.join(", ")
                        : String(item.value ?? "")}
                    </div>
                  ))}
                </div>
              </FieldGroup>
            )}
          </div>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 flex items-start gap-3 rounded-md">
          <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Important Note:</p>
            <p className="text-sm">
              Custom non-negotiables are now managed from Questionnaire. Use this
              modal to set required values for selected application form fields and
              questionnaire non-negotiable items.
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
            onClick={onContinue}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
