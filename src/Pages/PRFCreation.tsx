import CancelRequestModal from "@/features/prf_2/components/CancelRequestModal";
import PRFStepsNavigation from "@/features/prf_2/components/PRFStepsNavigation";
import { useEffect, useMemo, useState } from "react";
import PRFStepComponent from "@/features/prf_2/components/PRFStepComponent.tsx";
import PRFNavigationButton from "@/features/prf_2/components/PRFNavigationButton.tsx";
import { usePRF2Form } from "@/features/prf_2/hooks/usePRF2Form";
import {
  UpdatePRF2IdMissingError,
  usePRF2Mutation,
} from "@/features/prf_2/hooks/usePRF2Mutation";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PRFSidebarPreview from "@/features/prf_2/components/PRFSidebarPreview.tsx";
import type { PRFFormData as LegacyPRFFormData } from "@/features/prf_2/types/LegacyPRFCompat";
import { adaptLegacyPrfToPrf2FormData } from "@/features/prf_2/utils/prf2PayloadAdapter";
import {
  createEmptyStepErrors,
  getFirstErrorStep,
  hasStepErrors,
  mapServerErrorsToSteps,
  type StepErrors,
  type ValidationError,
  validateStep,
  validateSteps,
} from "@/features/prf_2/utils/validateSteps";

interface PRFCreationProps {
  initialData?: LegacyPRFFormData;
  updateMode?: boolean;
}

export default function PRFCreation({
  initialData,
  updateMode = false,
}: PRFCreationProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [maxStepVisited, setMaxStepVisited] = useState(updateMode ? 6 : 1);
  const [stepErrors, setStepErrors] = useState<StepErrors>(
    createEmptyStepErrors(),
  );
  const adaptedInitialData = useMemo(
    () => (initialData ? adaptLegacyPrfToPrf2FormData(initialData) : undefined),
    [initialData],
  );
  const { formData, setFormData, serializeFormData } =
    usePRF2Form(adaptedInitialData);
  const { submitPrf, isSubmitting } = usePRF2Mutation();

  useEffect(() => {
    if (!updateMode) {
      return;
    }

    setStepErrors(validateSteps(formData));
  }, [formData, updateMode]);

  function handleStepClick(targetStep: number) {
    if (updateMode) {
      setStep(targetStep);
      return;
    }

    if (targetStep <= maxStepVisited) {
      setStep(targetStep);
    }
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    const normalizedFormData = serializeFormData();
    const allStepErrors = validateSteps(normalizedFormData);
    const hasAnyErrors = Object.values(allStepErrors).some((currentErrors) =>
      hasStepErrors(currentErrors),
    );

    if (hasAnyErrors) {
      setStepErrors(allStepErrors);

      const firstErrorStep = getFirstErrorStep(allStepErrors);
      if (firstErrorStep && firstErrorStep !== step) {
        setStep(firstErrorStep);
      }

      toast.error("Please fix all errors before submitting the PRF.");
      return;
    }

    try {
      const response = await submitPrf({
        formData: normalizedFormData,
        updateMode,
      });

      const successMessage = updateMode
        ? "PRF updated successfully!"
        : "PRF submitted successfully!";
      const failureMessage = updateMode
        ? "Failed to update PRF. Please try again."
        : "Failed to submit PRF. Please try again.";

      if (response.status === 200 || response.status === 201) {
        setStepErrors(createEmptyStepErrors());
        toast.success(successMessage);
        navigate("/requests");
        return;
      }

      toast.error(failureMessage);
    } catch (error: unknown) {
      if (error instanceof UpdatePRF2IdMissingError) {
        toast.error("Cannot update PRF because posting id is missing.");
        return;
      }

      if (isAxiosError<ValidationError>(error) && error.response?.data) {
        const mappedErrors = mapServerErrorsToSteps(error.response.data);
        const firstErrorStep = getFirstErrorStep(mappedErrors);

        if (firstErrorStep) {
          setStepErrors(mappedErrors);
          setStep(firstErrorStep);
          toast.error(`Please fix the errors in Step ${firstErrorStep}.`);
          return;
        }
      }

      const errorMessage =
        isAxiosError<{ detail?: string; error?: string }>(error) &&
        (error.response?.data?.detail || error.response?.data?.error)
          ? error.response.data.detail || error.response.data.error
          : updateMode
            ? "Failed to update PRF. Please try again."
            : "Failed to submit PRF. Please try again.";

      toast.error(errorMessage);
    }
  }

  function handleStepNextChange() {
    if (step === 6) {
      void handleSubmit();
      return;
    }

    const normalizedFormData = serializeFormData();
    const currentStepErrors = validateStep(normalizedFormData, step);

    if (hasStepErrors(currentStepErrors)) {
      setStepErrors((previous) => ({
        ...previous,
        [step]: currentStepErrors,
      }));
      toast.error(`Please fix the errors in Step ${step}.`);
      return;
    }

    const nextStep = Math.min(step + 1, 6);

    setStepErrors((previous) => ({
      ...previous,
      [step]: null,
    }));
    setStep(nextStep);

    if (!updateMode) {
      setMaxStepVisited((currentMax) => Math.max(currentMax, nextStep));
    }
  }

  function handleStepPrevChange() {
    if (step === 1) return;

    setStep((prev) => prev - 1);
  }

  return (
    <section className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {!updateMode && (
          <h1 className="text-lg font-bold text-gray-800 mb-6">
            Personnel Requisition Form
          </h1>
        )}

        {!updateMode && <CancelRequestModal />}

        <PRFStepsNavigation
          step={step}
          maxStepVisited={maxStepVisited}
          stepErrors={stepErrors}
          updateMode={updateMode}
          onStepClick={handleStepClick}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <PRFStepComponent
            step={step}
            formData={formData}
            updateFormData={setFormData}
            stepErrors={stepErrors}
          />

          {step > 0 && step < 4 && (
            <PRFSidebarPreview step={step} formData={formData} />
          )}
        </div>
        <PRFNavigationButton
          step={step}
          handleNext={handleStepNextChange}
          handlePrevious={handleStepPrevChange}
          submitting={isSubmitting}
          updateMode={updateMode}
        />
      </div>
    </section>
  );
}
