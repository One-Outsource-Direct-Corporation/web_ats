import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import type { JobPostingResponsePosition } from "@/features/jobs/types/jobTypes";
import { StepNavigation } from "@/features/positions/components/create-position/navigation/StepNavigation";
import { useStepNavigation } from "@/features/positions/hooks/create-position/useStepNavigation";
import Step01 from "./position-edit/Step01";
import Step02 from "./position-edit/Step02";
import Step03 from "./position-edit/Step03";
import Step04 from "./position-edit/Step04";
import Step05 from "./position-edit/Step05";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

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
    getStepTitle,
    resetSteps,
  } = useStepNavigation();
  const [formData, setFormData] = useState(initialData);
  const [stepErrors, setStepErrors] = useState<{ [key: number]: any }>({});
  const axiosPrivate = useAxiosPrivate();
  console.log(formData);

  const resetForm = () => {};

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step01 formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step02 formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step03 formData={formData} setFormData={setFormData} />;
      case 4:
        return <Step04 formData={formData} setFormData={setFormData} />;
      case 5:
        return <Step05 />;
    }
  };

  async function handlePublish() {
    console.log("Publishing position:", formData);

    const response = await axiosPrivate.patch(
      `/api/position/${formData.id}/`,
      formData
    );
    console.log("Position published successfully:", response.data);
  }

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
          onClick={currentStep === 5 ? handlePublish : handleNext}
        >
          {currentStep === 5 ? "Publish Position" : "Next step →"}
        </Button>
      </div>
    </>
  );
}
