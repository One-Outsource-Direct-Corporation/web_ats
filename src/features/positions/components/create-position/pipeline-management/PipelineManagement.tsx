import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { PipelineStage } from "../../../types/createPosition";

interface PipelineManagementProps {
  pipelineStages: PipelineStage[];
  onAddStepToStage: (stageId: number) => void;
  onEditStep?: (stageId: number, stepId: number) => void;
  onDeleteStep?: (stageId: number, stepId: number) => void;
}

export const PipelineManagement: React.FC<PipelineManagementProps> = ({
  pipelineStages,
  onAddStepToStage,
  onEditStep,
  onDeleteStep,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Pipeline Configuration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pipelineStages.map((stage) => (
          <div key={stage.id} className="border border-gray-300 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
              {stage.name}
            </h4>

            <div className="space-y-3 mb-4">
              {stage.steps.map((step) => (
                <div
                  key={step.id}
                  className="p-3 border border-gray-200 rounded-md bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <step.icon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {onEditStep && (
                        <Button
                          onClick={() => onEditStep(stage.id, step.id)}
                          variant="ghost"
                          size="sm"
                          className="p-1"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}
                      {onDeleteStep && (
                        <Button
                          onClick={() => onDeleteStep(stage.id, step.id)}
                          variant="ghost"
                          size="sm"
                          className="p-1 text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {step.description && (
                    <p className="text-xs text-gray-600 mt-2">
                      {step.description}
                    </p>
                  )}

                  {step.assessments && step.assessments.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-blue-600">
                        {step.assessments.length} assessment(s)
                      </span>
                    </div>
                  )}

                  {step.teamMembers && step.teamMembers.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-green-600">
                        {step.teamMembers.length} team member(s)
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => onAddStepToStage(stage.id)}
              variant="outline"
              size="sm"
              className="w-full text-blue-600 border-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
