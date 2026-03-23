import { useState } from "react";
import type { StepProps } from "../types/externalPosting.types";
import type { StepErrors } from "../utils/validateSteps";

export const useExternalPostingStepNavigation = (updateMode = false) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepErrors, setStepErrors] = useState<StepErrors>({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const steps: StepProps[] = [
    { number: 1, title: "Details", active: currentStep === 1 },
    { number: 2, title: "Description", active: currentStep === 2 },
    { number: 3, title: "Application Form", active: currentStep === 3 },
    { number: 4, title: "Pipeline", active: currentStep === 4 },
  ];

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return steps[0].title;
      case 2:
        return steps[1].title;
      case 3:
        return steps[2].title;
      case 4:
        return steps[3].title;
      default:
        return steps[0].title;
    }
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (updateMode || stepNumber <= currentStep || completedSteps.includes(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const resetSteps = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setStepErrors({
      1: null,
      2: null,
      3: null,
      4: null,
    });
  };

  const updateStepErrors = (errors: StepErrors) => {
    setStepErrors(errors);
  };

  return {
    steps,
    currentStep,
    completedSteps,
    stepErrors,
    handleNext,
    handleBack,
    handleStepClick,
    getStepTitle,
    resetSteps,
    updateStepErrors,
  };
};
