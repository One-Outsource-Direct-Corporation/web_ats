import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Eye } from "lucide-react";

import { useFormData } from "../hooks/create-position/useFormData";
import { useStepNavigation } from "../hooks/create-position/useStepNavigation";
import { usePipelineManagement } from "../hooks/create-position/usePipelineManagement";
import { useAssessmentManagement } from "../hooks/create-position/useAssessmentManagement";
import { useModalManagement } from "../hooks/create-position/useModalManagement";

import { PipelineManagement } from "../components/create-position/pipeline-management/PipelineManagement";
import { AssessmentManagement } from "../components/create-position/assessment-management/AssessmentManagement";
import { StepNavigation } from "../components/create-position/navigation/StepNavigation";

import { PreviewModal } from "../components/create-position/navigation/Modals";
// import { PoolApplicantsModal } from "../components/create-position/navigation/Modals";
import { SuccessPage } from "../components/create-position/navigation/SuccessPage";

import Step01 from "../components/create-position/steps/Step01";
import Step02 from "../components/create-position/steps/Step02";
import Step03 from "../components/create-position/steps/Step03";

let counter = 0;

export default function CreateNewPosition() {
  useEffect(() => {
    document.title = "Create New Position";
  }, []);
  const {
    steps,
    currentStep,
    completedSteps,
    handleNext: stepHandleNext,
    handleBack,
    getStepTitle,
    resetSteps,
  } = useStepNavigation();

  const navigate = useNavigate();

  console.log("Hey: ", counter++);

  // Initialize all our custom hooks
  const {
    formData,
    handleInputChange,
    handleApplicationFormChange,
    handlePipelineChange,
    resetFormData,
  } = useFormData();

  const pipelineHooks = usePipelineManagement();
  const assessmentHooks = useAssessmentManagement();
  const modalHooks = useModalManagement();

  // Enhanced handlers
  const handleNext = () => {
    if (currentStep === 3) {
      modalHooks.setShowNonNegotiableModal(true);
    } else if (currentStep === 5) {
      console.log("Current form data:", formData);
      return;
      modalHooks.setShowPoolApplicantsPopup(true);
    } else {
      stepHandleNext();
    }
  };

  const handleSaveNonNegotiables = () => {
    modalHooks.setShowNonNegotiableModal(false);
    stepHandleNext();
  };

  const handleViewAllPositions = () => {
    navigate("/positions");
  };

  const handleCreateAnother = () => {
    modalHooks.setShowSuccessPage(false);
    resetSteps();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step01 formData={formData} handleInputChange={handleInputChange} />
        );
      case 2:
        return (
          <Step02 formData={formData} handleInputChange={handleInputChange} />
        );
      case 3:
        return (
          <Step03
            formData={formData}
            handleApplicationFormChange={handleApplicationFormChange}
          />
        );
      case 4:
        return (
          <Card className="p-6">
            <PipelineManagement
              pipelineSteps={formData.pipeline}
              pipelineHandler={handlePipelineChange}
              pipelineStages={pipelineHooks.pipelineStages}
            />
          </Card>
        );

      case 5:
        return (
          <Card className="p-6">
            <AssessmentManagement
              globalAssessments={assessmentHooks.globalAssessments}
              selectedAssessmentForEdit={
                assessmentHooks.selectedAssessmentForEdit
              }
              onSelectAssessment={(assessment) => {
                assessmentHooks.setSelectedAssessmentForEdit(assessment);
                assessmentHooks.setIsEditingAssessment(true);
              }}
              onGoToPipeline={() => stepHandleNext()}
            />
          </Card>
        );
    }
  };

  // Render success page if needed
  if (modalHooks.showSuccessPage) {
    return (
      <SuccessPage
        formData={formData}
        onViewAllPositions={handleViewAllPositions}
        onCreateAnother={handleCreateAnother}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Positions</span>
            <span>/</span>
            <span>Create New Position</span>
          </div>

          {/* Steps Navigation */}
          <StepNavigation
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            resetForm={resetFormData}
          />

          {/* Main Content */}
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-gray-800">
              {getStepTitle()}
            </h2>
            <Button
              variant="outline"
              className="text-blue-600 border-blue-600 bg-transparent"
              onClick={() => modalHooks.setShowPreview(true)}
              disabled={currentStep === 4 || currentStep === 5}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
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
              {currentStep === 5 ? "Publish Position" : "Next step →"}
            </Button>
          </div>
        </div>
      </div>

      {/* All Modals */}
      <PreviewModal
        show={modalHooks.showPreview}
        onClose={() => modalHooks.setShowPreview(false)}
        formData={formData}
        currentStep={currentStep}
      />

      {/* <PoolApplicantsModal
        show={modalHooks.showPoolApplicantsPopup}
        onClose={() => modalHooks.setShowPoolApplicantsPopup(false)}
        formData={formData}
        selectedPoolingOption={modalHooks.selectedPoolingOption}
        onPoolingOptionChange={modalHooks.setSelectedPoolingOption}
        onPublish={handlePublish}
      /> */}

      {modalHooks.showNonNegotiableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => modalHooks.setShowNonNegotiableModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h5 className="text-xl font-bold text-gray-800">
                  Non-Negotiable Requirements
                </h5>
                <Button
                  onClick={() => modalHooks.setShowNonNegotiableModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Set the required values for non-negotiable fields. Candidates
                who don't meet these criteria will be automatically filtered
                out.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mt-6 flex items-start gap-3 rounded-md">
                <div className="text-yellow-600 flex-shrink-0 mt-0.5">⚠️</div>
                <div>
                  <p className="font-bold text-sm">Important Note:</p>
                  <p className="text-sm">
                    Non-negotiable requirements will be automatically evaluated
                    during the screening process. Candidates who don't meet
                    these criteria will be filtered out before manual review.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => modalHooks.setShowNonNegotiableModal(false)}
                  variant="outline"
                  className="px-4 py-2 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNonNegotiables}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save and Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
