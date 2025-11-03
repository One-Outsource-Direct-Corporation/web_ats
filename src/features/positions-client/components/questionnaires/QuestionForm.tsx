import { memo } from "react";
import type { QuestionOption } from "../../types/questionnaire.types";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import { Trash2 } from "lucide-react";
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
interface QuestionFormProps {
  questionText: string;
  questionDesc: string;
  questionType: string;
  parameterValue: string;
  options: QuestionOption[];
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
}

export const QuestionForm = memo(
  ({
    questionText,
    questionDesc,
    questionType,
    parameterValue,
    options,
    onQuestionTextChange,
    onQuestionDescChange,
    onQuestionTypeChange,
    onParameterValueChange,
    onOptionChange,
    onAddOption,
    onRemoveOption,
  }: QuestionFormProps) => {
    return (
      <FieldSet>
        <Field>
          <FieldLabel className="block text-base font-medium text-gray-800">
            Question
          </FieldLabel>
          <Input
            type="text"
            value={questionText}
            onChange={(e) => onQuestionTextChange(e.target.value)}
            className="w-full p-3"
            placeholder="Enter question"
          />
        </Field>
        <Field>
          <FieldLabel className="block text-base font-medium text-gray-800">
            Description (Optional)
          </FieldLabel>
          <Textarea
            value={questionDesc}
            onChange={(e) => onQuestionDescChange(e.target.value)}
            className="w-full p-3"
            placeholder="Enter description"
            rows={2}
          />
        </Field>
        <Field>
          <FieldLabel>Question Type</FieldLabel>
          <Select
            value={questionType}
            onValueChange={(value) => onQuestionTypeChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="checkboxes">Checkboxes</SelectItem>
              <SelectItem value="text_entry">Text Entry</SelectItem>
              <SelectItem value="paragraph">Paragraph</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {(questionType === "multiple_choice" ||
          questionType === "checkboxes") && (
          <FieldGroup>
            <FieldLabel>Options</FieldLabel>
            <FieldGroup className="grid grid-cols-1 gap-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    type="text"
                    value={opt.value}
                    onChange={(e) =>
                      onOptionChange(idx, "value", e.target.value)
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
                        onOptionChange(idx, "score", (opt.score || 0) + 1)
                      }
                    >
                      +1
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      className="px-2 py-1 border rounded text-xs"
                      onClick={() =>
                        onOptionChange(idx, "score", (opt.score || 0) - 1)
                      }
                    >
                      -1
                    </Button>
                  </div>
                  <Input
                    type="number"
                    value={opt.score}
                    onChange={(e) =>
                      onOptionChange(idx, "score", Number(e.target.value))
                    }
                    min={-1}
                    className="w-16 p-2 border border-gray-300 rounded-md"
                    placeholder="Score"
                  />
                  <Button
                    variant="ghost"
                    type="button"
                    className="text-red-500 hover:text-red-700 p-1"
                    onClick={() => onRemoveOption(idx)}
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
              onClick={onAddOption}
            >
              Add Option
            </Button>
          </FieldGroup>
        )}
        {(questionType === "text_entry" || questionType === "paragraph") && (
          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">
              Parameter Value
            </label>
            <input
              type={questionType === "paragraph" ? "textarea" : "text"}
              value={parameterValue}
              onChange={(e) => onParameterValueChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-base"
              placeholder={
                questionType === "paragraph"
                  ? "Enter parameter value (e.g., essay, long answer)"
                  : "Enter parameter value"
              }
            />
          </div>
        )}
      </FieldSet>
    );
  }
);

QuestionForm.displayName = "QuestionForm";
