import { useState } from "react";
import type {
  PositionFormData,
  PositionBase,
} from "../types/create_position.types";
import type {
  ApplicationForm,
  ApplicationFormType,
} from "../types/application_form.types";
import type {
  PipelineStep,
  PipelineStepInDb,
  PipelineStepLocal,
} from "../types/pipeline.types";

const getDefaultFormData = (): PositionFormData => ({
  client: null,
  education_level: null,
  experience_level: null,
  job_posting: {
    job_title: null,
    department: null,
    other_department: null,
    employment_type: null,
    headcount: null,
    work_setup: null,
    target_start_date: null,
    reason_for_posting: null,
    other_reason_for_posting: null,
    min_budget: null,
    max_budget: null,
    description: null,
    responsibilities: null,
    qualifications: null,
    working_site: null,
  },
  application_form: {
    application_form: {
      name: "optional",
      birth_date: "optional",
      gender: "optional",
      primary_contact_number: "optional",
      secondary_contact_number: "optional",
      email: "optional",
      linkedin_profile: "optional",
      address: "optional",
      expected_salary: "optional",
      willing_to_work_onsite: "optional",
      photo_2x2: "optional",
      upload_med_cert: "optional",
      preferred_interview_schedule: "optional",
      education_attained: "optional",
      year_graduated: "optional",
      university: "optional",
      course: "optional",
      work_experience: "optional",
      how_did_you_hear_about_us: "optional",
      agreement: "optional",
      signature: "optional",
    },
    non_negotiables: [],
  },
  pipeline: [],
  section_questionnaire: {},
  locations_client: [],
  batches_client: [],
});

export const useFormData = (initialData?: PositionFormData) => {
  const [formData, setFormData] = useState<PositionFormData>(
    initialData || getDefaultFormData()
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

  function handleApplicationFormChange(
    fieldName: keyof ApplicationForm,
    status: ApplicationFormType
  ) {
    setFormData((prev: PositionFormData) => ({
      ...prev,
      application_form: {
        ...prev.application_form,
        application_form: {
          ...prev.application_form.application_form,
          [fieldName]: status,
        },
      },
    }));
  }

  function isNonNegotiable(fieldName: string): boolean {
    return formData.application_form.non_negotiables.some(
      (item) => item.field === fieldName
    );
  }

  function toggleNonNegotiable(fieldName: string) {
    setFormData((prev: PositionFormData) => {
      const exists = prev.application_form.non_negotiables.some(
        (item) => item.field === fieldName
      );

      if (exists) {
        return {
          ...prev,
          application_form: {
            ...prev.application_form,
            non_negotiables: prev.application_form.non_negotiables.filter(
              (item) => item.field !== fieldName
            ),
          },
        };
      } else {
        return {
          ...prev,
          application_form: {
            ...prev.application_form,
            non_negotiables: [
              ...prev.application_form.non_negotiables,
              { field: fieldName, value: "" },
            ],
          },
        };
      }
    });
  }

  function setNonNegotiableValue(
    fieldName: string,
    value: string | number | boolean
  ) {
    setFormData((prev: PositionFormData) => {
      const exists = prev.application_form.non_negotiables.some(
        (item) => item.field === fieldName
      );

      if (exists) {
        return {
          ...prev,
          application_form: {
            ...prev.application_form,
            non_negotiables: prev.application_form.non_negotiables.map((item) =>
              item.field === fieldName ? { ...item, value } : item
            ),
          },
        };
      } else {
        return {
          ...prev,
          application_form: {
            ...prev.application_form,
            non_negotiables: [
              ...prev.application_form.non_negotiables,
              { field: fieldName, value },
            ],
          },
        };
      }
    });
  }

  function getNonNegotiableValue(
    fieldName: string
  ): string | number | boolean | null {
    const item = formData.application_form.non_negotiables.find(
      (item) => item.field === fieldName
    );
    return item?.value || null;
  }

  function handlePipelineChange(
    pipeline_identifier: string | number,
    data: PipelineStep
  ) {
    setFormData((prev: PositionFormData) => {
      const existingStep = prev.pipeline.filter((step: PipelineStep) =>
        step.source === "local"
          ? step.pipeline_identifier === pipeline_identifier
          : step.id === pipeline_identifier
      );

      if (existingStep.length > 0) {
        // Update existing step
        return {
          ...prev,
          pipeline: prev.pipeline.map((step: PipelineStep) => {
            if (
              step.source === "local"
                ? step.pipeline_identifier ===
                  (existingStep[0] as PipelineStepLocal).pipeline_identifier
                : step.id === (existingStep[0] as PipelineStepInDb).id
            ) {
              return { ...data };
            }
            return step;
          }),
        };
      } else {
        return {
          ...prev,
          pipeline: [...prev.pipeline, data],
        };
      }
    });
  }

  function handleDeletePipelineChange(pipeline_identifier: string | number) {
    setFormData((prev: PositionFormData) => ({
      ...prev,
      pipeline: prev.pipeline.filter((step: PipelineStep) =>
        step.source === "local"
          ? step.pipeline_identifier !== pipeline_identifier
          : step.id !== pipeline_identifier
      ),
    }));
  }

  function resetFormData() {
    setFormData(getDefaultFormData());
  }

  return {
    formData,
    setFormData,
    handlePositionBaseChange,
    handleJobPostingChange,
    handleApplicationFormChange,
    isNonNegotiable,
    toggleNonNegotiable,
    setNonNegotiableValue,
    getNonNegotiableValue,
    handlePipelineChange,
    handleDeletePipelineChange,
    resetFormData,
  };
};
