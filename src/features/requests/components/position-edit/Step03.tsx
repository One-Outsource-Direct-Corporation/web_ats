import type { JobPostingResponsePosition } from "@/features/jobs/types/job.types";
import { ApplicationFormManagement } from "@/shared/components/reusables/ApplicationFormManagement";

export default function Step03({
  formData,
  setFormData,
}: {
  formData: JobPostingResponsePosition;
  setFormData: (data: JobPostingResponsePosition) => void;
}) {
  function handleFormChange(field: string, value: any) {
    setFormData({
      ...formData,
      application_form: {
        ...formData.application_form,
        [field]: value,
      },
    });
  }

  return (
    <ApplicationFormManagement
      formData={formData}
      setFormData={handleFormChange}
    />
  );
}
