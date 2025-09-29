import { useState } from "react";
import type { Assessment, Question } from "../../types/createPosition";

export const useAssessmentManagement = () => {
  const [globalAssessments, setGlobalAssessments] = useState<Assessment[]>([]);
  const [selectedAssessmentForEdit, setSelectedAssessmentForEdit] =
    useState<Assessment | null>(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState<{
    [key: number]: Question[];
  }>({});
  const [isEditingAssessment, setIsEditingAssessment] = useState(false);

  // Question Management
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
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

  const addQuestionToAssessment = (
    assessmentId: number,
    question: Question
  ) => {
    const questionWithId = { ...question, id: Date.now() };
    setAssessmentQuestions((prev) => ({
      ...prev,
      [assessmentId]: [...(prev[assessmentId] || []), questionWithId],
    }));
  };

  const updateQuestionInAssessment = (
    assessmentId: number,
    questionId: number,
    updatedQuestion: Question
  ) => {
    setAssessmentQuestions((prev) => ({
      ...prev,
      [assessmentId]: (prev[assessmentId] || []).map((q) =>
        q.id === questionId ? updatedQuestion : q
      ),
    }));
  };

  const deleteQuestionFromAssessment = (
    assessmentId: number,
    questionId: number
  ) => {
    setAssessmentQuestions((prev) => ({
      ...prev,
      [assessmentId]: (prev[assessmentId] || []).filter(
        (q) => q.id !== questionId
      ),
    }));
  };

  const resetQuestionForm = () => {
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
  };

  const startEditingQuestion = (question: Question) => {
    setQuestionForm(question);
    setEditingQuestionId(question.id);
  };

  const resetAssessmentSelection = () => {
    setSelectedAssessmentForEdit(null);
    setIsEditingAssessment(false);
    resetQuestionForm();
  };

  return {
    globalAssessments,
    setGlobalAssessments,
    selectedAssessmentForEdit,
    setSelectedAssessmentForEdit,
    assessmentQuestions,
    setAssessmentQuestions,
    isEditingAssessment,
    setIsEditingAssessment,
    editingQuestionId,
    setEditingQuestionId,
    questionForm,
    setQuestionForm,
    addQuestionToAssessment,
    updateQuestionInAssessment,
    deleteQuestionFromAssessment,
    resetQuestionForm,
    startEditingQuestion,
    resetAssessmentSelection,
  };
};
