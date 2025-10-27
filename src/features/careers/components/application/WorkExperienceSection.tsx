import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { X } from "lucide-react";
import type { EducationWorkFormData } from "../../types/applicationForm";
import { Field, FieldLabel, FieldSet } from "@/shared/components/ui/field";

interface WorkExperienceSectionProps {
  formData: EducationWorkFormData;
  onInputChange: (field: string, value: string) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  formData,
  onInputChange,
  onAddExperience,
  onRemoveExperience,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>

      <FieldSet className="space-y-6">
        <FieldSet>
          <FieldLabel>Do you have work experience?</FieldLabel>
          <RadioGroup
            value={formData.hasWorkExperience}
            onValueChange={(value) => onInputChange("hasWorkExperience", value)}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="yes"
                id="experience-yes"
                className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
              />
              <Label
                htmlFor="experience-yes"
                className="cursor-pointer font-normal"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no"
                id="onsite-no"
                className="text-blue-500 border-blue-500 [&_svg]:fill-blue-500"
              />
              <Label htmlFor="onsite-no" className="cursor-pointer font-normal">
                No
              </Label>
            </div>
          </RadioGroup>
        </FieldSet>

        {formData.hasWorkExperience === "yes" && (
          <>
            {/* Current Work Experience Entry Form */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900">
                Add Work Experience
              </h3>

              <Field className="space-y-2">
                <FieldLabel htmlFor="currentJobTitle">Job Title</FieldLabel>
                <Input
                  id="currentJobTitle"
                  value={formData.currentJobTitle ?? ""}
                  onChange={(e) =>
                    onInputChange("currentJobTitle", e.target.value)
                  }
                  placeholder="Software Developer"
                />
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="currentCompany">Company Name</FieldLabel>
                <Input
                  id="currentCompany"
                  value={formData.currentCompany ?? ""}
                  onChange={(e) =>
                    onInputChange("currentCompany", e.target.value)
                  }
                  placeholder="Tech Solutions Inc."
                />
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="currentYearsExperience">
                  Years of Experience
                </FieldLabel>
                <Input
                  id="currentYearsExperience"
                  type="number"
                  value={formData.currentYearsExperience ?? ""}
                  onChange={(e) =>
                    onInputChange("currentYearsExperience", e.target.value)
                  }
                  placeholder="3"
                  min="0"
                />
              </Field>

              <Button
                type="button"
                onClick={onAddExperience}
                // variant="outline"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={
                  !formData.currentJobTitle ||
                  !formData.currentCompany ||
                  !formData.currentYearsExperience
                }
              >
                Add Experience
              </Button>
            </div>

            {(formData.workExperience?.length ?? 0) > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Added Work Experience
                </h3>
                {(formData.workExperience ?? []).map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {exp.jobTitle}
                      </p>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.years} Year/s
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveExperience(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </FieldSet>
    </div>
  );
};
