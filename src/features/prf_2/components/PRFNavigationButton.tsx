import { Button } from "@/shared/components/ui/button.tsx";
import { ArrowLeft } from "lucide-react";

interface PRFNavigationButtonProps {
  step: number;
  handleNext: () => void;
  handlePrevious: () => void;
  submitting?: boolean;
  updateMode?: boolean;
  onSaveDraft?: () => Promise<void> | void;
}

export default function PRFNavigationButton({
  step,
  handleNext,
  handlePrevious,
  submitting = false,
  updateMode = false,
  onSaveDraft,
}: PRFNavigationButtonProps) {
  const submitLabel = updateMode ? "Update" : "Submit";
  const submittingLabel = updateMode ? "Updating..." : "Submitting...";

  return (
    <div className="flex justify-between mt-10">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={step === 1 || submitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {onSaveDraft && (
          <Button
            variant="secondary"
            onClick={() => {
              void onSaveDraft();
            }}
            disabled={submitting}
          >
            Save as Draft
          </Button>
        )}
      </div>
      <Button
        className="bg-[#0056D2] hover:bg-blue-700 text-white"
        onClick={handleNext}
        disabled={submitting}
      >
        {step === 6 ? (submitting ? submittingLabel : submitLabel) : "Next"}
      </Button>
    </div>
  );
}
