import { useState } from "react";
import type {
  Question,
  QuestionnaireSection,
  SavedQuestionnaire,
} from "../types/create_position.types";

export function useQuestionnaires() {
  const [sections, setSections] = useState<QuestionnaireSection[]>([]);
  const [questionnaireName, setQuestionnaireName] = useState("");
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [showSectionInput, setShowSectionInput] = useState(false);
  const [editingQuestionIdStep3, setEditingQuestionIdStep3] = useState<
    number | null
  >(null);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");
  const [moveMode, setMoveMode] = useState(false);
  const [selectedQuestionForMove, setSelectedQuestionForMove] = useState<{
    sectionId: number;
    questionId: number;
  } | null>(null);
  const [savedQuestionnaires, setSavedQuestionnaires] = useState<
    SavedQuestionnaire[]
  >([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isTemplateSelected, setIsTemplateSelected] = useState(false);
  const [showTemplateOptions, setShowTemplateOptions] = useState(false);
  const [includeInCandidateExperience, setIncludeInCandidateExperience] =
    useState(true);

  // Question form state for Step 3
  const [questionFormStep3, setQuestionFormStep3] = useState<Question>({
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

  const handleMoveQuestion = (sectionId: number, questionId: number) => {
    if (selectedQuestionForMove) {
      // Find the question in the source section
      const sourceSection = sections.find(
        (s) => s.id === selectedQuestionForMove.sectionId
      );
      const questionToMove = sourceSection?.questions.find(
        (q) => q.id === selectedQuestionForMove.questionId
      );

      if (questionToMove) {
        // Remove the question from the source section
        const updatedSections = sections.map((section) => {
          if (section.id === selectedQuestionForMove.sectionId) {
            return {
              ...section,
              questions: section.questions.filter(
                (q) => q.id !== selectedQuestionForMove.questionId
              ),
            };
          }
          return section;
        });

        // Add the question to the destination section
        const finalSections = updatedSections.map((section) => {
          if (section.id === sectionId) {
            const targetQuestionIndex = section.questions.findIndex(
              (q) => q.id === questionId
            );
            const newQuestions = [...section.questions];
            newQuestions.splice(targetQuestionIndex, 0, questionToMove);
            return {
              ...section,
              questions: newQuestions,
            };
          }
          return section;
        });

        setSections(finalSections);
        setSelectedQuestionForMove(null);
        setMoveMode(false);
      }
    }
  };

  const saveQuestionStep3 = () => {
    if (questionFormStep3.question.trim() && currentSectionId) {
      const newQuestion: Question = {
        id: editingQuestionIdStep3 || Date.now(),
        question: questionFormStep3.question,
        description: questionFormStep3.description,
        type: questionFormStep3.type,
        mode: questionFormStep3.mode,
        options: questionFormStep3.options,
        scorePerOption: questionFormStep3.scorePerOption,
        parameterValue: questionFormStep3.parameterValue,
        nonNegotiableText: questionFormStep3.nonNegotiableText,
        nonNegotiableOptions: questionFormStep3.nonNegotiableOptions,
        required: questionFormStep3.required,
      };

      setSections((prev) =>
        prev.map((section) => {
          if (section.id === currentSectionId) {
            if (editingQuestionIdStep3) {
              return {
                ...section,
                questions: section.questions.map((q) =>
                  q.id === editingQuestionIdStep3 ? newQuestion : q
                ),
              };
            } else {
              return {
                ...section,
                questions: [...section.questions, newQuestion],
              };
            }
          }
          return section;
        })
      );

      setEditingQuestionIdStep3(null);
      setCurrentSectionId(null);
    }
  };

  const handleSaveAsNewTemplate = () => {
    if (questionnaireName.trim() && sections.length > 0) {
      const newQuestionnaire: SavedQuestionnaire = {
        name: questionnaireName,
        sections: sections,
      };
      setSavedQuestionnaires((prev) => [...prev, newQuestionnaire]);
      setSelectedTemplate(questionnaireName);
      setIsTemplateSelected(true);
    }
  };

  const handleUpdateTemplate = () => {
    if (questionnaireName.trim() === "") {
      alert("Questionnaire name cannot be empty.");
      return;
    }

    const updatedTemplates = savedQuestionnaires.map((template) =>
      template.name === selectedTemplate
        ? { name: questionnaireName, sections: sections }
        : template
    );
    setSavedQuestionnaires(updatedTemplates);
    setSelectedTemplate(questionnaireName);
  };

  const getNonNegotiableQuestionsForForm = () => {
    const nonNegotiableFields: Array<{
      category: string;
      field: string;
      type:
        | "text"
        | "select"
        | "radio"
        | "checkbox"
        | "file"
        | "date"
        | "number";
      options?: string[];
    }> = [];

    // Add questionnaire non-negotiables
    sections.forEach((section) => {
      section.questions.forEach((question) => {
        if (question.mode === "Non-negotiable") {
          nonNegotiableFields.push({
            category: `Questionnaire - ${section.name}`,
            field: question.question,
            type:
              question.type === "Multiple Choice"
                ? "radio"
                : question.type === "Checkboxes"
                ? "checkbox"
                : question.type === "Text Entry"
                ? "text"
                : question.type === "Paragraph"
                ? "text"
                : "text",
            options:
              question.type === "Multiple Choice" ||
              question.type === "Checkboxes"
                ? question.options.filter((opt) => opt.trim() !== "")
                : undefined,
          });
        }
      });
    });

    return nonNegotiableFields;
  };

  return {
    sections,
    setSections,
    questionnaireName,
    setQuestionnaireName,
    currentSectionId,
    setCurrentSectionId,
    newSectionName,
    setNewSectionName,
    showSectionInput,
    setShowSectionInput,
    editingQuestionIdStep3,
    setEditingQuestionIdStep3,
    editingSectionId,
    setEditingSectionId,
    editingSectionName,
    setEditingSectionName,
    moveMode,
    setMoveMode,
    selectedQuestionForMove,
    setSelectedQuestionForMove,
    savedQuestionnaires,
    setSavedQuestionnaires,
    selectedTemplate,
    setSelectedTemplate,
    isTemplateSelected,
    setIsTemplateSelected,
    showTemplateOptions,
    setShowTemplateOptions,
    includeInCandidateExperience,
    setIncludeInCandidateExperience,
    questionFormStep3,
    setQuestionFormStep3,
    handleMoveQuestion,
    saveQuestionStep3,
    handleSaveAsNewTemplate,
    handleUpdateTemplate,
    getNonNegotiableQuestionsForForm,
  };
}
