import { AddressInfoSection } from "../application/AddressInfoSection";
import { ContactInfoSection } from "../application/ContactInfoSection";
import { DataPrivacySection } from "../application/DataPrivacySection";
import { PersonalInfoSection } from "../application/PersonalInfoSection";
import type { PersonalFormData } from "../../types/application_form.types";

interface Step01Props {
  formData: PersonalFormData;
  onInputChange: (
    field: keyof PersonalFormData,
    value: string | number | null
  ) => void;
  acceptTerms: boolean;
  onAcceptTermsChange: (accepted: boolean) => void;
}

export default function Step01({
  formData,
  onInputChange,
  acceptTerms,
  onAcceptTermsChange,
}: Step01Props) {
  return (
    <div className="space-y-6">
      <DataPrivacySection
        acceptTerms={acceptTerms}
        onAcceptTermsChange={onAcceptTermsChange}
      />
      <PersonalInfoSection formData={formData} onInputChange={onInputChange} />
      <ContactInfoSection formData={formData} onInputChange={onInputChange} />
      <AddressInfoSection formData={formData} onInputChange={onInputChange} />
    </div>
  );
}
