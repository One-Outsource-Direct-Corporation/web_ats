import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { FileText, Trash2, GripVertical } from "lucide-react";
import type { PipelineStep } from "@/shared/types/pipeline.types";
import { Card } from "@/shared/components/ui/card";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  ProcessTypeIcon,
  getProcessTypeLabel,
} from "@/shared/components/reusables/pipeline/ProcessTypeIcon";
import { AddEditQuestionModal } from "./questionnaires/AddEditQuestionModal";
import type { Questionnaire } from "../types/questionnaire.types";

interface AssessmentManagementProps2 {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (updatedPipelines: PipelineStep[]) => void;
}

export const AssessmentManagement = ({
  pipelineSteps,
  pipelineHandler,
}: AssessmentManagementProps2) => {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedProcessType, setSelectedProcessType] = useState<string>("");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | number | null
  >(null);

  // Get unique stages from pipeline steps that have assessments
  const stagesWithAssessments = Array.from(
    new Set(
      pipelineSteps
        .filter((step) => step.assessments && step.assessments.length > 0)
        .map((step) => step.stage)
    )
  ).sort((a, b) => a - b);

  // Get process types for selected stage
  const processTypesForStage = selectedStage
    ? pipelineSteps
        .filter(
          (step) =>
            step.stage === selectedStage &&
            step.assessments &&
            step.assessments.length > 0
        )
        .map((step) => step.process_type)
    : [];

  // Get assessments for selected stage and process type
  const getAssessmentsForStageAndProcessType = (
    stage: number,
    processType: string
  ) => {
    const step = pipelineSteps.find(
      (s) => s.stage === stage && s.process_type === processType
    );
    return step?.assessments || [];
  };

  const selectedAssessments =
    selectedStage && selectedProcessType
      ? getAssessmentsForStageAndProcessType(selectedStage, selectedProcessType)
      : [];

  const selectedAssessment = selectedAssessments.find((assessment) => {
    const id = (assessment as any).id || (assessment as any).tempId;
    return id === selectedAssessmentId;
  });

  // Handler to add a new question to the selected assessment
  const handleAddQuestion = (question: Questionnaire) => {
    if (!selectedStage || !selectedProcessType || !selectedAssessmentId) return;

    const updatedPipelines = pipelineSteps.map((step) => {
      if (
        step.stage === selectedStage &&
        step.process_type === selectedProcessType
      ) {
        const updatedAssessments = step.assessments.map((assessment) => {
          const id = (assessment as any).id || (assessment as any).tempId;
          if (id === selectedAssessmentId) {
            return {
              ...assessment,
              questions: [...(assessment.questions || []), question],
            };
          }
          return assessment;
        });
        return { ...step, assessments: updatedAssessments };
      }
      return step;
    });

    pipelineHandler(updatedPipelines);
  };

  // Handler to update an existing question
  const handleUpdateQuestion = (updatedQuestion: Questionnaire) => {
    if (!selectedStage || !selectedProcessType || !selectedAssessmentId) return;

    const updatedPipelines = pipelineSteps.map((step) => {
      if (
        step.stage === selectedStage &&
        step.process_type === selectedProcessType
      ) {
        const updatedAssessments = step.assessments.map((assessment) => {
          const id = (assessment as any).id || (assessment as any).tempId;
          if (id === selectedAssessmentId) {
            const updatedQuestions = (assessment.questions || []).map((q) => {
              const qId = (q as any).id || (q as any).tempId;
              const updatedQId =
                (updatedQuestion as any).id || (updatedQuestion as any).tempId;
              return qId === updatedQId ? updatedQuestion : q;
            });
            return { ...assessment, questions: updatedQuestions };
          }
          return assessment;
        });
        return { ...step, assessments: updatedAssessments };
      }
      return step;
    });

    pipelineHandler(updatedPipelines);
  };

  // Handler to delete a question
  const handleDeleteQuestion = (questionToDelete: Questionnaire) => {
    if (!selectedStage || !selectedProcessType || !selectedAssessmentId) return;

    const updatedPipelines = pipelineSteps.map((step) => {
      if (
        step.stage === selectedStage &&
        step.process_type === selectedProcessType
      ) {
        const updatedAssessments = step.assessments.map((assessment) => {
          const id = (assessment as any).id || (assessment as any).tempId;
          if (id === selectedAssessmentId) {
            const qIdToDelete =
              (questionToDelete as any).id || (questionToDelete as any).tempId;
            const updatedQuestions = (assessment.questions || []).filter(
              (q) => {
                const qId = (q as any).id || (q as any).tempId;
                return qId !== qIdToDelete;
              }
            );
            return { ...assessment, questions: updatedQuestions };
          }
          return assessment;
        });
        return { ...step, assessments: updatedAssessments };
      }
      return step;
    });

    pipelineHandler(updatedPipelines);
  };

  const assessmentQuestions = selectedAssessment?.questions || [];

  return (
    <Card className="p-6">
      {pipelineSteps.length === 0 ||
      pipelineSteps.every((step) => !step.assessments?.length) ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No assessments configured yet</p>
          <p className="text-sm text-gray-400 mb-6">
            Add assessments to your pipeline stages to get started
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Assessment Configuration
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a process type to view and configure its assessments
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Stage and Process Type Selection and Assessments List */}
            <div className="space-y-4">
              {/* Stage Selection */}
              <Field>
                <FieldLabel>Select Stage</FieldLabel>
                <Select
                  value={selectedStage?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedStage(Number(value));
                    setSelectedProcessType("");
                    setSelectedAssessmentId(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stagesWithAssessments.map((stage) => (
                      <SelectItem key={stage} value={stage.toString()}>
                        Stage {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Process Type Selection - Only show when stage is selected */}
              {selectedStage && processTypesForStage.length > 0 && (
                <Field>
                  <FieldLabel>Filter by Process Type</FieldLabel>
                  <Select
                    value={selectedProcessType}
                    onValueChange={(value) => {
                      setSelectedProcessType(value);
                      setSelectedAssessmentId(null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a process type">
                        {selectedProcessType && (
                          <div className="flex items-center gap-2">
                            <ProcessTypeIcon
                              processType={selectedProcessType}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span>
                              {getProcessTypeLabel(selectedProcessType)}
                            </span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {processTypesForStage.map((processType) => (
                        <SelectItem key={processType} value={processType}>
                          <div className="flex items-center gap-2">
                            <ProcessTypeIcon
                              processType={processType}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span>{getProcessTypeLabel(processType)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}

              {selectedStage && selectedProcessType && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Assessments ({selectedAssessments.length})
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {selectedAssessments.map((assessment) => {
                      const id =
                        (assessment as any).id || (assessment as any).tempId;
                      const isSelected = selectedAssessmentId === id;

                      return (
                        <div
                          key={id}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedAssessmentId(id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-800">
                                {assessment.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {assessment.type}
                              </div>
                              {assessment.required && (
                                <span className="inline-block text-xs text-blue-600 font-medium mt-1">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Assessment Questions */}
            <div className="space-y-4">
              {selectedAssessment ? (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h4 className="text-md font-semibold text-gray-800">
                      Question for {selectedAssessment.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedAssessment.type}
                    </p>
                  </div>

                  {/* Question List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Questions ({assessmentQuestions.length})
                      </span>
                      <AddEditQuestionModal onSave={handleAddQuestion} />
                    </div>

                    {/* Actual Questions from Data */}
                    <div className="space-y-2">
                      {assessmentQuestions.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <p className="text-sm">No questions added yet</p>
                          <p className="text-xs mt-1">
                            Click "Add Question" to get started
                          </p>
                        </div>
                      ) : (
                        assessmentQuestions.map((question) => {
                          const qId =
                            (question as any).id || (question as any).tempId;
                          return (
                            <div
                              key={qId}
                              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                            >
                              <div className="flex items-start gap-3">
                                <button
                                  type="button"
                                  className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </button>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-start gap-2 flex-1">
                                      <Checkbox
                                        id={`q-${qId}`}
                                        className="mt-0.5"
                                      />
                                      <label
                                        htmlFor={`q-${qId}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                      >
                                        {question.name}
                                      </label>
                                    </div>
                                    <div className="flex gap-1">
                                      <AddEditQuestionModal
                                        question={question}
                                        onSave={handleUpdateQuestion}
                                        onDelete={handleDeleteQuestion}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() =>
                                          handleDeleteQuestion(question)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3 text-red-600" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 text-xs text-gray-500 ml-6">
                                    <span className="bg-white px-2 py-0.5 rounded border border-gray-200">
                                      {question.type}
                                    </span>
                                    {question.parameter && (
                                      <span className="bg-white px-2 py-0.5 rounded border border-gray-200">
                                        Parameters: {question.parameter}
                                      </span>
                                    )}
                                    {question.options &&
                                      question.options.length > 0 && (
                                        <span className="bg-white px-2 py-0.5 rounded border border-gray-200">
                                          {question.options.length} Options
                                        </span>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">
                      Select an assessment to view questions
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
