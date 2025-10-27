import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { PersonalFormData } from "../../types/applicationForm";
import { Field, FieldLabel, FieldSet } from "@/shared/components/ui/field";
// import type { ApplicationForm } from "../../types/job";

interface PersonalInfoSectionProps {
  formData: PersonalFormData;
  onInputChange: (
    field: keyof PersonalFormData,
    value: string | number | null
  ) => void;
  // applicationForm: ApplicationForm; // TODO: Uncomment this after the logic is implemented
  errors?: { [key in keyof PersonalFormData]?: string };
}

export const PersonalInfoSection = ({
  formData,
  onInputChange,
  errors = {},
}: PersonalInfoSectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Personal Information
      </h2>

      <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input
            id="firstName"
            value={formData.firstName ?? ""}
            onChange={(e) => onInputChange("firstName", e.target.value)}
            placeholder="Enter your first name"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input
            id="lastName"
            value={formData.lastName ?? ""}
            onChange={(e) => onInputChange("lastName", e.target.value)}
            placeholder="Enter your last name"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="birthday">Birthday</FieldLabel>
          <Input
            id="birthday"
            type="date"
            value={formData.birthday ?? ""}
            onChange={(e) => onInputChange("birthday", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="gender">Gender</FieldLabel>
          <Select
            value={formData.gender ?? ""}
            onValueChange={(value) => onInputChange("gender", value)}
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
        </Field>
      </FieldSet>
    </div>
  );
};
