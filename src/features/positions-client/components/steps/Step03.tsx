import { Card } from "@/shared/components/ui/card";
import { ApplicationFormManagement } from "../../../../shared/components/reusables/ApplicationFormManagement";
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
    value: ApplicationFormType
  ) => void;
  nonNegotiableHandler: (updatedNonNegotiables: NonNegotiable) => void;
  questionnaireHandler: (
    updatedQuestionnaire: ApplicationFormQuestionnaire
  ) => void;
  error?: ValidationError | null;
}

export default function Step03({
  applicationFormData,
  applicationFormHandler,
  nonNegotiableHandler,
  questionnaireHandler,
  error,
}: Step03Props) {
  return (
    <Card className="p-6">
      <ApplicationFormManagement
        applicationFormData={applicationFormData}
        applicationFormHandler={applicationFormHandler}
        nonNegotiableHandler={nonNegotiableHandler}
        questionnaireHandler={questionnaireHandler}
        validationError={error}
      />
    </Card>
  );
}
