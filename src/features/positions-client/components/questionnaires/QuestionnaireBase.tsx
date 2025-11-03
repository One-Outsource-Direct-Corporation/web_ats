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
import { AddQuestionModal } from "./AddQuestionModal";
import { Input } from "@/shared/components/ui/input";

interface QuestionnaireBaseProps {
  showAddQuestionnaireModal: boolean;
  setShowAddQuestionnaireModal: (open: boolean) => void;
  questionnaireName: string;
  setQuestionnaireName: (name: string) => void;
  questionnaireManager: any;
  questionForm: any;
  onMoveQuestionsClick: (
    questionId: string,
    fromSectionIdx: number,
    toSectionIdx: number
  ) => void;
  handleMoveQuestions: () => void;
  handleEditQuestion: (sectionIdx: number, questionIdx: number) => void;
  handleDeleteQuestion: (sectionIdx: number, questionIdx: number) => void;
  handleAddQuestion: () => void;
}

export default function QuestionnaireBase({
  showAddQuestionnaireModal,
  setShowAddQuestionnaireModal,
  questionnaireName,
  setQuestionnaireName,
  questionnaireManager,
  questionForm,
  handleMoveQuestions,
  handleEditQuestion,
  handleDeleteQuestion,
  handleAddQuestion,
}: QuestionnaireBaseProps) {
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
          <Select defaultValue="">
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

        <FieldSet className="flex flex-row items-center">
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

        <Dialog
          open={showAddQuestionnaireModal}
          onOpenChange={setShowAddQuestionnaireModal}
        >
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
                value={questionnaireName}
                onChange={(e) => setQuestionnaireName(e.target.value)}
                placeholder="Enter questionnaire name"
                className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Field>
            <SectionList
              sections={questionnaireManager.sections}
              showAddSectionInput={questionnaireManager.showAddSectionInput}
              newSectionName={questionnaireManager.newSectionName}
              editingSectionIdx={questionnaireManager.editingSectionIdx}
              editSectionName={questionnaireManager.editSectionName}
              onAddSectionClick={questionnaireManager.handleAddSection}
              onMoveQuestionsClick={handleMoveQuestions}
              onNewSectionNameChange={questionnaireManager.setNewSectionName}
              onConfirmAddSection={questionnaireManager.handleConfirmAddSection}
              onCancelAddSection={questionnaireManager.handleCancelAddSection}
              onEditSectionNameChange={questionnaireManager.setEditSectionName}
              onEditSection={questionnaireManager.handleEditSection}
              onConfirmEditSection={
                questionnaireManager.handleConfirmEditSection
              }
              onCancelEditSection={questionnaireManager.handleCancelEditSection}
              onDeleteSection={questionnaireManager.handleDeleteSection}
              onAddQuestion={questionForm.handleOpenAddQuestion}
              onEditQuestion={handleEditQuestion}
              onDeleteQuestion={handleDeleteQuestion}
            />
            <AddQuestionModal
              isOpen={questionForm.showAddQuestionModal}
              isEditMode={questionForm.isEditMode}
              questionText={questionForm.questionText}
              questionDesc={questionForm.questionDesc}
              questionType={questionForm.questionType}
              parameterValue={questionForm.parameterValue}
              options={questionForm.options}
              onClose={questionForm.resetForm}
              onQuestionTextChange={questionForm.setQuestionText}
              onQuestionDescChange={questionForm.setQuestionDesc}
              onQuestionTypeChange={questionForm.setQuestionType}
              onParameterValueChange={questionForm.setParameterValue}
              onOptionChange={questionForm.handleOptionChange}
              onAddOption={questionForm.handleAddOption}
              onRemoveOption={questionForm.handleRemoveOption}
              onAddQuestion={handleAddQuestion}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                type="button"
                className="px-6 py-2 border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white"
              >
                Save as New Template
              </Button>
              <Button
                type="button"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-md"
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
