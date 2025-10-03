import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { PersonalFormData } from "../../types/applicationForm";
import type { ApplicationForm } from "../../types/job";

interface PersonalInfoSectionProps {
  formData: PersonalFormData;
  onInputChange: (field: keyof PersonalFormData, value: string) => void;
  applicationForm: ApplicationForm;
  errors?: Record<string, string>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  onInputChange,
  applicationForm,
  errors = {},
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        {applicationForm?.name !== "disabled" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => onInputChange("firstName", e.target.value)}
                placeholder="Enter your first name"
                required={applicationForm?.name === "required"}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => onInputChange("lastName", e.target.value)}
                placeholder="Enter your last name"
                required={applicationForm?.name === "required"}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </>
        )}

        {/* Birthday */}
        {applicationForm?.birth_date !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => onInputChange("birthday", e.target.value)}
              required={applicationForm?.birth_date === "required"}
            />
            {errors.birthday && (
              <p className="text-sm text-red-600">{errors.birthday}</p>
            )}
          </div>
        )}

        {/* Gender */}
        {applicationForm?.gender !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => onInputChange("gender", value)}
              required={applicationForm?.gender === "required"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-600">{errors.gender}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
