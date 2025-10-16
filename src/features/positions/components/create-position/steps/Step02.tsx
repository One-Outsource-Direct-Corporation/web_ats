import type { CreatePositionFormData } from "@/features/positions/types/createPosition";
import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";
import { Card } from "@/shared/components/ui/card";

interface Step02Props {
  formData: CreatePositionFormData;
  handleInputChange: (
    field: keyof CreatePositionFormData,
    content: string
  ) => void;
  error?: any;
}

export default function Step02({
  formData,
  handleInputChange,
  error,
}: Step02Props) {
  return (
    <Card className="p-6">
      <div className="space-y-2 ">
        {error?.job_posting?.description && (
          <p className="text-sm text-red-500">
            {error.job_posting.description[0]}
          </p>
        )}
        <RichTextEditor
          title="Job Description"
          value={formData.description || ""}
          onChange={(content) => handleInputChange("description", content)}
          placeholder="Enter the job description here..."
        />
      </div>

      <div className="space-y-2 ">
        {error?.job_posting?.responsibilities && (
          <p className="text-sm text-red-500">
            {error.job_posting.responsibilities[0]}
          </p>
        )}
        <RichTextEditor
          title="Responsibilities"
          value={formData.responsibilities || ""}
          onChange={(content) => handleInputChange("responsibilities", content)}
          placeholder="Enter the responsibilities here..."
        />
      </div>

      <div className="space-y-2 ">
        {error?.job_posting?.qualifications && (
          <p className="text-sm text-red-500">
            {error.job_posting.qualifications[0]}
          </p>
        )}
        <RichTextEditor
          title="Qualifications"
          value={formData.qualifications || ""}
          onChange={(content) => handleInputChange("qualifications", content)}
          placeholder="Enter the qualifications here..."
        />
      </div>
    </Card>
  );
}
