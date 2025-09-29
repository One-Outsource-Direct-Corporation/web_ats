import { useState } from "react";
import type { CreatePositionFormData } from "../../types/createPosition";

export const useFormData = () => {
  const [formData, setFormData] = useState<CreatePositionFormData>({
    jobTitle: "",
    department: "",
    employmentType: "Full-Time",
    educationNeeded: "Bachelor's Degree",
    workSetup: "Hybrid",
    experience: "Entry Level",
    headcountsNeeded: "",
    dateNeeded: "",
    reasonForHire: "Others, Please Specify",
    reasonSpecify: "",
    budgetFrom: "",
    budgetTo: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetFormData = () => {
    setFormData({
      jobTitle: "",
      department: "",
      employmentType: "Full-Time",
      educationNeeded: "Bachelor's Degree",
      workSetup: "Hybrid",
      experience: "Entry Level",
      headcountsNeeded: "",
      dateNeeded: "",
      reasonForHire: "Others, Please Specify",
      reasonSpecify: "",
      budgetFrom: "",
      budgetTo: "",
    });
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    resetFormData,
  };
};
