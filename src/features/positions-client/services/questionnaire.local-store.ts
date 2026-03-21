import type { ApplicationFormQuestionnaire } from "@/features/external_posting/types/questionnaire.types";

const QUESTIONNAIRE_DRAFT_STORAGE_KEY =
  "external-posting:questionnaire-draft:v1";

export interface QuestionnaireLocalRecord {
  data: ApplicationFormQuestionnaire;
  synced: boolean;
  savedAt: string;
}

export interface QuestionnaireLocalStore {
  saveDraft: (data: ApplicationFormQuestionnaire) => void;
  getDraft: () => QuestionnaireLocalRecord | null;
  clearDraft: () => void;
  markSynced: () => void;
}

const safeParse = (value: string): QuestionnaireLocalRecord | null => {
  try {
    return JSON.parse(value) as QuestionnaireLocalRecord;
  } catch {
    return null;
  }
};

export const questionnaireLocalStore: QuestionnaireLocalStore = {
  saveDraft(data) {
    if (typeof window === "undefined") return;

    const record: QuestionnaireLocalRecord = {
      data,
      synced: false,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      QUESTIONNAIRE_DRAFT_STORAGE_KEY,
      JSON.stringify(record),
    );
  },

  getDraft() {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem(QUESTIONNAIRE_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return safeParse(raw);
  },

  clearDraft() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(QUESTIONNAIRE_DRAFT_STORAGE_KEY);
  },

  markSynced() {
    if (typeof window === "undefined") return;
    const current = this.getDraft();
    if (!current) return;

    const syncedRecord: QuestionnaireLocalRecord = {
      ...current,
      synced: true,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      QUESTIONNAIRE_DRAFT_STORAGE_KEY,
      JSON.stringify(syncedRecord),
    );
  },
};
