import type { JobPostingResponsePosition } from "@/features/jobs/types/job.types";
import { RichTextEditor } from "@/shared/components/reusables/RichTextEditor";
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
export default function Step02({
  formData,
  setFormData,
  errors,
}: {
  formData: JobPostingResponsePosition;
  setFormData: (data: JobPostingResponsePosition) => void;
  errors?: any;
}) {
  function handleChange(field: string, value: any) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  return (
    <FieldGroup className="mt-10">
      <Field>
        <FieldLabel>Description</FieldLabel>
        <RichTextEditor
          value={formData.description}
          onChange={(value) => handleChange("description", value)}
        />
        {errors?.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
      </Field>
      <Field>
        <FieldLabel>Responsibilities</FieldLabel>
        <RichTextEditor
          value={formData.responsibilities}
          onChange={(value) => handleChange("responsibilities", value)}
        />
        {errors?.responsibilities && (
          <p className="text-red-600 text-sm mt-1">{errors.responsibilities}</p>
        )}
      </Field>
      <Field>
        <FieldLabel>Qualifications</FieldLabel>
        <RichTextEditor
          value={formData.qualifications}
          onChange={(value) => handleChange("qualifications", value)}
        />
        {errors?.qualifications && (
          <p className="text-red-600 text-sm mt-1">{errors.qualifications}</p>
        )}
      </Field>
    </FieldGroup>
  );
}
