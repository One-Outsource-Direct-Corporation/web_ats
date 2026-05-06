import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import { createInitialPRF2Data } from "@/features/prf_2/utils/prfInitialData";

export function usePRF2Form(initialData?: PRFFormData) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<PRFFormData>(
    initialData ?? createInitialPRF2Data(user),
  );

  function serializeFormData(): PRFFormData {
    return formData;
  }

  return {
    formData,
    setFormData,
    serializeFormData,
  };
}
