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

const getDefaultFormData = (): PositionFormData => ({
  client: null,
  education_level: null,
  job_posting: {
    job_title: null,
    department_name: null,
    experience_level: null,
    department_name_other: null,
    employment_type: null,
    number_of_vacancies: null,
    work_setup: null,
    target_start_date: null,
    reason_for_posting: null,
    other_reason_for_posting: null,
    min_salary: null,
    max_salary: null,
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
    non_negotiable: { non_negotiable: [] },
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
