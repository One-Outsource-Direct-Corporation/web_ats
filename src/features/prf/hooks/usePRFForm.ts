import { useState } from "react";
import type { PRF } from "../types/prfTypes";

export function usePRFForm(initialData: PRF) {
  const [formData, setFormData] = useState<PRF>(initialData);
  const updateFormData = (updates: Partial<PRF>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };
  return { formData, updateFormData };
}
