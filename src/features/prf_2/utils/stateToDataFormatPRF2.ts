import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";

export function stateToDataFormatPRF(formData: PRFFormData) {
  const newFormData = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      // For nested objects, flatten keys (e.g., "job_posting.department")
      Object.entries(value).forEach(([subKey, subValue]) => {
        newFormData.append(`${key}.${subKey}`, String(subValue ?? ""));
      });
    } else {
      newFormData.append(key, String(value ?? ""));
    }
  });

  newFormData.delete("job_posting.department_display");
  newFormData.delete("prf_input.immediate_supervisor_display");

  return newFormData;
}