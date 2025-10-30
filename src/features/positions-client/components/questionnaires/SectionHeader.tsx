import { memo } from "react";
import { Button } from "@/shared/components/ui/button";

interface SectionHeaderProps {
  sectionName: string;
  isEditing: boolean;
  editValue: string;
  onEditChange: (value: string) => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onAddQuestion: () => void;
  onDelete: () => void;
}

export const SectionHeader = memo(
  ({
    sectionName,
    isEditing,
    editValue,
    onEditChange,
    onEdit,
    onSaveEdit,
    onCancelEdit,
    onAddQuestion,
    onDelete,
  }: SectionHeaderProps) => {
    return (
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200">
        {isEditing ? (
          <div className="flex-1 flex gap-2 items-center">
            <input
              type="text"
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-4 py-2"
              onClick={onSaveEdit}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-gray-700 text-sm font-medium rounded-md px-4 py-2"
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <span className="text-base font-medium text-gray-900 mb-2 md:mb-0">
              {sectionName}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-4 py-2"
                onClick={onEdit}
              >
                Edit
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-4 py-2"
                onClick={onAddQuestion}
              >
                + Add Question
              </Button>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 p-2"
                onClick={onDelete}
                aria-label="Delete Section"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";
