/**
 * Shared validation utilities for form validation across Position and PRF forms
 */

export interface ValidationError {
  [key: string]: string[] | ValidationError;
}

/**
 * Validates job posting fields
 */
export function validateJobPosting(jobPosting: any): ValidationError {
  const errors: ValidationError = {};

  if (!jobPosting.job_title) {
    errors.job_title = ["This field may not be null."];
  }

  if (!jobPosting.target_start_date) {
    errors.target_start_date = ["This field may not be null."];
  }

  if (!jobPosting.reason_for_posting) {
    errors.reason_for_posting = ["This field may not be null."];
  }

  if (!jobPosting.experience_level) {
    errors.experience_level = ["This field may not be null."];
  }

  if (!jobPosting.department_name) {
    errors.department_name = ["This field may not be null."];
  }

  if (!jobPosting.employment_type) {
    errors.employment_type = ["This field may not be null."];
  }

  if (!jobPosting.work_setup) {
    errors.work_setup = ["This field may not be null."];
  }

  if (!jobPosting.working_site || jobPosting.working_site.trim() === "") {
    errors.working_site = ["This field may not be blank."];
  }

  if (!jobPosting.number_of_vacancies) {
    errors.number_of_vacancies = ["This field may not be null."];
  }

  if (!jobPosting.min_salary) {
    errors.min_salary = ["This field may not be null."];
  }

  if (!jobPosting.max_salary) {
    errors.max_salary = ["This field may not be null."];
  }

  if (!jobPosting.description || jobPosting.description.trim() === "") {
    errors.description = ["This field may not be blank."];
  }

  if (
    !jobPosting.responsibilities ||
    jobPosting.responsibilities.trim() === ""
  ) {
    errors.responsibilities = ["This field may not be blank."];
  }

  if (!jobPosting.qualifications || jobPosting.qualifications.trim() === "") {
    errors.qualifications = ["This field may not be blank."];
  }

  return errors;
}

/**
 * Validates pipeline steps
 */
export function validatePipeline(pipeline: any[]): {
  [stepIndex: number]: ValidationError;
} | null {
  if (!pipeline || pipeline.length === 0) {
    return null; // Return null if empty, let caller handle the message
  }

  const pipelineErrors: { [stepIndex: number]: ValidationError } = {};
  pipeline.forEach((step, index) => {
    const stepErrors: ValidationError = {};

    if (!step.process_type || step.process_type.trim() === "") {
      stepErrors.process_type = ["Process type is required."];
    }

    if (!step.process_title || step.process_title.trim() === "") {
      stepErrors.process_title = ["Process title is required."];
    }

    if (!step.reminder || step.reminder.trim() === "") {
      stepErrors.reminder = ["Reminder date is required."];
    }

    if (Object.keys(stepErrors).length > 0) {
      pipelineErrors[index] = stepErrors;
    }
  });

  return Object.keys(pipelineErrors).length > 0 ? pipelineErrors : null;
}

/**
 * Maps server validation errors to step-specific errors
 * @param serverErrors - Errors from server response
 * @param fieldMapping - Map of server field names to step numbers
 */
export function mapServerErrorsToSteps(
  serverErrors: ValidationError,
  fieldMapping: { [field: string]: number }
): { [stepNumber: number]: ValidationError | null } {
  const errors: { [stepNumber: number]: ValidationError | null } = {};

  // Group errors by step
  for (const [field, fieldErrors] of Object.entries(serverErrors)) {
    const stepNumber = fieldMapping[field];

    if (stepNumber !== undefined) {
      if (!errors[stepNumber]) {
        errors[stepNumber] = {};
      }
      (errors[stepNumber] as ValidationError)[field] = fieldErrors;
    } else if (field === "job_posting" && typeof fieldErrors === "object") {
      // Handle nested job_posting errors
      const jobPostingErrors = fieldErrors as ValidationError;

      for (const [jpField, jpErrors] of Object.entries(jobPostingErrors)) {
        const jpStepNumber = fieldMapping[`job_posting.${jpField}`];

        if (jpStepNumber !== undefined) {
          if (!errors[jpStepNumber]) {
            errors[jpStepNumber] = {};
          }
          if (!(errors[jpStepNumber] as ValidationError).job_posting) {
            (errors[jpStepNumber] as ValidationError).job_posting = {};
          }
          (
            (errors[jpStepNumber] as ValidationError)
              .job_posting as ValidationError
          )[jpField] = jpErrors;
        }
      }
    } else if (field === "pipeline") {
      // Handle pipeline errors separately - they have their own structure
      const pipelineStepNumber = fieldMapping["pipeline"];
      if (pipelineStepNumber !== undefined) {
        errors[pipelineStepNumber] = { pipeline: fieldErrors };
      }
    }
  }

  return errors;
}

/**
 * Checks if a step has errors
 */
export function hasStepErrors(stepErrors: ValidationError | null): boolean {
  if (!stepErrors) return false;
  return Object.keys(stepErrors).length > 0;
}

/**
 * Validates non-negotiable fields to ensure they have values
 */
export function validateNonNegotiable(nonNegotiable: any): ValidationError {
  const errors: ValidationError = {};

  if (!nonNegotiable || !nonNegotiable.non_negotiable) {
    return errors;
  }

  const emptyFields: string[] = [];

  nonNegotiable.non_negotiable.forEach((item: any, index: number) => {
    if (item.value === "" || item.value === null || item.value === undefined) {
      // Convert field key to readable label
      const fieldLabel = item.field
        .split("_")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      emptyFields.push(fieldLabel);
    }
  });

  if (emptyFields.length > 0) {
    errors.non_negotiable = [
      `The following non-negotiable fields must have values: ${emptyFields.join(
        ", "
      )}`,
    ];
  }

  return errors;
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

/**
 * Helper to get error message from nested job_posting field
 * @param errors - The validation errors object
 * @param field - The field name within job_posting
 * @returns The first error message or undefined
 */
export function getJobPostingError(
  errors: ValidationError | null | undefined,
  field: string
): string | undefined {
  if (!errors?.job_posting || Array.isArray(errors.job_posting)) {
    return undefined;
  }
  const fieldError = (errors.job_posting as ValidationError)[field];
  return Array.isArray(fieldError) ? fieldError[0] : undefined;
}

/**
 * Helper to get error message from root-level field
 * @param errors - The validation errors object
 * @param field - The field name at root level
 * @returns The first error message or undefined
 */
export function getFieldError(
  errors: ValidationError | null | undefined,
  field: string
): string | undefined {
  if (!errors) return undefined;
  const fieldError = errors[field];
  return Array.isArray(fieldError) ? fieldError[0] : undefined;
}
