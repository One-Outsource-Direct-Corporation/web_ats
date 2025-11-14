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
import type { PRFFormData } from "../types/prf.types";

interface PRFProps {
  initialData?: PRFFormData;
}

export default function PRF({ initialData }: PRFProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [maxStepVisited, setMaxStepVisited] = useState(1);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
    setShowSubmitConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitConfirmDialog(false);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      // navigate("/requests");
    }, 1500);

    const formDataObj = stateToDataFormatPRF(formData);
    // return;

    try {
      const response = await axiosPrivate.post("/api/prf/", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("PRF submitted successfully!");
      }
    } catch (err: AxiosError | any) {
      toast.error("Failed to submit PRF. Please try again.");
      console.error("Error submitting PRF:", err);
    }
  };

  return (
    <>
      <SuccessPopup show={showSuccessPopup} />
      <div className="min-h-screen bg-white p-6 pt-[100px]">
        <div className="mx-auto max-w-7xl space-y-4">
          <h1 className="text-lg font-bold text-gray-800 mb-6">
            Personnel Requisition Form
          </h1>
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
            ].map((label, i) => (
              <div
                key={i}
                className={`flex-1 text-center py-2 text-sm font-semibold relative ${
                  i + 1 === step
                    ? "bg-[#0056D2] text-white"
                    : "bg-white text-gray-500"
                } ${
                  i + 1 <= maxStepVisited && i + 1 !== step
                    ? "cursor-pointer hover:bg-gray-100"
                    : ""
                }`}
                onClick={() => {
                  if (i + 1 <= maxStepVisited && i + 1 !== step) {
                    setStep(i + 1);
                  }
                }}
              >
                {label}
                {i < 6 && (
                  <span className="absolute right-0 top-0 h-full w-px bg-gray-300" />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Step01
              goToNextStep={goToNextStep}
              formData={formData}
              updateFormData={setFormData}
            />
          )}
          {step === 2 && (
            <Step02
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              step={step}
              formData={formData}
              updateFormData={setFormData}
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
