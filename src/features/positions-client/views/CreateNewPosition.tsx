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
    handleApplicationFormChange,
    isNonNegotiable,
    toggleNonNegotiable,
    setNonNegotiableValue,
    pipelineHandler,
    resetFormData,
  } = useFormData();

  return (
    <PositionClient
      formData={formData}
      setFormData={setFormData}
      pipelineHandler={pipelineHandler}
      handlePositionBaseChange={handlePositionBaseChange}
      handleJobPostingChange={handleJobPostingChange}
      handleApplicationFormChange={handleApplicationFormChange}
      isNonNegotiable={isNonNegotiable}
      toggleNonNegotiable={toggleNonNegotiable}
      setNonNegotiableValue={setNonNegotiableValue}
      resetFormData={resetFormData}
    />
  );
}
