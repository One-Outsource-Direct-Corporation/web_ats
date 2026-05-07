import { useState } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";

interface PlaceholderGroup {
  label: string;
  items: { placeholder: string; description: string }[];
}

interface AvailablePlaceholdersProps {
  context: "outcome" | "schedule" | "all";
}

const OUTCOME_PLACEHOLDERS: PlaceholderGroup[] = [
  {
    label: "Candidate",
    items: [
      { placeholder: "{{ candidate_name }}", description: "Candidate's full name" },
    ],
  },
  {
    label: "Job / Pipeline Step",
    items: [
      { placeholder: "{{ job_title }}", description: "Job title" },
      { placeholder: "{{ pipeline_step_process_type_label }}", description: "Process type display label" },
    ],
  },
  {
    label: "Interviewer / Company",
    items: [
      { placeholder: "{{ interviewer_name }}", description: "Interviewer's full name" },
      { placeholder: "{{ interviewer_role }}", description: "Interviewer's role" },
      { placeholder: "{{ company_name }}", description: "Company name" },
    ],
  },
];

const SCHEDULE_PLACEHOLDERS: PlaceholderGroup[] = [
  {
    label: "Schedule",
    items: [
      { placeholder: "{{ schedule }}", description: "Scheduled date and time" },
      { placeholder: "{{ action }}", description: "scheduled / rescheduled" },
    ],
  },
  {
    label: "Meeting Details",
    items: [
      { placeholder: "{{ meeting_platform }}", description: "Platform name (e.g. Zoom, Google Meet)" },
      { placeholder: "{{ meeting_link }}", description: "Meeting URL" },
      { placeholder: "{{ meeting_link_name }}", description: "Link display name" },
      { placeholder: "{{ interview_setup }}", description: "onsite / online / phone" },
      { placeholder: "{{ meeting_address }}", description: "Physical address for onsite" },
    ],
  },
];

export function AvailablePlaceholders({ context }: AvailablePlaceholdersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const showOutcome = context === "outcome" || context === "all";
  const showSchedule = context === "schedule" || context === "all";

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Info className="h-3.5 w-3.5 flex-shrink-0" />
        <span>Available Placeholders</span>
        {isOpen ? <ChevronDown className="h-3.5 w-3.5 ml-auto" /> : <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
      </button>

      {isOpen && (
        <div className="px-3 pb-3 space-y-3">
          <p className="text-xs text-blue-600">
            Use these placeholders in your subject and body. They will be replaced with actual values when the email is sent.
          </p>

          {showOutcome && OUTCOME_PLACEHOLDERS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500 mb-1">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <div key={item.placeholder} className="flex items-start gap-2 text-xs">
                    <code className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 font-mono text-blue-800">
                      {item.placeholder}
                    </code>
                    <span className="text-blue-600">— {item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {showSchedule && SCHEDULE_PLACEHOLDERS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500 mb-1">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <div key={item.placeholder} className="flex items-start gap-2 text-xs">
                    <code className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 font-mono text-blue-800">
                      {item.placeholder}
                    </code>
                    <span className="text-blue-600">— {item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
