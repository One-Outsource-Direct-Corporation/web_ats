import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { PersonalFormData } from "../../types/application_form.types";
import type { ApplicationFormBase } from "@/shared/types/application_form.types";

interface ContactInfoSectionProps {
  formData: PersonalFormData;
  onInputChange: (
    field: keyof PersonalFormData,
    value: string | number | null
  ) => void;
  applicationForm: ApplicationFormBase;
  errors?: { [key in keyof PersonalFormData]?: string };
}

export function ContactInfoSection({
  formData,
  onInputChange,
  applicationForm,
}: ContactInfoSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="primaryContact">Primary Contact Number</Label>
          <Input
            id="primaryContact"
            value={formData.primaryContact ?? ""}
            onChange={(e) => onInputChange("primaryContact", e.target.value)}
            placeholder="+63 912 345 6789"
            disabled={applicationForm.primary_contact_number === "disabled"}
            required={applicationForm.primary_contact_number === "required"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondaryContact">Secondary Contact Number</Label>
          <Input
            id="secondaryContact"
            value={formData.secondaryContact ?? ""}
            onChange={(e) => onInputChange("secondaryContact", e.target.value)}
            placeholder="+63 987 654 3210"
            disabled={applicationForm.secondary_contact_number === "disabled"}
            required={applicationForm.secondary_contact_number === "required"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email ?? ""}
            onChange={(e) => onInputChange("email", e.target.value)}
            placeholder="your.email@example.com"
            disabled={applicationForm.email === "disabled"}
            required={applicationForm.email === "required"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinProfile">LinkedIn Profile (Optional)</Label>
          <Input
            id="linkedinProfile"
            value={formData.linkedinProfile ?? ""}
            onChange={(e) => onInputChange("linkedinProfile", e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            disabled={applicationForm.linkedin_profile === "disabled"}
            required={applicationForm.linkedin_profile === "required"}
          />
        </div>
      </div>
    </div>
  );
}
