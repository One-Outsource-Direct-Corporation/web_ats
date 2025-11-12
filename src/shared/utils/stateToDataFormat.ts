import type { PositionFormData } from "@/features/positions-client/types/create_position.types";
import type { PRFFormData } from "@/features/prf/types/prf.types";

export function stateToDataFormatClient(formData: PositionFormData) {
  // TODO: change the data structure from changes made
  return {
    client: formData.client,
    education_level: formData.education_level,
    job_posting: {
      job_title: formData.job_posting.job_title,
      department_name: formData.job_posting.department_name,
      department_name_other: formData.job_posting.department_name_other,
      experience_level: formData.job_posting.experience_level,
      employment_type: formData.job_posting.employment_type,
      number_of_vacancies: formData.job_posting.number_of_vacancies,
      work_setup: formData.job_posting.work_setup,
      target_start_date: formData.job_posting.target_start_date,
      reason_for_posting: formData.job_posting.reason_for_posting,
      other_reason_for_posting: formData.job_posting.other_reason_for_posting,
      min_salary: formData.job_posting.min_salary,
      max_salary: formData.job_posting.max_salary,
      description: formData.job_posting.description,
      responsibilities: formData.job_posting.responsibilities,
      qualifications: formData.job_posting.qualifications,
      working_site: formData.job_posting.working_site,
    },
    application_form: {
      application_form: formData.application_form.application_form,
      non_negotiable: formData.application_form.non_negotiable,
      questionnaire: {
        name: formData.application_form.questionnaire.name,
        template: formData.application_form.questionnaire.template,
        sections: formData.application_form.questionnaire.sections,
      },
    },
    pipeline: formData.pipeline.map((step) => ({
      ...step,
      hiring_managers: step.hiring_managers.map((manager) => manager.id),
    })),
    locations: formData.locations,
    batches: formData.batches,
  };
}

export function stateToDataFormatPRF(formData: PRFFormData) {
  return {};
}
