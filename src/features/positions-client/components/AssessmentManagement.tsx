import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { FileText, Trash2, GripVertical } from "lucide-react";
import type {
  AssessmentInDb,
  AssessmentLocal,
  PipelineStep,
  PipelineStepInDb,
  PipelineStepLocal,
} from "@/shared/types/pipeline.types";
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
import type {
  Questionnaire,
  QuestionnaireDb,
  QuestionnaireLocal,
} from "../types/questionnaire.types";

interface AssessmentManagementProps {
  pipelineSteps: PipelineStep[];
  pipelineHandler: (updatedPipelines: PipelineStep[]) => void;
}

export const AssessmentManagement = ({
  pipelineSteps,
  pipelineHandler,
}: AssessmentManagementProps) => {
  const [selectedPipelineStep, setSelectedPipelineStep] =
    useState<PipelineStep | null>(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | number | null
  >(null);

  const pipelineStepsWithAssessments = pipelineSteps.filter(
    (step) => step.assessments && step.assessments.length > 0
  );

  const selectedAssessments = selectedPipelineStep?.assessments || [];

  const selectedAssessment = selectedAssessments.find((assessment) => {
    const id =
      (assessment as AssessmentInDb).id ||
      (assessment as AssessmentLocal).tempId;
    return id === selectedAssessmentId;
  });

  const handleAddQuestion = (question: Questionnaire) => {
    if (!selectedPipelineStep || !selectedAssessmentId) return;

    const updatedPipelines = pipelineSteps.map((step) => {
      const stepId = (step as any).id || (step as any).tempId;
      const selectedStepId =
        (selectedPipelineStep as any).id ||
        (selectedPipelineStep as any).tempId;

      if (stepId === selectedStepId) {
        const updatedAssessments = step.assessments.map((assessment) => {
          const id =
            (assessment as AssessmentInDb).id ||
            (assessment as AssessmentLocal).tempId;
          if (id === selectedAssessmentId) {
            return {
              ...assessment,
              questions: [...(assessment.questions || []), question],
            };
          }
          return assessment;
        });
        const updatedStep = { ...step, assessments: updatedAssessments };

        if (stepId === selectedStepId) {
          setSelectedPipelineStep(updatedStep);
        }

        return updatedStep;
      }
      return step;
    });

    pipelineHandler(updatedPipelines);
  };

  const handleUpdateQuestion = (updatedQuestion: Questionnaire) => {
    if (!selectedPipelineStep || !selectedAssessmentId) return;

    const updatedPipelines = pipelineSteps.map((step) => {
      const stepId =
        (step as PipelineStepInDb).id || (step as PipelineStepLocal).tempId;
      const selectedStepId =
        (selectedPipelineStep as PipelineStepInDb).id ||
        (selectedPipelineStep as PipelineStepLocal).tempId;

      if (stepId === selectedStepId) {
        const updatedAssessments = step.assessments.map((assessment) => {
          const id =
            (assessment as AssessmentInDb).id ||
            (assessment as AssessmentLocal).tempId;
          if (id === selectedAssessmentId) {
            const updatedQuestions = (assessment.questions || []).map((q) => {
              const qId =
                (q as QuestionnaireDb).id || (q as QuestionnaireLocal).tempId;
              const updatedQId =
                (updatedQuestion as any).id || (updatedQuestion as any).tempId;
              return qId === updatedQId ? updatedQuestion : q;
            });
            return { ...assessment, questions: updatedQuestions };
          }
          return assessment;
        });
        const updatedStep = { ...step, assessments: updatedAssessments };

        if (stepId === selectedStepId) {
          setSelectedPipelineStep(updatedStep);
        }

        return updatedStep;
      }
      return step;
    });

    pipelineHandler(updatedPipelines);
  };

  const handleDeleteQuestion = (questionToDelete: Questionnaire) => {
    if (!selectedPipelineStep || !selectedAssessmentId) return;

    const updatedPipelines = pipelineSteps.map((step) => {
      const stepId =
        (step as PipelineStepInDb).id || (step as PipelineStepLocal).tempId;
      const selectedStepId =
        (selectedPipelineStep as PipelineStepInDb).id ||
        (selectedPipelineStep as PipelineStepLocal).tempId;

      if (stepId === selectedStepId) {
        const updatedAssessments = step.assessments.map((assessment) => {
          const id =
            (assessment as AssessmentInDb).id ||
            (assessment as AssessmentLocal).tempId;
          if (id === selectedAssessmentId) {
            const qIdToDelete =
              (questionToDelete as QuestionnaireDb).id ||
              (questionToDelete as QuestionnaireLocal).tempId;

            const updatedQuestions = (assessment.questions || [])
              .map((q) => {
                const qId =
                  (q as QuestionnaireDb).id || (q as QuestionnaireLocal).tempId;
                if (qId === qIdToDelete) {
                  if (typeof qId === "number") return { ...q, _delete: true };
                  else return null;
                }
                return q;
              })
              .filter((q) => q !== null) as Questionnaire[];

            return { ...assessment, questions: updatedQuestions };
          }
          return assessment;
        });
        const updatedStep = { ...step, assessments: updatedAssessments };

        if (stepId === selectedStepId) {
          setSelectedPipelineStep(updatedStep);
        }

        return updatedStep;
      }
      return step;
    });

    pipelineHandler(updatedPipelines);
  };

  const assessmentQuestions = (selectedAssessment?.questions || []).filter(
    (q) => !(q as QuestionnaireDb)._delete
  );

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
            {/* Left Panel - Pipeline Step Selection and Assessments List */}
            <div className="space-y-4">
              {/* Pipeline Step Selection */}
              <Field>
                <FieldLabel>Select Pipeline Step</FieldLabel>
                <Select
                  value={
                    selectedPipelineStep
                      ? String(
                          (selectedPipelineStep as any).id ||
                            (selectedPipelineStep as any).tempId
                        )
                      : ""
                  }
                  onValueChange={(value) => {
                    const step = pipelineStepsWithAssessments.find((s) => {
                      const stepId = (s as any).id || (s as any).tempId;
                      return String(stepId) === value;
                    });
                    setSelectedPipelineStep(step || null);
                    setSelectedAssessmentId(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pipeline step">
                      {selectedPipelineStep && (
                        <div className="flex items-center gap-2">
                          <ProcessTypeIcon
                            processType={selectedPipelineStep.process_type}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span>
                            Stage {selectedPipelineStep.stage} -{" "}
                            {getProcessTypeLabel(
                              selectedPipelineStep.process_type
                            )}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {pipelineStepsWithAssessments.map((step) => {
                      const stepId = (step as any).id || (step as any).tempId;
                      return (
                        <SelectItem key={stepId} value={String(stepId)}>
                          <div className="flex items-center gap-2">
                            <ProcessTypeIcon
                              processType={step.process_type}
                              className="h-4 w-4 text-blue-600"
                            />
                            <span>
                              Stage {step.stage} -{" "}
                              {getProcessTypeLabel(step.process_type)}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </Field>

              {selectedPipelineStep && (
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
