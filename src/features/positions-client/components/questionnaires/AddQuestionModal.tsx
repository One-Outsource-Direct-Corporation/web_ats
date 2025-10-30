import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import { QuestionForm } from "./QuestionForm";
import type { QuestionOption } from "../../types/questionnaire.types";

interface AddQuestionModalProps {
  isOpen: boolean;
  isEditMode?: boolean;
  questionText: string;
  questionDesc: string;
  questionType: string;
  questionMode: string;
  parameterValue: string;
  options: QuestionOption[];
  onClose: () => void;
  onQuestionTextChange: (value: string) => void;
  onQuestionDescChange: (value: string) => void;
  onQuestionTypeChange: (value: string) => void;
  onQuestionModeChange: (value: string) => void;
  onParameterValueChange: (value: string) => void;
  onOptionChange: (
    idx: number,
    field: "value" | "score",
    value: string | number
  ) => void;
  onAddOption: () => void;
  onRemoveOption: (idx: number) => void;
  onAddQuestion: () => void;
}

export const AddQuestionModal = memo(
  ({
    isOpen,
    isEditMode = false,
    questionText,
    questionDesc,
    questionType,
    questionMode,
    parameterValue,
    options,
    onClose,
    onQuestionTextChange,
    onQuestionDescChange,
    onQuestionTypeChange,
    onQuestionModeChange,
    onParameterValueChange,
    onOptionChange,
    onAddOption,
    onRemoveOption,
    onAddQuestion,
  }: AddQuestionModalProps) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl h-[80vh] mx-4 flex flex-col">
          <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Question" : "Add Question"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <QuestionForm
              questionText={questionText}
              questionDesc={questionDesc}
              questionType={questionType}
              questionMode={questionMode}
              parameterValue={parameterValue}
              options={options}
              onQuestionTextChange={onQuestionTextChange}
              onQuestionDescChange={onQuestionDescChange}
              onQuestionTypeChange={onQuestionTypeChange}
              onQuestionModeChange={onQuestionModeChange}
              onParameterValueChange={onParameterValueChange}
              onOptionChange={onOptionChange}
              onAddOption={onAddOption}
              onRemoveOption={onRemoveOption}
            />
          </div>
          <div className="p-6 border-t flex justify-end gap-3 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              className="px-6 py-2"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-md"
              onClick={onAddQuestion}
            >
              {isEditMode ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

AddQuestionModal.displayName = "AddQuestionModal";
