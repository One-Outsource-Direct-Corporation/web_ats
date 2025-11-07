import { useState, useEffect } from "react";
import type {
  QuestionOption,
  Questionnaire,
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
import { PlusCircle, Trash2 } from "lucide-react";
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

interface AddQuestionModalProps {
  question?: Questionnaire;
  onSave: (question: Questionnaire) => void;
  onDelete?: (question: Questionnaire) => void;
}

type QuestionForm = {
  name: string;
  description: string;
  type: "Multiple Choice" | "Checkboxes" | "Text Entry" | "Paragraph";
  parameter: string;
  options: QuestionOption[];
};

const defaultForm: QuestionForm = {
  name: "",
  description: "",
  type: "Multiple Choice",
  parameter: "",
  options: [{ value: "", score: 0 }],
};

export function AddQuestionModal({
  question,
  onSave,
  onDelete,
}: AddQuestionModalProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [questionForm, setQuestionForm] = useState<QuestionForm>(defaultForm);
  const isEdit = !!question;

  useEffect(() => {
    if (question) {
      setQuestionForm({
        name: question.name,
        description: question.description || "",
        type: question.type,
        parameter: question.parameter || "",
        options: question.options || [{ value: "", score: 0 }],
      });
    }
  }, [question]);

  const handleFormChange = (
    field: keyof QuestionForm,
    value: string | QuestionOption[]
  ) => {
    setQuestionForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionChange = (
    idx: number,
    field: "value" | "score",
    value: string | number
  ) => {
    const newOptions = [...questionForm.options];
    if (field === "value") {
      newOptions[idx].value = value as string;
    } else {
      newOptions[idx].score = value as number;
    }
    handleFormChange("options", newOptions);
  };

  const handleAddOption = () => {
    handleFormChange("options", [
      ...questionForm.options,
      { value: "", score: 0 },
    ]);
  };

  const handleRemoveOption = (idx: number) => {
    if (questionForm.options.length > 1) {
      handleFormChange(
        "options",
        questionForm.options.filter((_, i) => i !== idx)
      );
    }
  };

  const handleReset = () => {
    setQuestionForm(defaultForm);
  };

  const handleSave = () => {
    if (!questionForm.name.trim()) {
      alert("Please enter a question name");
      return;
    }

    const savedQuestion: Questionnaire = {
      ...(isEdit && question ? question : { tempId: `temp-${Date.now()}` }),
      name: questionForm.name,
      description: questionForm.description || undefined,
      type: questionForm.type,
      options:
        questionForm.type === "Multiple Choice" ||
        questionForm.type === "Checkboxes"
          ? questionForm.options.filter((opt) => opt.value.trim() !== "")
          : undefined,
      parameter:
        questionForm.type === "Text Entry" || questionForm.type === "Paragraph"
          ? questionForm.parameter
          : undefined,
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
          <PlusCircle className="w-4 h-4" />
          {isEdit ? "Edit" : "Add Question"}
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
              value={questionForm.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
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
              value={questionForm.type}
              onValueChange={(
                value:
                  | "Multiple Choice"
                  | "Checkboxes"
                  | "Text Entry"
                  | "Paragraph"
              ) => handleFormChange("type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                <SelectItem value="Checkboxes">Checkboxes</SelectItem>
                <SelectItem value="Text Entry">Text Entry</SelectItem>
                <SelectItem value="Paragraph">Paragraph</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {(questionForm.type === "Multiple Choice" ||
            questionForm.type === "Checkboxes") && (
            <FieldGroup>
              <FieldLabel>Options</FieldLabel>
              <FieldGroup className="grid grid-cols-1 gap-2">
                {questionForm.options.map((opt, idx) => (
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
          {(questionForm.type === "Text Entry" ||
            questionForm.type === "Paragraph") && (
            <Field>
              <FieldLabel className="block text-base font-medium text-gray-800">
                Parameter Value
              </FieldLabel>
              <Input
                type="text"
                value={questionForm.parameter}
                onChange={(e) => handleFormChange("parameter", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-base"
                placeholder={
                  questionForm.type === "Paragraph"
                    ? "Enter parameter value (e.g., essay, long answer)"
                    : "Enter parameter value"
                }
              />
            </Field>
          )}
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
