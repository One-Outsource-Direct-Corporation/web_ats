import { useState } from "react";
import type {
  PersonalFormData,
  JobDetailsFormData,
  EducationWorkFormData,
  AcknowledgementFormData,
  ApplicationFormData,
  WorkExperienceEntry,
} from "../types/applicationForm";

const initialPersonalData: PersonalFormData = {
  firstName: null,
  lastName: null,
  birthday: null,
  gender: null,
  primaryContact: null,
  secondaryContact: null,
  email: null,
  linkedinProfile: null,
  addressLine1: null,
  city: null,
  district: null,
  postalCode: null,
  country: null,
};

const initialJobDetailsData: JobDetailsFormData = {
  positionApplyingFor: null,
  expectedSalary: null,
  willingToWorkOnsite: null,
  photo: null,
  medicalCertificate: null,
  interviewSchedule: null,
};

const initialEducationWorkData: EducationWorkFormData = {
  highestEducation: null,
  yearGraduated: null,
  institution: null,
  program: null,
  hasWorkExperience: null,
  currentJobTitle: null,
  currentCompany: null,
  currentYearsExperience: null,
  workExperience: [],
};

const initialAcknowledgementData: AcknowledgementFormData = {
  howDidYouLearn: null,
  certificationAccepted: false,
  signature: null,
};

const data = {
  personalInfo: initialPersonalData,
  jobDetails: initialJobDetailsData,
  educationWork: initialEducationWorkData,
  acknowledgement: initialAcknowledgementData,
};

// TODO: Add localStorage data persistence

export const useApplicationForm = (jobTitle?: string) => {
  const [formData, setFormData] = useState<ApplicationFormData>(data);
  const [currentStage, setCurrentStage] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (jobTitle && !formData.jobDetails.positionApplyingFor) {
    setFormData((prev) => ({
      ...prev,
      jobDetails: {
        ...prev.jobDetails,
        positionApplyingFor: jobTitle,
      },
    }));
  }

  function handleInputPersonalInfo(
    field: keyof PersonalFormData,
    value: string | number | null
  ) {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  }

  function handleInputJobDetails(
    field: keyof JobDetailsFormData,
    value: string | File | number | null
  ) {
    setFormData((prev) => ({
      ...prev,
      jobDetails: {
        ...prev.jobDetails,
        [field]: value,
      },
    }));
  }

  function handleInputEducationWork(
    field: keyof EducationWorkFormData,
    value: string | number | null | WorkExperienceEntry[]
  ) {
    setFormData((prev) => ({
      ...prev,
      educationWork: {
        ...prev.educationWork,
        [field]: value,
      },
    }));
  }

  function handleInputAcknowledgement(
    field: keyof AcknowledgementFormData,
    value: string | boolean | null
  ) {
    setFormData((prev) => ({
      ...prev,
      acknowledgement: {
        ...prev.acknowledgement,
        [field]: value,
      },
    }));
  }

  const goToNextStage = () => {
    if (currentStage < 4) {
      setCurrentStage(currentStage + 1);
    }
  };

  const goToPreviousStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  return {
    formData,
    currentStage,
    acceptTerms,

    setAcceptTerms,

    handleInputPersonalInfo,
    handleInputJobDetails,
    handleInputEducationWork,
    handleInputAcknowledgement,

    goToNextStage,
    goToPreviousStage,
  };
};
