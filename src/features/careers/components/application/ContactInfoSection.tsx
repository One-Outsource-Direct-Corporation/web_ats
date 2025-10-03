import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { PersonalFormData } from "../../types/applicationForm";
import type { ApplicationForm } from "../../types/job";

interface ContactInfoSectionProps {
  formData: PersonalFormData;
  onInputChange: (field: keyof PersonalFormData, value: string) => void;
  applicationForm: ApplicationForm;
  errors?: Record<string, string>;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  formData,
  onInputChange,
  applicationForm,
  errors = {},
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Contact */}
        {applicationForm?.primary_contact_number !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="primaryContact">Primary Contact Number</Label>
            <Input
              id="primaryContact"
              value={formData.primaryContact}
              onChange={(e) => onInputChange("primaryContact", e.target.value)}
              placeholder="+63 912 345 6789"
              required={applicationForm?.primary_contact_number === "required"}
            />
            {errors.primaryContact && (
              <p className="text-sm text-red-600">{errors.primaryContact}</p>
            )}
          </div>
        )}

        {/* Secondary Contact */}
        {applicationForm?.secondary_contact_number !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="secondaryContact">Secondary Contact Number</Label>
            <Input
              id="secondaryContact"
              value={formData.secondaryContact}
              onChange={(e) =>
                onInputChange("secondaryContact", e.target.value)
              }
              placeholder="+63 987 654 3210"
              required={
                applicationForm?.secondary_contact_number === "required"
              }
            />
          </div>
        )}

        {/* Email */}
        {applicationForm?.email !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="your.email@example.com"
              required={applicationForm?.email === "required"}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        )}

        {/* LinkedIn */}
        {applicationForm?.linkedin_profile !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="linkedinProfile">LinkedIn Profile (Optional)</Label>
            <Input
              id="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={(e) => onInputChange("linkedinProfile", e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              required={applicationForm?.linkedin_profile === "required"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
