import { useState } from "react";
import type {
  FormData,
  FormFieldStatuses,
} from "../types/createNewPositionTypes";

const initialFormData: FormData = {
  jobTitle: "",
  department: "",
  employmentType: "Full-Time",
  educationNeeded: "Bachelor's Degree",
  workSetup: "Hybrid",
  experience: "Entry Level",
  headcountsNeeded: "",
  dateNeeded: "",
  reasonForHire: "Others, Please Specify",
  reasonSpecify: "",
  budgetFrom: "",
  budgetTo: "",
};

const initialFormFieldStatuses: FormFieldStatuses = {
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
    { field: "Years of Experience", status: "required", nonNegotiable: true },
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
    {
      field: "Upload medical certificate for at least 6 months",
      status: "required",
      nonNegotiable: false,
    },
    {
      field: "Preferred interview schedule (3 dates eg February 20)",
      status: "required",
      nonNegotiable: false,
    },
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
};

export function useFormData() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formFieldStatuses, setFormFieldStatuses] = useState<FormFieldStatuses>(
    initialFormFieldStatuses
  );
  const [nonNegotiableValues, setNonNegotiableValues] = useState<{
    [key: string]: any;
  }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleNonNegotiableValueChange = (fieldKey: string, value: any) => {
    setNonNegotiableValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const getNonNegotiableFields = () => {
    const nonNegotiableFields: Array<{
      category: string;
      field: string;
      type:
        | "text"
        | "select"
        | "radio"
        | "checkbox"
        | "file"
        | "date"
        | "number";
      options?: string[];
    }> = [];

    // Check Personal Information
    formFieldStatuses.personal.forEach((item) => {
      if (item.nonNegotiable) {
        nonNegotiableFields.push({
          category: "Personal Information",
          field: item.field,
          type: "text",
        });
      }
    });

    // Check Job Details
    formFieldStatuses.job.forEach((item) => {
      if (item.nonNegotiable) {
        let fieldType:
          | "text"
          | "select"
          | "radio"
          | "checkbox"
          | "file"
          | "date"
          | "number" = "text";

        if (item.field === "Are you willing to work onsite?") {
          fieldType = "radio";
        } else if (item.field.toLowerCase().includes("upload")) {
          fieldType = "file";
        } else if (item.field === "Expected Salary") {
          fieldType = "number";
        } else if (item.field.toLowerCase().includes("date")) {
          fieldType = "date";
        }

        nonNegotiableFields.push({
          category: "Job Details",
          field: item.field,
          type: fieldType,
          options:
            item.field === "Are you willing to work onsite?"
              ? ["Yes", "No", "Flexible"]
              : undefined,
        });
      }
    });

    // Check Work and Education
    formFieldStatuses.education.forEach((item) => {
      if (item.nonNegotiable) {
        let fieldType:
          | "text"
          | "select"
          | "radio"
          | "checkbox"
          | "file"
          | "date"
          | "number" = "text";

        if (item.field === "Highest Educational Attained") {
          fieldType = "select";
        } else if (item.field === "Work Experience") {
          fieldType = "radio";
        }

        nonNegotiableFields.push({
          category: "Work and Education",
          field: item.field,
          type: fieldType,
          options:
            item.field === "Highest Educational Attained"
              ? [
                  "High School",
                  "Associate Degree",
                  "Bachelor's Degree",
                  "Master's Degree",
                  "Doctorate",
                ]
              : item.field === "Work Experience"
              ? ["Yes", "No"]
              : undefined,
        });
      }
    });

    return nonNegotiableFields;
  };

  return {
    formData,
    formFieldStatuses,
    nonNegotiableValues,
    handleInputChange,
    handleFormFieldStatusChange,
    handleFormFieldNonNegotiableChange,
    handleNonNegotiableValueChange,
    getNonNegotiableFields,
  };
}
