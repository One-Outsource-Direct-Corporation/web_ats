import type { CreatePositionFormData } from "@/features/positions/types/createPosition";
import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";
import { Card } from "@/shared/components/ui/card";

interface Step02Props {
  formData: CreatePositionFormData;
  handleInputChange: (
    field: keyof CreatePositionFormData,
    content: string
  ) => void;
}

export default function Step02({ formData, handleInputChange }: Step02Props) {
  return (
    <Card className="p-6">
      <RichTextEditor
        title="Job Description"
        value={formData.description || ""}
        onChange={(content) => handleInputChange("description", content)}
        placeholder="Enter the job description here..."
      />
      <RichTextEditor
        title="Responsibilities"
        value={formData.responsibilities || ""}
        onChange={(content) => handleInputChange("responsibilities", content)}
        placeholder="Enter the responsibilities here..."
      />
      <RichTextEditor
        title="Qualifications"
        value={formData.qualifications || ""}
        onChange={(content) => handleInputChange("qualifications", content)}
        placeholder="Enter the qualifications here..."
      />
    </Card>
  );
}
