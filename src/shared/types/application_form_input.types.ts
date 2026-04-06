import type { ApplicationFormQuestionnaire } from "@/features/external_posting";
import type {
  ApplicationForm,
  NonNegotiable,
} from "@/shared/types/application_form.types";

export interface ApplicationFormInputPayload {
  application_form: ApplicationForm;
  non_negotiable: NonNegotiable;
  questionnaire: ApplicationFormQuestionnaire;
}
