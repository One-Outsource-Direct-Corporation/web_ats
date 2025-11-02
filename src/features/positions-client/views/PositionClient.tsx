import { useNavigate } from "react-router-dom";
import type {
  CreatePositionFormData,
  PipelineStep,
} from "../types/create_position.types";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { useModalManagement } from "../hooks/useModalManagement";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { PreviewModal } from "../components/Modals";
import { StepNavigation } from "../components/StepNavigation";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";
import Step01 from "../components/steps/Step01";
import Step02 from "../components/steps/Step02";
import Step03 from "../components/steps/Step03";
import Step04 from "../components/steps/Step04";
import { AssessmentManagement } from "../components/AssessmentManagement";
import { NonNegotiableModal } from "../components/NonNegotiableModal";
import { useState } from "react";
import { stateToDataFormatClient } from "@/shared/utils/stateToDataFormat";

interface PositionClientProps {
  formData: CreatePositionFormData;
  handleInputChange: (
    field: keyof CreatePositionFormData,
    content: string
  ) => void;
  handleApplicationFormChange: (field: string, status: string) => void;
  handleNonNegotiableChange: (field: string, value: boolean) => void;
  handleNonNegotiableValueChange: (name: string, value: any) => void;
  handlePipelineChange: (
    pipeline_identifier: string | number,
    data: PipelineStep
  ) => void;
  handleDeletePipelineChange: (pipeline_identifier: string | number) => void;
  resetFormData: () => void;
}

export default function PositionClient({
  formData,
  handleInputChange,
  handleApplicationFormChange,
  handleNonNegotiableChange,
  handleNonNegotiableValueChange,
  handlePipelineChange,
  handleDeletePipelineChange,
  resetFormData,
}: PositionClientProps) {
  const [nonNegotiableValues, setNonNegotiableValues] = useState<{
    [key: string]: any;
  }>({});

  const navigate = useNavigate();
  const {
    steps,
    currentStep,
    completedSteps,
    handleNext: stepHandleNext,
    handleBack,
    handleStepClick,
    getStepTitle,
    resetSteps,
  } = useStepNavigation();
  const axiosPrivate = useAxiosPrivate();
  const modalHooks = useModalManagement();

  // TODO: Add The Step Errors

  const handleNext = async () => {
    if (currentStep === 3) {
      modalHooks.setShowNonNegotiableModal(true);
    } else if (currentStep === 5) {
      // TODO: bring back the Pool Applicants Here
      // TODO: change the data structure from changes made

      console.log("Submitting form data:", formData);
      return;

      const data = stateToDataFormatClient(formData);

      try {
        const response = await axiosPrivate.post("/api/position/", data);
        console.log("Response from server:", response);
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
      } catch (err: AxiosError | any) {
        console.log(err);
      }
    } else {
      stepHandleNext();
    }
  };

  const handleSaveNonNegotiables = () => {
    // Convert nonNegotiableValues object to array format
    Object.entries(nonNegotiableValues).forEach(([name, value]) => {
      handleNonNegotiableValueChange(name, value);
    });
    modalHooks.setShowNonNegotiableModal(false);
    stepHandleNext();
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
            handleNonNegotiableChange={handleNonNegotiableChange}
          />
        );
      case 4:
        return (
          <Step04
            pipelineSteps={formData.pipeline}
            pipelineHandler={handlePipelineChange}
            pipelineDeleteHandler={handleDeletePipelineChange}
          />
        );
      case 5:
        return (
          <AssessmentManagement
            pipelineSteps={formData.pipeline}
            goToPipeline={() => handleStepClick(4)}
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
          //   stepErrors={stepErrors}
        />

        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-bold text-gray-800">{getStepTitle()}</h2>
          <Button
            variant="outline"
            className="text-blue-600 border-blue-600 bg-transparent hover:bg-blue-600 hover:text-white"
            onClick={() => modalHooks.setShowPreview(true)}
            disabled={currentStep === 4 || currentStep === 5}
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
            {currentStep === 5 ? "Publish Position" : "Next step →"}
          </Button>
        </div>
      </div>

      <PreviewModal
        show={modalHooks.showPreview}
        onClose={() => modalHooks.setShowPreview(false)}
        formData={formData}
        currentStep={currentStep}
      />

      <NonNegotiableModal
        show={modalHooks.showNonNegotiableModal}
        onClose={() => modalHooks.setShowNonNegotiableModal(false)}
        onSave={handleSaveNonNegotiables}
        formData={formData}
        nonNegotiableValues={nonNegotiableValues}
        setNonNegotiableValues={setNonNegotiableValues}
      />
    </>
  );
}
