import { Button } from "@/shared/components/ui/button.tsx";
import { ArrowLeft } from "lucide-react";

interface PRFNavigationButtonProps {
  step: number;
  handleNext: () => void;
  handlePrevious: () => void;
  submitting?: boolean;
}

export default function PRFNavigationButton({
  step,
  handleNext,
  handlePrevious,
  submitting = false,
}: PRFNavigationButtonProps) {
  return (
    <div className="flex justify-between mt-10">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={step === 1 || submitting}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      <Button
        className="bg-[#0056D2] hover:bg-blue-700 text-white"
        onClick={handleNext}
        disabled={submitting}
      >
        {step === 6 ? (submitting ? "Submitting..." : "Submit") : "Next"}
      </Button>
    </div>
  );
}
