import { useState } from "react";
import type { Section, Question } from "../types/questionnaire.types";

export const useQuestionnaireManager = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [showAddSectionInput, setShowAddSectionInput] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingSectionIdx, setEditingSectionIdx] = useState<number | null>(
    null
  );
  const [editSectionName, setEditSectionName] = useState("");

  // Section management
  const handleAddSection = () => {
    setShowAddSectionInput(true);
    setNewSectionName("");
  };

  const handleConfirmAddSection = () => {
    if (newSectionName.trim()) {
      setSections([...sections, { name: newSectionName.trim() }]);
      setShowAddSectionInput(false);
      setNewSectionName("");
    }
  };

  const handleCancelAddSection = () => {
    setShowAddSectionInput(false);
    setNewSectionName("");
  };

  const handleDeleteSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleEditSection = (idx: number) => {
    setEditingSectionIdx(idx);
    setEditSectionName(sections[idx].name);
  };

  const handleConfirmEditSection = () => {
    if (editingSectionIdx !== null && editSectionName.trim()) {
      setSections(
        sections.map((section, idx) =>
          idx === editingSectionIdx
            ? { ...section, name: editSectionName.trim() }
            : section
        )
      );
      setEditingSectionIdx(null);
      setEditSectionName("");
    }
  };

  const handleCancelEditSection = () => {
    setEditingSectionIdx(null);
    setEditSectionName("");
  };

  // Question management
  const addQuestionToSection = (sectionIdx: number, question: Question) => {
    setSections(
      sections.map((section, idx) =>
        idx === sectionIdx
          ? { ...section, questions: [...(section.questions || []), question] }
          : section
      )
    );
  };

  const updateQuestionInSection = (
    sectionIdx: number,
    questionIdx: number,
    question: Question
  ) => {
    setSections(
      sections.map((section, idx) =>
        idx === sectionIdx
          ? {
              ...section,
              questions: section.questions?.map((q, qIdx) =>
                qIdx === questionIdx ? question : q
              ),
            }
          : section
      )
    );
  };

  const deleteQuestionFromSection = (
    sectionIdx: number,
    questionIdx: number
  ) => {
    setSections(
      sections.map((section, idx) =>
        idx === sectionIdx
          ? {
              ...section,
              questions: section.questions?.filter(
                (_, qIdx) => qIdx !== questionIdx
              ),
            }
          : section
      )
    );
  };

  return {
    sections,
    showAddSectionInput,
    newSectionName,
    editingSectionIdx,
    editSectionName,
    setNewSectionName,
    setEditSectionName,
    handleAddSection,
    handleConfirmAddSection,
    handleCancelAddSection,
    handleDeleteSection,
    handleEditSection,
    handleConfirmEditSection,
    handleCancelEditSection,
    addQuestionToSection,
    updateQuestionInSection,
    deleteQuestionFromSection,
  };
};
