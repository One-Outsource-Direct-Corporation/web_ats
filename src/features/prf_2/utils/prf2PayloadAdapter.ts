import {
  JobPostingStatus,
  JobPostingType,
} from "@/features/jobs/types/JobPosting";
import type { PRFFormData as LegacyPRFFormData } from "@/features/prf_2/types/LegacyPRFCompat";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import type {
  DepartmentObject,
  ImmediateSupervisorObject,
} from "@/features/prf_2/types/PRF";
import { getImmediateSupervisorDisplay } from "@/features/prf_2/utils/displayMappers";
import { createInitialPRF2Data } from "@/features/prf_2/utils/prfInitialData";

interface PrfSubmitPayload {
  job_posting: {
    id?: number;
    job_title: string | null;
    target_start_date: string | null;
    reason_for_posting: string | null;
    other_reason_for_posting: string | null;
    experience_level: string | null;
    department: number | null;
    employment_type: string | null;
    work_setup: string | null;
    working_site: string | null;
    number_of_vacancies: number | null;
    work_schedule_from: string | null;
    work_schedule_to: string | null;
    min_salary: number | null;
    max_salary: number | null;
    description: string | null;
    responsibilities: string | null;
    qualifications: string | null;
    status: string | null;
    type: "prf";
  };
  business_unit: number | null;
  immediate_supervisor: number | null;
  category: string | null;
  hardware_required: Record<string, boolean>;
  software_required: Record<string, boolean>;
  application_form: PRFFormData["application_form_input"];
  pipeline: PRFFormData["pipeline_input"];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringOrEmpty(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function toNumberOrEmpty(value: unknown): number | "" {
  if (typeof value === "number") {
    return Number.isNaN(value) ? "" : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }

    const numeric = Number(trimmed);
    return Number.isNaN(numeric) ? "" : numeric;
  }

  return "";
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const numeric = Number(trimmed);
    return Number.isNaN(numeric) ? null : numeric;
  }

  return null;
}

function toNullableString(value: unknown): string | null {
  if (typeof value === "string") {
    return value.trim() ? value : null;
  }

  return null;
}

function toImmediateSupervisorObject(
  value: unknown,
): ImmediateSupervisorObject | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "number" ||
    typeof value.first_name !== "string" ||
    typeof value.last_name !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    first_name: value.first_name,
    middle_name:
      typeof value.middle_name === "string" ? value.middle_name : null,
    last_name: value.last_name,
    role: typeof value.role === "string" ? value.role : "supervisor",
  };
}

function toDepartmentObject(value: unknown): DepartmentObject | null {
  if (!isRecord(value)) {
    return null;
  }

  if (typeof value.id !== "number" || typeof value.name !== "string") {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
  } as DepartmentObject;
}

function normalizeBooleanRecord(value: unknown): Record<string, boolean> {
  if (!isRecord(value)) {
    return {};
  }

  const normalized: Record<string, boolean> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (typeof nestedValue === "boolean") {
      normalized[key] = nestedValue;
    }
  }

  return normalized;
}

export function adaptLegacyPrfToPrf2FormData(
  source: LegacyPRFFormData,
): PRFFormData {
  const base = createInitialPRF2Data();
  const sourceJobPosting: Record<string, unknown> = isRecord(source.job_posting)
    ? source.job_posting
    : {};
  const department = toDepartmentObject(
    (source as { department?: unknown }).department,
  );
  const immediateSupervisor = toImmediateSupervisorObject(
    (source as { immediate_supervisor_display?: unknown })
      .immediate_supervisor_display,
  );
  const immediateSupervisorDisplay =
    getImmediateSupervisorDisplay(immediateSupervisor);

  // Handle business_unit as either number or object from backend
  const sourceBusinessUnit = (source as Record<string, unknown>).business_unit;
  const businessUnitId =
    typeof sourceBusinessUnit === "number"
      ? sourceBusinessUnit
      : isRecord(sourceBusinessUnit) && typeof sourceBusinessUnit.id === "number"
        ? sourceBusinessUnit.id
        : null;

  // Handle department as either number or object from backend
  const sourceDepartment = sourceJobPosting.department;
  const departmentId =
    typeof sourceDepartment === "number"
      ? sourceDepartment
      : isRecord(sourceDepartment) && typeof sourceDepartment.id === "number"
        ? sourceDepartment.id
        : department?.id ?? "";
  const departmentName =
    typeof sourceJobPosting.department_display === "string"
      ? sourceJobPosting.department_display
      : isRecord(sourceDepartment) && typeof sourceDepartment.name === "string"
        ? sourceDepartment.name
        : department?.name ?? null;

  const adapted: PRFFormData = {
    ...base,
    job_posting: {
      ...base.job_posting,
      id:
        typeof sourceJobPosting.id === "number"
          ? sourceJobPosting.id
          : undefined,
      job_title: toStringOrEmpty(sourceJobPosting.job_title),
      target_start_date: toStringOrEmpty(sourceJobPosting.target_start_date),
      reason_for_posting: toStringOrEmpty(sourceJobPosting.reason_for_posting),
      other_reason_for_posting: toStringOrEmpty(
        sourceJobPosting.other_reason_for_posting,
      ),
      experience_level: toStringOrEmpty(sourceJobPosting.experience_level) as
        | PRFFormData["job_posting"]["experience_level"]
        | "",
      department: departmentId,
      department_display: departmentName,
      employment_type: toStringOrEmpty(sourceJobPosting.employment_type) as
        | PRFFormData["job_posting"]["employment_type"]
        | "",
      work_setup: toStringOrEmpty(sourceJobPosting.work_setup) as
        | PRFFormData["job_posting"]["work_setup"]
        | "",
      working_site: toStringOrEmpty(sourceJobPosting.working_site),
      number_of_vacancies: toNumberOrEmpty(
        sourceJobPosting.number_of_vacancies,
      ),
      work_schedule_from: toStringOrEmpty(sourceJobPosting.work_schedule_from),
      work_schedule_to: toStringOrEmpty(sourceJobPosting.work_schedule_to),
      min_salary: toNumberOrEmpty(sourceJobPosting.min_salary),
      max_salary: toNumberOrEmpty(sourceJobPosting.max_salary),
      description: toStringOrEmpty(sourceJobPosting.description),
      responsibilities: toStringOrEmpty(sourceJobPosting.responsibilities),
      qualifications: toStringOrEmpty(sourceJobPosting.qualifications),
      status:
        (toNullableString(
          sourceJobPosting.status,
        ) as PRFFormData["job_posting"]["status"]) || JobPostingStatus.PENDING,
      type: JobPostingType.PRF,
    },
    prf_input: {
      ...base.prf_input,
      business_unit: (businessUnitId ?? "") as PRFFormData["prf_input"]["business_unit"],
      immediate_supervisor:
        typeof source.immediate_supervisor === "number"
          ? source.immediate_supervisor
          : (immediateSupervisor?.id ?? ""),
      immediate_supervisor_display: immediateSupervisorDisplay,
      category: (toNullableString(source.category) ??
        "") as PRFFormData["prf_input"]["category"],
      hardware_required: normalizeBooleanRecord(source.hardware_required),
      software_required: normalizeBooleanRecord(source.software_required),
    },
    application_form_input: isRecord(source.application_form)
      ? (source.application_form as PRFFormData["application_form_input"])
      : base.application_form_input,
    pipeline_input: (() => {
      const steps = Array.isArray(source.pipeline)
        ? (source.pipeline as PRFFormData["pipeline_input"])
        : [];
      // Enforce mandatory Stage 04 steps
      const mandatoryTypes = ["for_job_offer", "pre_onboarding", "onboarding"];
      const existingTypes = new Set(steps.filter((s) => s.stage === 4).map((s) => s.process_type));
      const missing = mandatoryTypes.filter((t) => !existingTypes.has(t));
      const PASSED_BODY =
        "Dear {{ candidate_name }},\n\n" +
        "We are pleased to inform you that you have successfully completed the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
        "We will be in touch with further details regarding the next steps.\n\n" +
        "Best regards,\n" +
        "{{ interviewer_name }}\n" +
        "{{ interviewer_role }}\n" +
        "{{ company_name }}";
      const FAILED_BODY =
        "Dear {{ candidate_name }},\n\n" +
        "Thank you for your participation in the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
        "After careful consideration, we regret to inform you that you have not been successful on this occasion.\n\n" +
        "We appreciate your interest and wish you all the best in your future endeavors.\n\n" +
        "Best regards,\n" +
        "{{ interviewer_name }}\n" +
        "{{ interviewer_role }}\n" +
        "{{ company_name }}";
      missing.forEach((process_type, index) => {
        const order = steps.filter((s) => s.stage === 4).length + index + 1;
        steps.push({
          tempId: `default-${process_type}-${Date.now()}-${index}`,
          process_type,
          process_title: process_type === "for_job_offer" ? "For Job Offer" : process_type === "pre_onboarding" ? "Pre-Onboarding" : "Onboarding",
          description: "",
          order,
          stage: 4,
          interviewer: null,
          passedEmailTemplateId: null,
          failedEmailTemplateId: null,
          notification_templates: [
            { action_type: "send_email", trigger_outcome: "passed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: PASSED_BODY },
            { action_type: "send_email", trigger_outcome: "failed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: FAILED_BODY },
          ],
          assessments: [],
        } as any);
      });
      return steps;
    })(),
  };

  return adapted;
}

export function buildPrfSubmitPayload(formData: PRFFormData): PrfSubmitPayload {
  const immediateSupervisorId =
    typeof formData.prf_input.immediate_supervisor === "number"
      ? formData.prf_input.immediate_supervisor
      : null;

  return {
    job_posting: {
      id:
        typeof formData.job_posting.id === "number"
          ? formData.job_posting.id
          : undefined,
      job_title: toNullableString(formData.job_posting.job_title),
      target_start_date: toNullableString(
        formData.job_posting.target_start_date,
      ),
      reason_for_posting: toNullableString(
        formData.job_posting.reason_for_posting,
      ),
      other_reason_for_posting: toNullableString(
        formData.job_posting.other_reason_for_posting,
      ),
      experience_level: toNullableString(formData.job_posting.experience_level),
      department: toNumberOrNull(formData.job_posting.department),
      employment_type: toNullableString(formData.job_posting.employment_type),
      work_setup: toNullableString(formData.job_posting.work_setup),
      working_site: toNullableString(formData.job_posting.working_site),
      number_of_vacancies: toNumberOrNull(
        formData.job_posting.number_of_vacancies,
      ),
      work_schedule_from: toNullableString(
        formData.job_posting.work_schedule_from,
      ),
      work_schedule_to: toNullableString(formData.job_posting.work_schedule_to),
      min_salary: toNumberOrNull(formData.job_posting.min_salary),
      max_salary: toNumberOrNull(formData.job_posting.max_salary),
      description: toNullableString(formData.job_posting.description),
      responsibilities: toNullableString(formData.job_posting.responsibilities),
      qualifications: toNullableString(formData.job_posting.qualifications),
      status:
        toNullableString(formData.job_posting.status) ??
        JobPostingStatus.PENDING,
      type: "prf",
    },
    business_unit: toNumberOrNull(formData.prf_input.business_unit),
    immediate_supervisor: immediateSupervisorId,
    category: toNullableString(formData.prf_input.category),
    hardware_required: normalizeBooleanRecord(
      formData.prf_input.hardware_required,
    ),
    software_required: normalizeBooleanRecord(
      formData.prf_input.software_required,
    ),
    application_form: formData.application_form_input,
    pipeline: Array.isArray(formData.pipeline_input)
      ? formData.pipeline_input
      : [],
  };
}
