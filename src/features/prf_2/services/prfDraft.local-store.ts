import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";

const PRF_DRAFT_STORAGE_KEY = "prf:form-draft:v1";

export interface PrfDraftSummary {
  jobTitle: string;
  businessUnit: string | number;
  lastStep: number;
}

export interface PrfDraftLocalRecord {
  data: PRFFormData;
  savedAt: string;
  summary: PrfDraftSummary;
}

export interface PrfDraftLocalStore {
  saveDraft: (data: PRFFormData, summary: PrfDraftSummary) => void;
  getDraft: () => PrfDraftLocalRecord | null;
  clearDraft: () => void;
}

const safeParse = (value: string): PrfDraftLocalRecord | null => {
  try {
    return JSON.parse(value) as PrfDraftLocalRecord;
  } catch {
    return null;
  }
};

export const prfDraftLocalStore: PrfDraftLocalStore = {
  saveDraft(data, summary) {
    if (typeof window === "undefined") return;

    const record: PrfDraftLocalRecord = {
      data,
      savedAt: new Date().toISOString(),
      summary,
    };

    localStorage.setItem(PRF_DRAFT_STORAGE_KEY, JSON.stringify(record));
  },

  getDraft() {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem(PRF_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return safeParse(raw);
  },

  clearDraft() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PRF_DRAFT_STORAGE_KEY);
  },
};

export function extractDraftSummary(formData: PRFFormData): PrfDraftSummary {
  return {
    jobTitle: formData.job_posting.job_title || "",
    businessUnit: formData.prf_input.business_unit || "",
    lastStep: 1,
  };
}
