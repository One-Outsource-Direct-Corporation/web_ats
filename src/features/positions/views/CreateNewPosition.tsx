import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Eye } from "lucide-react";

// Import all our hooks
import {
  useFormData,
  useStepNavigation,
  useLocationBatchManagement,
  usePipelineManagement,
  useAssessmentManagement,
  useFormFieldManagement,
  useModalManagement,
} from "../hooks/create-position";

import { BasicDetailsForm } from "../components/create-position/form-management/BasicDetailsForm";
import { ApplicationFormManagement } from "../components/create-position/form-management/ApplicationFormManagement";
import { LocationManagement } from "../components/create-position/location-management/LocationManagement";
import { BatchManagement } from "../components/create-position/location-management/BatchManagement";
import { PipelineManagement } from "../components/create-position/pipeline-management/PipelineManagement";
import { StagePopupModal } from "../components/create-position/pipeline-management/StagePopupModal";
import { AssessmentManagement } from "../components/create-position/assessment-management/AssessmentManagement";
import { RichTextEditor } from "../../../shared/components/reusables/RichTextEditor";
import { StepNavigation } from "../components/create-position/navigation/StepNavigation";
import { CancelModal } from "../components/create-position/navigation/Modals";
import { PreviewModal } from "../components/create-position/navigation/Modals";
import { PoolApplicantsModal } from "../components/create-position/navigation/Modals";
import { SuccessPage } from "../components/create-position/navigation/SuccessPage";

import type { StepProps } from "../types/createPosition";

export default function CreateNewPosition() {
  useEffect(() => {
    document.title = "Create New Position";
  }, []);

  const navigate = useNavigate();

  // Initialize all our custom hooks
  const { formData, handleInputChange, handleApplicationFormChange } =
    useFormData();

  const {
    currentStep,
    completedSteps,
    handleNext: stepHandleNext,
    handleBack,
    handleStepClick,
    getStepTitle,
    resetSteps,
  } = useStepNavigation();

  const locationBatchHooks = useLocationBatchManagement();
  const pipelineHooks = usePipelineManagement();
  const assessmentHooks = useAssessmentManagement();
  const formFieldHooks = useFormFieldManagement();
  const modalHooks = useModalManagement();

  // Steps Configuration
  const steps: StepProps[] = [
    { number: 1, title: "Details", active: currentStep === 1 },
    { number: 2, title: "Description", active: currentStep === 2 },
    { number: 3, title: "Application Form", active: currentStep === 3 },
    { number: 4, title: "Pipeline", active: currentStep === 4 },
    { number: 5, title: "Assessment", active: currentStep === 5 },
  ];

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

  const handleCancel = () => {
    modalHooks.setShowModal(true);
  };

  const handleConfirmCancel = () => {
    navigate("/positions");
  };

  const handleSaveNonNegotiables = () => {
    modalHooks.setShowNonNegotiableModal(false);
    stepHandleNext();
  };

  const handlePublish = () => {
    modalHooks.setShowPoolApplicantsPopup(false);
    modalHooks.setShowSuccessPage(true);
  };

  const handleViewAllPositions = () => {
    navigate("/positions");
  };

  const handleCreateAnother = () => {
    modalHooks.setShowSuccessPage(false);
    resetSteps();
  };

  const handleStagePopupSave = () => {
    pipelineHooks.saveStageData(assessmentHooks.setGlobalAssessments);
    modalHooks.setShowStagePopup(false);
    pipelineHooks.resetStagePopup();
  };

  const handleStagePopupClose = () => {
    modalHooks.setShowStagePopup(false);
    pipelineHooks.resetStagePopup();
  };

  const handleAddStepToStage = (stageId: number) => {
    pipelineHooks.addStepToStage(stageId);
    modalHooks.setShowStagePopup(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="p-6">
            <BasicDetailsForm
              formData={formData}
              onInputChange={handleInputChange}
            />

            <LocationManagement
              locations={locationBatchHooks.locations}
              editingLocationId={locationBatchHooks.editingLocationId}
              onLocationChange={locationBatchHooks.handleLocationChange}
              onEditLocation={locationBatchHooks.handleEditLocation}
              onDeleteLocation={locationBatchHooks.deleteLocation}
              onAddLocation={locationBatchHooks.addLocation}
              setEditingLocationId={locationBatchHooks.setEditingLocationId}
            />

            <BatchManagement
              batches={locationBatchHooks.batches}
              locations={locationBatchHooks.locations}
              editingBatchId={locationBatchHooks.editingBatchId}
              onBatchChange={locationBatchHooks.handleBatchChange}
              onEditBatch={locationBatchHooks.handleEditBatch}
              onDeleteBatch={locationBatchHooks.deleteBatch}
              onAddBatch={locationBatchHooks.addBatch}
              setEditingBatchId={locationBatchHooks.setEditingBatchId}
            />
          </Card>
        );

      case 2:
        return (
          <Card className="p-6">
            <RichTextEditor
              title="Job Description"
              value={formData.description || ""}
              onChange={(content) => handleInputChange("description", content)}
              placeholder="Enter the job description here..."
            />
            <RichTextEditor
              title="Responsibilities"
              value={formData.responsibilities || ""}
              onChange={(content) =>
                handleInputChange("responsibilities", content)
              }
              placeholder="Enter the responsibilities here..."
            />
            <RichTextEditor
              title="Qualifications"
              value={formData.qualifications || ""}
              onChange={(content) =>
                handleInputChange("qualifications", content)
              }
              placeholder="Enter the qualifications here..."
            />
          </Card>
        );

      case 3:
        return (
          <Card className="p-6">
            <ApplicationFormManagement
              formData={formData}
              onFieldStatusChange={handleApplicationFormChange}
              includeInCandidateExperience={
                formFieldHooks.includeInCandidateExperience
              }
              onIncludeInCandidateExperienceChange={
                formFieldHooks.setIncludeInCandidateExperience
              }
              showTemplateOptions={formFieldHooks.showTemplateOptions}
              onToggleTemplateOptions={() =>
                formFieldHooks.setShowTemplateOptions(
                  !formFieldHooks.showTemplateOptions
                )
              }
              onAddQuestionnaire={() => {
                /* Handle add questionnaire */
              }}
            />
          </Card>
        );

      case 4:
        return (
          <Card className="p-6">
            <PipelineManagement
              pipelineStages={pipelineHooks.pipelineStages}
              onAddStepToStage={handleAddStepToStage}
              onEditStep={pipelineHooks.editStep}
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

      default:
        return (
          <Card className="p-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Create New Position
              </h3>
              <p className="text-gray-600">Select a step to get started.</p>
            </div>
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
            onStepClick={handleStepClick}
            onCancel={handleCancel}
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
      <CancelModal
        show={modalHooks.showModal}
        onClose={() => modalHooks.setShowModal(false)}
        onConfirm={handleConfirmCancel}
      />

      <PreviewModal
        show={modalHooks.showPreview}
        onClose={() => modalHooks.setShowPreview(false)}
        formData={formData}
        currentStep={currentStep}
      />

      <PoolApplicantsModal
        show={modalHooks.showPoolApplicantsPopup}
        onClose={() => modalHooks.setShowPoolApplicantsPopup(false)}
        formData={formData}
        selectedPoolingOption={modalHooks.selectedPoolingOption}
        onPoolingOptionChange={modalHooks.setSelectedPoolingOption}
        onPublish={handlePublish}
      />

      <StagePopupModal
        show={modalHooks.showStagePopup}
        onClose={handleStagePopupClose}
        stagePopupData={pipelineHooks.stagePopupData}
        setStagePopupData={pipelineHooks.setStagePopupData}
        editingStepId={pipelineHooks.editingStepId}
        onSave={handleStagePopupSave}
      />

      {/* Non-Negotiable Requirements Modal - You can create this as a separate component */}
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
