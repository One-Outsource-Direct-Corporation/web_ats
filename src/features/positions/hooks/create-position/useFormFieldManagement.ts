import { useState } from "react";
import type { FormFieldStatuses } from "../../types/createPosition";

export const useFormFieldManagement = () => {
  const [formFieldStatuses, setFormFieldStatuses] = useState<FormFieldStatuses>(
    {
      personal: [
        { field: "Name", status: "required", nonNegotiable: false },
        { field: "Birth Date", status: "required", nonNegotiable: false },
        { field: "Gender", status: "required", nonNegotiable: false },
        {
          field: "Primary Contact Number",
          status: "required",
          nonNegotiable: false,
        },
        {
          field: "Secondary Contact Number",
          status: "required",
          nonNegotiable: false,
        },
        { field: "Email Address", status: "required", nonNegotiable: false },
        { field: "LinkedIn Profile", status: "optional", nonNegotiable: false },
        { field: "Address", status: "required", nonNegotiable: false },
      ],
      job: [
        { field: "Job Title", status: "required", nonNegotiable: false },
        { field: "Company Name", status: "required", nonNegotiable: false },
        {
          field: "Years of Experience",
          status: "required",
          nonNegotiable: true,
        },
        {
          field: "Position Applying for",
          status: "required",
          nonNegotiable: false,
        },
        { field: "Expected Salary", status: "required", nonNegotiable: true },
        {
          field: "Are you willing to work onsite?",
          status: "required",
          nonNegotiable: true,
        },
        { field: "Upload 2×2 photo", status: "required", nonNegotiable: false },
      ],
      education: [
        {
          field: "Highest Educational Attained",
          status: "required",
          nonNegotiable: true,
        },
        { field: "Year Graduated", status: "required", nonNegotiable: false },
        {
          field: "University / Institution Name",
          status: "required",
          nonNegotiable: false,
        },
        { field: "Program / Course", status: "required", nonNegotiable: false },
        { field: "Work Experience", status: "required", nonNegotiable: true },
        { field: "Job Title", status: "required", nonNegotiable: false },
      ],
      acknowledgement: [
        {
          field: "How did you learn about this job opportunity?",
          status: "required",
          nonNegotiable: false,
        },
        { field: "Agreement", status: "required", nonNegotiable: false },
        { field: "Signature", status: "required", nonNegotiable: false },
      ],
    }
  );

  // Questionnaire Management
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [includeInCandidateExperience, setIncludeInCandidateExperience] =
    useState(true);
  const [savedQuestionnaires, setSavedQuestionnaires] = useState<any[]>([]);
  const [showTemplateOptions, setShowTemplateOptions] = useState(false);

  // Non-negotiable Values
  const [nonNegotiableValues, setNonNegotiableValues] = useState<{
    [key: string]: any;
  }>({});

  const handleFormFieldStatusChange = (
    category: "personal" | "job" | "education" | "acknowledgement",
    index: number,
    status: "required" | "optional" | "disabled"
  ) => {
    setFormFieldStatuses((prevStatuses) => ({
      ...prevStatuses,
      [category]: prevStatuses[category].map((item, idx) =>
        idx === index ? { ...item, status: status } : item
      ),
    }));
  };

  const handleFormFieldNonNegotiableChange = (
    category: "personal" | "job" | "education" | "acknowledgement",
    index: number,
    nonNegotiable: boolean
  ) => {
    setFormFieldStatuses((prevStatuses) => ({
      ...prevStatuses,
      [category]: prevStatuses[category].map((item, idx) =>
        idx === index ? { ...item, nonNegotiable: nonNegotiable } : item
      ),
    }));
  };

  return {
    formFieldStatuses,
    setFormFieldStatuses,
    selectedTemplate,
    setSelectedTemplate,
    includeInCandidateExperience,
    setIncludeInCandidateExperience,
    savedQuestionnaires,
    setSavedQuestionnaires,
    showTemplateOptions,
    setShowTemplateOptions,
    nonNegotiableValues,
    setNonNegotiableValues,
    handleFormFieldStatusChange,
    handleFormFieldNonNegotiableChange,
  };
};
