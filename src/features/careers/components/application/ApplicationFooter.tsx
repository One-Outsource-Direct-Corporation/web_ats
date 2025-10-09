import { Button } from "@/shared/components/ui/button";

interface ApplicationFooterProps {
  currentStage: number;
  acceptTerms: boolean;
  certificationAccepted: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const ApplicationFooter: React.FC<ApplicationFooterProps> = ({
  currentStage,
  acceptTerms,
  certificationAccepted,
  onBack,
  onNext,
}) => {
  const isNextDisabled =
    (currentStage === 1 && !acceptTerms) ||
    (currentStage === 4 && !certificationAccepted);

  return (
    <div className="fixed bottom-0 left-0 lg:left-80 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
      <div className="max-w-4xl mx-auto flex justify-between">
        {currentStage > 1 && (
          <Button
            onClick={onBack}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-8 py-2"
          >
            Back
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={isNextDisabled}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 ml-auto"
        >
          {currentStage === 4 ? "Submit Application" : "Next"}
        </Button>
      </div>
    </div>
  );
};
