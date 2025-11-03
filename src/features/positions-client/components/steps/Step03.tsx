import { Card } from "@/shared/components/ui/card";
import { ApplicationFormManagement } from "../../../../shared/components/reusables/ApplicationFormManagement";
import type {
  ApplicationForm,
  ApplicationFormData,
  ApplicationFormType,
} from "../../types/application_form.types";

interface Step03Props {
  formData: ApplicationFormData;
  handleApplicationFormChange: (
    fieldName: keyof ApplicationForm,
    status: ApplicationFormType
  ) => void;
  isNonNegotiable: (fieldName: string) => boolean;
  toggleNonNegotiable: (fieldName: string) => void;
}

export default function Step03({
  formData,
  handleApplicationFormChange,
  isNonNegotiable,
  toggleNonNegotiable,
}: Step03Props) {
  return (
    <Card className="p-6">
      <ApplicationFormManagement
        formData={formData}
        setFormData={handleApplicationFormChange}
        isNonNegotiable={isNonNegotiable}
        toggleNonNegotiable={toggleNonNegotiable}
      />
    </Card>
  );
}
