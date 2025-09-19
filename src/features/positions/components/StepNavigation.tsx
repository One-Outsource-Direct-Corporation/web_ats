import { Button } from "@/shared/components/ui/button";
import type { StepConfig } from "../types/createNewPositionTypes";

interface StepNavigationProps {
  steps: StepConfig[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  completedSteps: number[];
}

export default function StepNavigation({
  steps,
  currentStep,
  onStepClick,
  onBack,
  onNext,
  onCancel,
  completedSteps,
}: StepNavigationProps) {
  return (
    <>
      {/* Steps Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                    step.active
                      ? "bg-blue-600 text-white"
                      : completedSteps.includes(step.number)
                      ? "bg-green-600 text-white"
                      : step.number <= currentStep
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  onClick={() => onStepClick(step.number)}
                >
                  {completedSteps.includes(step.number) ? "✓" : step.number}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium cursor-pointer ${
                      step.active
                        ? "text-blue-600"
                        : completedSteps.includes(step.number)
                        ? "text-green-600"
                        : step.number <= currentStep
                        ? "text-gray-700 hover:text-blue-600"
                        : "text-gray-400"
                    }`}
                    onClick={() => onStepClick(step.number)}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="ml-6 mr-6 flex-1">
                  <div
                    className={`h-0.5 ${
                      completedSteps.includes(step.number)
                        ? "bg-green-600"
                        : step.number < currentStep
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          className="text-gray-600 border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button onClick={onNext}>
            {currentStep === 5 ? "Next Step" : "Next"}
          </Button>
        </div>
      </div>
    </>
  );
}
