import { useState } from "react";
import type { FormData } from "../types/prfTypes";

export function usePRFForm(initialData: FormData) {
  const [formData, setFormData] = useState<FormData>(initialData);
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };
  return { formData, updateFormData };
}
