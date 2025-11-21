import DOMPurify from "dompurify";
import { formatDateYYYYMMDD } from "./formatDate";
import type { PositionFormData } from "@/features/positions-client/types/create_position.types";
import type { PRFFormData } from "@/features/prf/types/prf.types";

type ExtractedFiles = Record<string, File>;
type ExtractFilesResult = { data: unknown; files: ExtractedFiles };

/** Safely sanitize strings using DOMPurify */
function sanitizeString(input?: string): string {
  return DOMPurify.sanitize(input ?? "");
}

/** Format a generic job posting object with date and sanitization */
function formatJobPosting<T extends Record<string, any>>(jobPosting: T): T {
  let formattedDate = jobPosting.target_start_date;

  // Only format if it's not already in YYYY-MM-DD format
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

/**
 * Recursively extracts File objects from any nested data structure.
 * - Replaces File objects with null.
 * - Replaces FileInDb objects with `{id: number}`.
 * - Returns the normalized data and a map of extracted files keyed by their path.
 */
function extractFiles(obj: unknown, prefix = ""): ExtractFilesResult {
  let data: unknown;
  const files: ExtractedFiles = {};

  if (Array.isArray(obj)) {
    data = obj.map((item, idx) => {
      return extractFiles(item, `${prefix}[${idx}]`).data;
    });
    // Collect files from every array item
    obj.forEach((item, idx) => {
      const childFiles = extractFiles(item, `${prefix}[${idx}]`).files;
      Object.assign(files, childFiles);
    });
  } else if (obj && typeof obj === "object") {
    data = {};
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      // File
      if (value instanceof File) {
        files[fullKey] = value;
        (data as Record<string, unknown>)[key] = null;
      }
      // FileInDb
      else if (
        value &&
        typeof value === "object" &&
        "id" in value &&
        "file" in value
      ) {
        (data as Record<string, unknown>)[key] = {
          id: (value as { id: number }).id,
        };
      }
      // Empty object - treat as null (FIX FOR YOUR ISSUE)
      else if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      ) {
        (data as Record<string, unknown>)[key] = null;
      }
      // Array or object - recurse
      else if (typeof value === "object" && value !== null) {
        const result = extractFiles(value, fullKey);
        (data as Record<string, unknown>)[key] = result.data;
        Object.assign(files, result.files);
      }
      // Primitive value
      else {
        (data as Record<string, unknown>)[key] = value;
      }
    }
  } else {
    // Primitive
    data = obj;
  }

  return { data, files };
}

/**
 * Converts a structured state object (formData) to FormData, handling nested files, job posting formatting, etc.
 *
 * @param formData The root state object
 * @param options Config object to specify jobPosting field name and additional field logic
 */
export function stateToDataFormat<T extends object>(
  formData: T,
  options: {
    jobPostingField?: keyof T;
    customFields?: (data: T) => Partial<T>;
  } = {}
): FormData {
  let baseData = { ...formData } as any;

  // Format the job posting field if present and specified
  if (options.jobPostingField && baseData[options.jobPostingField as string]) {
    baseData[options.jobPostingField as string] = formatJobPosting(
      baseData[options.jobPostingField as string]
    );
  }

  // Custom field handling
  if (options.customFields) {
    baseData = { ...baseData, ...options.customFields(formData) };
  }

  // Normalize pipeline data, if present
  if ("pipeline" in baseData && Array.isArray(baseData.pipeline)) {
    baseData.pipeline = baseData.pipeline.map((step: any) => {
      const normalizedStep: any = {
        ...step,
        hiring_managers: Array.isArray(step.hiring_managers)
          ? step.hiring_managers.map((mgr: any) =>
              typeof mgr === "object" && mgr !== null && "id" in mgr
                ? mgr.id
                : mgr
            )
          : [],
        // IMPORTANT: Normalize assessments within each step
        assessments: Array.isArray(step.assessments)
          ? step.assessments.map((assessment: any) => {
              const normalizedAssessment: any = { ...assessment };

              // Preserve id for existing assessments
              if (assessment.id !== undefined) {
                normalizedAssessment.id = assessment.id;
              }

              // Remove tempId (only for React state)
              delete normalizedAssessment.tempId;

              return normalizedAssessment;
            })
          : [],
      };

      // Preserve id for existing steps (PipelineStepInDb)
      if (step.id !== undefined) {
        normalizedStep.id = step.id;
      }

      // Remove tempId if present (it's only for React state management)
      if ("tempId" in normalizedStep) {
        delete normalizedStep.tempId;
      }

      return normalizedStep;
    });
  }

  // Normalize location data, if present
  if ("locations" in baseData && Array.isArray(baseData.locations)) {
    baseData.locations = baseData.locations.map((location: any) => {
      const normalizedLocation: any = { ...location };

      // If location has a tempId and no id, keep the tempId for backend to ignore
      if (location.tempId && !location.id) {
        // Keep tempId - backend will ignore it during creation
        normalizedLocation.tempId = location.tempId;
      }

      // Preserve id for existing locations (LocationEntryDb)
      if (location.id !== undefined) {
        normalizedLocation.id = location.id;
      }

      return normalizedLocation;
    });

    // Normalize batch data and update location references
    if ("batches" in baseData && Array.isArray(baseData.batches)) {
      baseData.batches = baseData.batches.map((batch: any) => {
        const normalizedBatch: any = { ...batch };

        // Preserve id for existing batches (BatchEntryDb)
        if (batch.id !== undefined) {
          normalizedBatch.id = batch.id;
        }

        // Preserve tempId for new batches - backend will ignore it
        if (batch.tempId && !batch.id) {
          normalizedBatch.tempId = batch.tempId;
        }

        // Handle location field - keep it as-is (tempId or ID)
        if (batch.location !== undefined) {
          normalizedBatch.location = batch.location;
        }

        return normalizedBatch;
      });
    }
  } else if ("batches" in baseData && Array.isArray(baseData.batches)) {
    // Handle batches even if no locations array exists
    baseData.batches = baseData.batches.map((batch: any) => {
      const normalizedBatch: any = { ...batch };

      // Preserve id for existing batches (BatchEntryDb)
      if (batch.id !== undefined) {
        normalizedBatch.id = batch.id;
      }

      // Preserve tempId for new batches - backend will ignore it
      if (batch.tempId && !batch.id) {
        normalizedBatch.tempId = batch.tempId;
      }

      // Ensure location field is preserved (it's a FK to LocationEntry)
      if (batch.location !== undefined) {
        normalizedBatch.location = batch.location;
      }

      return normalizedBatch;
    });
  }

  // Normalize questionnaire name if present (can be at root or nested in application_form)
  const questionnaireLocations = [
    { obj: baseData, path: "questionnaire" },
    { obj: baseData.application_form, path: "application_form.questionnaire" },
  ];

  for (const location of questionnaireLocations) {
    if (
      location.obj &&
      "questionnaire" in location.obj &&
      location.obj.questionnaire &&
      typeof location.obj.questionnaire === "object"
    ) {
      if (
        !location.obj.questionnaire.name ||
        (typeof location.obj.questionnaire.name === "string" &&
          location.obj.questionnaire.name.trim() === "") ||
        location.obj.questionnaire.name === null
      ) {
        location.obj.questionnaire = {
          ...location.obj.questionnaire,
          name: "anonymous",
        };
      }
    }
  }

  // Extract files and normalized data recursively
  const { data: jsonData, files } = extractFiles(baseData);

  // Build FormData object
  const formDataObj = new FormData();
  formDataObj.append("data", JSON.stringify(jsonData));
  for (const [key, file] of Object.entries(files)) {
    formDataObj.append(key, file);
  }

  return formDataObj;
}

// Usage for PositionFormData
export function stateToDataFormatClient(formData: PositionFormData): FormData {
  return stateToDataFormat(formData, { jobPostingField: "job_posting" });
}

// Usage for PRFFormData
export function stateToDataFormatPRF(formData: PRFFormData): FormData {
  return stateToDataFormat(formData, { jobPostingField: "job_posting" });
}
