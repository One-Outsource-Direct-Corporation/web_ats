import type { AcknowledgementFormData } from "../../types/application_form.types";
import type { QuestionnaireAnswers } from "../../types/application_form.types";
import type { PublicApplyQuestionnaire } from "../../types/jobApply.types";
import { AcknowledgementSection } from "../application/AcknowledgementSection";
import type { ApplicationFormBase } from "@/shared/types/application_form.types";

interface Step04Props {
  formData: AcknowledgementFormData;
  onInputChange: (
    field: keyof AcknowledgementFormData,
    value: string | boolean | File | null,
  ) => void;
  applicationForm: ApplicationFormBase;
  questionnaire: PublicApplyQuestionnaire;
  questionnaireAnswers: QuestionnaireAnswers;
  onQuestionnaireParagraphInput: (questionKey: string, value: string) => void;
  onQuestionnaireSingleChoiceInput: (
    questionKey: string,
    value: string,
  ) => void;
  onQuestionnaireCheckboxInput: (
    questionKey: string,
    value: string,
    checked: boolean,
  ) => void;
}

export default function Step04({
  formData,
  onInputChange,
  applicationForm,
  questionnaire,
  questionnaireAnswers,
  onQuestionnaireParagraphInput,
  onQuestionnaireSingleChoiceInput,
  onQuestionnaireCheckboxInput,
}: Step04Props) {
  return (
    <AcknowledgementSection
      formData={formData}
      onInputChange={onInputChange}
      applicationForm={applicationForm}
      questionnaire={questionnaire}
      questionnaireAnswers={questionnaireAnswers}
      onQuestionnaireParagraphInput={onQuestionnaireParagraphInput}
      onQuestionnaireSingleChoiceInput={onQuestionnaireSingleChoiceInput}
      onQuestionnaireCheckboxInput={onQuestionnaireCheckboxInput}
    />
  );
}
