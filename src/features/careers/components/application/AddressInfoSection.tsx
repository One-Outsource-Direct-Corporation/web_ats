import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { PersonalFormData } from "../../types/applicationForm";

interface AddressInfoSectionProps {
  formData: PersonalFormData;
  onInputChange: (field: keyof PersonalFormData, value: string) => void;
}

export const AddressInfoSection: React.FC<AddressInfoSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Address Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Line 1 */}
        <div className="md:col-span-2">
          <Label htmlFor="addressLine1">Street Address</Label>
          <Input
            id="addressLine1"
            value={formData.addressLine1}
            onChange={(e) => onInputChange("addressLine1", e.target.value)}
            placeholder="123 Main Street, Barangay San Antonio"
          />
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onInputChange("city", e.target.value)}
            placeholder="Makati City"
          />
        </div>

        {/* District/Province */}
        <div>
          <Label htmlFor="district">District/Province</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => onInputChange("district", e.target.value)}
            placeholder="Metro Manila"
          />
        </div>

        {/* Postal Code */}
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => onInputChange("postalCode", e.target.value)}
            placeholder="1203"
          />
        </div>

        {/* Country */}
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => onInputChange("country", e.target.value)}
            placeholder="Philippines"
          />
        </div>
      </div>
    </div>
  );
};
