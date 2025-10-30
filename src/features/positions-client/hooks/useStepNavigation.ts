import { useState } from "react";
import type { StepProps } from "../types/create_position.types";

export const useStepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: StepProps[] = [
    { number: 1, title: "Details", active: currentStep === 1 },
    { number: 2, title: "Description", active: currentStep === 2 },
    { number: 3, title: "Application Form", active: currentStep === 3 },
    { number: 4, title: "Pipeline", active: currentStep === 4 },
    { number: 5, title: "Assessment", active: currentStep === 5 },
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
      case 5:
        return steps[4].title;
    }
  };

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

  const resetSteps = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  return {
    steps,
    currentStep,
    completedSteps,
    handleNext,
    handleBack,
    handleStepClick,
    getStepTitle,
    resetSteps,
  };
};
