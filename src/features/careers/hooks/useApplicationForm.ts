import { useState, useEffect, useRef } from "react";
import type {
  PersonalFormData,
  JobDetailsFormData,
  EducationWorkFormData,
  AcknowledgementFormData,
  ApplicationFormState,
} from "../types/applicationForm";

const initialPersonalData: PersonalFormData = {
  firstName: "",
  lastName: "",
  birthday: "",
  gender: "",
  primaryContact: "",
  secondaryContact: "",
  email: "",
  linkedinProfile: "",
  addressLine1: "",
  city: "",
  district: "",
  postalCode: "",
  country: "",
};

const initialJobDetailsData: JobDetailsFormData = {
  positionApplyingFor: "",
  expectedSalary: "",
  willingToWorkOnsite: "",
  photo: null,
  medicalCertificate: null,
  interviewSchedule: "",
};

const initialEducationWorkData: EducationWorkFormData = {
  highestEducation: "",
  yearGraduated: "",
  institution: "",
  program: "",
  hasWorkExperience: "",
  currentJobTitle: "",
  currentCompany: "",
  currentYearsExperience: "",
  workExperience: [],
};

const initialAcknowledgementData: AcknowledgementFormData = {
  howDidYouLearn: "",
  certificationAccepted: false,
  signature: null,
};

export const useApplicationForm = (jobTitle?: string) => {
  const [formData, setFormData] =
    useState<PersonalFormData>(initialPersonalData);
  const [stage2Data, setStage2Data] = useState<JobDetailsFormData>(
    initialJobDetailsData
  );
  const [stage3Data, setStage3Data] = useState<EducationWorkFormData>(
    initialEducationWorkData
  );
  const [stage4Data, setStage4Data] = useState<AcknowledgementFormData>(
    initialAcknowledgementData
  );
  const [currentStage, setCurrentStage] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Ref to hold the latest form data for saving
  const formStateRef = useRef<ApplicationFormState>({
    formData,
    stage2Data,
    stage3Data,
    stage4Data,
    currentStage,
    acceptTerms,
  });

  // Update the ref whenever any state changes
  useEffect(() => {
    formStateRef.current = {
      formData,
      stage2Data,
      stage3Data,
      stage4Data,
      currentStage,
      acceptTerms,
    };
  }, [formData, stage2Data, stage3Data, stage4Data, currentStage, acceptTerms]);

  // Load persisted form data from localStorage on mount
  useEffect(() => {
    try {
      const persistedData = localStorage.getItem("applicationFormData");
      if (persistedData) {
        const parsedData = JSON.parse(persistedData) as ApplicationFormState;
        setFormData(parsedData.formData || initialPersonalData);
        setStage2Data(parsedData.stage2Data || initialJobDetailsData);
        setStage3Data(parsedData.stage3Data || initialEducationWorkData);
        setStage4Data(parsedData.stage4Data || initialAcknowledgementData);
        setCurrentStage(parsedData.currentStage || 1);
        setAcceptTerms(parsedData.acceptTerms || false);

        // Clear after loading to prevent stale data
        localStorage.removeItem("applicationFormData");
      }
    } catch (error) {
      console.error("Failed to load application form data:", error);
      localStorage.removeItem("applicationFormData");
    }
  }, []);

  // Auto-fill position applying for when job title is provided
  useEffect(() => {
    if (jobTitle && !stage2Data.positionApplyingFor) {
      setStage2Data((prev) => ({
        ...prev,
        positionApplyingFor: jobTitle,
      }));
    }
  }, [jobTitle, stage2Data.positionApplyingFor]);

  const handlePersonalInfoChange = (
    field: keyof PersonalFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleJobDetailsChange = (
    field: string,
    value: string | File | null
  ) => {
    setStage2Data((prev) => ({ ...prev, [field]: value }));
  };

  const handleEducationWorkChange = (field: string, value: string) => {
    setStage3Data((prev) => ({ ...prev, [field]: value }));
  };

  const handleAcknowledgementChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setStage4Data((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddWorkExperience = () => {
    if (
      stage3Data.currentJobTitle &&
      stage3Data.currentCompany &&
      stage3Data.currentYearsExperience
    ) {
      setStage3Data((prev) => ({
        ...prev,
        workExperience: [
          ...prev.workExperience,
          {
            jobTitle: prev.currentJobTitle,
            company: prev.currentCompany,
            years: prev.currentYearsExperience,
          },
        ],
        currentJobTitle: "",
        currentCompany: "",
        currentYearsExperience: "",
      }));
    }
  };

  const handleRemoveWorkExperience = (index: number) => {
    setStage3Data((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const handleDocumentsUploaded = (resumeData: any) => {
    if (resumeData) {
      setFormData({
        firstName: resumeData.firstName || "",
        lastName: resumeData.lastName || "",
        birthday: resumeData.birthday || "",
        gender: resumeData.gender || "",
        primaryContact: resumeData.primaryContact || "",
        secondaryContact: resumeData.secondaryContact || "",
        email: resumeData.email || "",
        linkedinProfile: resumeData.linkedinProfile || "",
        addressLine1: resumeData.addressLine1 || "",
        city: resumeData.city || "",
        district: resumeData.district || "",
        postalCode: resumeData.postalCode || "",
        country: resumeData.country || "",
      });

      if (resumeData.workExperience) {
        setStage3Data((prev) => ({
          ...prev,
          workExperience: resumeData.workExperience,
        }));
      }
    }
  };

  const saveFormState = () => {
    try {
      localStorage.setItem(
        "applicationFormData",
        JSON.stringify(formStateRef.current)
      );
    } catch (error) {
      console.error("Failed to save application form data:", error);
    }
  };

  const clearFormState = () => {
    localStorage.removeItem("applicationFormData");
  };

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
    // State
    formData,
    stage2Data,
    stage3Data,
    stage4Data,
    currentStage,
    acceptTerms,

    // Setters
    setAcceptTerms,

    // Handlers
    handlePersonalInfoChange,
    handleJobDetailsChange,
    handleEducationWorkChange,
    handleAcknowledgementChange,
    handleAddWorkExperience,
    handleRemoveWorkExperience,
    handleDocumentsUploaded,

    // Navigation
    goToNextStage,
    goToPreviousStage,

    // Persistence
    saveFormState,
    clearFormState,
  };
};
