import { useState } from "react";

export const useFormFieldManagement = () => {
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

  return {
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
  };
};
