import { useState } from "react";
import { EducationSection } from "../application/EducationSection";
import { WorkExperienceSection } from "../application/WorkExperienceSection";
import type { EducationWorkFormData } from "../../types/applicationForm";

export default function Step03() {
  const [formData, setFormData] = useState<EducationWorkFormData>({
    highestEducation: null,
    yearGraduated: null,
    institution: null,
    program: null,
    hasWorkExperience: null,
    currentJobTitle: null,
    currentCompany: null,
    currentYearsExperience: null,
    workExperience: [],
  });

  function handleEducationWorkChange(field: string, value: string) {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }

  function handleAddExperience() {
    setFormData((prevData) => {
      if (prevData && prevData.workExperience !== null) {
        return {
          ...prevData,
          workExperience: [
            ...(prevData.workExperience ?? []),
            {
              jobTitle: prevData.currentJobTitle ?? "",
              company: prevData.currentCompany ?? "",
              years: Number(prevData.currentYearsExperience ?? 0),
            },
          ],
          currentJobTitle: null,
          currentCompany: null,
          currentYearsExperience: null,
        };
      }
      return prevData;
    });
  }

  function handleRemoveExperience(index: number) {
    setFormData((prevData) => {
      if (prevData && prevData.workExperience !== null) {
        return {
          ...prevData,
          workExperience: (prevData.workExperience ?? []).filter(
            (_, i) => i !== index
          ),
        };
      }
      return prevData;
    });
  }

  return (
    <div className="space-y-6">
      <EducationSection
        formData={formData}
        onInputChange={handleEducationWorkChange}
      />
      <WorkExperienceSection
        formData={formData}
        onInputChange={handleEducationWorkChange}
        onAddExperience={handleAddExperience}
        onRemoveExperience={handleRemoveExperience}
      />
    </div>
  );
}
