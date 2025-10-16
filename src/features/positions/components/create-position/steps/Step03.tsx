import { Card } from "@/shared/components/ui/card";
import { ApplicationFormManagement } from "../form-management/ApplicationFormManagement";
import type { CreatePositionFormData } from "@/features/positions/types/createPosition";

interface Step03Props {
  formData: CreatePositionFormData;
  handleApplicationFormChange: (fieldName: string, status: string) => void;
}

export default function Step03({
  formData,
  handleApplicationFormChange,
}: Step03Props) {
  return (
    <Card className="p-6">
      <ApplicationFormManagement
        formData={formData}
        setFormData={handleApplicationFormChange}
      />
    </Card>
  );
}
