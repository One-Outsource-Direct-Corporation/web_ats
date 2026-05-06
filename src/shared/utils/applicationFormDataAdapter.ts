import type {
  ApplicationFormData,
  ApplicationFormType,
  NonNegotiableBase,
} from "@/shared/types/application_form.types";
import type { PipelineStep } from "@/shared/types/pipeline.types";

type AnyRecord = Record<string, unknown>;

const DEFAULT_FIELD_VALUE: ApplicationFormType = "optional";

const DEFAULT_APPLICATION_FORM_FIELDS: Record<string, ApplicationFormType> = {
  name: DEFAULT_FIELD_VALUE,
  birth_date: DEFAULT_FIELD_VALUE,
  gender: DEFAULT_FIELD_VALUE,
  primary_contact_number: DEFAULT_FIELD_VALUE,
  secondary_contact_number: DEFAULT_FIELD_VALUE,
  email: DEFAULT_FIELD_VALUE,
  linkedin_profile: DEFAULT_FIELD_VALUE,
  address: DEFAULT_FIELD_VALUE,
  expected_salary: DEFAULT_FIELD_VALUE,
  willing_to_work_onsite: DEFAULT_FIELD_VALUE,
  photo_2x2: DEFAULT_FIELD_VALUE,
  upload_med_cert: DEFAULT_FIELD_VALUE,
  preferred_interview_schedule: DEFAULT_FIELD_VALUE,
  education_attained: DEFAULT_FIELD_VALUE,
  year_graduated: DEFAULT_FIELD_VALUE,
  university: DEFAULT_FIELD_VALUE,
  course: DEFAULT_FIELD_VALUE,
  work_experience: DEFAULT_FIELD_VALUE,
  how_did_you_hear_about_us: DEFAULT_FIELD_VALUE,
  agreement: DEFAULT_FIELD_VALUE,
  signature: DEFAULT_FIELD_VALUE,
};

const ALLOWED_APPLICATION_FIELD_VALUES: ApplicationFormType[] = [
  "required",
  "optional",
  "disabled",
];

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null;
}

function toRecord(value: unknown): AnyRecord {
  return isRecord(value) ? value : {};
}

function normalizeApplicationFieldValue(value: unknown): ApplicationFormType {
  if (
    typeof value === "string" &&
    (ALLOWED_APPLICATION_FIELD_VALUES as string[]).includes(value)
  ) {
    return value as ApplicationFormType;
  }

  return DEFAULT_FIELD_VALUE;
}

function normalizeApplicationFormFields(
  payload: unknown,
): ApplicationFormData["application_form"] {
  const source = toRecord(payload);
  const normalizedFields: Record<string, ApplicationFormType> = {};

  for (const key of Object.keys(DEFAULT_APPLICATION_FORM_FIELDS)) {
    normalizedFields[key] = normalizeApplicationFieldValue(source[key]);
  }

  if (typeof source.id === "number") {
    return {
      id: source.id,
      ...(normalizedFields as ApplicationFormData["application_form"]),
    };
  }

  return normalizedFields as ApplicationFormData["application_form"];
}

function normalizeNonNegotiable(
  payload: unknown,
): ApplicationFormData["non_negotiable"] {
  const source = toRecord(payload);

  const rawItems = Array.isArray(source.non_negotiable)
    ? source.non_negotiable
    : Array.isArray(payload)
      ? payload
      : [];

  const normalizedItems: NonNegotiableBase[] = rawItems
    .filter(isRecord)
    .map((item) => {
      const fieldName = typeof item.field === "string" ? item.field.trim() : "";

      return {
        field: fieldName,
        value: item.value as string | number | boolean,
      };
    })
    .filter((item) => item.field.length > 0);

  if (typeof source.id === "number") {
    return {
      id: source.id,
      non_negotiable: normalizedItems,
    };
  }

  return { non_negotiable: normalizedItems };
}

function normalizeQuestionnaire(
  payload: unknown,
): ApplicationFormData["questionnaire"] {
  const source = toRecord(payload);

  const normalized: Record<string, unknown> = {
    name: typeof source.name === "string" ? source.name : null,
    template: typeof source.template === "boolean" ? source.template : false,
    sections: Array.isArray(source.sections) ? source.sections : [],
  };

  if (typeof source.id === "number") {
    normalized.id = source.id;
  }

  return normalized as ApplicationFormData["questionnaire"];
}

export function normalizeApplicationFormDataPayload(
  payload: unknown,
): ApplicationFormData {
  const source = toRecord(payload);

  const wrappedApplicationForm = toRecord(source.application_form);
  const hasWrappedApplicationForm =
    Object.keys(wrappedApplicationForm).length > 0;

  const applicationFormSource = hasWrappedApplicationForm
    ? wrappedApplicationForm
    : source;

  const nonNegotiableSource =
    source.non_negotiable ?? wrappedApplicationForm.non_negotiable;
  const questionnaireSource =
    source.questionnaire ?? wrappedApplicationForm.questionnaire;

  return {
    application_form: normalizeApplicationFormFields(applicationFormSource),
    non_negotiable: normalizeNonNegotiable(nonNegotiableSource),
    questionnaire: normalizeQuestionnaire(questionnaireSource),
  };
}

export function normalizePipelineStepsPayload(
  payload: unknown,
): PipelineStep[] {
  if (Array.isArray(payload)) {
    return payload as PipelineStep[];
  }

  const source = toRecord(payload);
  if (Array.isArray(source.steps)) {
    return source.steps as PipelineStep[];
  }

  return [];
}
