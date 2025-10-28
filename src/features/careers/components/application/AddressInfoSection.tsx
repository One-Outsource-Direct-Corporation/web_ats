import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { PersonalFormData } from "../../types/application_form.types";

interface AddressInfoSectionProps {
  formData: PersonalFormData;
  onInputChange: (
    field: keyof PersonalFormData,
    value: string | number | null
  ) => void;
  errors?: { [key in keyof PersonalFormData]?: string };
}

export const AddressInfoSection: React.FC<AddressInfoSectionProps> = ({
  formData,
  onInputChange,
  errors = {},
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Address Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="addressLine1">Street Address</Label>
          <Input
            id="addressLine1"
            value={formData.addressLine1 ?? ""}
            onChange={(e) => onInputChange("addressLine1", e.target.value)}
            placeholder="123 Main Street, Barangay San Antonio"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city ?? ""}
            onChange={(e) => onInputChange("city", e.target.value)}
            placeholder="Makati City"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District/Province</Label>
          <Input
            id="district"
            value={formData.district ?? ""}
            onChange={(e) => onInputChange("district", e.target.value)}
            placeholder="Metro Manila"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={formData.postalCode ?? ""}
            onChange={(e) => onInputChange("postalCode", e.target.value)}
            placeholder="1203"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country ?? ""}
            onChange={(e) => onInputChange("country", Number(e.target.value))}
            placeholder="Philippines"
          />
        </div>
      </div>
    </div>
  );
};
