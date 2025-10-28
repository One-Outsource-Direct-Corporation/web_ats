import { JobDetailsSection } from "../application/JobDetailsSection";
import type { JobDetailsFormData } from "../../types/applicationForm";

interface Step02Props {
  formData: JobDetailsFormData;
  onInputChange: (field: string, value: string | File | number | null) => void;
}

export default function Step02({ formData, onInputChange }: Step02Props) {
  return (
    <JobDetailsSection formData={formData} onInputChange={onInputChange} />
  );
}
