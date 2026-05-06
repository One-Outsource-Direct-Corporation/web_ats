import { useState } from "react";
import type { Questionnaire, QuestionOption, QuestionType } from "@/features/external_posting";

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
  const [questionType, setQuestionType] = useState<QuestionType>("multiple_choices");
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
    setQuestionType("multiple_choices");
    setQuestionMode("Parameter");
    setParameterValue("");
    setOptions([{ value: "", score: 0 }]);
  };

  const handleOpenEditQuestion = (
    sectionIdx: number,
    questionIdx: number,
    question: Questionnaire
  ) => {
    setEditQuestionSectionIdx(sectionIdx);
    setEditQuestionIdx(questionIdx);
    setIsEditMode(true);
    setShowAddQuestionModal(true);
    setQuestionText(question.question);
    setQuestionDesc(question.description || "");
    setQuestionType(question.question_type);
    setQuestionMode(question.parameter ? "Parameter" : "");
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
    question: questionText,
    description: questionDesc,
    question_type: questionType,
    options:
      questionType === "multiple_choices" || questionType === "checkboxes"
        ? options
        : undefined,
    parameter:
      questionType === "paragraph"
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
