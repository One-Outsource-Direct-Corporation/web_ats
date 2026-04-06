import { ApplicationFormManagement } from "@/shared/components/reusables/ApplicationFormManagement";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import type { ApplicationFormQuestionnaire } from "@/features/external_posting";
import type {
  ApplicationForm,
  ApplicationFormType,
  NonNegotiable,
} from "@/shared/types/application_form.types";
import type React from "react";

interface PRFStep04Props {
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
}

export default function PRFStep04({
  formData,
  updateFormData,
}: PRFStep04Props) {
  const applicationFormHandler = (
    field: keyof ApplicationForm,
    value: ApplicationFormType,
  ) => {
    updateFormData((prev) => ({
      ...prev,
      application_form_input: {
        ...prev.application_form_input,
        application_form: {
          ...prev.application_form_input.application_form,
          [field]: value,
        },
      },
    }));
  };

  const nonNegotiableHandler = (updatedNonNegotiables: NonNegotiable) => {
    updateFormData((prev) => ({
      ...prev,
      application_form_input: {
        ...prev.application_form_input,
        non_negotiable: updatedNonNegotiables,
      },
    }));
  };

  const questionnaireHandler = (
    updatedQuestionnaire: ApplicationFormQuestionnaire,
  ) => {
    updateFormData((prev) => ({
      ...prev,
      application_form_input: {
        ...prev.application_form_input,
        questionnaire: updatedQuestionnaire,
      },
    }));
  };

  return (
    <div className="lg:col-span-3 space-y-6">
      <ApplicationFormManagement
        applicationFormData={formData.application_form_input}
        applicationFormHandler={applicationFormHandler}
        nonNegotiableHandler={nonNegotiableHandler}
        questionnaireHandler={questionnaireHandler}
      />
    </div>
  );
}
