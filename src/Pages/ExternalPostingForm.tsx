import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import {
  PreviewModal,
  Step01,
  Step02,
  Step03,
  Step04,
  StepNavigation,
  type PositionFormData,
  useExternalPostingFormData,
  useExternalPostingStepNavigation,
  useExternalPostingSubmissionFlow,
} from "@/features/external_posting";
import ResumeDraftModal from "@/features/external_posting/components/ResumeDraftModal";
import { positionDraftLocalStore } from "@/features/external_posting/services/positionDraft.local-store";
import { Button } from "@/shared/components/ui/button";

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
    hasDraft,
    loadDraftFromStorage,
    discardDraft,
    handlePositionBaseChange,
    handleJobPostingChange,
    resetFormData,
    applicationFormHandler,
    nonNegotiableHandler,
    questionnaireHandler,
    pipelineHandler,
  } = useExternalPostingFormData(initialData);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const draftRecord = useMemo(() => {
    if (!hasDraft) return null;
    return positionDraftLocalStore.getDraft();
  }, [hasDraft]);

  useEffect(() => {
    if (hasDraft) {
      setShowResumeModal(true);
    }
  }, [hasDraft]);

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

  const handleResumeDraft = () => {
    loadDraftFromStorage();
    setShowResumeModal(false);
  };

  const handleStartNewDraft = () => {
    discardDraft();
    setShowResumeModal(false);
  };

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
            updateMode={updateMode}
          />
        );
      case 4:
        return (
          <Step04
            pipelineSteps={formData.pipeline}
            pipelineHandler={pipelineHandler}
            errors={stepErrors[4]}
            jobTitle={formData.job_posting.job_title ?? undefined}
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
          <span>{updateMode ? "Edit Position" : "Create New Position"}</span>
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

        <div className="flex items-start justify-between">
          <h2 className="text-3xl font-bold text-gray-800">{getStepTitle()}</h2>
          <Button
            variant="outline"
            className="border-blue-600 bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={() => setIsPreviewModalOpen(true)}
            disabled={currentStep >= 4}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>

        {renderStepContent()}

        <div className="flex justify-between">
          <Button
            variant="outline"
            className="bg-transparent text-gray-600"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            ← Back
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
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
        show={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        formData={formData}
        currentStep={currentStep}
      />

      {draftRecord && (
        <ResumeDraftModal
          open={showResumeModal}
          savedAt={draftRecord.savedAt}
          summary={{
            jobTitle: draftRecord.data.job_posting?.job_title ?? null,
            client: draftRecord.data.client,
          }}
          onResume={handleResumeDraft}
          onStartNew={handleStartNewDraft}
        />
      )}
    </>
  );
}
