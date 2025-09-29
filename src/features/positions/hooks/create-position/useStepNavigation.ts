import { useState } from "react";

export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || completedSteps.includes(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Position Details";
      case 2:
        return "Position Description";
      case 3:
        return "Application Form";
      case 4:
        return "Position Pipeline";
      case 5:
        return "Assessment";
      default:
        return "Create New Position";
    }
  };

  const resetSteps = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  return {
    currentStep,
    completedSteps,
    handleNext,
    handleBack,
    handleStepClick,
    goToStep,
    getStepTitle,
    resetSteps,
  };
};
