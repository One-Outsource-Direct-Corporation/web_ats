import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Field, FieldLabel, FieldGroup } from "@/shared/components/ui/field";
import type { PositionData } from "@/features/positions/types/positionTypes";

interface PositionEditFormProps {
  initialData: PositionData;
  onSave: (data: PositionData) => Promise<void>;
  saving: boolean;
}

export default function PositionEditForm({
  initialData,
  onSave,
  saving,
}: PositionEditFormProps) {
  const [formData, setFormData] = useState<PositionData>(initialData);
  const [isEdited, setIsEdited] = useState(false);

  const handleInputChange = (
    field: keyof PositionData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="job_title">Job Title *</FieldLabel>
          <Input
            id="job_title"
            value={formData.job_title}
            placeholder="Enter job title"
            onChange={(e) => handleInputChange("job_title", e.target.value)}
          />
        </Field>

        {/* Client */}
        <Field>
          <FieldLabel htmlFor="client">Client *</FieldLabel>
          <Input
            id="client"
            value={formData.client}
            placeholder="Enter client name"
            onChange={(e) => handleInputChange("client", e.target.value)}
          />
        </Field>

        {/* Department */}
        <Field>
          <FieldLabel htmlFor="department">Department *</FieldLabel>
          <Input
            id="department"
            value={formData.department}
            placeholder="Enter department"
            onChange={(e) => handleInputChange("department", e.target.value)}
          />
        </Field>

        {/* Number of Vacancies */}
        <Field>
          <FieldLabel htmlFor="number_of_vacancies">
            Number of Vacancies *
          </FieldLabel>
          <Input
            id="number_of_vacancies"
            type="number"
            value={formData.number_of_vacancies}
            placeholder="Enter number of vacancies"
            onChange={(e) =>
              handleInputChange("number_of_vacancies", parseInt(e.target.value))
            }
          />
        </Field>

        {/* Date Needed */}
        <Field>
          <FieldLabel htmlFor="date_needed">Date Needed *</FieldLabel>
          <Input
            id="date_needed"
            type="date"
            value={formData.date_needed}
            onChange={(e) => handleInputChange("date_needed", e.target.value)}
          />
        </Field>

        {/* Employment Type */}
        <Field>
          <FieldLabel htmlFor="employment_type">Employment Type *</FieldLabel>
          <Select
            value={formData.employment_type}
            onValueChange={(value) =>
              handleInputChange("employment_type", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Work Setup */}
        <Field>
          <FieldLabel htmlFor="work_setup">Work Setup *</FieldLabel>
          <Select
            value={formData.work_setup}
            onValueChange={(value) => handleInputChange("work_setup", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select work setup" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Experience Level */}
        <Field>
          <FieldLabel htmlFor="experience_level">Experience Level *</FieldLabel>
          <Select
            value={formData.experience_level}
            onValueChange={(value) =>
              handleInputChange("experience_level", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Education Level */}
        <Field>
          <FieldLabel htmlFor="education_level">Education Level *</FieldLabel>
          <Select
            value={formData.education_level}
            onValueChange={(value) =>
              handleInputChange("education_level", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="associate">Associate Degree</SelectItem>
              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
              <SelectItem value="master">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Min Budget */}
        <Field>
          <FieldLabel htmlFor="min_budget">Minimum Budget *</FieldLabel>
          <Input
            id="min_budget"
            type="number"
            value={formData.min_budget}
            placeholder="Enter minimum budget"
            onChange={(e) =>
              handleInputChange("min_budget", parseFloat(e.target.value))
            }
          />
        </Field>

        {/* Max Budget */}
        <Field>
          <FieldLabel htmlFor="max_budget">Maximum Budget *</FieldLabel>
          <Input
            id="max_budget"
            type="number"
            value={formData.max_budget}
            placeholder="Enter maximum budget"
            onChange={(e) =>
              handleInputChange("max_budget", parseFloat(e.target.value))
            }
          />
        </Field>

        {/* Location */}
        <Field>
          <FieldLabel htmlFor="location">Location *</FieldLabel>
          <Input
            id="location"
            value={formData.location}
            placeholder="Enter location"
            onChange={(e) => handleInputChange("location", e.target.value)}
          />
        </Field>

        {/* Reason for Hiring */}
        <Field>
          <FieldLabel htmlFor="reason_for_hiring">
            Reason for Hiring *
          </FieldLabel>
          <Select
            value={formData.reason_for_hiring}
            onValueChange={(value) =>
              handleInputChange("reason_for_hiring", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new-position">New Position</SelectItem>
              <SelectItem value="replacement">Replacement</SelectItem>
              <SelectItem value="expansion">Expansion</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      {/* Description */}
      <Field>
        <FieldLabel htmlFor="description">Job Description *</FieldLabel>
        <Textarea
          id="description"
          value={formData.description}
          placeholder="Enter job description"
          rows={4}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </Field>

      {/* Responsibilities */}
      <Field>
        <FieldLabel htmlFor="responsibilities">
          Key Responsibilities *
        </FieldLabel>
        <Textarea
          id="responsibilities"
          value={formData.responsibilities}
          placeholder="Enter key responsibilities"
          rows={4}
          onChange={(e) =>
            handleInputChange("responsibilities", e.target.value)
          }
        />
      </Field>

      {/* Qualifications */}
      <Field>
        <FieldLabel htmlFor="qualifications">
          Required Qualifications *
        </FieldLabel>
        <Textarea
          id="qualifications"
          value={formData.qualifications}
          placeholder="Enter required qualifications"
          rows={4}
          onChange={(e) => handleInputChange("qualifications", e.target.value)}
        />
      </Field>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          disabled={saving || !isEdited}
          className="min-w-32"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
