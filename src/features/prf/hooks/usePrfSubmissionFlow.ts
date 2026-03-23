import { useCallback } from "react";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  validateSteps,
  mapServerErrorsToSteps,
  hasStepErrors,
  type StepErrors,
  type ValidationError,
} from "../utils/validateSteps";
import type { PRFFormData } from "../types/prf.types";
import { UpdatePrfIdMissingError, usePrfMutation } from "./usePrfMutation";

interface UsePrfSubmissionFlowParams {
  updateMode?: boolean;
  currentStep: number;
  onSetStepErrors: (errors: StepErrors) => void;
  onSetStep: (step: number) => void;
  onSetMaxStepVisited: (updater: (current: number) => number) => void;
  onSuccess: () => void;
}

export function usePrfSubmissionFlow({
  updateMode,
  currentStep,
  onSetStepErrors,
  onSetStep,
  onSetMaxStepVisited,
  onSuccess,
}: UsePrfSubmissionFlowParams) {
  const { submitPrf } = usePrfMutation();

  const validateBeforeSubmit = useCallback(
    (formData: PRFFormData): boolean => {
      const allErrors = validateSteps(formData);
      const hasAnyErrors = Object.values(allErrors).some((error) =>
        hasStepErrors(error)
      );

      if (!hasAnyErrors) {
        return true;
      }

      toast.error("Please fix all errors before submitting the PRF");
      onSetStepErrors(allErrors);

      const firstErrorStep = Object.keys(allErrors)
        .map(Number)
        .find((stepNum) => hasStepErrors(allErrors[stepNum]));

      if (firstErrorStep && firstErrorStep !== currentStep) {
        onSetStep(firstErrorStep);
        onSetMaxStepVisited((currentMax) => Math.max(currentMax, firstErrorStep));
      }

      return false;
    },
    [currentStep, onSetMaxStepVisited, onSetStep, onSetStepErrors]
  );

  const confirmSubmit = useCallback(
    async (formData: PRFFormData) => {
      try {
        const response = await submitPrf({ formData, updateMode });

        if (response.status === 200 || response.status === 201) {
          toast.success(updateMode ? "PRF updated successfully!" : "PRF submitted successfully!");
          onSuccess();
          return;
        }

        toast.error("Failed to submit PRF. Please try again.");
      } catch (err: unknown) {
        if (err instanceof UpdatePrfIdMissingError) {
          toast.error("Cannot update PRF because posting id is missing.");
          return;
        }

        if (!isAxiosError(err)) {
          toast.error("Failed to submit PRF. Please try again.");
          return;
        }

        const statusCode = err.response?.status;
        const responseData = err.response?.data as
          | (Record<string, unknown> & { error?: string })
          | undefined;

        if (statusCode === 403) {
          toast.error("You do not have permission to submit/edit this PRF.");
          return;
        }

        if (responseData?.error) {
          toast.error(responseData.error);
          return;
        }

        if (responseData) {
          const serverErrors = mapServerErrorsToSteps(
            responseData as ValidationError
          );
          onSetStepErrors(serverErrors);

          const firstErrorStep = Object.keys(serverErrors)
            .map(Number)
            .find((stepNum) => hasStepErrors(serverErrors[stepNum]));

          if (firstErrorStep) {
            onSetStep(firstErrorStep);
            onSetMaxStepVisited((currentMax) =>
              Math.max(currentMax, firstErrorStep)
            );
            toast.error(`Please fix the errors in Step ${firstErrorStep}`);
          } else {
            toast.error("Please fix the errors in the form");
          }

          return;
        }

        toast.error("Failed to submit PRF. Please try again.");
      }
    },
    [onSetMaxStepVisited, onSetStep, onSetStepErrors, onSuccess, submitPrf, updateMode]
  );

  return {
    validateBeforeSubmit,
    confirmSubmit,
  };
}
