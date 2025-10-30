import { useState } from "react";
import type { Question, QuestionOption } from "../types/questionnaire.types";

export const useQuestionForm = () => {
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [addQuestionSectionIdx, setAddQuestionSectionIdx] = useState<
    number | null
  >(null);
  const [editQuestionSectionIdx, setEditQuestionSectionIdx] = useState<
    number | null
  >(null);
  const [editQuestionIdx, setEditQuestionIdx] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionDesc, setQuestionDesc] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [questionMode, setQuestionMode] = useState("Parameter");
  const [parameterValue, setParameterValue] = useState("");
  const [options, setOptions] = useState<QuestionOption[]>([
    { value: "", score: 0 },
  ]);

  const handleOpenAddQuestion = (idx: number) => {
    setAddQuestionSectionIdx(idx);
    setIsEditMode(false);
    setShowAddQuestionModal(true);
    setQuestionText("");
    setQuestionDesc("");
    setQuestionType("Multiple Choice");
    setQuestionMode("Parameter");
    setParameterValue("");
    setOptions([{ value: "", score: 0 }]);
  };

  const handleOpenEditQuestion = (
    sectionIdx: number,
    questionIdx: number,
    question: Question
  ) => {
    setEditQuestionSectionIdx(sectionIdx);
    setEditQuestionIdx(questionIdx);
    setIsEditMode(true);
    setShowAddQuestionModal(true);
    setQuestionText(question.text);
    setQuestionDesc(question.desc || "");
    setQuestionType(question.type);
    setQuestionMode(question.mode);
    setParameterValue(question.parameter || "");
    setOptions(question.options || [{ value: "", score: 0 }]);
  };

  const handleAddOption = () => {
    setOptions([...options, { value: "", score: 0 }]);
  };

  const handleRemoveOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const handleOptionChange = (
    idx: number,
    field: "value" | "score",
    val: string | number
  ) => {
    setOptions(
      options.map((opt, i) => (i === idx ? { ...opt, [field]: val } : opt))
    );
  };

  const resetForm = () => {
    setShowAddQuestionModal(false);
    setAddQuestionSectionIdx(null);
    setEditQuestionSectionIdx(null);
    setEditQuestionIdx(null);
    setIsEditMode(false);
  };

  const getCurrentQuestion = () => ({
    text: questionText,
    desc: questionDesc,
    type: questionType as
      | "Multiple Choice"
      | "Checkboxes"
      | "Text Entry"
      | "Paragraph",
    mode: questionMode,
    options:
      questionType === "Multiple Choice" || questionType === "Checkboxes"
        ? options
        : undefined,
    parameter:
      questionType === "Text Entry" || questionType === "Paragraph"
        ? parameterValue
        : undefined,
  });

  return {
    showAddQuestionModal,
    addQuestionSectionIdx,
    editQuestionSectionIdx,
    editQuestionIdx,
    isEditMode,
    questionText,
    questionDesc,
    questionType,
    questionMode,
    parameterValue,
    options,
    setQuestionText,
    setQuestionDesc,
    setQuestionType,
    setQuestionMode,
    setParameterValue,
    handleOpenAddQuestion,
    handleOpenEditQuestion,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    resetForm,
    getCurrentQuestion,
  };
};
