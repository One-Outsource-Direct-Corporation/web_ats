import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import {
  mapServerErrorsToSteps as mapServerErrors,
  hasStepErrors as checkStepErrors,
  getStepErrorSummary as getErrorSummary,
  type ValidationError,
} from "@/shared/utils/formValidation";
import {
  validatePrfJobPostingWithZod,
  validatePrfPipelineWithZod,
  validatePrfNonNegotiableWithZod,
} from "@/features/prf/services/prfValidation.service";

export type { ValidationError };

export interface StepErrors {
  [stepNumber: number]: ValidationError | null;
}

const STEP_COUNT = 6;

export function createEmptyStepErrors(): StepErrors {
  return {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  };
}

function normalizeNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function normalizeJobPosting(formData: PRFFormData) {
  const source = formData.job_posting;

  return {
    ...source,
    department: normalizeNumber(source.department),
    number_of_vacancies: normalizeNumber(source.number_of_vacancies),
    min_salary: normalizeNumber(source.min_salary),
    max_salary: normalizeNumber(source.max_salary),
  };
}

function getStep1Errors(formData: PRFFormData): ValidationError | null {
  const stepErrors: ValidationError = {};

  if (!formData.prf_input.business_unit) {
    stepErrors.business_unit = ["This field may not be null."];
  }

  if (
    formData.job_posting.reason_for_posting === "other" &&
    (!formData.job_posting.other_reason_for_posting ||
      !formData.job_posting.other_reason_for_posting.trim())
  ) {
    if (!stepErrors.job_posting || Array.isArray(stepErrors.job_posting)) {
      stepErrors.job_posting = {};
    }

    (stepErrors.job_posting as ValidationError).other_reason_for_posting = [
      "This field may not be blank.",
    ];
  }

  const jobPostingErrors = validatePrfJobPostingWithZod(
    normalizeJobPosting(formData),
  );
  const step1Fields = [
    "job_title",
    "target_start_date",
    "reason_for_posting",
    "other_reason_for_posting",
    "department",
    "number_of_vacancies",
  ];

  const step1JobPostingErrors: ValidationError = {};

  for (const field of step1Fields) {
    if (jobPostingErrors[field]) {
      step1JobPostingErrors[field] = jobPostingErrors[field];
    }
  }

  if (Object.keys(step1JobPostingErrors).length > 0) {
    stepErrors.job_posting = {
      ...(stepErrors.job_posting && !Array.isArray(stepErrors.job_posting)
        ? stepErrors.job_posting
        : {}),
      ...step1JobPostingErrors,
    };
  }

  return Object.keys(stepErrors).length > 0 ? stepErrors : null;
}

function getStep2Errors(formData: PRFFormData): ValidationError | null {
  const stepErrors: ValidationError = {};

  if (!formData.prf_input.category) {
    stepErrors.category = ["This field may not be null."];
  }

  const jobPostingErrors = validatePrfJobPostingWithZod(
    normalizeJobPosting(formData),
  );
  const step2Fields = [
    "experience_level",
    "employment_type",
    "work_setup",
    "working_site",
    "work_schedule_from",
    "work_schedule_to",
    "description",
    "responsibilities",
    "qualifications",
    "min_salary",
    "max_salary",
  ];

  const step2JobPostingErrors: ValidationError = {};

  for (const field of step2Fields) {
    if (jobPostingErrors[field]) {
      step2JobPostingErrors[field] = jobPostingErrors[field];
    }
  }

  if (Object.keys(step2JobPostingErrors).length > 0) {
    stepErrors.job_posting = step2JobPostingErrors;
  }

  return Object.keys(stepErrors).length > 0 ? stepErrors : null;
}

function getStep4Errors(formData: PRFFormData): ValidationError | null {
  const errors = validatePrfNonNegotiableWithZod(
    formData.application_form_input?.non_negotiable,
  );

  return Object.keys(errors).length > 0 ? errors : null;
}

function getStep5Errors(formData: PRFFormData): ValidationError | null {
  const stepErrors: ValidationError = {};

  if (!formData.pipeline_input || formData.pipeline_input.length === 0) {
    stepErrors.pipeline_input = ["At least one pipeline step is required."];
    return stepErrors;
  }

  const pipelineErrors = validatePrfPipelineWithZod(formData.pipeline_input);
  if (pipelineErrors) {
    stepErrors.pipeline_input = pipelineErrors;
  }

  return Object.keys(stepErrors).length > 0 ? stepErrors : null;
}

export function validateSteps(formData: PRFFormData): StepErrors {
  const errors = createEmptyStepErrors();

  errors[1] = getStep1Errors(formData);
  errors[2] = getStep2Errors(formData);
  errors[3] = null;
  errors[4] = getStep4Errors(formData);
  errors[5] = getStep5Errors(formData);
  errors[6] = null;

  return errors;
}

export function validateStep(
  formData: PRFFormData,
  step: number,
): ValidationError | null {
  if (step < 1 || step > STEP_COUNT) {
    return null;
  }

  return validateSteps(formData)[step] ?? null;
}

export function mapServerErrorsToSteps(
  serverErrors: ValidationError,
): StepErrors {
  const fieldMapping: { [field: string]: number } = {
    business_unit: 1,
    immediate_supervisor: 1,
    category: 2,

    "job_posting.job_title": 1,
    "job_posting.target_start_date": 1,
    "job_posting.reason_for_posting": 1,
    "job_posting.other_reason_for_posting": 1,
    "job_posting.department": 1,
    "job_posting.number_of_vacancies": 1,

    "job_posting.experience_level": 2,
    "job_posting.employment_type": 2,
    "job_posting.work_setup": 2,
    "job_posting.working_site": 2,
    "job_posting.work_schedule_from": 2,
    "job_posting.work_schedule_to": 2,
    "job_posting.min_salary": 2,
    "job_posting.max_salary": 2,
    "job_posting.description": 2,
    "job_posting.responsibilities": 2,
    "job_posting.qualifications": 2,

    hardware_required: 3,
    software_required: 3,

    application_form_input: 4,
    non_negotiable: 4,
    questionnaire: 4,
    "application_form.non_negotiable": 4,

    pipeline: 5,
    pipeline_input: 5,
  };

  const mapped = mapServerErrors(serverErrors, fieldMapping);

  return {
    ...createEmptyStepErrors(),
    ...mapped,
  };
}

export function hasStepErrors(stepErrors: ValidationError | null): boolean {
  return checkStepErrors(stepErrors);
}

export function getStepErrorSummary(
  stepErrors: ValidationError | null,
): string {
  return getErrorSummary(stepErrors);
}

export function getFirstErrorStep(stepErrors: StepErrors): number | null {
  for (let step = 1; step <= STEP_COUNT; step += 1) {
    if (hasStepErrors(stepErrors[step])) {
      return step;
    }
  }

  return null;
}
