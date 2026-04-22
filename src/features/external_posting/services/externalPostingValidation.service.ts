import { z } from "zod";
import type { ValidationError } from "@/shared/utils/formValidation";

const requiredTextField = z
  .string({ message: "This field may not be null." })
  .trim()
  .min(1, "This field may not be blank.");

const requiredNumberField = z
  .number({ message: "This field may not be null." })
  .nonnegative("This field may not be null.");

const pipelineStepSchema = z.object({
  process_type: z
    .string({ message: "Process type is required." })
    .trim()
    .min(1, "Process type is required."),
  process_title: z
    .string({ message: "Process title is required." })
    .trim()
    .min(1, "Process title is required."),
  reminder: z
    .string({ message: "Reminder date is required." })
    .trim()
    .min(1, "Reminder date is required."),
  interviewer: z
    .object({
      id: z.number({ message: "Interviewer is required." }),
    })
    .nullable()
    .refine((value) => value !== null, {
      message: "Interviewer is required.",
      path: ["interviewer"],
    }),
});

const nonNegotiableItemSchema = z.object({
  field: z.string().trim().min(1),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.undefined(),
  ]),
});

const nonNegotiableSchema = z.object({
  non_negotiable: z.array(nonNegotiableItemSchema),
});

const MANAGED_NON_NEGOTIABLE_FIELDS = new Set([
  "expected_salary",
  "willing_to_work_onsite",
  "education_attained",
  "course",
]);

export const jobPostingSchema = z
  .object({
    job_title: requiredTextField,
    target_start_date: requiredTextField,
    reason_for_posting: requiredTextField,
    experience_level: requiredTextField,
    department_name: requiredTextField,
    employment_type: requiredTextField,
    work_setup: requiredTextField,
    working_site: requiredTextField,
    number_of_vacancies: requiredNumberField,
    min_salary: requiredNumberField,
    max_salary: requiredNumberField,
    work_schedule_from: requiredTextField,
    work_schedule_to: requiredTextField,
    description: requiredTextField,
    responsibilities: requiredTextField,
    qualifications: requiredTextField,
  })
  .refine((data) => data.max_salary >= data.min_salary, {
    path: ["max_salary"],
    message: "Maximum salary must be greater than or equal to minimum salary.",
  });

export const pipelineSchema = z.array(pipelineStepSchema);

export function validateJobPostingWithZod(
  jobPosting: unknown,
): ValidationError {
  const parsed = jobPostingSchema.safeParse(jobPosting);
  if (parsed.success) {
    return {};
  }

  const errors: ValidationError = {};
  parsed.error.issues.forEach((issue) => {
    const field = String(issue.path[0] ?? "job_posting");
    errors[field] = [issue.message];
  });

  return errors;
}

export function validatePipelineWithZod(
  pipeline: unknown[],
): { [stepIndex: number]: ValidationError } | null {
  if (!pipeline || pipeline.length === 0) {
    return null;
  }

  const pipelineErrors: { [stepIndex: number]: ValidationError } = {};

  pipeline.forEach((step, index) => {
    const parsedStep = pipelineStepSchema.safeParse(step);
    if (parsedStep.success) {
      return;
    }

    const stepErrors: ValidationError = {};
    parsedStep.error.issues.forEach((issue) => {
      const field = String(issue.path[0] ?? "pipeline");
      stepErrors[field] = [issue.message];
    });

    if (Object.keys(stepErrors).length > 0) {
      pipelineErrors[index] = stepErrors;
    }
  });

  return Object.keys(pipelineErrors).length > 0 ? pipelineErrors : null;
}

export function validateNonNegotiableWithZod(
  nonNegotiable: unknown,
): ValidationError {
  if (!nonNegotiable || typeof nonNegotiable !== "object") {
    return {};
  }

  const parsed = nonNegotiableSchema.safeParse(nonNegotiable);
  if (!parsed.success) {
    return { non_negotiable: ["Invalid non-negotiable payload."] };
  }

  const emptyFields: string[] = [];

  parsed.data.non_negotiable.forEach((item) => {
    if (!MANAGED_NON_NEGOTIABLE_FIELDS.has(item.field)) {
      return;
    }

    if (item.value === "" || item.value === null || item.value === undefined) {
      const fieldLabel = item.field
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      emptyFields.push(fieldLabel);
    }
  });

  if (emptyFields.length === 0) {
    return {};
  }

  return {
    non_negotiable: [
      `The following non-negotiable fields must have values: ${emptyFields.join(
        ", ",
      )}`,
    ],
  };
}
