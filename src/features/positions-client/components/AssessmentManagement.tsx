import React from "react";
import { Button } from "@/shared/components/ui/button";
import { FileText } from "lucide-react";
import type { Assessment } from "../types/create_position.types";
import { Card } from "@/shared/components/ui/card";

interface AssessmentManagementProps {
  globalAssessments: Assessment[];
  selectedAssessmentForEdit: Assessment | null;
  onSelectAssessment: (assessment: Assessment) => void;
  onGoToPipeline: () => void;
}

export const AssessmentManagement: React.FC<AssessmentManagementProps> = ({
  globalAssessments,
  selectedAssessmentForEdit,
  onSelectAssessment,
  onGoToPipeline,
}) => {
  return (
    <Card className="p-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Assessment Management
        </h3>

        {globalAssessments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No assessments configured yet</p>
            <p className="text-sm text-gray-400 mb-6">
              Add assessments to your pipeline stages to get started
            </p>
            <Button
              onClick={onGoToPipeline}
              variant="outline"
              className="text-blue-600 border-blue-600"
            >
              Go to Pipeline Configuration
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedAssessmentForEdit?.id === assessment.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-300"
                }`}
                onClick={() => onSelectAssessment(assessment)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-blue-600 font-medium">
                    {assessment.stage}
                  </span>
                  <span className="text-xs text-gray-500">
                    {assessment.type}
                  </span>
                </div>

                <h4 className="font-semibold text-gray-800 mb-2">
                  {assessment.title}
                </h4>

                <p className="text-sm text-gray-600 mb-3">
                  {assessment.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{assessment.required ? "Required" : "Optional"}</span>
                  {assessment.timeLimit && (
                    <span>Time limit: {assessment.timeLimit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
