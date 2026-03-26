import { useEffect, useState } from "react";
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
import { getDefaultFormData, testData } from "../utils/positionInitialData";
import { positionDraftLocalStore } from "../services/positionDraft.local-store";
import { questionnaireLocalStore } from "../services/questionnaire.local-store";

export const useExternalPostingFormData = (initialData?: PositionFormData) => {
  const shouldUseDraft = import.meta.env.VITE_REACT_ENV !== "development";

  const [formData, setFormData] = useState<PositionFormData>(() => {
    if (initialData) return initialData;

    if (shouldUseDraft) {
      const savedDraft = positionDraftLocalStore.getDraft();
      if (savedDraft?.data) {
        return savedDraft.data;
      }
    }

    return import.meta.env.VITE_REACT_ENV === "development"
      ? testData()
      : getDefaultFormData();
  });

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
    setFormData((prev: PositionFormData) => ({
      ...prev,
      job_posting: {
        ...prev.job_posting,
        [fieldName]: value,
      },
    }));
  }

  function resetFormData() {
    setFormData(getDefaultFormData());
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
    positionDraftLocalStore.saveDraft(formData);
  }, [formData, shouldUseDraft, initialData]);

  return {
    formData,
    setFormData,
    handlePositionBaseChange,
    handleJobPostingChange,
    resetFormData,
    applicationFormHandler,
    nonNegotiableHandler,
    questionnaireHandler,
    pipelineHandler,
  };
};
