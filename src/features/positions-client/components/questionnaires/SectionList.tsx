import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { AddSectionInput } from "./AddSectionInput";
import type {
  Section,
  Questionnaire,
  SectionDb,
  SectionLocal,
  QuestionnaireDb,
  QuestionnaireLocal,
} from "../../types/questionnaire.types";
import { Move, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddEditQuestionModal } from "./AddEditQuestionModal";

interface SectionListProps {
  sections: Section[];
  addSection: (newSection: Section) => void;
  onUpdateSection: (id: number | string, updatedSection: Section) => void;
  onDeleteSection: (id: number | string) => void;
}

export function SectionList({
  sections,
  addSection,
  onUpdateSection,
  onDeleteSection,
}: SectionListProps) {
  const [showAddSectionInput, setShowAddSectionInput] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<
    number | string | null
  >(null);
  const [editingSectionName, setEditingSectionName] = useState("");

  function getIdSection(section: Section): number | string {
    return (section as SectionDb).id ?? (section as SectionLocal).tempId;
  }

  function getIdQuestion(question: Questionnaire): number | string {
    return (
      (question as QuestionnaireDb).id ??
      (question as QuestionnaireLocal).tempId
    );
  }

  function handleAddQuestion(section: Section, question: Questionnaire) {
    const sectionId = getIdSection(section);
    const updatedSection: Section = {
      ...section,
      questionnaires: [...section.questionnaires, question],
    };
    onUpdateSection(sectionId, updatedSection);
  }

  function handleEditQuestion(
    section: Section,
    id: number | string,
    updatedQuestion: Questionnaire
  ) {
    const updatedQuestionnaires = section.questionnaires.map((q) =>
      getIdQuestion(q) === id ? updatedQuestion : q
    );

    const updatedSection: Section = {
      ...section,
      questionnaires: updatedQuestionnaires,
    };

    onUpdateSection(getIdSection(section), updatedSection);
  }

  function handleDeleteQuestion(section: Section, id: number | string) {
    let updatedQuestionnaires;
    if (typeof id === "number") {
      updatedQuestionnaires = section.questionnaires.map((q) =>
        getIdQuestion(q) === id ? { ...q, _delete: true } : q
      );
    } else {
      updatedQuestionnaires = section.questionnaires.filter(
        (q) => getIdQuestion(q) !== id
      );
    }
    const updatedSection: Section = {
      ...section,
      questionnaires: updatedQuestionnaires,
    };
    if (onUpdateSection) {
      onUpdateSection(getIdSection(section), updatedSection);
    }
  }

  function handleEditSectionClick(section: Section) {
    setEditingSectionId(getIdSection(section));
    setEditingSectionName(section.name);
  }

  function handleSaveEditSection(section: Section) {
    if (editingSectionName.trim()) {
      const updatedSection: Section = {
        ...section,
        name: editingSectionName,
      };
      onUpdateSection(getIdSection(section), updatedSection);
      setEditingSectionId(null);
      setEditingSectionName("");
    }
  }

  function handleCancelEditSection() {
    setEditingSectionId(null);
    setEditingSectionName("");
  }

  function handleDeleteSectionClick(section: Section) {
    onDeleteSection(getIdSection(section));
  }

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
        {sections.length > 0 ? (
          sections
            .filter((section) => !(section as SectionDb)._delete)
            .map((section) => (
              <div
                key={getIdSection(section)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-white flex items-center justify-between px-4 py-3">
                  {editingSectionId === getIdSection(section) ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="text"
                        value={editingSectionName}
                        onChange={(e) => setEditingSectionName(e.target.value)}
                        className="flex-1"
                        placeholder="Section name"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSaveEditSection(section)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEditSection}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900 text-base">
                        {section.name}
                      </span>
                      <div className="flex gap-2">
                        <AddEditQuestionModal
                          onSave={(question) =>
                            handleAddQuestion(section, question)
                          }
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          className="p-2 text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditSectionClick(section)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          type="button"
                          className="p-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteSectionClick(section)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                {section.questionnaires.filter(
                  (q) => !(q as QuestionnaireDb)._delete
                ).length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="space-y-2">
                      {section.questionnaires
                        .filter((q) => !(q as QuestionnaireDb)._delete)
                        .map((question) => (
                          <div
                            key={getIdQuestion(question)}
                            className="flex items-center justify-between p-2rounded"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {question.question}
                              </p>
                              {question.description && (
                                <p className="text-xs text-gray-500">
                                  {question.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-400">
                                {question.question_type}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <AddEditQuestionModal
                                question={question}
                                onSave={(updatedQuestion) =>
                                  handleEditQuestion(
                                    section,
                                    getIdQuestion(question),
                                    updatedQuestion
                                  )
                                }
                                onDelete={() =>
                                  handleDeleteQuestion(
                                    section,
                                    getIdQuestion(question)
                                  )
                                }
                              />
                              <Button
                                variant="ghost"
                                type="button"
                                className="p-1 text-red-500 hover:text-red-700"
                                onClick={() =>
                                  handleDeleteQuestion(
                                    section,
                                    getIdQuestion(question)
                                  )
                                }
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
            ))
        ) : (
          <div className="text-sm text-gray-500 text-center">
            No sections added yet.
          </div>
        )}
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
