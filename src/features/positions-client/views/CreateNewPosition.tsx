import { useEffect } from "react";

import { useFormData } from "../hooks/useFormData";
import PositionClient from "./PositionClient";

export default function CreateNewPosition() {
  useEffect(() => {
    document.title = "Create New Position";
  }, []);

  const {
    formData,
    handleInputChange,
    handleApplicationFormChange,
    handleNonNegotiableChange,
    handleNonNegotiableValueChange,
    handlePipelineChange,
    handleDeletePipelineChange,
    resetFormData,
  } = useFormData();

  return (
    <PositionClient
      formData={formData}
      handleInputChange={handleInputChange}
      handleApplicationFormChange={handleApplicationFormChange}
      handleNonNegotiableChange={handleNonNegotiableChange}
      handleNonNegotiableValueChange={handleNonNegotiableValueChange}
      handlePipelineChange={handlePipelineChange}
      handleDeletePipelineChange={handleDeletePipelineChange}
      resetFormData={resetFormData}
    />
  );
}
