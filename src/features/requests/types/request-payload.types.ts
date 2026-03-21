export interface NamedLookupItemPayload {
  id?: number;
  name: string;
}

export interface JobPostingUpdatePayload {
  job_title: string;
  target_start_date: string;
  reason_for_posting: string;
  other_reason_for_posting: string;
  department_name: string;
  employment_type: string;
  work_setup: string;
  working_site: string;
  number_of_vacancies: number;
  min_salary: number;
  max_salary: number;
  description: string;
  responsibilities: string;
  qualifications: string;
}

export interface UpdatePrfPayload {
  job_posting: JobPostingUpdatePayload;
  non_negotiables: string;
  business_unit: string;
  immediate_supervisor: number;
  hiring_managers: number[];
  interview_levels: number;
  category: string;
  position: string;
  work_schedule_from: string;
  work_schedule_to: string;
  salary_budget: number;
  is_salary_range: boolean;
  assessment_required: boolean;
  other_assessment: string[];
  assessment_types: NamedLookupItemPayload[];
  hardware_requirements: NamedLookupItemPayload[];
  software_requirements: NamedLookupItemPayload[];
}

export interface UpdatePositionPayload {
  client: number;
  education_level: string;
  experience_level: string;
  job_posting: JobPostingUpdatePayload;
  application_form: unknown;
  pipeline: unknown[];
}

export interface NamedLookupFormItem {
  id: number;
  name: string;
}

export interface PrfEditFormState {
  id: number;
  job_title: string;
  target_start_date: string;
  reason_for_posting: string;
  other_reason_for_posting: string;
  department_name: string;
  employment_type: string;
  work_setup: string;
  working_site: string;
  number_of_vacancies: number;
  min_salary: number;
  max_salary: number;
  description: string;
  responsibilities: string;
  qualifications: string;
  non_negotiables: string;
  business_unit: string;
  immediate_supervisor: number;
  hiring_managers: number[];
  category: string;
  position: string;
  work_schedule_from: string;
  work_schedule_to: string;
  salary_budget: number;
  is_salary_range: boolean;
  assessment_required: boolean;
  other_assessment: string[] | string;
  assessment_types: NamedLookupFormItem[];
  hardware_requirements: NamedLookupFormItem[];
  software_requirements: NamedLookupFormItem[];
}

export interface PositionEditFormState {
  id: number;
  client: number;
  education_level: string;
  experience_level: string;
  job_title: string;
  target_start_date: string;
  reason_for_posting: string;
  other_reason_for_posting: string;
  department_name: string;
  employment_type: string;
  work_setup: string;
  working_site: string;
  number_of_vacancies: number;
  min_salary: number;
  max_salary: number;
  description: string;
  responsibilities: string;
  qualifications: string;
  application_form: Record<string, unknown>;
  pipeline: unknown[];
}
