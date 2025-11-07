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
} from "../../types/questionnaire.types";

// interface QuestionnaireBaseProps {
//   // Questionnaire state
//   questionnaireName: string;
//   onQuestionnaireNameChange: (name: string) => void;

//   // Template selection
//   selectedTemplate?: string;
//   onTemplateChange?: (templateId: string) => void;

//   // Include in candidate experience
//   includeInCandidateExperience: boolean;
//   onIncludeInCandidateExperienceChange: (value: boolean) => void;

//   // Sections data
//   sections: Section[];

//   // Section CRUD operations
//   onAddSection: (name: string) => void;
//   onEditSection: (idx: number, name: string) => void;
//   onDeleteSection: (idx: number) => void;

//   // Question CRUD operations
//   onAddQuestion: (sectionIdx: number, question: Questionnaire) => void;
//   onEditQuestion: (
//     sectionIdx: number,
//     questionIdx: number,
//     question: Questionnaire
//   ) => void;
//   onDeleteQuestion: (sectionIdx: number, questionIdx: number) => void;

//   // Save operations
//   onSave: () => void;
//   onSaveAsTemplate?: () => void;
// }

interface QuestionnaireBaseProps {
  questionnaire: ApplicationFormQuestionnaire;
  setQuestionnaire: React.Dispatch<
    React.SetStateAction<ApplicationFormQuestionnaire>
  >;
}

export default function QuestionnaireBase({
  questionnaire,
  setQuestionnaire,
}: QuestionnaireBaseProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(
    undefined
  );

  function handleSetQuestionnaire(
    field: keyof ApplicationFormQuestionnaire,
    value: string | boolean | Section[] | null
  ) {
    setQuestionnaire((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSectionsChange(newSection: Section) {
    handleSetQuestionnaire("sections", [...questionnaire.sections, newSection]);
  }

  function handleUpdateSection(sectionIndex: number, updatedSection: Section) {
    const updatedSections = [...questionnaire.sections];
    updatedSections[sectionIndex] = updatedSection;
    handleSetQuestionnaire("sections", updatedSections);
  }

  function handleSave() {
    // Current implementation is automatic syncing, so save button is just to close the dialog
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
              Add Questionnaire
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Add Questionnaire
              </DialogTitle>
            </DialogHeader>
            <Field className="mb-6">
              <FieldLabel
                htmlFor="questionnaireName"
                className="block text-base font-medium text-gray-800 mb-2"
              >
                Questionnaire Name
              </FieldLabel>
              <Input
                id="questionnaireName"
                type="text"
                value={questionnaire.name ?? ""}
                onChange={(e) => {
                  handleSetQuestionnaire("name", e.target.value);
                }}
                placeholder="Enter questionnaire name"
                className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Field>
            <SectionList
              sections={questionnaire.sections}
              addSection={handleSectionsChange}
              onUpdateSection={handleUpdateSection}
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
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-md"
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
