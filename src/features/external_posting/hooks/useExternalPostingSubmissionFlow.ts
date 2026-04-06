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
import type { PositionFormData } from "../types/externalPosting.types";
import {
  UpdateExternalPostingIdMissingError,
  useExternalPostingMutation,
} from "./useExternalPostingMutation";

interface UseExternalPostingSubmissionFlowParams {
  updateMode?: boolean;
  currentStep: number;
  onUpdateStepErrors: (errors: StepErrors) => void;
  onNavigateToStep: (stepNumber: number) => void;
  onCreateSuccess: () => void;
  onUpdateSuccess: () => void;
}

export function useExternalPostingSubmissionFlow({
  updateMode,
  currentStep,
  onUpdateStepErrors,
  onNavigateToStep,
  onCreateSuccess,
  onUpdateSuccess,
}: UseExternalPostingSubmissionFlowParams) {
  const { submitExternalPosting } = useExternalPostingMutation();

  const submitCurrentStep = useCallback(
    async (formData: PositionFormData) => {
      if (currentStep !== 4) {
        return { didSubmit: false };
      }

      const allErrors = validateSteps(formData);
      const hasAnyErrors = Object.values(allErrors).some((error) => hasStepErrors(error));

      console.log(hasAnyErrors);
      console.log(allErrors);

      if (hasAnyErrors) {
        toast.error("Please fix all errors before publishing the position");
        onUpdateStepErrors(allErrors);

        const firstErrorStep = Object.keys(allErrors)
          .map(Number)
          .find((step) => hasStepErrors(allErrors[step]));

        if (firstErrorStep && firstErrorStep !== currentStep) {
          onNavigateToStep(firstErrorStep);
        }

        return { didSubmit: true, isSuccess: false };
      }

      try {
        const response = await submitExternalPosting({ formData, updateMode });

        if (response.status === 200 || response.status === 201) {
          const successMessage = updateMode
            ? "Position updated successfully!"
            : "Position created successfully!";

          toast.success(successMessage);

          if (updateMode) {
            onUpdateSuccess();
          } else {
            onCreateSuccess();
          }

          return { didSubmit: true, isSuccess: true };
        }

        return { didSubmit: true, isSuccess: false };
      } catch (err: unknown) {
        if (err instanceof UpdateExternalPostingIdMissingError) {
          toast.error("Cannot update position because posting id is missing.");
          return { didSubmit: true, isSuccess: false };
        }

        if (!isAxiosError(err)) {
          const genericErrorMessage = updateMode
            ? "Failed to update position. Please try again."
            : "Failed to create position. Please try again.";
          toast.error(genericErrorMessage);
          return { didSubmit: true, isSuccess: false };
        }

        const statusCode = err.response?.status;
        const responseData = err.response?.data as
          | (Record<string, unknown> & { error?: string })
          | undefined;

        if (statusCode === 403) {
          toast.error("You do not have permission to perform this action.");
          return { didSubmit: true, isSuccess: false };
        }

        if (responseData?.error) {
          toast.error(responseData.error);
          return { didSubmit: true, isSuccess: false };
        }

        if (responseData) {
          const serverErrors = mapServerErrorsToSteps(responseData as ValidationError);
          onUpdateStepErrors(serverErrors);

          const firstErrorStep = Object.keys(serverErrors)
            .map(Number)
            .find((step) => hasStepErrors(serverErrors[step]));

          if (firstErrorStep) {
            onNavigateToStep(firstErrorStep);
            toast.error(`Please fix the errors in Step ${firstErrorStep}`);
          } else {
            toast.error("Please fix the errors in the form");
          }

          return { didSubmit: true, isSuccess: false };
        }

        const errorMessage = updateMode
          ? "Failed to update position. Please try again."
          : "Failed to create position. Please try again.";
        toast.error(errorMessage);
        return { didSubmit: true, isSuccess: false };
      }
    },
    [
      currentStep,
      onCreateSuccess,
      onNavigateToStep,
      onUpdateStepErrors,
      onUpdateSuccess,
      submitExternalPosting,
      updateMode,
    ]
  );

  return { submitCurrentStep };
}
