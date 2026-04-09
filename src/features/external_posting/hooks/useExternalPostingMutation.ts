import { useCallback } from "react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { stateToDataFormatClient } from "@/shared/utils/stateToDataFormat";
import type {
  PositionFormData,
  PositionResponse,
} from "@/features/external_posting/types/externalPosting.types";

export class UpdateExternalPostingIdMissingError extends Error {
  constructor() {
    super("Missing external posting id for update mode.");
    this.name = "UpdateExternalPostingIdMissingError";
  }
}

const getUpdateJobPostingId = (formData: PositionFormData): number | null => {
  const candidate = formData as PositionResponse;
  const id = candidate?.job_posting?.id;
  return typeof id === "number" ? id : null;
};

export function useExternalPostingMutation() {
  const axiosPrivate = useAxiosPrivate();

  const submitExternalPosting = useCallback(
    async (params: {
      formData: PositionFormData;
      updateMode?: boolean;
      statusOverride?: "draft" | "pending";
    }) => {
      const { formData, updateMode, statusOverride } = params;

      const payloadSource = statusOverride
        ? {
            ...formData,
            job_posting: {
              ...formData.job_posting,
              status: statusOverride,
            },
          }
        : formData;

      const payload = stateToDataFormatClient(
        payloadSource as PositionFormData,
      );

      if (updateMode) {
        const jobPostingId = getUpdateJobPostingId(formData);
        if (!jobPostingId) {
          throw new UpdateExternalPostingIdMissingError();
        }

        return axiosPrivate.patch(
          `/api/external_posting/${jobPostingId}/`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }

      return axiosPrivate.post("/api/external_posting/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    [axiosPrivate],
  );

  return { submitExternalPosting };
}
