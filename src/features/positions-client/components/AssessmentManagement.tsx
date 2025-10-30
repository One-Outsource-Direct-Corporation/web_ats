import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { FileText } from "lucide-react";
import type { Assessment, PipelineStep } from "../types/create_position.types";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/shared/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Edit2, Trash2 } from "lucide-react";
interface AssessmentManagementProps2 {
  pipelineSteps: PipelineStep[];
  goToPipeline: () => void;
}

export const AssessmentManagement = ({
  pipelineSteps,
  goToPipeline,
}: AssessmentManagementProps2) => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | number | null
  >(null);
  return (
    <Card className="p-6">
      {pipelineSteps.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No assessments configured yet</p>
          <p className="text-sm text-gray-400 mb-6">
            Add assessments to your pipeline stages to get started
          </p>
          <Button
            onClick={goToPipeline}
            variant="outline"
            className="text-blue-600 border-blue-600"
          >
            Go to Pipeline Configuration
          </Button>
        </div>
      ) : (
        <FieldSet>
          <span className="text-sm font-semibold text-gray-800">
            Select an assessment to configure questions
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldGroup>
              <Field>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Assessment by Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stage1">Stage 1</SelectItem>
                    <SelectItem value="stage2">Stage 2</SelectItem>
                    <SelectItem value="stage3">Stage 3</SelectItem>
                    <SelectItem value="stage4">Stage 4</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {pipelineSteps.flatMap((step) =>
                  step.assessments.map((assessment) => {
                    const id =
                      assessment.source === "db"
                        ? assessment.id
                        : assessment.localId;
                    const isSelected = selectedAssessmentId === id;
                    return (
                      <div
                        key={id}
                        className={`border-2 border-blue-200 rounded-lg p-4 cursor-pointer transition-colors mb-3 ${
                          isSelected ? "bg-blue-50" : "bg-white"
                        }`}
                        style={{ boxShadow: "0 0 0 2px #2563eb22" }}
                        onClick={() => setSelectedAssessmentId(id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium text-gray-800">
                              {assessment.type}
                            </span>
                            <div className="text-xs text-blue-700 mt-1">
                              Stage {step.stage.toString().padStart(2, "0")}
                              <span className="mx-1">•</span>
                              {assessment.required ? "Required" : "Optional"}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-blue-100"
                            >
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </FieldGroup>

            <FieldGroup>
              <Input placeholder="Search template question" />
              <FieldGroup className="flex md:flex-row gap-2 mt-2">
                <Field>
                  <FieldLabel>Set Due</FieldLabel>
                  <Input type="date" />
                </Field>
                <Field>
                  <FieldLabel>Set Time Limit</FieldLabel>
                  <Input type="time" />
                </Field>
              </FieldGroup>
            </FieldGroup>
          </div>
          <FieldSeparator />
          <div>Selected Assessment Content Here</div>
        </FieldSet>
      )}
    </Card>
  );
};
