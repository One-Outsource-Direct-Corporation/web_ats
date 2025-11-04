import { useEffect } from "react";

import { useFormData } from "../hooks/useFormData";
import PositionClient from "./PositionClient";
export default function CreateNewPosition() {
  useEffect(() => {
    document.title = "Create New Position";
  }, []);

  const {
    formData,
    handlePositionBaseChange,
    handleJobPostingChange,
    handleApplicationFormChange,
    isNonNegotiable,
    toggleNonNegotiable,
    setNonNegotiableValue,
    handlePipelineChange,
    handleDeletePipelineChange,
    resetFormData,
  } = useFormData();

  return (
    <PositionClient
      formData={formData}
      handlePositionBaseChange={handlePositionBaseChange}
      handleJobPostingChange={handleJobPostingChange}
      handleApplicationFormChange={handleApplicationFormChange}
      handlePipelineChange={handlePipelineChange}
      handleDeletePipelineChange={handleDeletePipelineChange}
      isNonNegotiable={isNonNegotiable}
      toggleNonNegotiable={toggleNonNegotiable}
      setNonNegotiableValue={setNonNegotiableValue}
      resetFormData={resetFormData}
    />
  );
}
