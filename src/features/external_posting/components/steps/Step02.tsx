import type { PositionFormData } from "@/features/external_posting/types/externalPosting.types";
import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { X, Plus } from "lucide-react";
import type { ValidationError } from "../../utils/validateSteps";
import { useState } from "react";

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
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    
    const currentSkills = formData.job_posting.required_skills ?? [];
    if (currentSkills.includes(trimmed)) return;
    
    handleInputChange("required_skills", JSON.stringify([...currentSkills, trimmed]));
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = formData.job_posting.required_skills ?? [];
    handleInputChange("required_skills", JSON.stringify(currentSkills.filter(s => s !== skill)));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

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

      <div className="space-y-3 mt-6">
        <label className="text-sm font-medium text-gray-700">
          Required Skills <span className="text-red-500">*</span>
        </label>
        {jobPostingErrors?.required_skills &&
          Array.isArray(jobPostingErrors.required_skills) && (
            <p className="text-sm text-red-500">
              {jobPostingErrors.required_skills[0]}
            </p>
          )}
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter or click Add"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddSkill}
            disabled={!newSkill.trim()}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.job_posting.required_skills ?? []).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
