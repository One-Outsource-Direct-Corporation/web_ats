import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PositionBase,
  PositionFormData,
} from "../types/externalPosting.types";
import type {
  ApplicationForm,
  ApplicationFormType,
  NonNegotiable,
} from "@/shared/types/application_form.types";
import type { PipelineStep } from "@/shared/types/pipeline.types";
import type { ApplicationFormQuestionnaire } from "../types/questionnaire.types";
import { getDefaultFormData } from "../utils/positionInitialData";
import { positionDraftLocalStore } from "../services/positionDraft.local-store";
import { questionnaireLocalStore } from "../services/questionnaire.local-store";
import {
  normalizeApplicationFormDataPayload,
  normalizePipelineStepsPayload,
} from "@/shared/utils/applicationFormDataAdapter";

const normalizeExternalPostingFormData = (
  value: PositionFormData,
): PositionFormData => ({
  ...value,
  application_form: normalizeApplicationFormDataPayload(value.application_form),
  pipeline: normalizePipelineStepsPayload(value.pipeline),
  locations: Array.isArray(value.locations) ? value.locations : [],
  batches: Array.isArray(value.batches) ? value.batches : [],
});

export const useExternalPostingFormData = (initialData?: PositionFormData) => {
  const shouldUseDraft = import.meta.env.VITE_REACT_ENV !== "development";
  const numericJobPostingFields: Array<keyof PositionFormData["job_posting"]> =
    ["number_of_vacancies", "min_salary", "max_salary"];

  const normalizeJobPostingValue = (
    fieldName: keyof PositionFormData["job_posting"],
    value: string | number | null,
  ): string | number | null => {
    if (!numericJobPostingFields.includes(fieldName)) {
      return value;
    }

    if (value === null) {
      return null;
    }

    if (typeof value === "number") {
      return Number.isNaN(value) ? null : value;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return null;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isNaN(parsedValue) ? null : parsedValue;
  };

  const [formData, setFormData] = useState<PositionFormData>(() => {
    if (initialData) {
      return normalizeExternalPostingFormData(initialData);
    }

    return getDefaultFormData();
  });

  const [hasDraft, setHasDraft] = useState(() => {
    if (!shouldUseDraft || initialData) return false;
    return positionDraftLocalStore.getDraft() !== null;
  });

  const draftResolvedRef = useRef(
    !shouldUseDraft || !!initialData || !positionDraftLocalStore.getDraft(),
  );

  const loadDraftFromStorage = useCallback(() => {
    const saved = positionDraftLocalStore.getDraft();
    if (saved?.data) {
      setFormData(normalizeExternalPostingFormData(saved.data));
    }
    draftResolvedRef.current = true;
    setHasDraft(false);
  }, []);

  const discardDraft = useCallback(() => {
    positionDraftLocalStore.clearDraft();
    draftResolvedRef.current = true;
    setHasDraft(false);
  }, []);

  function handlePositionBaseChange(
    field: keyof PositionBase,
    value: string | number | null,
  ) {
    setFormData((prev: PositionFormData) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleJobPostingChange(
    fieldName: keyof PositionFormData["job_posting"],
    value: string | number | null,
  ) {
    const normalizedValue = normalizeJobPostingValue(fieldName, value);

    setFormData((prev: PositionFormData) => ({
      ...prev,
      job_posting: {
        ...prev.job_posting,
        [fieldName]: normalizedValue,
      },
    }));
  }

  function resetFormData() {
    setFormData(getDefaultFormData());
    draftResolvedRef.current = true;
    if (shouldUseDraft) {
      positionDraftLocalStore.clearDraft();
    }
  }

  function pipelineHandler(updatedPipelines: PipelineStep[]) {
    setFormData((prev) => ({
      ...prev,
      pipeline: updatedPipelines,
    }));
  }

  function applicationFormHandler(
    field: keyof ApplicationForm,
    value: ApplicationFormType,
  ) {
    setFormData((prev) => ({
      ...prev,
      application_form: {
        ...prev.application_form,
        application_form: {
          ...prev.application_form.application_form,
          [field]: value,
        },
      },
    }));
  }

  function nonNegotiableHandler(updatedNonNegotiables: NonNegotiable) {
    setFormData((prev) => ({
      ...prev,
      application_form: {
        ...prev.application_form,
        non_negotiable: updatedNonNegotiables,
      },
    }));
  }

  function questionnaireHandler(
    updatedQuestionnaire: ApplicationFormQuestionnaire,
  ) {
    setFormData((prev) => ({
      ...prev,
      application_form: {
        ...prev.application_form,
        questionnaire: updatedQuestionnaire,
      },
    }));

    if (shouldUseDraft) {
      questionnaireLocalStore.saveDraft(updatedQuestionnaire);
    }
  }

  useEffect(() => {
    if (!shouldUseDraft || initialData) return;
    if (!draftResolvedRef.current) return;
    positionDraftLocalStore.saveDraft(formData);
  }, [formData, shouldUseDraft, initialData]);

  return {
    formData,
    setFormData,
    hasDraft,
    loadDraftFromStorage,
    discardDraft,
    handlePositionBaseChange,
    handleJobPostingChange,
    resetFormData,
    applicationFormHandler,
    nonNegotiableHandler,
    questionnaireHandler,
    pipelineHandler,
  };
};
