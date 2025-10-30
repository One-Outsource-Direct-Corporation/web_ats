import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import type { JobPostingResponsePosition } from "@/features/jobs/types/job.types";
import { StepNavigation } from "@/features/positions-client/components/StepNavigation";
import { useStepNavigation } from "@/features/positions-client/hooks/useStepNavigation";
import Step01 from "./position-edit/Step01";
import Step02 from "./position-edit/Step02";
import Step03 from "./position-edit/Step03";
import Step04 from "./position-edit/Step04";
import Step05 from "./position-edit/Step05";
import useSubmitEditFormPosition from "../hooks/useSubmitEditFormPosition";

interface PositionEditFormProps {
  initialData: JobPostingResponsePosition;
}

export default function PositionEditForm({
  initialData,
}: PositionEditFormProps) {
  const {
    steps,
    currentStep,
    completedSteps,
    handleNext,
    handleBack,
    handleStepClick,
  } = useStepNavigation();
  const [formData, setFormData] = useState(initialData);
  const [stepErrors, setStepErrors] = useState<{ [key: number]: any }>({});
  const { handleSubmit, loading, error } = useSubmitEditFormPosition({
    formData,
  });

  // Update step errors when error changes
  useEffect(() => {
    if (error) {
      const errors: { [key: number]: any } = {};

      // Step 1 errors: Basic info (client, education_level, experience_level, job_posting fields)
      if (
        error.client ||
        error.education_level ||
        error.experience_level ||
        error.job_posting
      ) {
        errors[1] = {
          client: error.client,
          education_level: error.education_level,
          experience_level: error.experience_level,
          ...error.job_posting,
        };
      }

      // Step 2 errors: Rich text fields (description, responsibilities, qualifications)
      if (
        error.job_posting?.description ||
        error.job_posting?.responsibilities ||
        error.job_posting?.qualifications
      ) {
        errors[2] = {
          description: error.job_posting.description,
          responsibilities: error.job_posting.responsibilities,
          qualifications: error.job_posting.qualifications,
        };
      }

      // Step 3 errors: Application form
      if (error.application_form) {
        errors[3] = error.application_form;
      }

      // Step 4 errors: Pipeline
      if (error.pipeline) {
        errors[4] = error.pipeline;
      }

      setStepErrors(errors);
    } else {
      setStepErrors({});
    }
  }, [error]);

  const resetForm = () => {};

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step01
            formData={formData}
            setFormData={setFormData}
            errors={stepErrors[1]}
          />
        );
      case 2:
        return (
          <Step02
            formData={formData}
            setFormData={setFormData}
            errors={stepErrors[2]}
          />
        );
      case 3:
        return <Step03 formData={formData} setFormData={setFormData} />;
      case 4:
        return (
          <Step04
            formData={formData}
            setFormData={setFormData}
            errors={error}
          />
        );
      case 5:
        return <Step05 />;
    }
  };

  return (
    <>
      <StepNavigation
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        resetForm={resetForm}
        onStepClick={handleStepClick}
        stepErrors={stepErrors}
      />

      {renderStepContent()}

      <div className="flex justify-between mt-10">
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
          onClick={currentStep === 5 ? handleSubmit : handleNext}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {currentStep === 5 ? "Publishing..." : "Loading..."}
            </>
          ) : currentStep === 5 ? (
            "Publish Position"
          ) : (
            "Next step →"
          )}
        </Button>
      </div>
    </>
  );
}
