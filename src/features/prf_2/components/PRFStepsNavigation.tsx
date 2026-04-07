import type { StepErrors } from "@/features/prf_2/utils/validateSteps";
import { hasStepErrors } from "@/features/prf_2/utils/validateSteps";

const STEPS = [
  "Step 01",
  "Step 02",
  "Step 03",
  "Step 04",
  "Step 05",
  "Step 06",
];

interface PRFStepsNavigationProps {
  step: number;
  maxStepVisited: number;
  stepErrors: StepErrors;
  updateMode?: boolean;
  onStepClick: (targetStep: number) => void;
}

export default function PRFStepsNavigation({
  step,
  maxStepVisited,
  stepErrors,
  updateMode = false,
  onStepClick,
}: PRFStepsNavigationProps) {
  return (
    <div className="flex space-x-0 border border-gray-300 rounded-md overflow-hidden mt-10 mb-8">
      {STEPS.map((label, i) => {
        const currentStepIndex = i + 1;
        const isActive = step === currentStepIndex;
        const isVisited = updateMode || currentStepIndex <= maxStepVisited;
        const isClickable = updateMode
          ? !isActive
          : currentStepIndex <= maxStepVisited && !isActive;
        const hasError = hasStepErrors(stepErrors[currentStepIndex]);

        return (
          <div
            key={currentStepIndex}
            className={`flex-1 text-center py-2 text-sm font-semibold relative ${
              hasError
                ? "bg-red-600 text-white"
                : isActive
                  ? "bg-[#0056D2] text-white"
                  : isVisited
                    ? "bg-green-50 text-green-700"
                    : "bg-white text-gray-500"
            } ${
              isClickable
                ? hasError
                  ? "cursor-pointer hover:bg-red-700"
                  : isVisited
                    ? "cursor-pointer hover:bg-green-100"
                    : "cursor-pointer hover:bg-gray-200"
                : ""
            }`}
            onClick={() => {
              if (isClickable) {
                onStepClick(currentStepIndex);
              }
            }}
          >
            {label}
            {currentStepIndex < 6 && (
              <span className="absolute right-0 top-0 h-full w-px bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}
