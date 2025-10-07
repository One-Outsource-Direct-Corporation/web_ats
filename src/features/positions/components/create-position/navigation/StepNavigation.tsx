import type { StepProps } from "../../../types/createPosition";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  resetForm: () => void;
}

export const StepNavigation = ({
  steps,
  currentStep,
  completedSteps,
  resetForm,
}: StepNavigationProps) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/positions", { replace: true });
    resetForm();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-4">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center gap-2">
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
