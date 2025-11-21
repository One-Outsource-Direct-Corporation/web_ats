import { useState } from "react";
import type { PRFFormData } from "../types/prf.types";
import type { PipelineStep } from "@/shared/types/pipeline.types";
import type {
  ApplicationForm,
  ApplicationFormType,
  NonNegotiable,
} from "@/shared/types/application_form.types";
import type { ApplicationFormQuestionnaire } from "@/features/positions-client/types/questionnaire.types";
import initialDataPrf, { testData } from "../data/prfInitialData";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function usePRFForm(initialData?: PRFFormData) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PRFFormData>(
    initialData ||
      (import.meta.env.VITE_REACT_ENV === "development"
        ? testData()
        : user
        ? initialDataPrf(user)
        : initialDataPrf())
  );

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

  function resetData() {
    setFormData(user ? initialDataPrf(user) : initialDataPrf());
  }

  return {
    formData,
    setFormData,
    pipelineHandler,
    applicationFormHandler,
    nonNegotiableHandler,
    questionnaireHandler,
    resetData,
  };
}
