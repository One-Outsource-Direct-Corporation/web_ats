import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/shared/components/ui/field";
import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";
import type { JobPostingResponsePRF } from "@/features/jobs/types/jobTypes";

interface EditStep02Props {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  formData: JobPostingResponsePRF;
  handleInputChange: (
    field: keyof JobPostingResponsePRF,
    value: string | number | boolean
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<JobPostingResponsePRF>>;
  errors?: { [key: string]: any };
}

export const EditStep02: React.FC<EditStep02Props> = ({
  goToNextStep,
  goToPreviousStep,
  formData,
  handleInputChange,
  setFormData,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Work Setup */}
        <Field>
          <FieldLabel htmlFor="work_setup">Work Setup *</FieldLabel>
          <Select
            value={formData.work_setup}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, work_setup: value }));
            }}
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

        {/* Category */}
        <Field>
          <FieldLabel htmlFor="category">Category *</FieldLabel>
          <Input
            id="category"
            value={formData.category}
            placeholder="Enter category"
            onChange={(e) => handleInputChange("category", e.target.value)}
          />
          {errors?.category && <FieldError>{errors.category}</FieldError>}
        </Field>

        {/* Position */}
        <Field>
          <FieldLabel htmlFor="position">Position *</FieldLabel>
          <Input
            id="position"
            value={formData.position}
            placeholder="Enter position"
            onChange={(e) => handleInputChange("position", e.target.value)}
          />
          {errors?.position && <FieldError>{errors.position}</FieldError>}
        </Field>

        {/* Working Site */}
        <Field>
          <FieldLabel htmlFor="working_site">Working Site *</FieldLabel>
          <Input
            id="working_site"
            value={formData.working_site}
            placeholder="Enter working site"
            onChange={(e) => handleInputChange("working_site", e.target.value)}
          />
          {errors?.working_site && (
            <FieldError>{errors.working_site}</FieldError>
          )}
        </Field>

        {/* Work Schedule */}
        <FieldGroup className="grid md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel htmlFor="work_schedule_from">
              Work Schedule From *
            </FieldLabel>
            <Input
              id="work_schedule_from"
              type="time"
              value={formData.work_schedule_from}
              onChange={(e) =>
                handleInputChange("work_schedule_from", e.target.value)
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="work_schedule_to">
              Work Schedule To *
            </FieldLabel>
            <Input
              id="work_schedule_to"
              type="time"
              value={formData.work_schedule_to}
              onChange={(e) =>
                handleInputChange("work_schedule_to", e.target.value)
              }
            />
          </Field>
        </FieldGroup>
      </FieldGroup>

      {/* Description */}
      <Field>
        <RichTextEditor
          title="Job Description *"
          value={formData.description}
          onChange={(content) => handleInputChange("description", content)}
        />
        {errors?.job_posting?.description && (
          <FieldError>{errors.job_posting.description}</FieldError>
        )}
      </Field>

      {/* Responsibilities */}
      <Field>
        <RichTextEditor
          title="Key Responsibilities *"
          value={formData.responsibilities}
          onChange={(content) => handleInputChange("responsibilities", content)}
        />
        {errors?.job_posting?.responsibilities && (
          <FieldError>{errors.job_posting.responsibilities}</FieldError>
        )}
      </Field>

      {/* Qualifications */}
      <Field>
        <RichTextEditor
          title="Required Qualifications *"
          value={formData.qualifications}
          onChange={(content) => handleInputChange("qualifications", content)}
        />
        {errors?.job_posting?.qualifications && (
          <FieldError>{errors.job_posting.qualifications}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="non_negotiables">Non-Negotiables *</FieldLabel>
        <RichTextEditor
          value={formData.non_negotiables}
          onChange={(content) => handleInputChange("non_negotiables", content)}
        />
        {errors?.non_negotiables && (
          <FieldError>{errors.non_negotiables}</FieldError>
        )}
      </Field>

      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={goToPreviousStep}>
          &larr; Previous
        </Button>
        <Button
          className="bg-[#0056D2] hover:bg-blue-700 text-white"
          onClick={goToNextStep}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
