import { useState } from "react";
import type { CreatePositionFormData } from "../../types/createPosition";

export const useFormData = () => {
  const [formData, setFormData] = useState<CreatePositionFormData>({
    job_title: "",
    department: "",
    employment_type: "Full-Time",
    education_level: "Bachelor's Degree",
    work_setup: "Hybrid",
    experience_level: "Entry Level",
    headcount: "",
    date_needed: "",
    reason_for_hiring: "Others, Please Specify",
    other_reason_for_hiring: "",
    min_budget: "",
    max_budget: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetFormData = () => {
    setFormData({
      job_title: "",
      department: "",
      employment_type: "Full-Time",
      education_level: "Bachelor's Degree",
      work_setup: "Hybrid",
      experience_level: "Entry Level",
      headcount: "",
      date_needed: "",
      reason_for_hiring: "Others, Please Specify",
      other_reason_for_hiring: "",
      min_budget: "",
      max_budget: "",
    });
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    resetFormData,
  };
};
