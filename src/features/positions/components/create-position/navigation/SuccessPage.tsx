import React from "react";
import { Button } from "@/shared/components/ui/button";
import type { CreatePositionFormData } from "@/features/positions/types/create_position.types";

interface SuccessPageProps {
  formData: CreatePositionFormData;
  onViewAllPositions: () => void;
  onCreateAnother: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  formData,
  onViewAllPositions,
  onCreateAnother,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-[100px]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Position Created Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your new position "{formData.job_title}" has been created and is
            ready for publishing.
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Position Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-700">Job Title:</strong>
                <span className="ml-2">{formData.job_title}</span>
              </div>
              <div>
                <strong className="text-gray-700">Department:</strong>
                <span className="ml-2">{formData.department}</span>
              </div>
              <div>
                <strong className="text-gray-700">Employment Type:</strong>
                <span className="ml-2">{formData.employment_type}</span>
              </div>
              <div>
                <strong className="text-gray-700">Work Setup:</strong>
                <span className="ml-2">{formData.work_setup}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={onViewAllPositions}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              View All Positions
            </Button>
            <Button
              onClick={onCreateAnother}
              variant="outline"
              className="text-gray-600 border-gray-300"
            >
              Create Another Position
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
