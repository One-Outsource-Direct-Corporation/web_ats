import { useEffect } from "react";

import { useFormData } from "../hooks/useFormData";
import PositionClient from "./PositionClient";

export default function CreateNewPosition() {
  useEffect(() => {
    document.title = "Create New Position";
  }, []);

  const {
    formData,
    setFormData,
    handlePositionBaseChange,
    handleJobPostingChange,
    pipelineHandler,
    applicationFormHandler,
    nonNegotiableHandler,
    questionnaireHandler,
    resetFormData,
  } = useFormData();

  return (
    <PositionClient
      formData={formData}
      setFormData={setFormData}
      applicationFormHandler={applicationFormHandler}
      nonNegotiableHandler={nonNegotiableHandler}
      questionnaireHandler={questionnaireHandler}
      pipelineHandler={pipelineHandler}
      handlePositionBaseChange={handlePositionBaseChange}
      handleJobPostingChange={handleJobPostingChange}
      resetFormData={resetFormData}
    />
  );
}
