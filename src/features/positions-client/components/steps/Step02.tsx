import type { PositionFormData } from "@/features/positions-client/types/create_position.types";
import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";
import { Card } from "@/shared/components/ui/card";
import type { ValidationError } from "../../utils/validateSteps";

interface Step02Props {
  formData: PositionFormData;
  handleInputChange: (
    field: keyof PositionFormData["job_posting"],
    content: string
  ) => void;
  error?: ValidationError | null;
}

export default function Step02({
  formData,
  handleInputChange,
  error,
}: Step02Props) {
  const jobPostingErrors = error?.job_posting as ValidationError | undefined;

  return (
    <Card className="p-6">
      <div className="space-y-2 ">
        {jobPostingErrors?.description &&
          Array.isArray(jobPostingErrors.description) && (
            <p className="text-sm text-red-500">
              {jobPostingErrors.description[0]}
            </p>
          )}
        <RichTextEditor
          title="Job Description"
          value={formData.job_posting.description || ""}
          onChange={(content) => handleInputChange("description", content)}
          placeholder="Enter the job description here..."
        />
      </div>

      <div className="space-y-2 ">
        {jobPostingErrors?.responsibilities &&
          Array.isArray(jobPostingErrors.responsibilities) && (
            <p className="text-sm text-red-500">
              {jobPostingErrors.responsibilities[0]}
            </p>
          )}
        <RichTextEditor
          title="Responsibilities"
          value={formData.job_posting.responsibilities || ""}
          onChange={(content) => handleInputChange("responsibilities", content)}
          placeholder="Enter the responsibilities here..."
        />
      </div>

      <div className="space-y-2 ">
        {jobPostingErrors?.qualifications &&
          Array.isArray(jobPostingErrors.qualifications) && (
            <p className="text-sm text-red-500">
              {jobPostingErrors.qualifications[0]}
            </p>
          )}
        <RichTextEditor
          title="Qualifications"
          value={formData.job_posting.qualifications || ""}
          onChange={(content) => handleInputChange("qualifications", content)}
          placeholder="Enter the qualifications here..."
        />
      </div>
    </Card>
  );
}
