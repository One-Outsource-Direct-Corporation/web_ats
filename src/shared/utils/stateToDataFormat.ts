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
  return {
    ...jobPosting,
    target_start_date: formatDateYYYYMMDD(jobPosting.target_start_date ?? ""),
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
  let baseData: any = { ...formData };

  // Format the job posting field if present and specified
  if (options.jobPostingField && baseData[options.jobPostingField]) {
    baseData[options.jobPostingField] = formatJobPosting(
      baseData[options.jobPostingField]
    );
  }

  // Custom field handling
  if (options.customFields) {
    baseData = { ...baseData, ...options.customFields(formData) };
  }

  // Normalize pipeline data, if present
  if (Array.isArray(baseData.pipeline)) {
    baseData.pipeline = baseData.pipeline.map((step: any) => ({
      ...step,
      hiring_managers: Array.isArray(step.hiring_managers)
        ? step.hiring_managers.map((mgr: any) => mgr.id)
        : [],
      assessments: step.assessments,
    }));
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
