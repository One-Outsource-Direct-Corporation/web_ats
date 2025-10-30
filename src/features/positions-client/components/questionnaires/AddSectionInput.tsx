import { memo } from "react";
import { Button } from "@/shared/components/ui/button";

interface AddSectionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export const AddSectionInput = memo(
  ({ value, onChange, onAdd, onCancel }: AddSectionInputProps) => {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Section name"
          className="flex-1 p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-6 py-2"
            onClick={onAdd}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-gray-700 text-sm font-medium rounded-md px-4 py-2"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
);

AddSectionInput.displayName = "AddSectionInput";
