export interface PersonalFormData {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  primaryContact: string;
  secondaryContact: string;
  email: string;
  linkedinProfile: string;
  addressLine1: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
}

export interface JobDetailsFormData {
  positionApplyingFor: string;
  expectedSalary: string;
  willingToWorkOnsite: string;
  photo: File | null;
  medicalCertificate: File | null;
  interviewSchedule: string;
}

export interface WorkExperienceEntry {
  jobTitle: string;
  company: string;
  years: string;
}

export interface EducationWorkFormData {
  highestEducation: string;
  yearGraduated: string;
  institution: string;
  program: string;
  hasWorkExperience: string;
  currentJobTitle: string;
  currentCompany: string;
  currentYearsExperience: string;
  workExperience: WorkExperienceEntry[];
}

export interface AcknowledgementFormData {
  howDidYouLearn: string;
  certificationAccepted: boolean;
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
