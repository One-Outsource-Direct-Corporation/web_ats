import { useState, useCallback } from "react";
import type {
  CreatePositionFormData,
  PipelineStep,
} from "../../types/createPosition";

export const useFormData = () => {
  const [formData, setFormData] = useState<CreatePositionFormData>({
    client: null,
    job_title: "",
    department: "",
    other_department: "",
    employment_type: "",
    education_level: "",
    work_setup: "",
    experience_level: "",
    headcount: 0,
    target_start_date: null,
    reason_for_posting: "",
    other_reason_for_posting: "",
    min_budget: 0,
    max_budget: 0,
    description: "",
    responsibilities: "",
    qualifications: "",
    working_site: "",
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

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleApplicationFormChange = useCallback(
    (fieldName: string, status: string) => {
      setFormData((prev) => ({
        ...prev,
        application_form: {
          ...prev.application_form,
          [fieldName]: status,
        },
      }));
    },
    []
  );

  const handlePipelineChange = useCallback(
    (pipeline_identifier: number, data: PipelineStep) => {
      setFormData((prev) => {
        const existingStep = prev.pipeline.filter(
          (step) => step.pipeline_identifier === pipeline_identifier
        );

        if (existingStep.length > 0) {
          // Update existing step
          return {
            ...prev,
            pipeline: prev.pipeline.map((step) => {
              if (
                step.pipeline_identifier === existingStep[0].pipeline_identifier
              ) {
                return { ...data };
              }
              return step;
            }),
          };
        } else {
          return {
            ...prev,
            pipeline: [...prev.pipeline, data],
          };
        }
      });
    },
    []
  );

  const handleDeletePipelineChange = useCallback(
    (pipeline_identifier: number) => {
      setFormData((prev) => ({
        ...prev,
        pipeline: prev.pipeline.filter(
          (step) => step.pipeline_identifier !== pipeline_identifier
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
      other_department: "",
      employment_type: "full_time",
      education_level: "bachelors_degree",
      work_setup: "hybrid",
      experience_level: "entry_level",
      headcount: 0,
      target_start_date: null,
      reason_for_posting: "",
      other_reason_for_posting: "",
      min_budget: 0,
      max_budget: 0,
      description: "",
      responsibilities: "",
      qualifications: "",
      working_site: "",
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
    handleDeletePipelineChange,
    resetFormData,
  };
};
