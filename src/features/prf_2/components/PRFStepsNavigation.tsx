import type { Dispatch, SetStateAction } from "react";

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
  setStep: Dispatch<SetStateAction<number>>;
}

export default function PRFStepsNavigation({
  step,
  setStep,
}: PRFStepsNavigationProps) {
  return (
    <div className="flex space-x-0 border border-gray-300 rounded-md overflow-hidden mt-10 mb-8">
      {STEPS.map((label, i) => {
        const currentStepIndex = i + 1;
        return (
          <div
            key={currentStepIndex}
            className={`flex-1 text-center py-2 text-sm font-semibold relative ${
              step === currentStepIndex
                ? "bg-[#0056D2] text-white"
                : "hover:bg-gray-200 text-gray-500"
            }`}
            onClick={() => setStep(currentStepIndex)}
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
