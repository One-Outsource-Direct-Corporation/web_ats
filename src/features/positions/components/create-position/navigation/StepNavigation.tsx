import React from "react";
import { Button } from "@/shared/components/ui/button";
import type { StepProps } from "../../../types/createPosition";

interface StepNavigationProps {
  steps: StepProps[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepNumber: number) => void;
  onCancel: () => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  onCancel,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-4">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            onClick={() => onStepClick(step.number)}
            className={`flex items-center gap-2 ${
              step.number <= currentStep || completedSteps.includes(step.number)
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.active
                  ? "bg-blue-600 text-white"
                  : completedSteps.includes(step.number)
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`text-sm font-medium ${
                step.active
                  ? "text-blue-600"
                  : completedSteps.includes(step.number)
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-0">
        <Button
          onClick={onCancel}
          variant="ghost"
          className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
