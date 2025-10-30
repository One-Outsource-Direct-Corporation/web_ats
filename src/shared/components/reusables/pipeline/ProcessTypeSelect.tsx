import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ProcessTypeIcon } from "./ProcessTypeIcon";

const PROCESS_TYPES = [
  { value: "resume_screening", label: "Resume Screening" },
  { value: "phone_call_interview", label: "Phone Call Interview" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "initial_interview", label: "Initial Interview" },
  { value: "assessments", label: "Assessments" },
  { value: "final_interview", label: "Final Interview" },
  { value: "for_job_offer", label: "For Job Offer" },
  { value: "for_offer_and_finalization", label: "For Offer and Finalization" },
  { value: "onboarding", label: "Onboarding" },
];

interface ProcessTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ProcessTypeSelect({
  value,
  onValueChange,
}: ProcessTypeSelectProps) {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Process Type">
          {value && (
            <div className="flex items-center gap-2">
              <ProcessTypeIcon processType={value} className="text-blue-600" />
              <span>
                {PROCESS_TYPES.find((pt) => pt.value === value)?.label}
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="Select Process Type" disabled>
            Select Process Type
          </SelectItem>
          {PROCESS_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex items-center gap-2">
                <ProcessTypeIcon
                  processType={type.value}
                  className="text-blue-600"
                />
                <span>{type.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
