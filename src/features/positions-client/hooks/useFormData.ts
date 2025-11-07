import { useState } from "react";
import type {
  PositionFormData,
  PositionBase,
} from "../types/create_position.types";
import type {
  ApplicationForm,
  ApplicationFormType,
} from "../../../shared/types/application_form.types";
import type { PipelineStep } from "../../../shared/types/pipeline.types";

const getDefaultFormData = (): PositionFormData => ({
  client: null,
  education_level: null,
  experience_level: null,
  job_posting: {
    job_title: null,
    department: null,
    other_department: null,
    employment_type: null,
    number_of_vacancies: null,
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
    questionnaire: { name: null, template: false, sections: [] },
  },
  pipeline: [],
  locations: [],
  batches: [],
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

  function resetFormData() {
    setFormData(getDefaultFormData());
  }

  function pipelineHandler(updatedPipelines: PipelineStep[]) {
    setFormData((prev) => ({
      ...prev,
      pipeline: updatedPipelines,
    }));
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
    resetFormData,
    pipelineHandler,
  };
};
