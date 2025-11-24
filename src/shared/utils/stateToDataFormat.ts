import DOMPurify from "dompurify";
import { formatDateYYYYMMDD } from "./formatDate";
import type { PositionFormData } from "@/features/positions-client/types/create_position.types";
import type { PRFFormData } from "@/features/prf/types/prf.types";

type ExtractedFiles = Record<string, File>;
type ExtractFilesResult = { data: unknown; files: ExtractedFiles };

function sanitizeString(input?: string): string {
  return DOMPurify.sanitize(input ?? "");
}

function formatJobPosting<T extends Record<string, any>>(jobPosting: T): T {
  let formattedDate = jobPosting.target_start_date;

  if (formattedDate && !/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
    formattedDate = formatDateYYYYMMDD(formattedDate);
  }

  return {
    ...jobPosting,
    target_start_date: formattedDate,
    description: sanitizeString(jobPosting.description),
    responsibilities: sanitizeString(jobPosting.responsibilities),
    qualifications: sanitizeString(jobPosting.qualifications),
    working_site: sanitizeString(jobPosting.working_site),
  };
}

function extractFiles(obj: unknown, prefix = ""): ExtractFilesResult {
  let data: unknown;
  const files: ExtractedFiles = {};

  if (Array.isArray(obj)) {
    data = obj.map((item, idx) => {
      return extractFiles(item, `${prefix}[${idx}]`).data;
    });
    obj.forEach((item, idx) => {
      const childFiles = extractFiles(item, `${prefix}[${idx}]`).files;
      Object.assign(files, childFiles);
    });
  } else if (obj && typeof obj === "object") {
    data = {};
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (value instanceof File) {
        files[fullKey] = value;
        (data as Record<string, unknown>)[key] = null;
      } else if (
        value &&
        typeof value === "object" &&
        "id" in value &&
        "file" in value
      ) {
        (data as Record<string, unknown>)[key] = {
          id: (value as { id: number }).id,
        };
      } else if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      ) {
        (data as Record<string, unknown>)[key] = null;
      } else if (typeof value === "object" && value !== null) {
        const result = extractFiles(value, fullKey);
        (data as Record<string, unknown>)[key] = result.data;
        Object.assign(files, result.files);
      } else {
        (data as Record<string, unknown>)[key] = value;
      }
    }
  } else {
    data = obj;
  }

  return { data, files };
}

export function stateToDataFormat<T extends object>(
  formData: T,
  options: {
    jobPostingField?: keyof T;
    customFields?: (data: T) => Partial<T>;
  } = {}
): FormData {
  let baseData = { ...formData } as any;

  if (options.jobPostingField && baseData[options.jobPostingField as string]) {
    baseData[options.jobPostingField as string] = formatJobPosting(
      baseData[options.jobPostingField as string]
    );
  }

  if (options.customFields) {
    baseData = { ...baseData, ...options.customFields(formData) };
  }

  if ("pipeline" in baseData && Array.isArray(baseData.pipeline)) {
    baseData.pipeline = baseData.pipeline.map((step: any) => {
      const hrIds = Array.isArray(step.human_resources)
        ? step.human_resources.map((mgr: any) =>
            typeof mgr === "object" && mgr !== null && "id" in mgr
              ? mgr.id
              : mgr
          )
        : [];

      const normalizedStep: any = {
        ...step,
        process_title: step.process_title || step.name || "",
        human_resources_ids: hrIds,
        // Remove old keys
        human_resources: undefined,
        name: undefined,

        assessments: Array.isArray(step.assessments)
          ? step.assessments.map((assessment: any) => {
              const normalizedAssessment: any = { ...assessment };
              if (assessment.id !== undefined)
                normalizedAssessment.id = assessment.id;
              delete normalizedAssessment.tempId;
              return normalizedAssessment;
            })
          : [],
      };

      if (step.id !== undefined) normalizedStep.id = step.id;
      if ("tempId" in normalizedStep) delete normalizedStep.tempId;

      return normalizedStep;
    });
  }

  if ("locations" in baseData && Array.isArray(baseData.locations)) {
    baseData.locations = baseData.locations.map((location: any) => {
      const normalizedLocation: any = { ...location };
      if (location.tempId && !location.id)
        normalizedLocation.tempId = location.tempId;
      if (location.id !== undefined) normalizedLocation.id = location.id;
      return normalizedLocation;
    });
  }

  if ("batches" in baseData && Array.isArray(baseData.batches)) {
    baseData.batches = baseData.batches.map((batch: any) => {
      const normalizedBatch: any = { ...batch };
      if (batch.id !== undefined) normalizedBatch.id = batch.id;
      if (batch.tempId && !batch.id) normalizedBatch.tempId = batch.tempId;
      if (batch.location !== undefined)
        normalizedBatch.location = batch.location;
      return normalizedBatch;
    });
  }
  const questionnaireLocations = [
    { obj: baseData, path: "questionnaire" },
    { obj: baseData.application_form, path: "application_form.questionnaire" },
  ];

  for (const location of questionnaireLocations) {
    if (
      location.obj?.questionnaire &&
      typeof location.obj.questionnaire === "object"
    ) {
      if (
        !location.obj.questionnaire.name ||
        location.obj.questionnaire.name.trim() === ""
      ) {
        location.obj.questionnaire = {
          ...location.obj.questionnaire,
          name: "anonymous",
        };
      }
    }
  }

  if ("pipeline" in baseData) {
    baseData.pipeline_input = baseData.pipeline;
    delete baseData.pipeline;
  }

  if ("application_form" in baseData) {
    baseData.application_form_input = baseData.application_form;
    delete baseData.application_form;
  }

  if ("locations" in baseData) {
    baseData.locations_input = baseData.locations;
    delete baseData.locations;
  }

  if ("batches" in baseData) {
    baseData.batches_input = baseData.batches;
    delete baseData.batches;
  }

  const { data: jsonData, files } = extractFiles(baseData);

  const formDataObj = new FormData();
  formDataObj.append("data", JSON.stringify(jsonData));

  for (const [key, file] of Object.entries(files)) {
    formDataObj.append(key, file);
  }

  return formDataObj;
}

export function stateToDataFormatClient(formData: PositionFormData): FormData {
  return stateToDataFormat(formData, { jobPostingField: "job_posting" });
}

export function stateToDataFormatPRF(formData: PRFFormData): FormData {
  return stateToDataFormat(formData, { jobPostingField: "job_posting" });
}
