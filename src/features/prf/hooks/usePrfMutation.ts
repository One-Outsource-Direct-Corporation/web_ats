import { useCallback } from "react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { stateToDataFormatPRF } from "@/shared/utils/stateToDataFormat";
import type { PRFFormData, PRFResponse } from "../types/prf.types";

export class UpdatePrfIdMissingError extends Error {
  constructor() {
    super("Missing PRF job posting id for update mode.");
    this.name = "UpdatePrfIdMissingError";
  }
}

const getUpdatePrfJobPostingId = (formData: PRFFormData): number | null => {
  const candidate = formData as PRFResponse;
  const id = candidate?.job_posting?.id;
  return typeof id === "number" ? id : null;
};

export function usePrfMutation() {
  const axiosPrivate = useAxiosPrivate();

  const submitPrf = useCallback(
    async (params: { formData: PRFFormData; updateMode?: boolean }) => {
      const { formData, updateMode } = params;
      const payload = stateToDataFormatPRF(formData);

      if (updateMode) {
        const jobPostingId = getUpdatePrfJobPostingId(formData);
        if (!jobPostingId) {
          throw new UpdatePrfIdMissingError();
        }

        return axiosPrivate.patch(`/api/prf/${jobPostingId}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      return axiosPrivate.post("/api/prf/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    [axiosPrivate]
  );

  return { submitPrf };
}
