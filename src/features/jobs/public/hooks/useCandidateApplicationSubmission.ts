import { useCallback, useState } from "react";
import { isAxiosError } from "axios";

import { careersService } from "../services/careers.service";
import type {
  CandidateApplicationSubmissionFiles,
  CandidateApplicationSubmissionPayload,
  CandidateApplicationSubmissionResponse,
} from "../types/jobApply.types";

const DEFAULT_ERROR_MESSAGE =
  "Failed to submit your application. Please try again.";

const collectErrorMessages = (value: unknown): string[] => {
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectErrorMessages(item));
  }

  if (value && typeof value === "object") {
    const nestedValues = Object.values(value as Record<string, unknown>);
    return nestedValues.flatMap((item) => collectErrorMessages(item));
  }

  return [];
};

const toErrorMessage = (responseData: unknown): string => {
  if (responseData && typeof responseData === "object") {
    const payload = responseData as Record<string, unknown>;

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }

    if (typeof payload.detail === "string" && payload.detail.trim()) {
      return payload.detail;
    }
  }

  const messages = Array.from(new Set(collectErrorMessages(responseData))).filter(
    Boolean,
  );

  if (messages.length > 0) {
    return messages.join(" | ");
  }

  return DEFAULT_ERROR_MESSAGE;
};

interface SubmitCandidateApplicationInput {
  payload: CandidateApplicationSubmissionPayload;
  files: CandidateApplicationSubmissionFiles;
}

export function useCandidateApplicationSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitCandidateApplication = useCallback(
    async ({
      payload,
      files,
    }: SubmitCandidateApplicationInput): Promise<CandidateApplicationSubmissionResponse> => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        return await careersService.submitCandidateApplication(payload, files);
      } catch (error: unknown) {
        let message = DEFAULT_ERROR_MESSAGE;

        if (isAxiosError(error)) {
          message = toErrorMessage(error.response?.data);
        } else if (error instanceof Error && error.message.trim()) {
          message = error.message;
        }

        setSubmitError(message);
        throw new Error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return {
    submitCandidateApplication,
    isSubmitting,
    submitError,
  };
}
