import { EducationSection } from "../application/EducationSection";
import { WorkExperienceSection } from "../application/WorkExperienceSection";
import type {
  EducationWorkFormData,
  WorkExperienceEntry,
} from "../../types/application_form.types";
import type { ApplicationFormBase } from "@/shared/types/application_form.types";

interface Step03Props {
  formData: EducationWorkFormData;
  onInputChange: (
    field: string,
    value: string | number | null | WorkExperienceEntry[]
  ) => void;
  applicationForm: ApplicationFormBase;
}

export default function Step03({
  formData,
  onInputChange,
  applicationForm,
}: Step03Props) {
  function handleAddExperience() {
    if (formData && formData.workExperience !== null) {
      const newExperience: WorkExperienceEntry = {
        jobTitle: formData.currentJobTitle ?? "",
        company: formData.currentCompany ?? "",
        years: Number(formData.currentYearsExperience ?? 0),
      };

      const updatedWorkExperience = [
        ...(formData.workExperience ?? []),
        newExperience,
      ];

      onInputChange("workExperience", updatedWorkExperience);
      onInputChange("currentJobTitle", null);
      onInputChange("currentCompany", null);
      onInputChange("currentYearsExperience", null);
    }
  }

  function handleRemoveExperience(index: number) {
    if (formData && formData.workExperience !== null) {
      const updatedWorkExperience = (formData.workExperience ?? []).filter(
        (_, i) => i !== index
      );
      onInputChange("workExperience", updatedWorkExperience);
    }
  }

  return (
    <div className="space-y-6">
      <EducationSection
        formData={formData}
        onInputChange={onInputChange}
        applicationForm={applicationForm}
      />
      <WorkExperienceSection
        formData={formData}
        applicationForm={applicationForm}
        onInputChange={onInputChange}
        onAddExperience={handleAddExperience}
        onRemoveExperience={handleRemoveExperience}
      />
    </div>
  );
}
