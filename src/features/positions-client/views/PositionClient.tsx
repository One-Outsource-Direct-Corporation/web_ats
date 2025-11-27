import { useNavigate } from "react-router-dom";
import type {
  PositionDb,
  PositionFormData,
} from "../types/create_position.types";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useModalManagement } from "../hooks/useModalManagement";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { PreviewModal } from "../components/Modals";
import { StepNavigation } from "../components/StepNavigation";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";
import Step01 from "../components/steps/Step01";
import Step02 from "../components/steps/Step02";
import Step03 from "../components/steps/Step03";
import Step04 from "../components/steps/Step04";
import { stateToDataFormatClient } from "@/shared/utils/stateToDataFormat";
import {
  validateSteps,
  mapServerErrorsToSteps,
  hasStepErrors,
} from "../utils/validateSteps";
import { usePositionFormData } from "../hooks/usePositionFormData";
import type { AxiosError } from "axios";

interface PositionClientProps {
  initialData?: PositionFormData;
  updateMode?: boolean;
}

export default function PositionClient({
  initialData,
  updateMode,
}: PositionClientProps) {
  const navigate = useNavigate();
  const {
    steps,
    currentStep,
    completedSteps,
    stepErrors,
    handleNext: stepHandleNext,
    handleBack,
    handleStepClick,
    getStepTitle,
    resetSteps,
    updateStepErrors,
  } = useStepNavigation(updateMode);
  const {
    formData,
    setFormData,
    handlePositionBaseChange,
    handleJobPostingChange,
    resetFormData,
    applicationFormHandler,
    nonNegotiableHandler,
    questionnaireHandler,
    pipelineHandler,
  } = usePositionFormData(initialData);
  const axiosPrivate = useAxiosPrivate();
  const modalHooks = useModalManagement();

  const handleNext = async () => {
    if (currentStep === 4) {
      const allErrors = validateSteps(formData);
      const hasAnyErrors = Object.values(allErrors).some((error) =>
        hasStepErrors(error)
      );

      if (hasAnyErrors) {
        toast.error("Please fix all errors before publishing the position");
        updateStepErrors(allErrors);

        const firstErrorStep = Object.keys(allErrors)
          .map(Number)
          .find((step) => hasStepErrors(allErrors[step]));

        if (firstErrorStep && firstErrorStep !== currentStep) {
          handleStepClick(firstErrorStep);
        }
        return;
      }

      const formDataObj = stateToDataFormatClient(formData);

      try {
        let response;
        if (updateMode) {
          response = await axiosPrivate.patch(
            `/api/position/${(formData as PositionDb).job_posting.id}/`,
            formDataObj,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          response = await axiosPrivate.post("/api/position/", formDataObj, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        if (response.status === 200 || response.status === 201) {
          const successMessage = updateMode
            ? "Position updated successfully!"
            : "Position created successfully!";

          toast.success(
            <div>
              {successMessage}{" "}
              {!updateMode && (
                <button
                  onClick={() => navigate("/")}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Positions Posted
                </button>
              )}
            </div>
          );

          if (updateMode) {
            navigate("/requests");
          } else {
            resetFormData();
            resetSteps();
          }
        }
      } catch (err: AxiosError | any) {
        console.error("Position operation error:", err);

        if (err.status === 403) {
          toast.error("You do not have permission to perform this action.");
          return;
        }

        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
          return;
        }

        if (err.response?.data) {
          const serverErrors = mapServerErrorsToSteps(err.response.data);
          updateStepErrors(serverErrors);

          const firstErrorStep = Object.keys(serverErrors)
            .map(Number)
            .find((step) => hasStepErrors(serverErrors[step]));

          if (firstErrorStep) {
            handleStepClick(firstErrorStep);
            toast.error(`Please fix the errors in Step ${firstErrorStep}`);
          } else {
            toast.error("Please fix the errors in the form");
          }
        } else {
          const errorMessage = updateMode
            ? "Failed to update position. Please try again."
            : "Failed to create position. Please try again.";
          toast.error(errorMessage);
        }
      }
    } else {
      stepHandleNext();
    }
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step01
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handlePositionBaseChange}
            handleJobPostingChange={handleJobPostingChange}
            error={stepErrors[1]}
          />
        );
      case 2:
        return (
          <Step02
            formData={formData}
            handleInputChange={handleJobPostingChange}
            error={stepErrors[2]}
          />
        );
      case 3:
        return (
          <Step03
            applicationFormData={formData.application_form}
            applicationFormHandler={applicationFormHandler}
            nonNegotiableHandler={nonNegotiableHandler}
            questionnaireHandler={questionnaireHandler}
            error={stepErrors[3]}
          />
        );
      case 4:
        return (
          <Step04
            pipelineSteps={formData.pipeline}
            pipelineHandler={pipelineHandler}
            errors={stepErrors[4]}
          />
        );
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Positions</span>
          <span>/</span>
          <span>Create New Position</span>
        </div>

        <StepNavigation
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
          resetForm={resetFormData}
          stepErrors={stepErrors}
          updateMode={updateMode}
        />

        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-bold text-gray-800">{getStepTitle()}</h2>
          <Button
            variant="outline"
            className="text-blue-600 border-blue-600 bg-transparent hover:bg-blue-600 hover:text-white"
            onClick={() => modalHooks.setShowPreview(true)}
            disabled={currentStep >= 4}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        {renderStepContent()}

        <div className="flex justify-between">
          <Button
            variant="outline"
            className="text-gray-600 bg-transparent"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            ← Back
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleNext}
          >
            {currentStep === 4
              ? updateMode
                ? "Update Position"
                : "Publish Position"
              : "Next step →"}
          </Button>
        </div>
      </div>

      <PreviewModal
        show={modalHooks.showPreview}
        onClose={() => modalHooks.setShowPreview(false)}
        formData={formData}
        currentStep={currentStep}
      />
    </>
  );
}
