import { useCallback, useState } from "react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import {stateToDataFormatPRF} from "@/features/prf_2/utils/stateToDataFormatPRF2";

export function usePRF2Mutation() {
  const axiosPrivate = useAxiosPrivate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPrf = useCallback(
    async (formData: PRFFormData) => {
      setIsSubmitting(true);

      try {
        return await axiosPrivate.post(
          "/api/prf/",
            stateToDataFormatPRF(formData),
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [axiosPrivate],
  );

  return {
    submitPrf,
    isSubmitting,
  };
}
