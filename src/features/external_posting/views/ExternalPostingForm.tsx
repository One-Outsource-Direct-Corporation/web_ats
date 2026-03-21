import { useNavigate } from "react-router-dom";
import type { PositionFormData } from "@/features/external_posting/types/externalPosting.types";
import {
  useExternalPostingStepNavigation,
} from "@/features/external_posting/hooks/useExternalPostingStepNavigation";
import {
  useExternalPostingModalManagement,
} from "@/features/external_posting/hooks/useExternalPostingModalManagement";
import {
  useExternalPostingFormData,
} from "@/features/external_posting/hooks/useExternalPostingFormData";
import {
  useExternalPostingSubmissionFlow,
} from "@/features/external_posting/hooks/useExternalPostingSubmissionFlow";
import {
  PreviewModal,
  StepNavigation,
  Step01,
  Step02,
  Step03,
  Step04,
} from "@/features/external_posting/components/externalPostingForm.components";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";

interface ExternalPostingFormProps {
  initialData?: PositionFormData;
  updateMode?: boolean;
}

export default function ExternalPostingForm(props: ExternalPostingFormProps) {
  const { initialData, updateMode } = props;
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
  } = useExternalPostingStepNavigation(updateMode);

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
  } = useExternalPostingFormData(initialData);

  const modalHooks = useExternalPostingModalManagement();

  const { submitCurrentStep } = useExternalPostingSubmissionFlow({
    updateMode,
    currentStep,
    onUpdateStepErrors: updateStepErrors,
    onNavigateToStep: handleStepClick,
    onUpdateSuccess: () => navigate("/requests"),
    onCreateSuccess: () => {
      resetFormData();
      resetSteps();
    },
  });

  const handleNext = async () => {
    const { didSubmit } = await submitCurrentStep(formData);

    if (!didSubmit) {
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
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>External Posting</span>
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
