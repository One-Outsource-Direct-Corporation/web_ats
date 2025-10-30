import { memo } from "react";
import type { QuestionOption } from "../../types/questionnaire.types";

interface QuestionFormProps {
  questionText: string;
  questionDesc: string;
  questionType: string;
  questionMode: string;
  parameterValue: string;
  options: QuestionOption[];
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
}

export const QuestionForm = memo(
  ({
    questionText,
    questionDesc,
    questionType,
    questionMode,
    parameterValue,
    options,
    onQuestionTextChange,
    onQuestionDescChange,
    onQuestionTypeChange,
    onQuestionModeChange,
    onParameterValueChange,
    onOptionChange,
    onAddOption,
    onRemoveOption,
  }: QuestionFormProps) => {
    return (
      <>
        <div className="mb-4">
          <label className="block text-base font-medium text-gray-800 mb-2">
            Question
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => onQuestionTextChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter question"
          />
        </div>
        <div className="mb-4">
          <label className="block text-base font-medium text-gray-800 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={questionDesc}
            onChange={(e) => onQuestionDescChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter description"
            rows={2}
          />
        </div>
        <div className="mb-4">
          <label className="block text-base font-medium text-gray-800 mb-2">
            Question Type
          </label>
          <select
            value={questionType}
            onChange={(e) => onQuestionTypeChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-base"
          >
            <option>Multiple Choice</option>
            <option>Checkboxes</option>
            <option>Text Entry</option>
            <option>Paragraph</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-base font-medium text-gray-800 mb-2">
            Mode
          </label>
          <select
            value={questionMode}
            onChange={(e) => onQuestionModeChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-base"
          >
            <option>Parameter</option>
          </select>
        </div>
        {(questionType === "Multiple Choice" ||
          questionType === "Checkboxes") && (
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-800 mb-2">
              Options
            </label>
            <div className="grid grid-cols-1 gap-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={opt.value}
                    onChange={(e) =>
                      onOptionChange(idx, "value", e.target.value)
                    }
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Option Value"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="px-2 py-1 border rounded text-xs"
                      onClick={() =>
                        onOptionChange(idx, "score", (opt.score || 0) + 1)
                      }
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 border rounded text-xs"
                      onClick={() =>
                        onOptionChange(idx, "score", (opt.score || 0) - 1)
                      }
                    >
                      -1
                    </button>
                  </div>
                  <input
                    type="number"
                    value={opt.score}
                    onChange={(e) =>
                      onOptionChange(idx, "score", Number(e.target.value))
                    }
                    className="w-16 p-2 border border-gray-300 rounded-md"
                    placeholder="Score"
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 p-1"
                    onClick={() => onRemoveOption(idx)}
                    aria-label="Remove Option"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 px-4 py-2 border rounded-md"
              onClick={onAddOption}
            >
              Add Option
            </button>
          </div>
        )}
        {(questionType === "Text Entry" || questionType === "Paragraph") && (
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-800 mb-2">
              Parameter Value
            </label>
            <input
              type={questionType === "Paragraph" ? "textarea" : "text"}
              value={parameterValue}
              onChange={(e) => onParameterValueChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-base"
              placeholder={
                questionType === "Paragraph"
                  ? "Enter parameter value (e.g., essay, long answer)"
                  : "Enter parameter value"
              }
            />
          </div>
        )}
      </>
    );
  }
);

QuestionForm.displayName = "QuestionForm";
