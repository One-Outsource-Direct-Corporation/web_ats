import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { EducationWorkFormData } from "../../types/application_form.types";
import { Field, FieldLabel, FieldSet } from "@/shared/components/ui/field";
import type { ApplicationFormBase } from "@/shared/types/application_form.types";

interface EducationSectionProps {
  formData: EducationWorkFormData;
  onInputChange: (field: string, value: string) => void;
  applicationForm: ApplicationFormBase;
}

export const EducationSection = ({
  formData,
  onInputChange,
  applicationForm,
}: EducationSectionProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Educational Background
      </h2>

      <FieldSet>
        <Field>
          <FieldLabel htmlFor="highestEducation">
            Highest Educational Attainment
          </FieldLabel>
          <Select
            value={formData.highestEducation ?? ""}
            onValueChange={(value) => onInputChange("highestEducation", value)}
            disabled={applicationForm.education_attained === "disabled"}
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
        </Field>

        <Field>
          <FieldLabel htmlFor="yearGraduated">Year Graduated</FieldLabel>
          <Input
            id="yearGraduated"
            type="number"
            value={formData.yearGraduated ?? ""}
            onChange={(e) => onInputChange("yearGraduated", e.target.value)}
            placeholder="2020"
            min="1950"
            max={new Date().getFullYear()}
            disabled={applicationForm.year_graduated === "disabled"}
            required={applicationForm.year_graduated === "required"}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="institution">
            University/Institution Name
          </FieldLabel>
          <Input
            id="institution"
            value={formData.institution ?? ""}
            onChange={(e) => onInputChange("institution", e.target.value)}
            placeholder="University of the Philippines"
            disabled={applicationForm.university === "disabled"}
            required={applicationForm.university === "required"}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="program">Course/Program</FieldLabel>
          <Input
            id="program"
            value={formData.program ?? ""}
            onChange={(e) => onInputChange("program", e.target.value)}
            placeholder="Bachelor of Science in Computer Science"
            disabled={applicationForm.course === "disabled"}
            required={applicationForm.course === "required"}
          />
        </Field>
      </FieldSet>
    </div>
  );
};
