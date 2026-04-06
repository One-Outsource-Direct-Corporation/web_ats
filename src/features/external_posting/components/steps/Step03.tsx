import { Card } from "@/shared/components/ui/card";
import { ApplicationFormStepContent } from "@/shared/components/reusables/ApplicationFormStepContent";
import type {
  ApplicationForm,
  ApplicationFormData,
  ApplicationFormType,
  NonNegotiable,
} from "../../../../shared/types/application_form.types";
import type { ApplicationFormQuestionnaire } from "../../types/questionnaire.types";
import type { ValidationError } from "@/shared/utils/formValidation";

interface Step03Props {
  applicationFormData: ApplicationFormData;
  applicationFormHandler: (
    field: keyof ApplicationForm,
    value: ApplicationFormType,
  ) => void;
  nonNegotiableHandler: (updatedNonNegotiables: NonNegotiable) => void;
  questionnaireHandler: (
    updatedQuestionnaire: ApplicationFormQuestionnaire,
  ) => void;
  error?: ValidationError | null;
  updateMode?: boolean;
}

export default function Step03({
  applicationFormData,
  applicationFormHandler,
  nonNegotiableHandler,
  questionnaireHandler,
  error,
  updateMode,
}: Step03Props) {
  const content = (
    <ApplicationFormStepContent
      applicationFormData={applicationFormData}
      applicationFormHandler={applicationFormHandler}
      nonNegotiableHandler={nonNegotiableHandler}
      questionnaireHandler={questionnaireHandler}
      validationError={error}
    />
  );

  if (updateMode) {
    return <div className="space-y-10">{content}</div>;
  }

  return <Card className="p-6">{content}</Card>;
}
