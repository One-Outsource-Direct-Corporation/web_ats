import { useState } from "react";
import type {
  Question,
  SavedQuestionnaire,
} from "../types/createNewPositionTypes";

export function useQuestions() {
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [showTemplateConfirmModal, setShowTemplateConfirmModal] =
    useState(false);
  const [pendingTemplate, setPendingTemplate] = useState("");
  const [moveQuestionModeStep5, setMoveQuestionModeStep5] = useState(false);
  const [selectedQuestionForMoveStep5, setSelectedQuestionForMoveStep5] =
    useState<number | null>(null);

  // Question form state for Step 5
  const [questionForm, setQuestionForm] = useState<Question>({
    id: 0,
    question: "",
    description: "",
    type: "Multiple Choice",
    mode: "Parameter",
    options: ["", "", "", ""],
    scorePerOption: [],
    parameterValue: "",
    nonNegotiableText: "",
    nonNegotiableOptions: [],
    required: false,
  });

  const openQuestionModal = () => {
    setQuestionForm({
      id: 0,
      question: "",
      description: "",
      type: "Multiple Choice",
      mode: "Parameter",
      options: ["", "", "", ""],
      scorePerOption: [],
      parameterValue: "",
      nonNegotiableText: "",
      nonNegotiableOptions: [],
      required: false,
    });
    setEditingQuestionId(null);
    setShowAddQuestionModal(true);
  };

  const editQuestion = (question: Question) => {
    setQuestionForm({
      id: question.id,
      question: question.question,
      description: question.description,
      type: question.type,
      mode: question.mode,
      options: question.options,
      scorePerOption: question.scorePerOption || [],
      parameterValue: question.parameterValue || "",
      nonNegotiableText: question.nonNegotiableText || "",
      nonNegotiableOptions: question.nonNegotiableOptions || [],
      required: question.required,
    });
    setEditingQuestionId(question.id);
    setShowAddQuestionModal(true);
  };

  const deleteQuestion = (
    questionId: number,
    selectedAssessmentForEdit: any,
    setAssessmentQuestions: any
  ) => {
    if (selectedAssessmentForEdit) {
      setAssessmentQuestions((prev: any) => ({
        ...prev,
        [selectedAssessmentForEdit.id]: (
          prev[selectedAssessmentForEdit.id] || []
        ).filter((q: any) => q.id !== questionId),
      }));
    }
  };

  const saveQuestion = (
    selectedAssessmentForEdit: any,
    setAssessmentQuestions: any
  ) => {
    if (questionForm.question.trim() && selectedAssessmentForEdit) {
      const newQuestion: Question = {
        id: editingQuestionId || Date.now(),
        question: questionForm.question,
        description: questionForm.description,
        type: questionForm.type,
        mode: questionForm.mode,
        options: questionForm.options,
        scorePerOption: questionForm.scorePerOption,
        parameterValue: questionForm.parameterValue,
        nonNegotiableText: questionForm.nonNegotiableText,
        nonNegotiableOptions: questionForm.nonNegotiableOptions,
        required: questionForm.required,
      };

      setAssessmentQuestions((prev: any) => {
        const currentQuestions = prev[selectedAssessmentForEdit.id] || [];
        if (editingQuestionId) {
          return {
            ...prev,
            [selectedAssessmentForEdit.id]: currentQuestions.map((q: any) =>
              q.id === editingQuestionId ? newQuestion : q
            ),
          };
        } else {
          return {
            ...prev,
            [selectedAssessmentForEdit.id]: [...currentQuestions, newQuestion],
          };
        }
      });

      setShowAddQuestionModal(false);
      setEditingQuestionId(null);
    }
  };

  const handleMoveQuestionStep5 = (
    targetQuestionId: number,
    selectedAssessmentForEdit: any,
    assessmentQuestions: any,
    setAssessmentQuestions: any
  ) => {
    if (selectedAssessmentForEdit && selectedQuestionForMoveStep5 !== null) {
      const currentQuestions = [
        ...(assessmentQuestions[selectedAssessmentForEdit.id] || []),
      ];
      const sourceIndex = currentQuestions.findIndex(
        (q: any) => q.id === selectedQuestionForMoveStep5
      );
      const targetIndex = currentQuestions.findIndex(
        (q: any) => q.id === targetQuestionId
      );

      if (
        sourceIndex !== -1 &&
        targetIndex !== -1 &&
        sourceIndex !== targetIndex
      ) {
        const [movedQuestion] = currentQuestions.splice(sourceIndex, 1);
        currentQuestions.splice(targetIndex, 0, movedQuestion);

        setAssessmentQuestions((prev: any) => ({
          ...prev,
          [selectedAssessmentForEdit.id]: currentQuestions,
        }));
      }
      setMoveQuestionModeStep5(false);
      setSelectedQuestionForMoveStep5(null);
    }
  };

  const selectTemplate = (
    templateName: string,
    selectedAssessmentForEdit: any,
    assessmentQuestions: any,
    applyTemplate: any
  ) => {
    if (selectedAssessmentForEdit) {
      const currentQuestions =
        assessmentQuestions[selectedAssessmentForEdit.id] || [];
      if (currentQuestions.length > 0) {
        // Show confirmation modal if there are existing questions
        setPendingTemplate(templateName);
        setShowTemplateConfirmModal(true);
      } else {
        // Apply template directly if no existing questions
        applyTemplate(templateName);
      }
    }
    setTemplateSearchQuery("");
  };

  const applyTemplate = (
    templateName: string,
    savedQuestionnaires: SavedQuestionnaire[],
    selectedAssessmentForEdit: any,
    setAssessmentQuestions: any
  ) => {
    const template = savedQuestionnaires.find((t) => t.name === templateName);
    if (template && selectedAssessmentForEdit) {
      // Convert template questions to assessment questions
      const templateQuestions: Question[] = [];
      template.sections.forEach((section) => {
        section.questions.forEach((q: any) => {
          templateQuestions.push({
            id: Date.now() + Math.random(),
            question: q.question,
            description: q.description,
            type: q.type,
            mode: q.mode,
            options: q.options,
            scorePerOption: q.scorePerOption || [],
            parameterValue: q.parameterValue || "",
            nonNegotiableText: q.nonNegotiableText,
            nonNegotiableOptions: q.nonNegotiableOptions || [],
            required: false,
          });
        });
      });
      setAssessmentQuestions((prev: any) => ({
        ...prev,
        [selectedAssessmentForEdit.id]: templateQuestions,
      }));
    }
  };

  const handleTemplateConfirm = (
    savedQuestionnaires: SavedQuestionnaire[],
    selectedAssessmentForEdit: any,
    setAssessmentQuestions: any
  ) => {
    applyTemplate(
      pendingTemplate,
      savedQuestionnaires,
      selectedAssessmentForEdit,
      setAssessmentQuestions
    );
    setShowTemplateConfirmModal(false);
    setPendingTemplate("");
  };

  const handleTemplateCancel = () => {
    setShowTemplateConfirmModal(false);
    setPendingTemplate("");
  };

  return {
    showAddQuestionModal,
    setShowAddQuestionModal,
    editingQuestionId,
    setEditingQuestionId,
    templateSearchQuery,
    setTemplateSearchQuery,
    showTemplateConfirmModal,
    setShowTemplateConfirmModal,
    pendingTemplate,
    setPendingTemplate,
    moveQuestionModeStep5,
    setMoveQuestionModeStep5,
    selectedQuestionForMoveStep5,
    setSelectedQuestionForMoveStep5,
    questionForm,
    setQuestionForm,
    openQuestionModal,
    editQuestion,
    deleteQuestion,
    saveQuestion,
    handleMoveQuestionStep5,
    selectTemplate,
    applyTemplate,
    handleTemplateConfirm,
    handleTemplateCancel,
  };
}
