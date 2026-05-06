import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ApplicationCompleteModalProps {
  onViewDashboard: () => void;
}

export const ApplicationCompleteModal: React.FC<
  ApplicationCompleteModalProps
> = ({ onViewDashboard }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-gray-900/65 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Application Submitted!
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Congratulations! Your application has been submitted successfully. You can view and track the status of all your applications from your candidate dashboard.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/", { replace: true })}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Home
          </Button>
          <Button
            onClick={onViewDashboard}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
