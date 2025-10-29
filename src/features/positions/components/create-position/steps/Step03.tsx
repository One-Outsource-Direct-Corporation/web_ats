import { Card } from "@/shared/components/ui/card";
import { ApplicationFormManagement } from "../../../../../shared/components/reusables/ApplicationFormManagement";
import type { CreatePositionFormData } from "@/features/positions/types/create_position.types";

interface Step03Props {
  formData: CreatePositionFormData;
  handleApplicationFormChange: (fieldName: string, status: string) => void;
  handleNonNegotiableChange: (fieldName: string, value: boolean) => void;
}

export default function Step03({
  formData,
  handleApplicationFormChange,
  handleNonNegotiableChange,
}: Step03Props) {
  return (
    <Card className="p-6">
      <ApplicationFormManagement
        formData={formData}
        setFormData={handleApplicationFormChange}
        setNonNegotiable={handleNonNegotiableChange}
      />
    </Card>
  );
}
