import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Field, FieldLabel, FieldGroup } from "@/shared/components/ui/field";
import type { PositionData } from "@/features/positions/types/positionTypes";
import type { JobPostingResponsePosition } from "@/features/jobs/types/jobTypes";
import { StepNavigation } from "@/features/positions/components/create-position/navigation/StepNavigation";
import { useStepNavigation } from "@/features/positions/hooks/create-position/useStepNavigation";
import Step01 from "./position-edit/step01";
import Step02 from "./position-edit/Step02";
import Step03 from "./position-edit/Step03";
import Step04 from "./position-edit/Step04";

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

  const resetForm = () => {};

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step01 />;
      case 2:
        return <Step02 />;
      case 3:
        return <Step03 />;
      case 4:
        return <Step04 />;
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
          onClick={handleNext}
        >
          {currentStep === 5 ? "Publish Position" : "Next step →"}
        </Button>
      </div>
    </>
  );
}
