// Field configuration for application form management
export interface FieldConfig {
  displayName: string;
  formDataKey: keyof ApplicationFormFields;
  defaultStatus: "required" | "optional" | "disabled";
  nonNegotiable?: boolean;
}

// Type for application_form fields in formData
export interface ApplicationFormFields {
  name: string;
  birth_date: string;
  gender: string;
  primary_contact_number: string;
  secondary_contact_number: string;
  email: string;
  linkedin_profile: string;
  address: string;
  expect_salary: string;
  willing_to_work_onsite: string;
  photo_2x2: string;
  upload_med_cert: string;
  preferred_interview_schedule: string;
  education_attained: string;
  year_graduated: string;
  university: string;
  course: string;
  work_experience: string;
  how_did_you_hear_about_us: string;
  agreement: string;
  signature: string;
}

export const PERSONAL_FIELDS: FieldConfig[] = [
  { displayName: "Name", formDataKey: "name", defaultStatus: "required" },
  {
    displayName: "Birth Date",
    formDataKey: "birth_date",
    defaultStatus: "required",
  },
  { displayName: "Gender", formDataKey: "gender", defaultStatus: "required" },
  {
    displayName: "Primary Contact Number",
    formDataKey: "primary_contact_number",
    defaultStatus: "required",
  },
  {
    displayName: "Secondary Contact Number",
    formDataKey: "secondary_contact_number",
    defaultStatus: "required",
  },
  {
    displayName: "Email Address",
    formDataKey: "email",
    defaultStatus: "required",
  },
  {
    displayName: "LinkedIn Profile",
    formDataKey: "linkedin_profile",
    defaultStatus: "optional",
  },
  { displayName: "Address", formDataKey: "address", defaultStatus: "required" },
];

export const JOB_FIELDS: FieldConfig[] = [
  {
    displayName: "Expected Salary",
    formDataKey: "expect_salary",
    defaultStatus: "required",
    nonNegotiable: true,
  },
  {
    displayName: "Are you willing to work onsite?",
    formDataKey: "willing_to_work_onsite",
    defaultStatus: "required",
    nonNegotiable: true,
  },
  {
    displayName: "Upload 2×2 photo",
    formDataKey: "photo_2x2",
    defaultStatus: "required",
  },
  {
    displayName: "Upload medical certificate from the last 6 months",
    formDataKey: "upload_med_cert",
    defaultStatus: "required",
  },
  {
    displayName: "Preferred Interview Schedule",
    formDataKey: "preferred_interview_schedule",
    defaultStatus: "required",
  },
];

export const EDUCATION_FIELDS: FieldConfig[] = [
  {
    displayName: "Highest Educational Attained",
    formDataKey: "education_attained",
    defaultStatus: "required",
    nonNegotiable: true,
  },
  {
    displayName: "Year Graduated",
    formDataKey: "year_graduated",
    defaultStatus: "required",
  },
  {
    displayName: "University / Institution Name",
    formDataKey: "university",
    defaultStatus: "required",
  },
  {
    displayName: "Program / Course",
    formDataKey: "course",
    defaultStatus: "required",
  },
  {
    displayName: "Work Experience",
    formDataKey: "work_experience",
    defaultStatus: "required",
    nonNegotiable: true,
  },
];

export const ACKNOWLEDGEMENT_FIELDS: FieldConfig[] = [
  {
    displayName: "How did you learn about this job opportunity?",
    formDataKey: "how_did_you_hear_about_us",
    defaultStatus: "required",
  },
  {
    displayName: "Agreement",
    formDataKey: "agreement",
    defaultStatus: "required",
  },
  {
    displayName: "Signature",
    formDataKey: "signature",
    defaultStatus: "required",
  },
];

// Helper to get all field configs by category
export const FIELD_CONFIGS = {
  personal: PERSONAL_FIELDS,
  job: JOB_FIELDS,
  education: EDUCATION_FIELDS,
  acknowledgement: ACKNOWLEDGEMENT_FIELDS,
} as const;
