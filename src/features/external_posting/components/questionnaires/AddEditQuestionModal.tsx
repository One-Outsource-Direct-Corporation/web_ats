import { useState, useEffect } from "react";
import type {
  QuestionOption,
  QuestionnaireBase,
  Questionnaire,
  QuestionType,
} from "../../types/questionnaire.types";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { PlusCircle, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface AddEditQuestionModalProps {
  question?: Questionnaire;
  onSave: (question: Questionnaire) => void;
  onDelete?: (question: Questionnaire) => void;
}

const defaultForm: QuestionnaireBase = {
  question: "",
  description: "",
  question_type: "multiple_choices",
  parameter: undefined,
  options: [{ value: "", score: 0 }],
  is_non_negotiable: false,
  non_negotiable_value: null,
};

const isEmptyNonNegotiableValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return value === "" || value === null || value === undefined;
};

const getQuestionOptionValues = (options?: QuestionOption[]): string[] =>
  (options ?? [])
    .map((opt) => opt.value.trim())
    .filter((opt) => opt.length > 0);

export function AddEditQuestionModal({
  question,
  onSave,
  onDelete,
}: AddEditQuestionModalProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [questionForm, setQuestionForm] =
    useState<QuestionnaireBase>(defaultForm);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );
  const isEdit = !!question;

  useEffect(() => {
    if (question) {
      setQuestionForm({
        question: question.question,
        description: question.description || "",
        question_type: question.question_type,
        parameter: question.parameter,
        options: question.options ?? [{ value: "", score: 0 }],
        is_non_negotiable: Boolean(question.is_non_negotiable),
        non_negotiable_value: question.non_negotiable_value ?? null,
      });
    } else {
      setQuestionForm(defaultForm);
    }
  }, [question]);

  const handleFormChange = (
    field: keyof QuestionnaireBase,
    value: string | QuestionOption[],
  ) => {
    if (field === "question_type") {
      const nextQuestionType = value as QuestionType;
      setQuestionForm((prev) => ({
        ...prev,
        question_type: nextQuestionType,
        // Reset options if switching to a type that needs them
        options:
          nextQuestionType === "multiple_choices" ||
          nextQuestionType === "checkboxes"
            ? prev.options && prev.options.length > 0
              ? prev.options
              : [{ value: "", score: 0 }]
            : undefined,
        // Reset parameter if switching to paragraph
        parameter: nextQuestionType === "paragraph" ? prev.parameter : undefined,
        non_negotiable_value: prev.is_non_negotiable
          ? nextQuestionType === "checkboxes"
            ? Array.isArray(prev.non_negotiable_value)
              ? prev.non_negotiable_value
              : []
            : Array.isArray(prev.non_negotiable_value)
              ? ""
              : prev.non_negotiable_value
          : prev.non_negotiable_value,
      }));
      setValidationMessage(null);
    } else {
      setQuestionForm((prev) => ({
        ...prev,
        [field]: value,
      }));
      setValidationMessage(null);
    }
  };

  const handleNonNegotiableToggle = (checked: boolean) => {
    setQuestionForm((prev) => ({
      ...prev,
      is_non_negotiable: checked,
      non_negotiable_value: checked
        ? prev.question_type === "checkboxes"
          ? Array.isArray(prev.non_negotiable_value)
            ? prev.non_negotiable_value
            : []
          : Array.isArray(prev.non_negotiable_value)
            ? ""
            : (prev.non_negotiable_value ?? "")
        : null,
    }));
    setValidationMessage(null);
  };

  const handleNonNegotiableValueChange = (
    value: string | number | boolean | string[] | null,
  ) => {
    setQuestionForm((prev) => ({
      ...prev,
      non_negotiable_value: value,
    }));
    setValidationMessage(null);
  };

  const handleNonNegotiableCheckboxOption = (
    optionValue: string,
    checked: boolean,
  ) => {
    const currentValues = Array.isArray(questionForm.non_negotiable_value)
      ? questionForm.non_negotiable_value
      : [];

    const nextValues = checked
      ? Array.from(new Set([...currentValues, optionValue]))
      : currentValues.filter((item) => item !== optionValue);

    handleNonNegotiableValueChange(nextValues);
  };

  const handleOptionChange = (
    idx: number,
    field: "value" | "score",
    value: string | number,
  ) => {
    const newOptions = [...(questionForm?.options || [])];
    if (field === "value") {
      newOptions[idx].value = value as string;
    } else {
      newOptions[idx].score = value as number;
    }
    handleFormChange("options", newOptions);
  };

  const handleAddOption = () => {
    handleFormChange("options", [
      ...(questionForm?.options || []),
      { value: "", score: 0 },
    ]);
  };

  const handleRemoveOption = (idx: number) => {
    if ((questionForm?.options || []).length > 1) {
      handleFormChange(
        "options",
        (questionForm?.options || []).filter((_, i) => i !== idx),
      );
    }
  };

  const handleReset = () => {
    setQuestionForm(defaultForm);
    setValidationMessage(null);
  };

  const handleSave = () => {
    if (!questionForm.question.trim()) {
      return;
    }

    if (
      questionForm.is_non_negotiable &&
      isEmptyNonNegotiableValue(questionForm.non_negotiable_value)
    ) {
      setValidationMessage("Please set the required non-negotiable value.");
      return;
    }

    const savedQuestion: Questionnaire = {
      ...(isEdit && question ? question : { tempId: `temp-${Date.now()}` }),
      question: questionForm.question,
      description: questionForm.description || undefined,
      question_type: questionForm.question_type,
      options:
        questionForm.question_type === "multiple_choices" ||
        questionForm.question_type === "checkboxes"
          ? questionForm.options?.filter((opt) => opt.value.trim() !== "")
          : undefined,
      parameter:
        questionForm.question_type === "paragraph"
          ? questionForm.parameter
          : undefined,
      is_non_negotiable: Boolean(questionForm.is_non_negotiable),
      non_negotiable_value: questionForm.is_non_negotiable
        ? (questionForm.non_negotiable_value ?? null)
        : null,
    };

    onSave(savedQuestion);
    handleReset();
    setShowDialog(false);
  };

  const handleDelete = () => {
    if (question && onDelete) {
      if (confirm("Are you sure you want to delete this question?")) {
        onDelete(question);
        setShowDialog(false);
      }
    }
  };
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className="p-2 text-blue-600 hover:text-blue-800"
        >
          {isEdit ? (
            <SquarePen className="w-4 h-4" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}
          {isEdit ? "" : "Add Question"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl! w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Question" : "Add Question"}
          </DialogTitle>
        </DialogHeader>
        <FieldSet>
          <Field>
            <FieldLabel className="block text-base font-medium text-gray-800">
              Question
            </FieldLabel>
            <Input
              type="text"
              value={questionForm.question}
              onChange={(e) => handleFormChange("question", e.target.value)}
              className="w-full p-3"
              placeholder="Enter question"
            />
          </Field>
          <Field>
            <FieldLabel className="block text-base font-medium text-gray-800">
              Description (Optional)
            </FieldLabel>
            <Textarea
              value={questionForm.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              className="w-full p-3"
              placeholder="Enter description"
              rows={2}
            />
          </Field>
          <Field>
            <FieldLabel>Question Type</FieldLabel>
            <Select
              value={questionForm.question_type}
              onValueChange={(value: QuestionType) =>
                handleFormChange("question_type", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choices">
                  Multiple Choice
                </SelectItem>
                <SelectItem value="checkboxes">Checkboxes</SelectItem>
                <SelectItem value="paragraph">Paragraph</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {(questionForm.question_type === "multiple_choices" ||
            questionForm.question_type === "checkboxes") && (
            <FieldGroup>
              <FieldLabel>Options</FieldLabel>
              <FieldGroup className="grid grid-cols-1 gap-2">
                {questionForm.options?.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      type="text"
                      value={opt.value}
                      onChange={(e) =>
                        handleOptionChange(idx, "value", e.target.value)
                      }
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      placeholder="Option Value"
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        type="button"
                        className="px-2 py-1 border rounded text-xs"
                        onClick={() =>
                          handleOptionChange(idx, "score", (opt.score || 0) + 1)
                        }
                      >
                        +1
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        className="px-2 py-1 border rounded text-xs"
                        onClick={() =>
                          handleOptionChange(idx, "score", (opt.score || 0) - 1)
                        }
                      >
                        -1
                      </Button>
                    </div>
                    <Input
                      type="number"
                      value={opt.score}
                      onChange={(e) =>
                        handleOptionChange(idx, "score", Number(e.target.value))
                      }
                      min={-1}
                      className="w-16 p-2 border border-gray-300 rounded-md"
                      placeholder="Score"
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      className="text-red-500 hover:text-red-700 p-1"
                      onClick={() => handleRemoveOption(idx)}
                      aria-label="Remove Option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </FieldGroup>
              <Button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleAddOption}
              >
                Add Option
              </Button>
            </FieldGroup>
          )}
          {questionForm.question_type === "paragraph" && (
            <Field>
              <FieldLabel className="block text-base font-medium text-gray-800">
                Parameter Value
              </FieldLabel>
              <Input
                type="text"
                value={questionForm.parameter ?? ""}
                onChange={(e) => handleFormChange("parameter", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-base"
                placeholder="Enter parameter value (e.g., essay, long answer)"
              />
            </Field>
          )}
          <FieldGroup className="rounded-md border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="non-negotiable-question"
                checked={Boolean(questionForm.is_non_negotiable)}
                onCheckedChange={(checked) =>
                  handleNonNegotiableToggle(Boolean(checked))
                }
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
              />
              <FieldLabel
                htmlFor="non-negotiable-question"
                className="cursor-pointer"
              >
                Mark this question as non-negotiable
              </FieldLabel>
            </div>

            {questionForm.is_non_negotiable && (
              <div className="mt-3 space-y-2">
                <FieldLabel className="block text-sm font-medium text-gray-800">
                  Required Value
                </FieldLabel>

                {questionForm.question_type === "paragraph" && (
                  <Input
                    type="text"
                    value={String(questionForm.non_negotiable_value ?? "")}
                    onChange={(event) =>
                      handleNonNegotiableValueChange(event.target.value)
                    }
                    className="w-full"
                    placeholder="Enter required answer"
                  />
                )}

                {questionForm.question_type === "multiple_choices" && (
                  <Select
                    value={
                      typeof questionForm.non_negotiable_value === "string"
                        ? questionForm.non_negotiable_value
                        : ""
                    }
                    onValueChange={(value) =>
                      handleNonNegotiableValueChange(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select required option" />
                    </SelectTrigger>
                    <SelectContent>
                      {getQuestionOptionValues(questionForm.options).map(
                        (optionValue) => (
                          <SelectItem value={optionValue} key={optionValue}>
                            {optionValue}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )}

                {questionForm.question_type === "checkboxes" && (
                  <div className="space-y-2">
                    {getQuestionOptionValues(questionForm.options).map(
                      (optionValue) => {
                        const selectedValues = Array.isArray(
                          questionForm.non_negotiable_value,
                        )
                          ? questionForm.non_negotiable_value
                          : [];

                        return (
                          <div
                            key={optionValue}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`non-negotiable-checkbox-${optionValue}`}
                              checked={selectedValues.includes(optionValue)}
                              onCheckedChange={(checked) =>
                                handleNonNegotiableCheckboxOption(
                                  optionValue,
                                  Boolean(checked),
                                )
                              }
                            />
                            <label
                              htmlFor={`non-negotiable-checkbox-${optionValue}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {optionValue}
                            </label>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}

                {validationMessage && (
                  <p className="text-sm text-red-600">{validationMessage}</p>
                )}
              </div>
            )}
          </FieldGroup>
        </FieldSet>
        <div className="flex gap-3 justify-end mt-4">
          {isEdit && onDelete && (
            <Button
              variant="outline"
              type="button"
              className="mr-auto text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              Delete Question
            </Button>
          )}
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              handleReset();
              setShowDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave}
          >
            {isEdit ? "Update Question" : "Save Question"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
