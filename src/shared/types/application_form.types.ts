export type ApplicationFormType = "required" | "optional" | "disabled";

export interface ApplicationForm {
  name: ApplicationFormType;
  birth_date: ApplicationFormType;
  gender: ApplicationFormType;
  primary_contact_number: ApplicationFormType;
  secondary_contact_number: ApplicationFormType;
  email: ApplicationFormType;
  linkedin_profile: ApplicationFormType;
  address: ApplicationFormType;
  expected_salary: ApplicationFormType;
  willing_to_work_onsite: ApplicationFormType;
  photo_2x2: ApplicationFormType;
  upload_med_cert: ApplicationFormType;
  preferred_interview_schedule: ApplicationFormType;
  education_attained: ApplicationFormType;
  year_graduated: ApplicationFormType;
  university: ApplicationFormType;
  course: ApplicationFormType;
  work_experience: ApplicationFormType;
  how_did_you_hear_about_us: ApplicationFormType;
  agreement: ApplicationFormType;
  signature: ApplicationFormType;
}

// Simplified: Single interface for non-negotiable requirements
export interface NonNegotiable {
  field: string; // Field name (e.g., "expected_salary")
  value: string | number | boolean; // Required value
}

export type ApplicationFormData = {
  application_form: ApplicationForm;
  non_negotiables: NonNegotiable[]; // Simple array of field requirements
};
