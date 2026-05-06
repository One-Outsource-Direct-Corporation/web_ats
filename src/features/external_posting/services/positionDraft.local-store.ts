import type { PositionFormData } from "@/features/external_posting/types/externalPosting.types";

const POSITION_DRAFT_STORAGE_KEY = "external-posting:position-draft:v1";

export interface PositionDraftLocalRecord {
  data: PositionFormData;
  synced: boolean;
  savedAt: string;
}

export interface PositionDraftLocalStore {
  saveDraft: (data: PositionFormData) => void;
  getDraft: () => PositionDraftLocalRecord | null;
  clearDraft: () => void;
  markSynced: () => void;
}

const safeParse = (value: string): PositionDraftLocalRecord | null => {
  try {
    return JSON.parse(value) as PositionDraftLocalRecord;
  } catch {
    return null;
  }
};

export const positionDraftLocalStore: PositionDraftLocalStore = {
  saveDraft(data) {
    if (typeof window === "undefined") return;

    const record: PositionDraftLocalRecord = {
      data,
      synced: false,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(POSITION_DRAFT_STORAGE_KEY, JSON.stringify(record));
  },

  getDraft() {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem(POSITION_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return safeParse(raw);
  },

  clearDraft() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(POSITION_DRAFT_STORAGE_KEY);
  },

  markSynced() {
    if (typeof window === "undefined") return;
    const current = this.getDraft();
    if (!current) return;

    const syncedRecord: PositionDraftLocalRecord = {
      ...current,
      synced: true,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(POSITION_DRAFT_STORAGE_KEY, JSON.stringify(syncedRecord));
  },
};
