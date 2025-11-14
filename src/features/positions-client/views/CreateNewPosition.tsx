import { useEffect } from "react";

import { usePositionFormData } from "../hooks/usePositionFormData";
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
  } = usePositionFormData();

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
