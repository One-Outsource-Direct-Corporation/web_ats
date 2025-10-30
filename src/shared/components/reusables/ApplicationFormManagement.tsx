import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldRadioButton } from "../../../features/positions-client/components/FormFieldRadioButton";
import type {
  FormFields,
  FormFieldNonNegotiables,
} from "@/features/positions-client/types/create_position.types";
import { memo, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { AddQuestionModal } from "@/features/positions-client/components/questionnaires/AddQuestionModal";
import { SectionList } from "@/features/positions-client/components/questionnaires/SectionList";
import { useQuestionnaireManager } from "@/features/positions-client/hooks/useQuestionnaireManager";
import { useQuestionForm } from "@/features/positions-client/hooks/useQuestionForm";

interface ApplicationFormManagementProps<
  T extends {
    application_form: FormFields;
    application_form_non_negotiables: FormFieldNonNegotiables;
  }
> {
  formData: T;
  setFormData: (fieldName: string, status: string) => void;
  setNonNegotiable: (fieldName: string, value: boolean) => void;
}

type FieldKey = keyof FormFields;

const FIELD_LABELS: Record<FieldKey, string> = {
  name: "Name",
  birth_date: "Birth Date",
  gender: "Gender",
  primary_contact_number: "Primary Contact Number",
  secondary_contact_number: "Secondary Contact Number",
  email: "Email",
  linkedin_profile: "LinkedIn Profile",
  address: "Address",
  expect_salary: "Expected Salary",
  willing_to_work_onsite: "Willing to Work Onsite",
  photo_2x2: "Photo 2x2",
  upload_med_cert: "Upload Medical Certificate",
  preferred_interview_schedule: "Preferred Interview Schedule",
  education_attained: "Education Attained",
  year_graduated: "Year Graduated",
  university: "University",
  course: "Course",
  work_experience: "Work Experience",
  how_did_you_hear_about_us: "How Did You Hear About Us",
  agreement: "Agreement",
  signature: "Signature",
};

const PERSONAL_INFO_FIELDS: FieldKey[] = [
  "name",
  "birth_date",
  "gender",
  "primary_contact_number",
  "secondary_contact_number",
  "email",
  "linkedin_profile",
  "address",
  "expect_salary",
  "willing_to_work_onsite",
  "photo_2x2",
  "upload_med_cert",
  "preferred_interview_schedule",
];

const EDUCATION_FIELDS: FieldKey[] = [
  "education_attained",
  "year_graduated",
  "university",
  "course",
];

const OTHER_FIELDS: FieldKey[] = [
  "work_experience",
  "how_did_you_hear_about_us",
  "agreement",
  "signature",
];

const FieldRow = memo(
  ({
    fieldKey,
    label,
    fieldValue,
    setFormData,
    hasNonNegotiable,
    nonNegotiableValue,
    setNonNegotiable,
  }: {
    fieldKey: FieldKey;
    label: string;
    fieldValue: string;
    setFormData: (fieldName: string, status: string) => void;
    hasNonNegotiable?: boolean;
    nonNegotiableValue?: boolean;
    setNonNegotiable?: (fieldName: string, value: boolean) => void;
  }) => {
    return (
      <TableRow>
        <TableCell className="font-medium p-4">{label}</TableCell>
        {hasNonNegotiable ? (
          <TableCell>
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={nonNegotiableValue || false}
                onChange={(e) => setNonNegotiable?.(fieldKey, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </TableCell>
        ) : (
          <TableCell></TableCell>
        )}
        <TableCell>
          <FormFieldRadioButton
            name={fieldKey}
            value="required"
            checked={fieldValue === "required"}
            onChange={setFormData}
          />
        </TableCell>
        <TableCell>
          <FormFieldRadioButton
            name={fieldKey}
            value="optional"
            checked={fieldValue === "optional"}
            onChange={setFormData}
          />
        </TableCell>
        <TableCell>
          <FormFieldRadioButton
            name={fieldKey}
            value="disabled"
            checked={fieldValue === "disabled"}
            onChange={setFormData}
          />
        </TableCell>
      </TableRow>
    );
  }
);

FieldRow.displayName = "FieldRow";

export const ApplicationFormManagement = memo(
  <
    T extends {
      application_form: FormFields;
      application_form_non_negotiables: FormFieldNonNegotiables;
    }
  >({
    formData,
    setFormData,
    setNonNegotiable,
  }: ApplicationFormManagementProps<T>) => {
    const nonNegotiableFields = new Set<FieldKey>([
      "expect_salary",
      "willing_to_work_onsite",
      "education_attained",
      "course",
    ]);

    const [showAddQuestionnaireModal, setShowAddQuestionnaireModal] =
      useState(false);
    const [questionnaireName, setQuestionnaireName] = useState("");

    // Use custom hooks for questionnaire management
    const questionnaireManager = useQuestionnaireManager();
    const questionForm = useQuestionForm();

    // Handle adding question
    const handleAddQuestion = () => {
      if (questionForm.isEditMode) {
        // Edit mode: update existing question
        if (
          questionForm.editQuestionSectionIdx !== null &&
          questionForm.editQuestionIdx !== null
        ) {
          const updatedQuestion = questionForm.getCurrentQuestion();
          questionnaireManager.updateQuestionInSection(
            questionForm.editQuestionSectionIdx,
            questionForm.editQuestionIdx,
            updatedQuestion
          );
        }
      } else {
        // Add mode: add new question
        if (questionForm.addQuestionSectionIdx !== null) {
          const newQuestion = questionForm.getCurrentQuestion();
          questionnaireManager.addQuestionToSection(
            questionForm.addQuestionSectionIdx,
            newQuestion
          );
        }
      }
      questionForm.resetForm();
    };

    // Handle editing question
    const handleEditQuestion = (sectionIdx: number, questionIdx: number) => {
      const section = questionnaireManager.sections[sectionIdx];
      const question = section.questions?.[questionIdx];
      if (question) {
        questionForm.handleOpenEditQuestion(sectionIdx, questionIdx, question);
      }
    };

    // Handle deleting question
    const handleDeleteQuestion = (sectionIdx: number, questionIdx: number) => {
      questionnaireManager.deleteQuestionFromSection(sectionIdx, questionIdx);
    };

    // Handle move questions (placeholder for future implementation)
    const handleMoveQuestions = () => {
      // TODO: Implement move questions logic
      console.log("Move questions");
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Application Form
          </h3>
          <p className="text-sm text-gray-600">
            Choose what information to collect from candidates who apply through
            your Careers Site.
          </p>
        </div>

        {/* Personal Information Section */}
        <FieldSet>
          <FieldLegend className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </FieldLegend>
          <Field className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-stone-100">
                <TableRow>
                  <TableHead className="w-[20rem] p-4">Field</TableHead>
                  <TableHead className="text-center p-4">
                    Non-Negotiable
                  </TableHead>
                  <TableHead className="text-center p-4">Required</TableHead>
                  <TableHead className="text-center p-4">Optional</TableHead>
                  <TableHead className="text-center p-4">Disabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PERSONAL_INFO_FIELDS.map((fieldKey) => (
                  <FieldRow
                    key={fieldKey}
                    fieldKey={fieldKey}
                    label={FIELD_LABELS[fieldKey]}
                    fieldValue={formData.application_form[fieldKey]}
                    setFormData={setFormData}
                    hasNonNegotiable={nonNegotiableFields.has(fieldKey)}
                    nonNegotiableValue={
                      nonNegotiableFields.has(fieldKey)
                        ? formData.application_form_non_negotiables[
                            fieldKey as keyof FormFieldNonNegotiables
                          ]
                        : false
                    }
                    setNonNegotiable={setNonNegotiable}
                  />
                ))}
              </TableBody>
            </Table>
          </Field>
        </FieldSet>

        {/* Education Section */}
        <FieldSet>
          <FieldLegend className="text-lg font-semibold text-gray-800 mb-4">
            Education
          </FieldLegend>
          <Field className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-stone-100">
                <TableRow>
                  <TableHead className="w-[20rem] p-4">Field</TableHead>
                  <TableHead className="text-center p-4">
                    Non-Negotiable
                  </TableHead>
                  <TableHead className="text-center p-4">Required</TableHead>
                  <TableHead className="text-center p-4">Optional</TableHead>
                  <TableHead className="text-center p-4">Disabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EDUCATION_FIELDS.map((fieldKey) => (
                  <FieldRow
                    key={fieldKey}
                    fieldKey={fieldKey}
                    label={FIELD_LABELS[fieldKey]}
                    fieldValue={formData.application_form[fieldKey]}
                    setFormData={setFormData}
                    hasNonNegotiable={nonNegotiableFields.has(fieldKey)}
                    nonNegotiableValue={
                      nonNegotiableFields.has(fieldKey)
                        ? formData.application_form_non_negotiables[
                            fieldKey as keyof FormFieldNonNegotiables
                          ]
                        : false
                    }
                    setNonNegotiable={setNonNegotiable}
                  />
                ))}
              </TableBody>
            </Table>
          </Field>
        </FieldSet>

        {/* Other Information Section */}
        <FieldSet>
          <FieldLegend className="text-lg font-semibold text-gray-800 mb-4">
            Other Information
          </FieldLegend>
          <Field className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-stone-100">
                <TableRow>
                  <TableHead className="w-[20rem] p-4">Field</TableHead>
                  <TableHead className="text-center p-4">
                    Non-Negotiable
                  </TableHead>
                  <TableHead className="text-center p-4">Required</TableHead>
                  <TableHead className="text-center p-4">Optional</TableHead>
                  <TableHead className="text-center p-4">Disabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {OTHER_FIELDS.map((fieldKey) => (
                  <FieldRow
                    key={fieldKey}
                    fieldKey={fieldKey}
                    label={FIELD_LABELS[fieldKey]}
                    fieldValue={formData.application_form[fieldKey]}
                    setFormData={setFormData}
                    hasNonNegotiable={nonNegotiableFields.has(fieldKey)}
                    nonNegotiableValue={
                      nonNegotiableFields.has(fieldKey)
                        ? formData.application_form_non_negotiables[
                            fieldKey as keyof FormFieldNonNegotiables
                          ]
                        : false
                    }
                    setNonNegotiable={setNonNegotiable}
                  />
                ))}
              </TableBody>
            </Table>
          </Field>
        </FieldSet>

        {/* Available Questionnaires Section */}
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

            <Button
              type="button"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              onClick={() => setShowAddQuestionnaireModal(true)}
            >
              Add Questionnaire
            </Button>
            {/* Add Questionnaire Modal */}
            {showAddQuestionnaireModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setShowAddQuestionnaireModal(false)}
                />
                <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Add Questionnaire
                      </h2>
                      <button
                        onClick={() => setShowAddQuestionnaireModal(false)}
                        className="text-gray-400 hover:text-gray-700 text-xl font-bold"
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="questionnaireName"
                        className="block text-base font-medium text-gray-800 mb-2"
                      >
                        Questionnaire Name
                      </label>
                      <input
                        id="questionnaireName"
                        type="text"
                        value={questionnaireName}
                        onChange={(e) => setQuestionnaireName(e.target.value)}
                        placeholder="Enter questionnaire name"
                        className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <SectionList
                      sections={questionnaireManager.sections}
                      showAddSectionInput={
                        questionnaireManager.showAddSectionInput
                      }
                      newSectionName={questionnaireManager.newSectionName}
                      editingSectionIdx={questionnaireManager.editingSectionIdx}
                      editSectionName={questionnaireManager.editSectionName}
                      onAddSectionClick={questionnaireManager.handleAddSection}
                      onMoveQuestionsClick={handleMoveQuestions}
                      onNewSectionNameChange={
                        questionnaireManager.setNewSectionName
                      }
                      onConfirmAddSection={
                        questionnaireManager.handleConfirmAddSection
                      }
                      onCancelAddSection={
                        questionnaireManager.handleCancelAddSection
                      }
                      onEditSectionNameChange={
                        questionnaireManager.setEditSectionName
                      }
                      onEditSection={questionnaireManager.handleEditSection}
                      onConfirmEditSection={
                        questionnaireManager.handleConfirmEditSection
                      }
                      onCancelEditSection={
                        questionnaireManager.handleCancelEditSection
                      }
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
                      questionMode={questionForm.questionMode}
                      parameterValue={questionForm.parameterValue}
                      options={questionForm.options}
                      onClose={questionForm.resetForm}
                      onQuestionTextChange={questionForm.setQuestionText}
                      onQuestionDescChange={questionForm.setQuestionDesc}
                      onQuestionTypeChange={questionForm.setQuestionType}
                      onQuestionModeChange={questionForm.setQuestionMode}
                      onParameterValueChange={questionForm.setParameterValue}
                      onOptionChange={questionForm.handleOptionChange}
                      onAddOption={questionForm.handleAddOption}
                      onRemoveOption={questionForm.handleRemoveOption}
                      onAddQuestion={handleAddQuestion}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-md"
                      >
                        Save as New Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Field>
        </FieldSet>
      </div>
    );
  }
);

ApplicationFormManagement.displayName = "ApplicationFormManagement";
