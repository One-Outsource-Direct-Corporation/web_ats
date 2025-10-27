export interface PersonalFormData {
  firstName: string | null;
  lastName: string | null;
  birthday: string | null;
  gender: string | null;
  primaryContact: string | null;
  secondaryContact: string | null;
  email: string | null;
  linkedinProfile: string | null;
  addressLine1: string | null;
  city: string | null;
  district: string | null;
  postalCode: number | null;
  country: string | null;
}

export interface JobDetailsFormData {
  positionApplyingFor: string | null;
  expectedSalary: number | null;
  willingToWorkOnsite: string | null;
  photo: File | null;
  medicalCertificate: File | null;
  interviewSchedule: string | null;
}

export interface WorkExperienceEntry {
  jobTitle: string | null;
  company: string | null;
  years: number | null;
}

export interface EducationWorkFormData {
  highestEducation: string | null;
  yearGraduated: string | null;
  institution: string | null;
  program: string | null;
  hasWorkExperience: string | null;
  currentJobTitle: string | null;
  currentCompany: string | null;
  currentYearsExperience: string | null;
  workExperience: WorkExperienceEntry[] | null;
}

export interface AcknowledgementFormData {
  howDidYouLearn: string | null;
  certificationAccepted: boolean | null;
  signature: string | File | null;
}

export interface ApplicationFormState {
  formData: PersonalFormData;
  stage2Data: JobDetailsFormData;
  stage3Data: EducationWorkFormData;
  stage4Data: AcknowledgementFormData;
  currentStage: number;
  acceptTerms: boolean;
}
