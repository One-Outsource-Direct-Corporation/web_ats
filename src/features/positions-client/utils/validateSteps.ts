import type { PositionFormData } from "../types/create_position.types";

export interface ValidationError {
  [key: string]: string[] | ValidationError;
}

export interface StepErrors {
  [stepNumber: number]: ValidationError | null;
}

/**
 * Validates the position form data and returns errors organized by step number
 */
export function validateSteps(formData: PositionFormData): StepErrors {
  const errors: StepErrors = {
    1: null,
    2: null,
    3: null,
    4: null,
  };

  // Step 1: Basic Details validation
  const step1Errors: ValidationError = {};

  if (!formData.client) {
    step1Errors.client = ["This field may not be null."];
  }

  if (!formData.education_level) {
    step1Errors.education_level = ["This field may not be null."];
  }

  // Job posting basic fields
  const jobPostingErrors: ValidationError = {};

  if (!formData.job_posting.job_title) {
    jobPostingErrors.job_title = ["This field may not be null."];
  }

  if (!formData.job_posting.target_start_date) {
    jobPostingErrors.target_start_date = ["This field may not be null."];
  }

  if (!formData.job_posting.reason_for_posting) {
    jobPostingErrors.reason_for_posting = ["This field may not be null."];
  }

  if (!formData.job_posting.experience_level) {
    jobPostingErrors.experience_level = ["This field may not be null."];
  }

  if (!formData.job_posting.department_name) {
    jobPostingErrors.department_name = ["This field may not be null."];
  }

  if (!formData.job_posting.employment_type) {
    jobPostingErrors.employment_type = ["This field may not be null."];
  }

  if (!formData.job_posting.work_setup) {
    jobPostingErrors.work_setup = ["This field may not be null."];
  }

  if (
    !formData.job_posting.working_site ||
    formData.job_posting.working_site.trim() === ""
  ) {
    jobPostingErrors.working_site = ["This field may not be blank."];
  }

  if (!formData.job_posting.number_of_vacancies) {
    jobPostingErrors.number_of_vacancies = ["This field may not be null."];
  }

  if (!formData.job_posting.min_salary) {
    jobPostingErrors.min_salary = ["This field may not be null."];
  }

  if (!formData.job_posting.max_salary) {
    jobPostingErrors.max_salary = ["This field may not be null."];
  }

  if (Object.keys(jobPostingErrors).length > 0) {
    step1Errors.job_posting = jobPostingErrors;
  }

  if (Object.keys(step1Errors).length > 0) {
    errors[1] = step1Errors;
  }

  const step2Errors: ValidationError = {};
  const descriptionErrors: ValidationError = {};

  if (
    !formData.job_posting.description ||
    formData.job_posting.description.trim() === ""
  ) {
    descriptionErrors.description = ["This field may not be blank."];
  }

  if (
    !formData.job_posting.responsibilities ||
    formData.job_posting.responsibilities.trim() === ""
  ) {
    descriptionErrors.responsibilities = ["This field may not be blank."];
  }

  if (
    !formData.job_posting.qualifications ||
    formData.job_posting.qualifications.trim() === ""
  ) {
    descriptionErrors.qualifications = ["This field may not be blank."];
  }

  if (Object.keys(descriptionErrors).length > 0) {
    step2Errors.job_posting = descriptionErrors;
  }

  if (Object.keys(step2Errors).length > 0) {
    errors[2] = step2Errors;
  }

  const step4Errors: ValidationError = {};

  if (!formData.pipeline || formData.pipeline.length === 0) {
    step4Errors.pipeline = ["At least one pipeline step is required."];
  }

  if (Object.keys(step4Errors).length > 0) {
    errors[4] = step4Errors;
  }

  return errors;
}

/**
 * Maps server validation errors to step-specific errors
 */
export function mapServerErrorsToSteps(
  serverErrors: ValidationError
): StepErrors {
  const errors: StepErrors = {
    1: null,
    2: null,
    3: null,
    4: null,
  };

  const step1Fields = [
    "client",
    "education_level",
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
  ];

  const step2Fields = ["description", "responsibilities", "qualifications"];

  // Map step 1 errors
  const step1Errors: ValidationError = {};
  if (serverErrors.client) {
    step1Errors.client = serverErrors.client as string[];
  }
  if (serverErrors.education_level) {
    step1Errors.education_level = serverErrors.education_level as string[];
  }
  if (
    serverErrors.job_posting &&
    typeof serverErrors.job_posting === "object"
  ) {
    const jobPostingErrors: ValidationError = {};
    const jobPosting = serverErrors.job_posting as ValidationError;

    step1Fields.forEach((field) => {
      if (jobPosting[field]) {
        jobPostingErrors[field] = jobPosting[field] as string[];
      }
    });

    if (Object.keys(jobPostingErrors).length > 0) {
      step1Errors.job_posting = jobPostingErrors;
    }
  }
  if (Object.keys(step1Errors).length > 0) {
    errors[1] = step1Errors;
  }

  // Map step 2 errors
  if (
    serverErrors.job_posting &&
    typeof serverErrors.job_posting === "object"
  ) {
    const step2Errors: ValidationError = {};
    const jobPosting = serverErrors.job_posting as ValidationError;

    step2Fields.forEach((field) => {
      if (jobPosting[field]) {
        if (!step2Errors.job_posting) {
          step2Errors.job_posting = {};
        }
        (step2Errors.job_posting as ValidationError)[field] = jobPosting[
          field
        ] as string[];
      }
    });

    if (Object.keys(step2Errors).length > 0) {
      errors[2] = step2Errors;
    }
  }

  // Map step 4 errors
  if (serverErrors.pipeline) {
    errors[4] = { pipeline: serverErrors.pipeline as string[] };
  }

  return errors;
}

/**
 * Checks if a specific step has errors
 */
export function hasStepErrors(stepErrors: ValidationError | null): boolean {
  if (!stepErrors) return false;
  return Object.keys(stepErrors).length > 0;
}

/**
 * Gets a summary of errors for a step
 */
export function getStepErrorSummary(
  stepErrors: ValidationError | null
): string {
  if (!stepErrors) return "";

  let errorCount = 0;
  const countErrors = (errors: ValidationError | string[]) => {
    if (Array.isArray(errors)) {
      errorCount++;
    } else {
      Object.values(errors).forEach(countErrors);
    }
  };

  countErrors(stepErrors);
  return errorCount === 1 ? "1 error" : `${errorCount} errors`;
}
