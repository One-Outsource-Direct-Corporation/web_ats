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
  setNonNegotiableValue: (
    fieldName: string,
    value: string | number | boolean
  ) => void;
}

export default function Step03({
  formData,
  handleApplicationFormChange,
  isNonNegotiable,
  toggleNonNegotiable,
  setNonNegotiableValue,
}: Step03Props) {
  return (
    <Card className="p-6">
      <ApplicationFormManagement
        formData={formData}
        setFormData={handleApplicationFormChange}
        isNonNegotiable={isNonNegotiable}
        toggleNonNegotiable={toggleNonNegotiable}
        setNonNegotiableValue={setNonNegotiableValue}
      />
    </Card>
  );
}
