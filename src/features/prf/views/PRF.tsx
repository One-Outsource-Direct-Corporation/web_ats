import { useNavigate } from "react-router-dom";
import { usePRFForm } from "../hooks/usePRFForm";
import { Step01 } from "../components/steps/Step01";
import { Step02 } from "../components/steps/Step02";
import { Step03 } from "../components/steps/Step03";
import { Step04 } from "../components/steps/Step04";
import {
  CancelConfirmModal,
  SubmitConfirmModal,
  SuccessPopup,
} from "../components/PRFModal";

import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { stateToDataFormatPRF } from "@/shared/utils/stateToDataFormat";
import { MinusCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Step05 from "../components/steps/Step05";
import { Step06 } from "../components/steps/Step06";
import type { PRFDb, PRFFormData } from "../types/prf.types";
import {
  validateSteps,
  mapServerErrorsToSteps,
  hasStepErrors,
  type StepErrors,
} from "../utils/validateSteps";

interface PRFProps {
  initialData?: PRFFormData;
  updateMode?: boolean;
}

export default function PRF({ initialData, updateMode }: PRFProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [maxStepVisited, setMaxStepVisited] = useState(updateMode ? 6 : 1);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

  const {
    formData,
    setFormData,
    applicationFormHandler,
    nonNegotiableHandler,
    questionnaireHandler,
    pipelineHandler,
  } = usePRFForm(initialData);

  const axiosPrivate = useAxiosPrivate();

  const goToNextStep = () => {
    setStep((prev) => {
      const nextStep = Math.min(prev + 1, 6);
      setMaxStepVisited((currentMax) => Math.max(currentMax, nextStep));
      return nextStep;
    });
  };

  const goToPreviousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleCancelRequest = () => {
    setShowCancelConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirmDialog(false);
    navigate("/requests");
  };

  const handleSaveAsDraft = () => {
    setShowCancelConfirmDialog(false);
    navigate("/requests");
  };

  const handleSubmit = () => {
    // Validate all steps before submitting
    const allErrors = validateSteps(formData);
    const hasAnyErrors = Object.values(allErrors).some((error) =>
      hasStepErrors(error)
    );

    if (hasAnyErrors) {
      toast.error("Please fix all errors before submitting the PRF");
      setStepErrors(allErrors);

      // Find the first step with errors and navigate to it
      const firstErrorStep = Object.keys(allErrors)
        .map(Number)
        .find((stepNum) => hasStepErrors(allErrors[stepNum]));

      if (firstErrorStep && firstErrorStep !== step) {
        setStep(firstErrorStep);
        setMaxStepVisited((currentMax) => Math.max(currentMax, firstErrorStep));
      }
      console.log(allErrors);
      return;
    }

    setShowSubmitConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitConfirmDialog(false);

    const formDataObj = stateToDataFormatPRF(formData);

    try {
      let response;
      if (updateMode) {
        response = await axiosPrivate.patch(
          `/api/prf/${(formData as PRFDb).job_posting.id}/`,
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axiosPrivate.post("/api/prf/", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log(response);

      if (response.status === 201) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate("/requests");
        }, 1500);
        toast.success("PRF submitted successfully!");
      }
    } catch (err: AxiosError | any) {
      console.error("Error submitting PRF:", err);

      // Map server errors to steps
      if (err.response?.data) {
        const serverErrors = mapServerErrorsToSteps(err.response.data);
        setStepErrors(serverErrors);

        // Find the first step with errors and navigate to it
        const firstErrorStep = Object.keys(serverErrors)
          .map(Number)
          .find((stepNum) => hasStepErrors(serverErrors[stepNum]));

        if (firstErrorStep) {
          setStep(firstErrorStep);
          setMaxStepVisited((currentMax) =>
            Math.max(currentMax, firstErrorStep)
          );
          toast.error(`Please fix the errors in Step ${firstErrorStep}`);
        } else {
          toast.error("Please fix the errors in the form");
        }
      } else {
        toast.error("Failed to submit PRF. Please try again.");
      }
    }
  };

  return (
    <>
      <SuccessPopup show={showSuccessPopup} />
      <div className="min-h-screen bg-white p-6">
        <div className="mx-auto max-w-7xl space-y-4">
          {!updateMode && (
            <h1 className="text-lg font-bold text-gray-800 mb-6">
              Personnel Requisition Form
            </h1>
          )}
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              className="border-1 border-red-700 text-red-700 text-sm hover:bg-red-700 hover:text-white"
              onClick={handleCancelRequest}
            >
              <MinusCircle className="h-4 w-4" /> Cancel Request
            </Button>
          </div>
          <div className="flex space-x-0 border border-gray-300 rounded-md overflow-hidden mb-8">
            {[
              "Step 01",
              "Step 02",
              "Step 03",
              "Step 04",
              "Step 05",
              "Step 06",
            ].map((label, i) => {
              const stepNumber = i + 1;
              const hasError =
                stepErrors[stepNumber] && hasStepErrors(stepErrors[stepNumber]);
              const isClickable =
                stepNumber <= maxStepVisited && stepNumber !== step;
              return (
                <div
                  key={i}
                  className={`flex-1 text-center py-2 text-sm font-semibold relative ${
                    hasError
                      ? "bg-red-600 text-white"
                      : stepNumber === step
                      ? "bg-[#0056D2] text-white"
                      : isClickable
                      ? "bg-blue-50 text-blue-600"
                      : "bg-white text-gray-500"
                  } ${
                    isClickable
                      ? hasError
                        ? "cursor-pointer hover:bg-red-700"
                        : "cursor-pointer hover:bg-blue-100"
                      : ""
                  }`}
                  onClick={() => {
                    if (isClickable) {
                      setStep(stepNumber);
                    }
                  }}
                >
                  {label}
                  {i < 6 && (
                    <span className="absolute right-0 top-0 h-full w-px bg-gray-300" />
                  )}
                </div>
              );
            })}
          </div>

          {step === 1 && (
            <Step01
              goToNextStep={goToNextStep}
              formData={formData}
              updateFormData={setFormData}
              errors={stepErrors[1]}
            />
          )}
          {step === 2 && (
            <Step02
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              step={step}
              formData={formData}
              updateFormData={setFormData}
              errors={stepErrors[2]}
            />
          )}
          {step === 3 && (
            <Step03
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              formData={formData}
              step={step}
              updateFormData={setFormData}
            />
          )}
          {step === 4 && (
            <Step04
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              formData={formData}
              applicationFormHandler={applicationFormHandler}
              nonNegotiableHandler={nonNegotiableHandler}
              questionnaireHandler={questionnaireHandler}
            />
          )}
          {step === 5 && (
            <Step05
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              pipelineSteps={formData.pipeline}
              pipelineHandler={pipelineHandler}
              errors={stepErrors[5]}
            />
          )}
          {step === 6 && (
            <Step06
              goToPreviousStep={goToPreviousStep}
              formData={formData}
              step={step}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <CancelConfirmModal
        open={showCancelConfirmDialog}
        onClose={() => setShowCancelConfirmDialog(false)}
        onConfirmCancel={handleConfirmCancel}
        onSaveAsDraft={handleSaveAsDraft}
      />

      {/* Submit Confirmation Dialog */}
      <SubmitConfirmModal
        open={showSubmitConfirmDialog}
        onClose={() => setShowSubmitConfirmDialog(false)}
        onConfirmSubmit={handleConfirmSubmit}
      />
    </>
  );
}
