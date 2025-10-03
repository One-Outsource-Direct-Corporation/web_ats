import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { X } from "lucide-react";
import type { EducationWorkFormData } from "../../types/applicationForm";

interface WorkExperienceSectionProps {
  data: EducationWorkFormData;
  onChange: (field: string, value: string) => void;
  onAddExperience: () => void;
  onRemoveExperience: (index: number) => void;
  errors: Record<string, string>;
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  data,
  onChange,
  onAddExperience,
  onRemoveExperience,
  errors,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h2>

      <div className="space-y-6">
        {/* Has Work Experience */}
        <div>
          <Label>Do you have work experience?</Label>
          <RadioGroup
            value={data.hasWorkExperience}
            onValueChange={(value) => onChange("hasWorkExperience", value)}
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2 space-y-2">
              <RadioGroupItem value="yes" id="experience-yes" />
              <Label
                htmlFor="experience-yes"
                className="cursor-pointer font-normal"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-y-2">
              <RadioGroupItem value="no" id="experience-no" />
              <Label
                htmlFor="experience-no"
                className="cursor-pointer font-normal"
              >
                No
              </Label>
            </div>
          </RadioGroup>
          {errors.hasWorkExperience && (
            <p className="text-sm text-red-600">{errors.hasWorkExperience}</p>
          )}
        </div>

        {/* Show work experience form if yes */}
        {data.hasWorkExperience === "yes" && (
          <>
            {/* Current Work Experience Entry Form */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900">
                Add Work Experience
              </h3>

              <div className="space-y-2">
                <Label htmlFor="currentJobTitle">Job Title</Label>
                <Input
                  id="currentJobTitle"
                  value={data.currentJobTitle}
                  onChange={(e) => onChange("currentJobTitle", e.target.value)}
                  placeholder="Software Developer"
                />
                {errors.currentJobTitle && (
                  <p className="text-sm text-red-600">
                    {errors.currentJobTitle}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentCompany">Company Name</Label>
                <Input
                  id="currentCompany"
                  value={data.currentCompany}
                  onChange={(e) => onChange("currentCompany", e.target.value)}
                  placeholder="Tech Solutions Inc."
                />
                {errors.currentCompany && (
                  <p className="text-sm text-red-600">
                    {errors.currentCompany}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentYearsExperience">
                  Years of Experience
                </Label>
                <Input
                  id="currentYearsExperience"
                  type="number"
                  value={data.currentYearsExperience}
                  onChange={(e) =>
                    onChange("currentYearsExperience", e.target.value)
                  }
                  placeholder="3"
                  min="0"
                />
                {errors.currentYearsExperience && (
                  <p className="text-sm text-red-600">
                    {errors.currentYearsExperience}
                  </p>
                )}
              </div>

              <Button
                type="button"
                onClick={onAddExperience}
                variant="outline"
                className="w-full"
                disabled={
                  !data.currentJobTitle ||
                  !data.currentCompany ||
                  !data.currentYearsExperience
                }
              >
                Add Experience
              </Button>
            </div>

            {/* List of Added Work Experiences */}
            {data.workExperience.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Added Work Experience
                </h3>
                {data.workExperience.map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {exp.jobTitle}
                      </p>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.years} years</p>
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
      </div>
    </div>
  );
};
