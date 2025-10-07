import { useState, useCallback } from "react";
import type { CreatePositionFormData } from "../../types/createPosition";

export const useFormData = () => {
  const [formData, setFormData] = useState<CreatePositionFormData>({
    client: null,
    job_title: "",
    department: "",
    employment_type: "full_time",
    education_level: "bachelors_degree",
    work_setup: "hybrid",
    experience_level: "entry_level",
    headcount: "",
    date_needed: null,
    reason_for_hiring: "",
    other_reason_for_hiring: "",
    min_budget: "",
    max_budget: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    application_form: {
      name: "optional",
      birth_date: "optional",
      gender: "optional",
      primary_contact_number: "optional",
      secondary_contact_number: "optional",
      email: "optional",
      linkedin_profile: "optional",
      address: "optional",
      expect_salary: "optional",
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
    pipeline: [],
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleApplicationFormChange = useCallback(
    (fieldName: string, status: string) => {
      setFormData((prev) => ({
        ...prev,
        application_form: {
          ...prev.application_form, // Preserve all existing fields
          [fieldName]: status, // Update only the specific field
        },
      }));
    },
    []
  );

  const handlePipelineChange = useCallback(
    (pipeline_identifier: number, field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        pipeline: prev.pipeline.map((step) =>
          step.pipeline_identifier === pipeline_identifier
            ? { ...step, [field]: value }
            : step
        ),
      }));
    },
    []
  );

  const resetFormData = () => {
    setFormData({
      client: null,
      job_title: "",
      department: "",
      employment_type: "full_time",
      education_level: "bachelors_degree",
      work_setup: "hybrid",
      experience_level: "entry_level",
      headcount: "",
      date_needed: null,
      reason_for_hiring: "",
      other_reason_for_hiring: "",
      min_budget: "",
      max_budget: "",
      description: "",
      responsibilities: "",
      qualifications: "",
      application_form: {
        name: "optional",
        birth_date: "optional",
        gender: "optional",
        primary_contact_number: "optional",
        secondary_contact_number: "optional",
        email: "optional",
        linkedin_profile: "optional",
        address: "optional",
        expect_salary: "optional",
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
      pipeline: [],
    });
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleApplicationFormChange,
    handlePipelineChange,
    resetFormData,
  };
};
