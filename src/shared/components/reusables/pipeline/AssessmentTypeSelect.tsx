import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Field, FieldLabel } from "../../ui/field";

interface AssessmentTypeSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

export function AssessmentTypeSelect({
  value,
  onChange,
}: AssessmentTypeSelectProps) {
  return (
    <Field>
      <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
        Assessment Type
      </FieldLabel>
      <Select value={value ?? ""} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Assessment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Select Assessment Type" disabled>
            Select Assessment Type
          </SelectItem>
          <SelectItem value="technical_test">Technical Test</SelectItem>
          <SelectItem value="personality_test">Personality Test</SelectItem>
          <SelectItem value="skills_assessment">Skills Assessment</SelectItem>
          <SelectItem value="cognitive_test">Cognitive Test</SelectItem>
          <SelectItem value="portfolio_review">Portfolio Review</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}
