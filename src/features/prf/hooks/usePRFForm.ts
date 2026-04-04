import { useState } from "react";
import type { PRFFormData } from "../types/prf.types";
import type { PipelineStep } from "@/shared/types/pipeline.types";
import type {
  ApplicationForm,
  ApplicationFormType,
  NonNegotiable,
} from "@/shared/types/application_form.types";
import type { ApplicationFormQuestionnaire } from "@/features/external_posting";
import {
  normalizeApplicationFormDataPayload,
  normalizePipelineStepsPayload,
} from "@/shared/utils/applicationFormDataAdapter";
import initialDataPrf, { testData } from "../data/prfInitialData";
import { useAuth } from "@/features/auth/hooks/useAuth";

const assessmentTypeLabelToValue: Record<string, string> = {
  "Technical Test": "technical_test",
  "Personality Test": "personality_test",
  "Skills Assessment": "skills_assessment",
  "Cognitive Test": "cognitive_test",
  "Portfolio Review": "portfolio_review",
};

function normalizeAssessmentType(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  return assessmentTypeLabelToValue[value] ?? value;
}

function normalizeDepartmentValue(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as { id: unknown }).id === "number"
  ) {
    return (value as { id: number }).id;
  }

  return null;
}

function normalizePrfFormData(input: PRFFormData): PRFFormData {
  const normalizedPipeline = normalizePipelineStepsPayload(input.pipeline);

  return {
    ...input,
    job_posting: {
      ...input.job_posting,
      department: normalizeDepartmentValue(input.job_posting.department),
    },
    application_form: normalizeApplicationFormDataPayload(
      input.application_form,
    ),
    pipeline: normalizedPipeline.map((step) => ({
      ...step,
      assessments: Array.isArray(step.assessments)
        ? step.assessments.map((assessment) => ({
            ...assessment,
            type: normalizeAssessmentType(assessment.type) as string | null,
          }))
        : [],
    })),
  };
}

export function usePRFForm(initialData?: PRFFormData) {
  const { user } = useAuth();
  const defaultData =
    initialData ||
    (import.meta.env.VITE_REACT_ENV === "development"
      ? testData()
      : user
        ? initialDataPrf(user)
        : initialDataPrf());

  const [formData, setFormData] = useState<PRFFormData>(
    normalizePrfFormData(defaultData),
  );

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
  }

  return {
    formData,
    setFormData,
    pipelineHandler,
    applicationFormHandler,
    nonNegotiableHandler,
    questionnaireHandler,
  };
}
