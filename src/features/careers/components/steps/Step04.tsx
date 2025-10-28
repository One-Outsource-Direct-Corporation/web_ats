import type { AcknowledgementFormData } from "../../types/applicationForm";
import { AcknowledgementSection } from "../application/AcknowledgementSection";

interface Step04Props {
  formData: AcknowledgementFormData;
  onInputChange: (
    field: keyof AcknowledgementFormData,
    value: string | boolean | File | null
  ) => void;
}

export default function Step04({ formData, onInputChange }: Step04Props) {
  return (
    <AcknowledgementSection formData={formData} onInputChange={onInputChange} />
  );
}
