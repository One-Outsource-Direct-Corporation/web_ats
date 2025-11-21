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
          <SelectItem value="Technical Test">Technical Test</SelectItem>
          <SelectItem value="Personality Test">Personality Test</SelectItem>
          <SelectItem value="Skills Assessment">Skills Assessment</SelectItem>
          <SelectItem value="Cognitive Test">Cognitive Test</SelectItem>
          <SelectItem value="Portfolio Review">Portfolio Review</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}
