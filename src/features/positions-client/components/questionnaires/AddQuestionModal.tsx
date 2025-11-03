import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import { QuestionForm } from "./QuestionForm";
import type { QuestionOption } from "../../types/questionnaire.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";

interface AddQuestionModalProps {
  isOpen: boolean;
  isEditMode?: boolean;
  questionText: string;
  questionDesc: string;
  questionType: string;
  parameterValue: string;
  options: QuestionOption[];
  onClose: () => void;
  onQuestionTextChange: (value: string) => void;
  onQuestionDescChange: (value: string) => void;
  onQuestionTypeChange: (value: string) => void;
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
    parameterValue,
    options,
    onClose,
    onQuestionTextChange,
    onQuestionDescChange,
    onQuestionTypeChange,
    onParameterValueChange,
    onOptionChange,
    onAddOption,
    onRemoveOption,
    onAddQuestion,
  }: AddQuestionModalProps) => {
    if (!isOpen) return null;

    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="!max-w-3xl w-full h-[90vh] mx-4 flex flex-col p-0">
          <DialogHeader className="p-6 border-b flex-shrink-0">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-6">
            <QuestionForm
              questionText={questionText}
              questionDesc={questionDesc}
              questionType={questionType}
              parameterValue={parameterValue}
              options={options}
              onQuestionTextChange={onQuestionTextChange}
              onQuestionDescChange={onQuestionDescChange}
              onQuestionTypeChange={onQuestionTypeChange}
              onParameterValueChange={onParameterValueChange}
              onOptionChange={onOptionChange}
              onAddOption={onAddOption}
              onRemoveOption={onRemoveOption}
            />
          </div>

          <DialogFooter className="p-6 border-t flex justify-end gap-3 flex-shrink-0">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

AddQuestionModal.displayName = "AddQuestionModal";
