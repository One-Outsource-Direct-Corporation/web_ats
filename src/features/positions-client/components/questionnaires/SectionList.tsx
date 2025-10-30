import { memo } from "react";
import { Button } from "@/shared/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { QuestionCard } from "./QuestionCard";
import { AddSectionInput } from "./AddSectionInput";
import type { Section } from "../../types/questionnaire.types";

interface SectionListProps {
  sections: Section[];
  showAddSectionInput: boolean;
  newSectionName: string;
  editingSectionIdx: number | null;
  editSectionName: string;
  onAddSectionClick: () => void;
  onMoveQuestionsClick: () => void;
  onNewSectionNameChange: (value: string) => void;
  onConfirmAddSection: () => void;
  onCancelAddSection: () => void;
  onEditSectionNameChange: (value: string) => void;
  onEditSection: (idx: number) => void;
  onConfirmEditSection: () => void;
  onCancelEditSection: () => void;
  onDeleteSection: (idx: number) => void;
  onAddQuestion: (idx: number) => void;
  onEditQuestion: (sectionIdx: number, questionIdx: number) => void;
  onDeleteQuestion: (sectionIdx: number, questionIdx: number) => void;
}

export const SectionList = memo(
  ({
    sections,
    showAddSectionInput,
    newSectionName,
    editingSectionIdx,
    editSectionName,
    onAddSectionClick,
    onMoveQuestionsClick,
    onNewSectionNameChange,
    onConfirmAddSection,
    onCancelAddSection,
    onEditSectionNameChange,
    onEditSection,
    onConfirmEditSection,
    onCancelEditSection,
    onDeleteSection,
    onAddQuestion,
    onEditQuestion,
    onDeleteQuestion,
  }: SectionListProps) => {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 border-gray-300"
              onClick={onMoveQuestionsClick}
            >
              <span className="material-icons align-middle text-base">
                open_with
              </span>{" "}
              Move Questions
            </Button>
            <Button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
              onClick={onAddSectionClick}
            >
              + Add Section
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200"
            >
              <SectionHeader
                sectionName={section.name}
                isEditing={editingSectionIdx === idx}
                editValue={editSectionName}
                onEditChange={onEditSectionNameChange}
                onEdit={() => onEditSection(idx)}
                onSaveEdit={onConfirmEditSection}
                onCancelEdit={onCancelEditSection}
                onAddQuestion={() => onAddQuestion(idx)}
                onDelete={() => onDeleteSection(idx)}
              />
              {section.questions && section.questions.length > 0 && (
                <div className="p-4 space-y-3">
                  {section.questions.map((question, qIdx) => (
                    <QuestionCard
                      key={qIdx}
                      question={question}
                      questionNumber={qIdx + 1}
                      onEdit={() => onEditQuestion(idx, qIdx)}
                      onDelete={() => onDeleteQuestion(idx, qIdx)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          {showAddSectionInput && (
            <AddSectionInput
              value={newSectionName}
              onChange={onNewSectionNameChange}
              onAdd={onConfirmAddSection}
              onCancel={onCancelAddSection}
            />
          )}
        </div>
      </div>
    );
  }
);

SectionList.displayName = "SectionList";
