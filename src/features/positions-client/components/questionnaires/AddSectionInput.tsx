// import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import type { Section } from "../../types/questionnaire.types";
import { useState } from "react";

interface AddSectionInputProps {
  addSection: (section: Section) => void;
  setShowAddSectionInput: (show: boolean) => void;
}

export function AddSectionInput({
  addSection,
  setShowAddSectionInput,
}: AddSectionInputProps) {
  const [section, setSection] = useState<Omit<Section, "id" | "tempId">>({
    name: "",
    questionnaires: [],
  });

  function handleSectionChange(field: keyof Section, value: string) {
    setSection((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function addNewSection() {
    addSection({ ...section, tempId: `tmp-${Date.now()}` });
    setSection({ name: "", questionnaires: [] });
    setShowAddSectionInput(false);
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row md:items-center gap-3">
      <input
        type="text"
        value={section?.name}
        onChange={(e) => handleSectionChange("name", e.target.value)}
        placeholder="Section name"
        className="flex-1 p-2 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md px-6 py-2"
          onClick={addNewSection}
        >
          Add
        </Button>
        <Button
          type="button"
          variant="outline"
          className="text-gray-700 text-sm font-medium rounded-md px-4 py-2"
          onClick={() => setShowAddSectionInput(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

AddSectionInput.displayName = "AddSectionInput";
