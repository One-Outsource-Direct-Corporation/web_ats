import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { SectionList } from "./SectionList";
import { Input } from "@/shared/components/ui/input";
import type {
  Section,
  ApplicationFormQuestionnaire,
  ApplicationFormQuestionnaireDb,
  SectionLocal,
  SectionDb,
  QuestionnaireDb,
  QuestionnaireLocal,
} from "../../types/questionnaire.types";

interface QuestionnaireBaseProps {
  questionnaire: ApplicationFormQuestionnaire;
  onQuestionnaireChange?: (
    updatedQuestionnaire: ApplicationFormQuestionnaire
  ) => void;
}

export default function QuestionnaireBase({
  questionnaire,
  onQuestionnaireChange,
}: QuestionnaireBaseProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(
    undefined
  );

  // Helper function to update questionnaire and sync with parent
  function handleSetQuestionnaire(
    field: keyof ApplicationFormQuestionnaire,
    value: string | boolean | Section[] | null
  ) {
    const updatedQuestionnaire = {
      ...questionnaire,
      [field]: value,
    };

    // Sync with parent if handler is provided
    onQuestionnaireChange?.(updatedQuestionnaire);
  }

  function handleSectionsChange(newSection: Section) {
    const updatedSections = [...questionnaire.sections, newSection];
    handleSetQuestionnaire("sections", updatedSections);
  }

  function handleUpdateSection(id: number | string, updatedSection: Section) {
    const updatedSections = questionnaire.sections.map((sec) =>
      (sec as SectionDb).id === id || (sec as SectionLocal).tempId === id
        ? updatedSection
        : sec
    );

    handleSetQuestionnaire("sections", updatedSections);
  }

  function handleDeleteSection(id: number | string) {
    let updatedSections;
    if (typeof id === "number") {
      // Persisted section: set _delete flag and cascade to all questionnaires
      updatedSections = questionnaire.sections.map((sec) => {
        if ((sec as SectionDb).id === id) {
          const questionnairesWithDelete = sec.questionnaires
            .map((q) => {
              // Only mark DB questionnaires with _delete, remove local ones
              if ((q as QuestionnaireDb).id) {
                return { ...q, _delete: true };
              }
              return q;
            })
            .filter((q) => !(q as QuestionnaireLocal).tempId);

          return {
            ...sec,
            _delete: true,
            questionnaires: questionnairesWithDelete,
          };
        }
        return sec;
      });
    } else {
      // Local section: remove from array
      updatedSections = questionnaire.sections.filter(
        (sec) => (sec as SectionLocal).tempId !== id
      );
    }
    handleSetQuestionnaire("sections", updatedSections);
  }

  function handleSave() {
    if (
      questionnaire.template &&
      (questionnaire.name === null || questionnaire.name.trim() === "")
    ) {
      return;
    }
    setShowDialog(false);
  }

  return (
    <FieldSet className="w-full md:w-100">
      <FieldLegend className="text-lg font-semibold text-gray-800 mb-4">
        Available Questionnaires
      </FieldLegend>

      <Field>
        <p className="text-sm text-gray-600 mb-4">
          Questionnaires let you extend your Application Form with custom
          questions.
        </p>

        <Field className="mb-4">
          <Select
            value={selectedTemplate}
            onValueChange={(value) => setSelectedTemplate(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Templates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="template1">Template 1</SelectItem>
              <SelectItem value="template2">Template 2</SelectItem>
              <SelectItem value="template3">Template 3</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <FieldSet className="flex flex-row items-center gap-2 mb-4">
          <Checkbox
            id="includeInCandidate"
            // checked={includeInCandidateExperience}
            // onCheckedChange={onIncludeInCandidateExperienceChange}
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
          <FieldLabel
            htmlFor="includeInCandidate"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Include in Candidate Experience (Default)
          </FieldLabel>
        </FieldSet>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              {(questionnaire as ApplicationFormQuestionnaireDb)?.id ||
              questionnaire.sections.length > 0
                ? "Configure Questionnaire"
                : "Add Questionnaire"}
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {questionnaire ? questionnaire.name : "Add Questionnaire"}
              </DialogTitle>
            </DialogHeader>
            <Field>
              <FieldLabel
                htmlFor="questionnaireName"
                className="font-medium text-gray-800"
              >
                Questionnaire Name
              </FieldLabel>
              <Input
                id="questionnaireName"
                type="text"
                value={
                  questionnaire.name === "anonymous"
                    ? ""
                    : questionnaire.name ?? ""
                }
                onChange={(e) => {
                  handleSetQuestionnaire("name", e.target.value);
                }}
                placeholder="Enter questionnaire name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Field>
            <SectionList
              sections={questionnaire.sections}
              addSection={handleSectionsChange}
              onUpdateSection={handleUpdateSection}
              onDeleteSection={handleDeleteSection}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                type="button"
                className={`px-6 py-2 hover:text-white ${
                  questionnaire.template
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border-blue-600 text-blue-600 hover:bg-blue-700"
                }`}
                onClick={() =>
                  handleSetQuestionnaire("template", !questionnaire.template)
                }
              >
                {questionnaire.template
                  ? "Unsave as Template"
                  : "Save as New Template"}
              </Button>
              <Button
                type="button"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Field>
    </FieldSet>
  );
}
