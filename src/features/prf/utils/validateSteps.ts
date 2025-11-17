import type { PRFFormData } from "../types/prf.types";
import {
  validateJobPosting,
  validatePipeline,
  mapServerErrorsToSteps as mapServerErrors,
  hasStepErrors as checkStepErrors,
  getStepErrorSummary as getErrorSummary,
  type ValidationError,
} from "@/shared/utils/formValidation";

export type { ValidationError };

export interface StepErrors {
  [stepNumber: number]: ValidationError | null;
}

/**
 * Validates the PRF form data and returns errors organized by step number
 */
export function validateSteps(formData: PRFFormData): StepErrors {
  const errors: StepErrors = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  };

  // Step 1: Basic PRF Details validation
  const step1Errors: ValidationError = {};

  if (!formData.business_unit) {
    step1Errors.business_unit = ["This field may not be null."];
  }

  // Validate job posting fields that appear in Step 1 UI
  const jobPostingErrors = validateJobPosting(formData.job_posting);
  const step1JobPostingFields = [
    "job_title",
    "target_start_date",
    "reason_for_posting",
    "department_name",
    "number_of_vacancies",
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

  // Validate immediate_supervisor
  if (!formData.immediate_supervisor) {
    step1Errors.immediate_supervisor = ["This field may not be null."];
  }

  if (Object.keys(step1Errors).length > 0) {
    errors[1] = step1Errors;
  }

  if (Object.keys(step1Errors).length > 0) {
    errors[1] = step1Errors;
  }

  // Step 2: Job Posting Basic Details validation
  const step2Errors: ValidationError = {};

  // Validate category (in Step 2 UI)
  if (!formData.category) {
    step2Errors.category = ["This field may not be null."];
  }

  // Validate work_schedule (in Step 2 UI)
  if (!formData.work_schedule_from) {
    step2Errors.work_schedule_from = ["This field may not be null."];
  }

  if (!formData.work_schedule_to) {
    step2Errors.work_schedule_to = ["This field may not be null."];
  }

  const step2JobPostingFields = [
    "experience_level",
    "employment_type",
    "work_setup",
    "working_site",
    "description",
    "responsibilities",
    "qualifications",
    "min_salary",
    "max_salary",
  ];

  const step2JobPosting: ValidationError = {};
  step2JobPostingFields.forEach((field) => {
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

  // Step 3: Asset Request (no validation, only warnings in UI)
  // Step 4: Application Form (no validation yet)

  // Step 5: Pipeline validation
  const step5Errors: ValidationError = {};

  if (!formData.pipeline || formData.pipeline.length === 0) {
    step5Errors.pipeline = ["At least one pipeline step is required."];
  } else {
    const pipelineErrors = validatePipeline(formData.pipeline);
    if (pipelineErrors) {
      step5Errors.pipeline = pipelineErrors;
    }
  }

  if (Object.keys(step5Errors).length > 0) {
    errors[5] = step5Errors;
  }

  return errors;
}

/**
 * Maps server validation errors to step-specific errors for PRF form
 */
export function mapServerErrorsToSteps(
  serverErrors: ValidationError
): StepErrors {
  const fieldMapping: { [field: string]: number } = {
    business_unit: 1,
    category: 1,
    work_schedule_from: 1,
    work_schedule_to: 1,
    "job_posting.job_title": 2,
    "job_posting.target_start_date": 2,
    "job_posting.reason_for_posting": 2,
    "job_posting.experience_level": 2,
    "job_posting.department_name": 2,
    "job_posting.employment_type": 2,
    "job_posting.work_setup": 2,
    "job_posting.working_site": 2,
    "job_posting.number_of_vacancies": 2,
    "job_posting.min_salary": 2,
    "job_posting.max_salary": 2,
    "job_posting.description": 3,
    "job_posting.responsibilities": 3,
    "job_posting.qualifications": 3,
    pipeline: 5,
  };

  return mapServerErrors(serverErrors, fieldMapping);
}

/**
 * Checks if a specific step has errors
 */
export function hasStepErrors(stepErrors: ValidationError | null): boolean {
  return checkStepErrors(stepErrors);
}

/**
 * Gets a summary of errors for a step
 */
export function getStepErrorSummary(
  stepErrors: ValidationError | null
): string {
  return getErrorSummary(stepErrors);
}
