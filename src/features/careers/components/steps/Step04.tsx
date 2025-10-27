import { useState } from "react";
import type { AcknowledgementFormData } from "../../types/applicationForm";
import { AcknowledgementSection } from "../application/AcknowledgementSection";

export default function Step04() {
  const [formData, setFormData] = useState<AcknowledgementFormData>({
    signature: null,
    howDidYouLearn: null,
    certificationAccepted: null,
  });

  function handleAcknowledgementChange(
    field: keyof AcknowledgementFormData,
    value: string | boolean | File | null
  ) {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }

  return (
    <AcknowledgementSection
      formData={formData}
      onInputChange={handleAcknowledgementChange}
    />
  );
}
