import { useState } from "react";
import { JobDetailsSection } from "../application/JobDetailsSection";
import type { JobDetailsFormData } from "../../types/applicationForm";

export default function Step02() {
  const [formData, setFormData] = useState<JobDetailsFormData>({
    positionApplyingFor: null,
    expectedSalary: null,
    willingToWorkOnsite: null,
    photo: null,

    medicalCertificate: null,
    interviewSchedule: null,
  });

  const handleChange = (
    field: string,
    value: string | number | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return <JobDetailsSection formData={formData} onInputChange={handleChange} />;
}
