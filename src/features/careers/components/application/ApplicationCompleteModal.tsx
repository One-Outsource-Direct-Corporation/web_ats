import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ApplicationCompleteModalProps {
  onTrackApplication: () => void;
}

export const ApplicationCompleteModal: React.FC<
  ApplicationCompleteModalProps
> = ({ onTrackApplication }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-gray-900/65 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Application Complete!
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Congratulations! Your application is complete! 🎉 A tracking code has
          been sent to your email. You can use this code to easily track your
          application's progress through the Track Application section. We're
          excited to have you on this journey!
        </p>
        {/* TODO: Brincg back the tracking code after submission */}
        <div className="bg-blue-50 p-3 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-1">Your tracking code:</p>
          <p className="text-lg font-bold text-blue-600">303030</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/", { replace: true })}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Home
          </Button>
          <Button
            onClick={onTrackApplication}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Track Application
          </Button>
        </div>
      </div>
    </div>
  );
};
