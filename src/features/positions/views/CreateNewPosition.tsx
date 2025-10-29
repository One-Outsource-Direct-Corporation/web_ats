import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";
import DOMPurify from "dompurify";

import { useFormData } from "../hooks/create-position/useFormData";
import { useStepNavigation } from "../hooks/create-position/useStepNavigation";
import { useAssessmentManagement } from "../hooks/create-position/useAssessmentManagement";
import { useModalManagement } from "../hooks/create-position/useModalManagement";

import { AssessmentManagement } from "../components/create-position/assessment-management/AssessmentManagement";
import { StepNavigation } from "../components/create-position/navigation/StepNavigation";

import { PreviewModal } from "../components/create-position/navigation/Modals";
import { NonNegotiableModal } from "../components/create-position/navigation/NonNegotiableModal";
import { SuccessPage } from "../components/create-position/navigation/SuccessPage";

import Step01 from "../components/create-position/steps/Step01";
import Step02 from "../components/create-position/steps/Step02";
import Step03 from "../components/create-position/steps/Step03";
import Step04 from "../components/create-position/steps/Step04";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { formatForJSON } from "@/shared/utils/formatName";

export default function CreateNewPosition() {
  useEffect(() => {
    document.title = "Create New Position";
  }, []);
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState(null);
  const [stepErrors, setStepErrors] = useState<{ [key: number]: any }>({});
  const [nonNegotiableValues, setNonNegotiableValues] = useState<{
    [key: string]: any;
  }>({});

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

  const navigate = useNavigate();

  // Initialize all our custom hooks
  const {
    formData,
    handleInputChange,
    handleApplicationFormChange,
    handleNonNegotiableChange,
    handlePipelineChange,
    handleDeletePipelineChange,
    resetFormData,
  } = useFormData();

  const fieldToStep: { [key: string]: number } = {
    // Step01 fields
    job_title: 1,
    department: 1,
    employment_type: 1,
    target_start_date: 1,
    work_setup: 1,
    working_site: 1,
    headcount: 1,
    reason_for_hiring: 1,
    other_reason_for_hiring: 1,
    min_budget: 1,
    max_budget: 1,
    client: 1,
    education_level: 1,
    experience_level: 1,
    department_name: 1,
    // Step02 fields
    description: 2,
    responsibilities: 2,
    qualifications: 2,
    // Step04 fields
    pipeline: 4,
    // Add the other fields
  };

  const assessmentHooks = useAssessmentManagement();
  const modalHooks = useModalManagement();

  console.log(formData);

  const handleNext = async () => {
    if (currentStep === 3) {
      modalHooks.setShowNonNegotiableModal(true);
    } else if (currentStep === 5) {
      // To do: bring back the Pool Applicants Here

      const data = {
        job_posting: {
          job_title: formData.job_title,
          target_start_date: formData.target_start_date,
          reason_for_posting: formatForJSON(formData.reason_for_posting),
          other_reason_for_posting:
            formData.reason_for_posting !== "others"
              ? ""
              : formatForJSON(formData.other_reason_for_posting),
          department_name: formatForJSON(formData.department),
          department_name_other:
            formData.department !== "other"
              ? ""
              : formatForJSON(formData.other_department),
          number_of_vacancies: Number(formData.headcount) || 1,
          headcount: Number(formData.headcount) || 0,
          employment_type: formData.employment_type,
          work_setup: formatForJSON(formData.work_setup),
          working_site: formData.working_site,
          min_salary: Number(formData.min_budget) || 0,
          max_salary: Number(formData.max_budget) || 0,
          description: DOMPurify.sanitize(formData.description),
          responsibilities: DOMPurify.sanitize(formData.responsibilities),
          qualifications: DOMPurify.sanitize(formData.qualifications),
        },
        application_form: {
          ...formData.application_form,
        },
        pipeline: [...formData.pipeline],
        client: formData.client,
        education_level: formData.education_level,
        experience_level: formData.experience_level,
      };
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
        }
      } catch (err: AxiosError | any) {
        const errorData = err.response?.data || { detail: "An error occurred" };
        setError(errorData);

        console.log(err);

        const newStepErrors: { [key: number]: any } = {};
        Object.keys(errorData).forEach((field) => {
          if (field === "job_posting") {
            Object.keys(errorData[field]).forEach((subField) => {
              if (fieldToStep[subField]) {
                if (!newStepErrors[fieldToStep[subField]]) {
                  newStepErrors[fieldToStep[subField]] = {};
                }
                newStepErrors[fieldToStep[subField]][subField] =
                  errorData[field][subField];
              }
            });
          } else {
            if (fieldToStep[field]) {
              if (!newStepErrors[fieldToStep[field]]) {
                newStepErrors[fieldToStep[field]] = {};
              }
              newStepErrors[fieldToStep[field]][field] = errorData[field];
            }
          }
        });
        setStepErrors(newStepErrors);
      }
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
          <Step01
            formData={formData}
            handleInputChange={handleInputChange}
            error={error}
          />
        );
      case 2:
        return (
          <Step02
            formData={formData}
            handleInputChange={handleInputChange}
            error={error}
          />
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
            errors={error}
          />
        );

      case 5:
        return (
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
        );
    }
  };

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
      <div className="bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
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

          {/* Main Content */}
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-bold text-gray-800">
              {getStepTitle()}
            </h2>
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
