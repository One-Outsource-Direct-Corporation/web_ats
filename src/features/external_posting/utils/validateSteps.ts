import type { PositionFormData } from "../types/externalPosting.types";
import {
  mapServerErrorsToSteps as mapServerErrors,
  hasStepErrors as checkStepErrors,
  getStepErrorSummary as getErrorSummary,
  type ValidationError,
} from "@/shared/utils/formValidation";
import {
  validateJobPostingWithZod,
  validatePipelineWithZod,
  validateNonNegotiableWithZod,
} from "../services/externalPostingValidation.service";

export type { ValidationError };

export interface StepErrors {
  [stepNumber: number]: ValidationError | null;
}

export function validateSteps(formData: PositionFormData): StepErrors {
  const errors: StepErrors = {
    1: null,
    2: null,
    3: null,
    4: null,
  };

  const step1Errors: ValidationError = {};

  if (!formData.client) {
    step1Errors.client = ["This field may not be null."];
  }

  if (!formData.education_level) {
    step1Errors.education_level = ["This field may not be null."];
  }

  const jobPostingErrors = validateJobPostingWithZod(formData.job_posting);
  const step1JobPostingFields = [
    "job_title",
    "target_start_date",
    "reason_for_posting",
    "experience_level",
    "department_name",
    "employment_type",
    "work_setup",
    "working_site",
    "number_of_vacancies",
    "min_salary",
    "max_salary",
    "work_schedule_from",
    "work_schedule_to",
  ];

  const step1JobPosting: ValidationError = {};
  step1JobPostingFields.forEach((field) => {
    if (jobPostingErrors[field]) {
      step1JobPosting[field] = jobPostingErrors[field];
    }
  });

  if (Object.keys(step1JobPosting).length > 0) {
    step1Errors.job_posting = step1JobPosting;
  }

  if (Object.keys(step1Errors).length > 0) {
    errors[1] = step1Errors;
  }

  const step2Errors: ValidationError = {};
  const step2Fields = ["description", "responsibilities", "qualifications"];
  const step2JobPosting: ValidationError = {};

  step2Fields.forEach((field) => {
    if (jobPostingErrors[field]) {
      step2JobPosting[field] = jobPostingErrors[field];
    }
  });

  if (Object.keys(step2JobPosting).length > 0) {
    step2Errors.job_posting = step2JobPosting;
  }

  if (Object.keys(step2Errors).length > 0) {
    errors[2] = step2Errors;
  }

  const step3Errors: ValidationError = {};
  const nonNegotiableErrors = validateNonNegotiableWithZod(
    formData.application_form?.non_negotiable,
  );

  if (Object.keys(nonNegotiableErrors).length > 0) {
    Object.assign(step3Errors, nonNegotiableErrors);
  }

  if (Object.keys(step3Errors).length > 0) {
    errors[3] = step3Errors;
  }

  const step4Errors: ValidationError = {};

  if (!formData.pipeline || formData.pipeline.length === 0) {
    step4Errors.pipeline = ["At least one pipeline step is required."];
  } else {
    const pipelineErrors = validatePipelineWithZod(formData.pipeline);
    if (pipelineErrors) {
      step4Errors.pipeline = pipelineErrors;
    }
  }

  if (Object.keys(step4Errors).length > 0) {
    errors[4] = step4Errors;
  }

  return errors;
}

export function mapServerErrorsToSteps(
  serverErrors: ValidationError,
): StepErrors {
  const fieldMapping: { [field: string]: number } = {
    client: 1,
    education_level: 1,
    "job_posting.job_title": 1,
    "job_posting.target_start_date": 1,
    "job_posting.reason_for_posting": 1,
    "job_posting.experience_level": 1,
    "job_posting.department_name": 1,
    "job_posting.employment_type": 1,
    "job_posting.work_setup": 1,
    "job_posting.working_site": 1,
    "job_posting.number_of_vacancies": 1,
    "job_posting.min_salary": 1,
    "job_posting.max_salary": 1,
    "job_posting.work_schedule_from": 1,
    "job_posting.work_schedule_to": 1,
    "job_posting.description": 2,
    "job_posting.responsibilities": 2,
    "job_posting.qualifications": 2,
    non_negotiable: 3,
    "application_form.non_negotiable": 3,
    pipeline: 4,
  };

  return mapServerErrors(serverErrors, fieldMapping);
}

export function hasStepErrors(stepErrors: ValidationError | null): boolean {
  return checkStepErrors(stepErrors);
}

export function getStepErrorSummary(
  stepErrors: ValidationError | null,
): string {
  return getErrorSummary(stepErrors);
}
