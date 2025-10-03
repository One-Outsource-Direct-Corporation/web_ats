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

interface EducationSectionProps {
  data: EducationWorkFormData;
  onChange: (field: string, value: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Educational Background
      </h2>

      <div className="space-y-6">
        {/* Highest Education */}
        <div className="space-y-2">
          <Label htmlFor="highestEducation">
            Highest Educational Attainment
          </Label>
          <Select
            value={data.highestEducation}
            onValueChange={(value) => onChange("highestEducation", value)}
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
        </div>

        {/* Year Graduated */}
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
        </div>

        {/* Institution */}
        <div className="space-y-2">
          <Label htmlFor="institution">University/Institution Name</Label>
          <Input
            id="institution"
            value={data.institution}
            onChange={(e) => onChange("institution", e.target.value)}
            placeholder="University of the Philippines"
          />
        </div>

        {/* Program/Course */}
        <div className="space-y-2">
          <Label htmlFor="program">Course/Program</Label>
          <Input
            id="program"
            value={data.program}
            onChange={(e) => onChange("program", e.target.value)}
            placeholder="Bachelor of Science in Computer Science"
          />
        </div>
      </div>
    </div>
  );
};
