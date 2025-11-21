import { useState } from "react";
import type {
  PositionFormData,
  PositionBase,
} from "../types/create_position.types";
import type {
  ApplicationForm,
  ApplicationFormType,
  NonNegotiable,
} from "../../../shared/types/application_form.types";
import type { PipelineStep } from "../../../shared/types/pipeline.types";
import type { ApplicationFormQuestionnaire } from "../types/questionnaire.types";
import { getDefaultFormData, testData } from "../data-dev/positionInitialData";

export const usePositionFormData = (initialData?: PositionFormData) => {
  const [formData, setFormData] = useState<PositionFormData>(
    initialData ||
      (import.meta.env.VITE_REACT_ENV === "development"
        ? testData()
        : getDefaultFormData())
  );

  function handlePositionBaseChange(
    field: keyof PositionBase,
    value: string | number | null
  ) {
    setFormData((prev: PositionFormData) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleJobPostingChange(
    fieldName: keyof PositionFormData["job_posting"],
    value: string | number | null
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
  }

  function pipelineHandler(updatedPipelines: PipelineStep[]) {
    setFormData((prev) => ({
      ...prev,
      pipeline: updatedPipelines,
    }));
  }

  function applicationFormHandler(
    field: keyof ApplicationForm,
    value: ApplicationFormType
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
    updatedQuestionnaire: ApplicationFormQuestionnaire
  ) {
    setFormData((prev) => ({
      ...prev,
      application_form: {
        ...prev.application_form,
        questionnaire: updatedQuestionnaire,
      },
    }));
  }

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
