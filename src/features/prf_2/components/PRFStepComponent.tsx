import PRFStep01 from "@/features/prf_2/components/Steps/PRFStep01.tsx";
import PRFStep02 from "@/features/prf_2/components/Steps/PRFStep02.tsx";
import PRFStep03 from "@/features/prf_2/components/Steps/PRFStep03.tsx";
import PRFStep04 from "@/features/prf_2/components/Steps/PRFStep04.tsx";
import PRFStep05 from "@/features/prf_2/components/Steps/PRFStep05.tsx";
import PRFStep06 from "@/features/prf_2/components/Steps/PRFStep06.tsx";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import type { StepErrors } from "@/features/prf_2/utils/validateSteps";
import type React from "react";

interface PRFStepComponentProps {
  step: number;
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
  stepErrors: StepErrors;
}

export default function PRFStepComponent({
  step,
  formData,
  updateFormData,
  stepErrors,
}: PRFStepComponentProps) {
  switch (step) {
    case 1:
      return (
        <PRFStep01
          formData={formData}
          updateFormData={updateFormData}
          errors={stepErrors[1]}
        />
      );
    case 2:
      return (
        <PRFStep02
          formData={formData}
          updateFormData={updateFormData}
          errors={stepErrors[2]}
        />
      );
    case 3:
      return (
        <PRFStep03
          formData={formData}
          updateFormData={updateFormData}
          errors={stepErrors[3]}
        />
      );
    case 4:
      return (
        <PRFStep04
          formData={formData}
          updateFormData={updateFormData}
          errors={stepErrors[4]}
        />
      );
    case 5:
      return (
        <PRFStep05
          formData={formData}
          updateFormData={updateFormData}
          errors={stepErrors[5]}
        />
      );
    case 6:
      return <PRFStep06 formData={formData} />;
    default:
      return (
        <PRFStep01
          formData={formData}
          updateFormData={updateFormData}
          errors={stepErrors[1]}
        />
      );
  }
}
