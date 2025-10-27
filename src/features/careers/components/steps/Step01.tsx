import { useState } from "react";
import { AddressInfoSection } from "../application/AddressInfoSection";
import { ContactInfoSection } from "../application/ContactInfoSection";
import { DataPrivacySection } from "../application/DataPrivacySection";
import { PersonalInfoSection } from "../application/PersonalInfoSection";
import type { PersonalFormData } from "../../types/applicationForm";

export default function Step01() {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState<PersonalFormData>({
    firstName: null,
    lastName: null,
    birthday: null,
    gender: null,
    primaryContact: null,
    secondaryContact: null,
    email: null,
    linkedinProfile: null,
    addressLine1: null,
    city: null,
    district: null,
    postalCode: null,
    country: null,
  });

  function handleFormInputChange(
    field: keyof PersonalFormData,
    value: string | number | null
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleStepTerms(accepted: boolean) {
    setAcceptTerms(accepted);
  }

  return (
    <div className="space-y-6">
      <DataPrivacySection
        acceptTerms={acceptTerms}
        onAcceptTermsChange={handleStepTerms}
      />
      <PersonalInfoSection
        formData={formData}
        onInputChange={handleFormInputChange}
      />
      <ContactInfoSection
        formData={formData}
        onInputChange={handleFormInputChange}
      />
      <AddressInfoSection
        formData={formData}
        onInputChange={handleFormInputChange}
      />
    </div>
  );
}
