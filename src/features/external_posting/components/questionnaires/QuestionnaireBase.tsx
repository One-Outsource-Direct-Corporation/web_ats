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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { SectionList } from "./SectionList";
import { Input } from "@/shared/components/ui/input";
import { useQuestionnaireTemplatesQuery } from "@/features/application_form_questionnaire";
import type { QuestionnaireTemplate } from "@/features/application_form_questionnaire";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
    updatedQuestionnaire: ApplicationFormQuestionnaire,
  ) => void;
}

export default function QuestionnaireBase({
  questionnaire,
  onQuestionnaireChange,
}: QuestionnaireBaseProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(
    undefined,
  );
  const { templates, loading, hasMore, loadMore, handleSearch } =
    useQuestionnaireTemplatesQuery({ pageSize: 10 });

  function normalizeTemplateToSections(
    template: QuestionnaireTemplate,
  ): Section[] {
    return template.sections.map((section) => ({
      tempId: `temp-section-${Date.now()}-${section.id}`,
      name: section.name,
      questionnaires: section.questionnaires.map((question) => ({
        tempId: `temp-question-${Date.now()}-${question.id}`,
        question: question.question,
        description: question.description,
        question_type: question.question_type,
        options: question.options,
        parameter: question.parameter,
      })),
    }));
  }

  function handleTemplateSelect(templateId: string) {
    const template = templates.find((item) => String(item.id) === templateId);
    if (!template) {
      return;
    }

    setSelectedTemplate(templateId);
    setTemplateOpen(false);
    onQuestionnaireChange?.({
      ...questionnaire,
      name: template.name,
      template: false,
      sections: normalizeTemplateToSections(template),
    });
  }

  function handleSetQuestionnaire(
    field: keyof ApplicationFormQuestionnaire,
    value: string | boolean | Section[] | null,
  ) {
    const updatedQuestionnaire = {
      ...questionnaire,
      [field]: value,
    };

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
        : sec,
    );

    handleSetQuestionnaire("sections", updatedSections);
  }

  function handleDeleteSection(id: number | string) {
    let updatedSections;
    if (typeof id === "number") {
      updatedSections = questionnaire.sections.map((sec) => {
        if ((sec as SectionDb).id === id) {
          const questionnairesWithDelete = sec.questionnaires
            .map((q) => {
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
      updatedSections = questionnaire.sections.filter(
        (sec) => (sec as SectionLocal).tempId !== id,
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
          <Popover open={templateOpen} onOpenChange={setTemplateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={templateOpen}
                className="w-full justify-between"
              >
                {selectedTemplate
                  ? (templates.find(
                      (template) => String(template.id) === selectedTemplate,
                    )?.name ?? "Browse Templates")
                  : "Browse Templates"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search templates..."
                  className="h-9"
                  onValueChange={handleSearch}
                />
                <CommandList
                  onScroll={(event) => {
                    const target = event.currentTarget;
                    if (
                      target.scrollHeight - target.scrollTop <=
                        target.clientHeight + 100 &&
                      hasMore &&
                      !loading
                    ) {
                      loadMore();
                    }
                  }}
                  className="max-h-[300px] overflow-y-auto"
                >
                  <CommandEmpty>
                    {loading ? "Loading..." : "No template found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {templates.map((template) => {
                      const templateId = String(template.id);
                      return (
                        <CommandItem
                          key={template.id}
                          value={templateId}
                          onSelect={() => handleTemplateSelect(templateId)}
                        >
                          <span className="font-medium">{template.name}</span>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedTemplate === templateId
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                    {hasMore && !loading && (
                      <CommandItem
                        disabled
                        className="justify-center text-sm text-gray-500"
                      >
                        Scroll for more...
                      </CommandItem>
                    )}
                    {loading && (
                      <CommandItem
                        disabled
                        className="justify-center text-sm text-gray-500"
                      >
                        Loading more...
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </Field>

        <FieldSet className="flex flex-row items-center gap-2 mb-4">
          <Checkbox
            id="includeInCandidate"
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
                    : (questionnaire.name ?? "")
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
