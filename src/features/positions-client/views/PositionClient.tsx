import { useNavigate } from "react-router-dom";
import type {
  PositionBase,
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
import type {
  ApplicationForm,
  ApplicationFormType,
  NonNegotiable,
} from "../../../shared/types/application_form.types";
import type { PipelineStep } from "../../../shared/types/pipeline.types";
import type { ApplicationFormQuestionnaire } from "../types/questionnaire.types";
import {
  validateSteps,
  mapServerErrorsToSteps,
  hasStepErrors,
} from "../utils/validateSteps";

interface PositionClientProps {
  formData: PositionFormData;
  setFormData: React.Dispatch<React.SetStateAction<PositionFormData>>;
  pipelineHandler: (updatedPipelines: PipelineStep[]) => void;
  applicationFormHandler: (
    field: keyof ApplicationForm,
    value: ApplicationFormType
  ) => void;
  nonNegotiableHandler: (updatedNonNegotiables: NonNegotiable) => void;
  questionnaireHandler: (
    updatedQuestionnaire: ApplicationFormQuestionnaire
  ) => void;
  handlePositionBaseChange: (
    fieldName: keyof PositionBase,
    value: string | number | null
  ) => void;
  handleJobPostingChange: (
    fieldName: keyof PositionFormData["job_posting"],
    value: string | number | null
  ) => void;
  resetFormData: () => void;
}

export default function PositionClient({
  formData,
  setFormData,
  applicationFormHandler,
  nonNegotiableHandler,
  questionnaireHandler,
  pipelineHandler,
  handlePositionBaseChange,
  handleJobPostingChange,
  resetFormData,
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
  } = useStepNavigation();
  const axiosPrivate = useAxiosPrivate();
  const modalHooks = useModalManagement();

  const handleNext = async () => {
    // Only validate on final submission (step 4)
    if (currentStep === 4) {
      // Validate all steps before submitting
      const allErrors = validateSteps(formData);
      const hasAnyErrors = Object.values(allErrors).some((error) =>
        hasStepErrors(error)
      );

      if (hasAnyErrors) {
        toast.error("Please fix all errors before publishing the position");
        updateStepErrors(allErrors);

        // Find the first step with errors and navigate to it
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
        const response = await axiosPrivate.post(
          "/api/position/",
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          toast.success(
            <div>
              Position created successfully!{" "}
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 underline hover:text-blue-800"
              >
                View Positions Posted
              </button>
            </div>
          );
          resetFormData();
          resetSteps();
        }
      } catch (err: any) {
        console.error("Position creation error:", err);

        // Map server errors to steps
        if (err.response?.data) {
          const serverErrors = mapServerErrorsToSteps(err.response.data);
          updateStepErrors(serverErrors);

          // Find the first step with errors and navigate to it
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
          toast.error("Failed to create position. Please try again.");
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
            {currentStep === 4 ? "Publish Position" : "Next step →"}
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
