import {
  FileText,
  Phone,
  CheckCircle,
  Users,
  ClipboardCheck,
  Briefcase,
  FileCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

interface ProcessTypeIconProps {
  processType: string;
  className?: string;
}

const processTypeIcons: Record<string, LucideIcon> = {
  resume_screening: FileText,
  phone_call_interview: Phone,
  shortlisted: CheckCircle,
  initial_interview: Users,
  assessments: ClipboardCheck,
  final_interview: Briefcase,
  for_job_offer: FileCheck,
  for_offer_and_finalization: FileCheck,
  onboarding: UserCheck,
};

export function ProcessTypeIcon({
  processType,
  className = "h-4 w-4",
}: ProcessTypeIconProps) {
  const Icon = processTypeIcons[processType] || FileText;
  return <Icon className={className} />;
}

export function getProcessTypeLabel(processType: string): string {
  const labels: Record<string, string> = {
    resume_screening: "Resume Screening",
    phone_call_interview: "Phone Call Interview",
    shortlisted: "Shortlisted",
    initial_interview: "Initial Interview",
    assessments: "Assessments",
    final_interview: "Final Interview",
    for_job_offer: "For Job Offer",
    for_offer_and_finalization: "For Offer and Finalization",
    onboarding: "Onboarding",
  };

  return labels[processType] || processType;
}
