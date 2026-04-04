import { ApplicationFormManagement } from "@/shared/components/reusables/ApplicationFormManagement";
import type { ApplicationFormQuestionnaire } from "@/features/external_posting";
import type {
  ApplicationForm,
  ApplicationFormData,
  ApplicationFormType,
  NonNegotiable,
} from "@/shared/types/application_form.types";
import type { ValidationError } from "@/shared/utils/formValidation";

interface ApplicationFormStepContentProps {
  applicationFormData: ApplicationFormData;
  applicationFormHandler: (
    field: keyof ApplicationForm,
    value: ApplicationFormType,
  ) => void;
  nonNegotiableHandler: (updatedNonNegotiables: NonNegotiable) => void;
  questionnaireHandler: (
    updatedQuestionnaire: ApplicationFormQuestionnaire,
  ) => void;
  validationError?: ValidationError | null;
}

export function ApplicationFormStepContent({
  applicationFormData,
  applicationFormHandler,
  nonNegotiableHandler,
  questionnaireHandler,
  validationError,
}: ApplicationFormStepContentProps) {
  return (
    <ApplicationFormManagement
      applicationFormData={applicationFormData}
      applicationFormHandler={applicationFormHandler}
      nonNegotiableHandler={nonNegotiableHandler}
      questionnaireHandler={questionnaireHandler}
      validationError={validationError}
    />
  );
}
