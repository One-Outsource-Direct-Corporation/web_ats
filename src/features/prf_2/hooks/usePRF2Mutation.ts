import { useCallback, useState } from "react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import { stateToDataFormat } from "@/shared/utils/stateToDataFormat";
import { buildPrfSubmitPayloadWithOptions } from "@/features/prf_2/utils/prf2PayloadAdapter";

export class UpdatePRF2IdMissingError extends Error {
  constructor() {
    super("Missing PRF job posting id for update mode.");
    this.name = "UpdatePRF2IdMissingError";
  }
}

const getUpdatePrfJobPostingId = (formData: PRFFormData): number | null => {
  const id = formData.job_posting?.id;
  return typeof id === "number" ? id : null;
};

export function usePRF2Mutation() {
  const axiosPrivate = useAxiosPrivate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPrf = useCallback(
    async (params: {
      formData: PRFFormData;
      updateMode?: boolean;
      statusOverride?: "draft" | "pending";
    }) => {
      const { formData, updateMode, statusOverride } = params;
      setIsSubmitting(true);

      try {
        const submitPayload = buildPrfSubmitPayloadWithOptions(formData, {
          statusOverride,
        });
        const payload = stateToDataFormat(submitPayload, {
          jobPostingField: "job_posting",
        });

        if (updateMode) {
          const jobPostingId = getUpdatePrfJobPostingId(formData);
          if (!jobPostingId) {
            throw new UpdatePRF2IdMissingError();
          }

          return await axiosPrivate.patch(
            `/api/prf/${jobPostingId}/`,
            payload,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
        }

        return await axiosPrivate.post("/api/prf/", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
