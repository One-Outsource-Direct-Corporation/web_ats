import { JobDetailsSection } from "../application/JobDetailsSection";
import type { JobDetailsFormData } from "../../types/application_form.types";
import type { ApplicationFormBase } from "@/shared/types/application_form.types";

interface Step02Props {
  formData: JobDetailsFormData;
  onInputChange: (field: string, value: string | File | number | null) => void;
  applicationForm: ApplicationFormBase;
}

export default function Step02({
  formData,
  onInputChange,
  applicationForm,
}: Step02Props) {
  return (
    <JobDetailsSection
      formData={formData}
      onInputChange={onInputChange}
      applicationForm={applicationForm}
    />
  );
}
