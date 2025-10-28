import { useState } from "react";
import type {
  Assessment,
  AssessmentForm,
  AssessmentSettings,
  Question,
} from "../types/create_position.types";

export function useAssessments() {
  const [globalAssessments, setGlobalAssessments] = useState<Assessment[]>([]);
  const [assessmentForm, setAssessmentForm] = useState<AssessmentForm>({
    type: "",
    title: "",
    description: "",
    required: false,
  });
  const [editingAssessmentId, setEditingAssessmentId] = useState<number | null>(
    null
  );
  const [selectedAssessmentForEdit, setSelectedAssessmentForEdit] =
    useState<Assessment | null>(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState<{
    [key: number]: Question[];
  }>({});
  const [isEditingAssessment, setIsEditingAssessment] = useState(false);
  const [assessmentSettings, setAssessmentSettings] =
    useState<AssessmentSettings>({});
  const [assessmentMoveMode, setAssessmentMoveMode] = useState(false);
  const [selectedAssessmentForMove, setSelectedAssessmentForMove] = useState<
    number | null
  >(null);

  const openAssessmentPopup = () => {
    setAssessmentForm({
      type: "",
      title: "",
      description: "",
      required: false,
    });
    setEditingAssessmentId(null);
  };

  const editAssessment = (assessment: Assessment) => {
    setAssessmentForm({
      type: assessment.type,
      title: assessment.title,
      description: assessment.description,
      required: assessment.required,
    });
    setEditingAssessmentId(assessment.id);
  };

  const deleteAssessment = (assessmentId: number, setStagePopupData: any) => {
    setStagePopupData((prev: any) => ({
      ...prev,
      assessments: prev.assessments.filter((a: any) => a.id !== assessmentId),
    }));
  };

  const deleteGlobalAssessment = (
    assessmentId: number,
    setPipelineStages: any
  ) => {
    setGlobalAssessments((prev) => prev.filter((a) => a.id !== assessmentId));

    // Also remove from current stage popup if it exists there
    setPipelineStages((prevStages: any) =>
      prevStages.map((stage: any) => ({
        ...stage,
        steps: stage.steps.map((step: any) => ({
          ...step,
          assessments: (step.assessments || []).filter(
            (a: any) => a.id !== assessmentId
          ),
        })),
      }))
    );

    // If currently editing this assessment, clear the editing state
    if (selectedAssessmentForEdit?.id === assessmentId) {
      setSelectedAssessmentForEdit(null);
      setIsEditingAssessment(false);
    }

    // Remove questions for this assessment
    setAssessmentQuestions((prev) => {
      const updated = { ...prev };
      delete updated[assessmentId];
      return updated;
    });

    // Remove assessment settings when deleting assessment
    setAssessmentSettings((prev) => {
      const updated = { ...prev };
      delete updated[assessmentId];
      return updated;
    });
  };

  const moveAssessment = (
    targetIndex: number,
    stagePopupData: any,
    setStagePopupData: any
  ) => {
    if (selectedAssessmentForMove !== null) {
      const assessments = [...stagePopupData.assessments];
      const sourceIndex = assessments.findIndex(
        (a) => a.id === selectedAssessmentForMove
      );

      if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
        // Swap assessments
        const temp = assessments[sourceIndex];
        assessments[sourceIndex] = assessments[targetIndex];
        assessments[targetIndex] = temp;

        setStagePopupData((prev: any) => ({
          ...prev,
          assessments: assessments,
        }));
      }

      setAssessmentMoveMode(false);
      setSelectedAssessmentForMove(null);
    }
  };

  const selectAssessmentForEdit = (assessment: Assessment) => {
    setSelectedAssessmentForEdit(assessment);
    setIsEditingAssessment(true);
    // Initialize assessment settings if they don't exist
    if (!assessmentSettings[assessment.id]) {
      setAssessmentSettings((prev) => ({
        ...prev,
        [assessment.id]: {
          dueDate: assessment.dueDate || "2021-02-09",
          timeLimit: "01:00:00", // Default time limit
        },
      }));
    }
  };

  const saveAssessmentChanges = () => {
    if (selectedAssessmentForEdit) {
      // Save the current questions to the assessment
      const currentQuestions =
        assessmentQuestions[selectedAssessmentForEdit.id] || [];
      setAssessmentQuestions((prev) => ({
        ...prev,
        [selectedAssessmentForEdit.id]: currentQuestions,
      }));

      // Update the global assessment with saved settings
      const settings = assessmentSettings[selectedAssessmentForEdit.id];
      if (settings) {
        setGlobalAssessments((prev) =>
          prev.map((assessment) =>
            assessment.id === selectedAssessmentForEdit.id
              ? {
                  ...assessment,
                  dueDate: settings.dueDate,
                  timeLimit: settings.timeLimit,
                }
              : assessment
          )
        );
      }
    }
    setIsEditingAssessment(false);
  };

  const handleAssessmentDueDateChange = (
    assessmentId: number,
    dueDate: string
  ) => {
    setAssessmentSettings((prev) => ({
      ...prev,
      [assessmentId]: {
        ...prev[assessmentId],
        dueDate,
      },
    }));
  };

  const handleAssessmentTimeLimitChange = (
    assessmentId: number,
    timeLimit: string
  ) => {
    setAssessmentSettings((prev) => ({
      ...prev,
      [assessmentId]: {
        ...prev[assessmentId],
        timeLimit,
      },
    }));
  };

  return {
    globalAssessments,
    setGlobalAssessments,
    assessmentForm,
    setAssessmentForm,
    editingAssessmentId,
    setEditingAssessmentId,
    selectedAssessmentForEdit,
    setSelectedAssessmentForEdit,
    assessmentQuestions,
    setAssessmentQuestions,
    isEditingAssessment,
    setIsEditingAssessment,
    assessmentSettings,
    setAssessmentSettings,
    assessmentMoveMode,
    setAssessmentMoveMode,
    selectedAssessmentForMove,
    setSelectedAssessmentForMove,
    openAssessmentPopup,
    editAssessment,
    deleteAssessment,
    deleteGlobalAssessment,
    moveAssessment,
    selectAssessmentForEdit,
    saveAssessmentChanges,
    handleAssessmentDueDateChange,
    handleAssessmentTimeLimitChange,
  };
}
