import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { EducationWorkFormData } from "../../types/applicationForm";
import type { ApplicationForm } from "../../types/job";

interface EducationSectionProps {
  data: EducationWorkFormData;
  onChange: (field: string, value: string) => void;
  applicationForm: ApplicationForm;
  errors: Record<string, string>;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  data,
  onChange,
  applicationForm,
  errors,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Educational Background
      </h2>

      <div className="space-y-6">
        {/* Highest Education */}
        {applicationForm?.education_attained !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="highestEducation">
              Highest Educational Attainment
            </Label>
            <Select
              value={data.highestEducation}
              onValueChange={(value) => onChange("highestEducation", value)}
              required={applicationForm.education_attained === "required"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="associate">Associate Degree</SelectItem>
                <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="master">Master's Degree</SelectItem>
                <SelectItem value="doctorate">Doctorate</SelectItem>
              </SelectContent>
            </Select>
            {errors.highestEducation && (
              <p className="text-sm text-red-600">{errors.highestEducation}</p>
            )}
          </div>
        )}

        {/* Year Graduated */}
        {applicationForm?.year_graduated !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="yearGraduated">Year Graduated</Label>
            <Input
              id="yearGraduated"
              type="number"
              value={data.yearGraduated}
              onChange={(e) => onChange("yearGraduated", e.target.value)}
              placeholder="2020"
              min="1950"
              max={new Date().getFullYear()}
            />
            {errors.yearGraduated && (
              <p className="text-sm text-red-600">{errors.yearGraduated}</p>
            )}
          </div>
        )}

        {/* Institution */}
        {applicationForm?.university !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="institution">University/Institution Name</Label>
            <Input
              id="institution"
              value={data.institution}
              onChange={(e) => onChange("institution", e.target.value)}
              placeholder="University of the Philippines"
              required={applicationForm.university === "required"}
            />
            {errors.institution && (
              <p className="text-sm text-red-600">{errors.institution}</p>
            )}
          </div>
        )}

        {/* Program/Course */}
        {applicationForm?.course !== "disabled" && (
          <div className="space-y-2">
            <Label htmlFor="program">Course/Program</Label>
            <Input
              id="program"
              value={data.program}
              onChange={(e) => onChange("program", e.target.value)}
              placeholder="Bachelor of Science in Computer Science"
              required={applicationForm.course === "required"}
            />
            {errors.program && (
              <p className="text-sm text-red-600">{errors.program}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
