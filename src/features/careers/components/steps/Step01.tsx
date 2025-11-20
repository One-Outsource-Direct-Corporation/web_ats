import { AddressInfoSection } from "../application/AddressInfoSection";
import { ContactInfoSection } from "../application/ContactInfoSection";
import { DataPrivacySection } from "../application/DataPrivacySection";
import { PersonalInfoSection } from "../application/PersonalInfoSection";
import type { PersonalFormData } from "../../types/application_form.types";
import type { ApplicationFormBase } from "@/shared/types/application_form.types";

interface Step01Props {
  formData: PersonalFormData;
  applicationForm: ApplicationFormBase;
  onInputChange: (
    field: keyof PersonalFormData,
    value: string | number | null
  ) => void;
  acceptTerms: boolean;
  onAcceptTermsChange: (accepted: boolean) => void;
}

export default function Step01({
  formData,
  applicationForm,
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
      <PersonalInfoSection
        formData={formData}
        onInputChange={onInputChange}
        applicationForm={applicationForm}
      />
      <ContactInfoSection
        formData={formData}
        onInputChange={onInputChange}
        applicationForm={applicationForm}
      />
      <AddressInfoSection
        formData={formData}
        onInputChange={onInputChange}
        applicationForm={applicationForm}
      />
    </div>
  );
}
