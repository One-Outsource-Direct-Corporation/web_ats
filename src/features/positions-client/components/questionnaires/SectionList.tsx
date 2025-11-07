import { Button } from "@/shared/components/ui/button";
import { AddSectionInput } from "./AddSectionInput";
import { AddQuestionModal } from "./AddQuestionModal";
import type { Section, Questionnaire } from "../../types/questionnaire.types";
import { Move, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface SectionListProps {
  sections: Section[];
  addSection: (newSection: Section) => void;
  onUpdateSection?: (sectionIndex: number, updatedSection: Section) => void;
}

export function SectionList({
  sections,
  addSection,
  onUpdateSection,
}: SectionListProps) {
  const [showAddSectionInput, setShowAddSectionInput] = useState(false);

  const handleAddQuestion = (sectionIndex: number, question: Questionnaire) => {
    const section = sections[sectionIndex];
    const updatedSection: Section = {
      ...section,
      questionnaires: [...section.questionnaires, question],
    };

    if (onUpdateSection) {
      onUpdateSection(sectionIndex, updatedSection);
    }
  };

  const handleEditQuestion = (
    sectionIndex: number,
    questionIndex: number,
    updatedQuestion: Questionnaire
  ) => {
    const section = sections[sectionIndex];
    const updatedQuestionnaires = [...section.questionnaires];
    updatedQuestionnaires[questionIndex] = updatedQuestion;

    const updatedSection: Section = {
      ...section,
      questionnaires: updatedQuestionnaires,
    };

    if (onUpdateSection) {
      onUpdateSection(sectionIndex, updatedSection);
    }
  };

  const handleDeleteQuestion = (
    sectionIndex: number,
    questionIndex: number
  ) => {
    const section = sections[sectionIndex];
    const updatedQuestionnaires = section.questionnaires.filter(
      (_, idx) => idx !== questionIndex
    );

    const updatedSection: Section = {
      ...section,
      questionnaires: updatedQuestionnaires,
    };

    if (onUpdateSection) {
      onUpdateSection(sectionIndex, updatedSection);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 border-gray-300"
            // onClick={onMoveQuestionsClick}
          >
            <Move height={4} width={4} />
            Move Questions
          </Button>
          <Button
            type="button"
            variant="outline"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 hover:text-white text-white text-sm font-medium rounded-md"
            onClick={() => setShowAddSectionInput(true)}
          >
            Add Section
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200">
            <div className="bg-white rounded-lg border border-gray-200 flex items-center justify-between px-4 py-3">
              <span className="font-medium text-gray-900 text-base">
                {section.name}
              </span>
              <div className="flex gap-2">
                <AddQuestionModal
                  onSave={(question) => handleAddQuestion(idx, question)}
                />
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {section.questionnaires.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="space-y-2">
                  {section.questionnaires.map((question, qIdx) => (
                    <div
                      key={qIdx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {question.name}
                        </p>
                        {question.description && (
                          <p className="text-xs text-gray-500">
                            {question.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">{question.type}</p>
                      </div>
                      <div className="flex gap-1">
                        <AddQuestionModal
                          question={question}
                          onSave={(updatedQuestion) =>
                            handleEditQuestion(idx, qIdx, updatedQuestion)
                          }
                          onDelete={() => handleDeleteQuestion(idx, qIdx)}
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          className="p-1 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteQuestion(idx, qIdx)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {showAddSectionInput && (
          <AddSectionInput
            addSection={addSection}
            setShowAddSectionInput={setShowAddSectionInput}
          />
        )}
      </div>
    </div>
  );
}
