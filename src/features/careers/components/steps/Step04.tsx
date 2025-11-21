import type { AcknowledgementFormData } from "../../types/application_form.types";
import { AcknowledgementSection } from "../application/AcknowledgementSection";

interface Step04Props {
  formData: AcknowledgementFormData;
  onInputChange: (
    field: keyof AcknowledgementFormData,
    value: string | boolean | File | null
  ) => void;
  applicationForm: any;
}

export default function Step04({
  formData,
  onInputChange,
  applicationForm,
}: Step04Props) {
  return (
    <AcknowledgementSection
      formData={formData}
      onInputChange={onInputChange}
      applicationForm={applicationForm}
    />
  );
}
