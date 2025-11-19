import type { StepProps } from "../types/create_position.types";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { StepErrors } from "../utils/validateSteps";
import { hasStepErrors } from "../utils/validateSteps";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/components/ui/dialog";

interface StepNavigationProps {
  steps: StepProps[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepNumber: number) => void;
  resetForm: () => void;
  stepErrors?: StepErrors;
  updateMode?: boolean;
}

export const StepNavigation = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  resetForm,
  stepErrors,
  updateMode = false,
}: StepNavigationProps) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/positions", { replace: true });
    resetForm();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-4">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        {steps.map((step) => {
          const hasError = stepErrors
            ? hasStepErrors(stepErrors[step.number])
            : false;
          const isCompleted = completedSteps.includes(step.number);
          const isActive = step.active;
          const isClickable =
            updateMode || step.number <= currentStep || isCompleted;

          return (
            <div
              key={step.number}
              className={`flex items-center gap-2 transition-colors duration-200 ${
                hasError
                  ? "text-red-600"
                  : isActive
                  ? "text-blue-600"
                  : isCompleted
                  ? "text-green-600"
                  : updateMode && isClickable
                  ? "text-blue-400 hover:text-blue-600"
                  : "text-gray-600"
              } ${isClickable ? "cursor-pointer" : ""}`}
              onClick={() => isClickable && onStepClick(step.number)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                  hasError
                    ? "bg-red-600 text-white"
                    : isActive
                    ? "bg-blue-600 text-white"
                    : isCompleted
                    ? "bg-green-600 text-white"
                    : updateMode && isClickable
                    ? "bg-blue-200 text-blue-800 hover:bg-blue-300 hover:text-blue-900"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  hasError
                    ? "text-red-600"
                    : isActive
                    ? "text-blue-600"
                    : isCompleted
                    ? "text-green-600"
                    : updateMode && isClickable
                    ? "text-blue-500 hover:text-blue-700"
                    : "text-gray-600"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-0">
        <Dialog>
          <DialogTrigger className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors duration-200">
            Cancel
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel? All unsaved changes will be
                lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Continue Editing</Button>
              </DialogClose>
              <Button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
              >
                Yes, Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
