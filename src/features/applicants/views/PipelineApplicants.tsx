import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft, BarChart3, CheckCircle, Download, FileText, Loader2, Plus, Search, Settings, Trash2, X, XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";
import { Badge } from "@/shared/components/ui/badge.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { Textarea } from "@/shared/components/ui/textarea.tsx";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { emailTemplateService } from "@/features/library/services/emailTemplate.service";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatAssessmentType, resolveFileUrl, isImageExtension, isPdfExtension } from "@/shared/utils/assessmentUtils";

import { useJobDetailQuery } from "@/features/jobs/hooks/useJobs";
import { extractPipelineStepsFromJobDetail } from "@/features/jobs/services/jobService";
import {
  formatJobTitle,
  getProcessTypeFromRouteSegment,
  getProcessTypeLabel,
} from "@/features/jobs/utils/jobFormatters";

import ResumeScreeningTable from "@/features/applicants/components/ResumeScreeningTable";
import JobOfferPipelineTable from "@/features/applicants/components/JobOfferPipelineTable";
import { useJobOffersQuery } from "@/features/applicants/hooks/useJobOffers";

import { useDeferredAction } from "@/features/applicants/hooks/useDeferredAction";

interface InterviewScheduleModalState {
  open: boolean;
  candidateApplicationId: number;
  candidateName: string;
  pipelineStepId: number;
  mode: "set" | "reschedule";
  existingSchedule?: string;
  jobTitle?: string;
}

interface AssessmentModalState {
  open: boolean;
  candidateApplicationId: number;
  candidateName: string;
  pipelineStepId: number;
  candidateAssessmentId?: number;
  mode: "preview" | "grade";
  assessment?: {
    id: number;
    type_label?: string | null;
    type?: string | null;
    file?: {
      filename?: string | null;
      file?: string | null;
    };
  };
}

interface CandidateAssessmentData {
  id: number;
  assessmentId: number;
  assessmentName?: string | null;
  status: "assigned" | "submitted" | "graded" | "sent" | "not_assigned";
  score?: number | null;
  notes?: string | null;
  is_sent?: boolean;
}

interface PipelineAssessment {
  id: number;
  name?: string | null;
  type?: string | null;
  type_label?: string | null;
  file?: {
    filename?: string | null;
    file?: string | null;
  };
}

interface SendAssessmentModalState {
  open: boolean;
  candidateApplicationId: number;
  candidateName: string;
  pipelineStepId: number;
  subject: string;
  body: string;
}

interface SendAssessmentPreview {
  subject: string;
  body: string;
  html_body: string;
  attachments: Array<{ filename: string; size: number }>;
  recipient_email: string;
  recipient_name: string;
}

interface PreonboardingCandidate {
  id: number;
  candidate_name: string;
  job_title: string;
  photo_url?: string | null;
  signed_offer_uploaded: boolean;
  resume_url?: string | null;
  resume_filename?: string | null;
  cover_letter_url?: string | null;
  cover_letter_filename?: string | null;
  med_cert_url?: string | null;
  med_cert_filename?: string | null;
  requirements_submitted: number;
  requirements_required: number;
  requirements_required_submitted: number;
  requirements_total: number;
}

interface OnboardingCandidate {
  id: number;
  candidate_name: string;
  job_title: string;
  photo_url?: string | null;
  onboarding_date: string | null;
  onboarding_email_sent_at: string | null;
}

interface TemplateItem {
  key: string;
  label: string;
  required: boolean;
  order: number;
  file_url?: string | null;
  filename?: string | null;
  status?: string;
}

interface RequirementItem {
  requirement_key: string;
  requirement_label: string;
  required: boolean;
  status: string;
  version: number;
  original_filename: string;
  file_id: number | null;
  file_url?: string | null;
  filename?: string | null;
  carry_over_to_onboarding: boolean;
  submitted_at: string | null;
}

const STANDARD_PREONBOARDING_REQUIREMENTS: { label: string; required: boolean }[] = [
  { label: "Valid NBI Clearance or Police Clearance", required: true },
  { label: "Medical Certificate", required: true },
  { label: "Certificate of Employment (COE)", required: true },
  { label: "Income Tax Return (ITR 2316)", required: true },
  { label: "Barangay Clearance", required: true },
  { label: "Photocopy of Dependents Birth Certificate (if applicable)", required: true },
  { label: "Photocopy of Marriage Contract (if applicable)", required: true },
  { label: "Photocopy of Birth Certificate", required: true },
  { label: "Photocopy of BIR ID / TIN Card", required: true },
  { label: "Photocopy of SSS ID / E1 Form", required: false },
  { label: "Photocopy of Philhealth Card", required: false },
  { label: "Photocopy of Pag-ibig ID / Certificate / Record of Contribution", required: false },
  { label: "2 pieces of 2×2 size photo", required: false },
  { label: "2 pieces of 1×1 size photo", required: false },
  { label: "Photocopy of SSS and Pag-ibig loan voucher (if with current loan)", required: false },
  { label: "Photocopy of other Government-Issued IDs", required: false },
];

interface InterviewScheduleFormState {
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  subject: string;
  interviewerNames: string;
  templateBody: string;
  interviewSetup: "onsite" | "online" | "phone";
  meetingPlatform: string;
  meetingLink: string;
  meetingLinkName: string;
  meetingAddress: string;
  rescheduleReason: string;
  emailTemplateId?: number | null;
}

interface InterviewEmailPreviewResponse {
  candidate_application_id: number;
  pipeline_step_id: number;
  subject: string;
  body: string;
  html_body: string;
  scheduled_for: string;
}

const toDateInputValue = (isoDateTime?: string): string => {
  if (!isoDateTime) {
    return "";
  }

  const parsed = new Date(isoDateTime);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toTimeInputValue = (isoDateTime?: string): string => {
  if (!isoDateTime) {
    return "09:00";
  }

  const parsed = new Date(isoDateTime);
  if (Number.isNaN(parsed.getTime())) {
    return "09:00";
  }

  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const buildIsoDateTime = (dateValue: string, timeValue: string): string | null => {
  if (!dateValue || !timeValue) {
    return null;
  }

  // Build an ISO-8601 string with explicit timezone offset for UTC+8
  // Backend expects an ISO datetime; include +08:00 so it's interpreted as UTC+8
  return `${dateValue}T${timeValue}:00+08:00`;
};

const formatDisplaySchedule = (scheduledFor?: string): string => {
  if (!scheduledFor) {
    return "Not Scheduled";
  }

  const parsed = new Date(scheduledFor);
  if (Number.isNaN(parsed.getTime())) {
    return "Not Scheduled";
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const buildInterviewSetupDetails = (
  setup: "onsite" | "online" | "phone",
  address?: string,
  platform?: string,
  link?: string,
  linkName?: string,
): string => {
  const lines: string[] = [];
  lines.push("\n---\nInterview Setup Details:");

  if (setup === "onsite") {
    lines.push(`Setup: Onsite`);
    if (address?.trim()) {
      lines.push(`Address: ${address}`);
    }
  } else if (setup === "online") {
    lines.push(`Setup: Online`);
    if (platform?.trim()) {
      lines.push(`Platform: ${platform}`);
    }
    if (linkName?.trim()) {
      lines.push(`Link Name: ${linkName}`);
    }
    if (link?.trim()) {
      lines.push(`Link: ${link}`);
    }
  } else if (setup === "phone") {
    lines.push(`Setup: Phone`);
  }

  return lines.join("\n");
};

const buildDefaultInterviewSubject = (
  mode: "set" | "reschedule",
  setup: "onsite" | "online" | "phone",
  jobTitle?: string,
): string => {
  const setupLabel = setup.charAt(0).toUpperCase() + setup.slice(1);
  const jobTitleStr = jobTitle ? ` - ${jobTitle}` : "";

  return mode === "reschedule"
    ? `Rescheduled Interview - ${setupLabel}${jobTitleStr}`
    : `Interview - ${setupLabel}${jobTitleStr}`;
};

const renderTemplate = (
  tmpl: string,
  form: InterviewScheduleFormState,
  modal: InterviewScheduleModalState,
): string => {
  if (!tmpl) return "";
  const scheduleIso = buildIsoDateTime(form.scheduledDate, form.scheduledTime) || "";
  const scheduleStr = scheduleIso ? formatDisplaySchedule(scheduleIso) : "Not Scheduled";

  const placeholders: Record<string, string> = {
    candidate_name: modal.candidateName || "",
    schedule: scheduleStr,
    pipeline_step_title: modal.jobTitle || "",
    meeting_link: form.meetingLink || "",
    meeting_address: form.meetingAddress || "",
    interview_setup: form.interviewSetup || "",
    interviewer_names: form.interviewerNames || "",
    job_title: modal.jobTitle || "",
    reschedule_reason: form.rescheduleReason || "",
    duration: form.duration || "",
    meeting_platform: form.meetingPlatform || "",
    meeting_link_name: form.meetingLinkName || "",
  };

  return tmpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => placeholders[key] ?? "");
};

const createDefaultScheduleForm = (
  candidateName: string,
  existingSchedule?: string,
  interviewerName?: string,
  mode?: "set" | "reschedule",
  jobTitle?: string,
): InterviewScheduleFormState => {
  const subject = buildDefaultInterviewSubject(mode || "set", "phone", jobTitle);
  
  const baseBody = `Hello ${candidateName},\n\nYour interview has been scheduled.`;
  const templateBody = baseBody;

  return {
    scheduledDate: toDateInputValue(existingSchedule),
    scheduledTime: toTimeInputValue(existingSchedule),
    duration: "60 mins",
    subject,
    interviewerNames: interviewerName || "",
    templateBody,
    interviewSetup: "phone",
    meetingPlatform: "Zoom Meeting",
    meetingLink: "",
    meetingLinkName: "",
    meetingAddress: "",
    rescheduleReason: "",
  };
};

const normalizeStatusTag = (value?: string): string => {
  if (!value) {
    return "pending";
  }

  return value
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z_]/g, "");
};

  const ACTIVE_PIPELINE_STATUSES = new Set(["pending", "scheduled", "in_progress", "assessment_sent", "assessment_partially_graded", "assessment_graded"]);

export default function PipelineApplicants() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams<{ jobId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { queueAction, processingId, pendingCandidateIds } = useDeferredAction();

  const [scheduleModalState, setScheduleModalState] = useState<InterviewScheduleModalState>({
    open: false,
    candidateApplicationId: 0,
    candidateName: "",
    pipelineStepId: 0,
    mode: "set",
    existingSchedule: undefined,
    jobTitle: undefined,
  });

  const [assessmentModalState, setAssessmentModalState] = useState<AssessmentModalState>({
    open: false,
    candidateApplicationId: 0,
    candidateName: "",
    pipelineStepId: 0,
    mode: "preview",
  });

  const [assessmentGradeForm, setAssessmentGradeForm] = useState({ score: "", notes: "" });
  const [candidateAssessments, setCandidateAssessments] = useState<Map<number, CandidateAssessmentData[]>>(new Map());
  const [sendAssessmentModalState, setSendAssessmentModalState] = useState<SendAssessmentModalState>({
    open: false,
    candidateApplicationId: 0,
    candidateName: "",
    pipelineStepId: 0,
    subject: "",
    body: "",
  });
  const [sendPreview, setSendPreview] = useState<SendAssessmentPreview | null>(null);
  const [isSendPreviewOpen, setIsSendPreviewOpen] = useState(false);
  const [isLoadingSendPreview, setIsLoadingSendPreview] = useState(false);
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<InterviewScheduleFormState>({
    scheduledDate: "",
    scheduledTime: "09:00",
    duration: "60 mins",
    subject: "Interview Session",
    interviewerNames: "",
    templateBody: "",
    interviewSetup: "phone",
    meetingPlatform: "Zoom Meeting",
    meetingLink: "",
    meetingLinkName: "",
    meetingAddress: "",
    rescheduleReason: "",
    emailTemplateId: undefined,
  });
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [isLoadingEmailPreview, setIsLoadingEmailPreview] = useState(false);
  const [emailPreview, setEmailPreview] = useState<InterviewEmailPreviewResponse | null>(null);
  const subjectEditedRef = useRef(false);

  const [resumePreviewCandidate, setResumePreviewCandidate] = useState<{
    id: number;
    name: string;
    resumeUrl?: string;
  } | null>(null);

  // Preonboarding state
  const [showPreOnboardingTemplateModal, setShowPreOnboardingTemplateModal] = useState(false);
  const [preOnboardingTemplateItems, setPreOnboardingTemplateItems] = useState<TemplateItem[]>([]);
  const [newPreOnboardingTemplateItem, setNewPreOnboardingTemplateItem] = useState("");

  const [showPreOnboardingCandidateModal, setShowPreOnboardingCandidateModal] = useState(false);
  const [selectedPreOnboardingCandidateId, setSelectedPreOnboardingCandidateId] = useState<number | null>(null);
  const [preOnboardingCandidateItems, setPreOnboardingCandidateItems] = useState<TemplateItem[]>([]);
  const [newPreOnboardingCandidateItem, setNewPreOnboardingCandidateItem] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [reportDate, setReportDate] = useState("");

  // Onboarding state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [selectedOnboardingCandidate, setSelectedOnboardingCandidate] = useState<{
    id: number;
    candidate_name: string;
    job_title: string;
  } | null>(null);
  const [onboardingDate, setOnboardingDate] = useState("");
  const [onboardingEmailSubject, setOnboardingEmailSubject] = useState("");
  const [onboardingEmailBody, setOnboardingEmailBody] = useState("");
  const [onboardingPreviewOpen, setOnboardingPreviewOpen] = useState(false);
  const [onboardingPreviewSubject, setOnboardingPreviewSubject] = useState("");
  const [onboardingPreviewBody, setOnboardingPreviewBody] = useState("");

  const { data: jobDetail, isLoading, isError, refetch } = useJobDetailQuery(jobId);
  const { data: offersData } = useJobOffersQuery();
  const jobOffers = Array.isArray(offersData) ? offersData : [];

  // Track navigation to/from IEF pages and trigger a refetch when returning
  const prevPathRef = useRef<string>(location.pathname);
  useEffect(() => {
    const prev = prevPathRef.current;
    const current = location.pathname;

    // If we navigated away from an IEF route back to the pipeline view, refresh data
    if (prev.includes("/ief") && !current.includes("/ief")) {
      void refetch();
    }

    prevPathRef.current = current;
  }, [location.pathname, refetch]);

  const pipelineSteps = useMemo(
    () => extractPipelineStepsFromJobDetail(jobDetail),
    [jobDetail],
  );

  const processTypes = useMemo(() => {
    const unique = new Set<string>();
    for (const step of pipelineSteps) {
      unique.add(step.process_type);
    }
    return Array.from(unique);
  }, [pipelineSteps]);

  const routeSegment = useMemo(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    return pathParts[pathParts.length - 1] ?? "";
  }, [location.pathname]);

  const routeProcessType = useMemo(
    () => getProcessTypeFromRouteSegment(routeSegment),
    [routeSegment],
  );

  const queryType = searchParams.get("type") ?? undefined;
  const selectedType = useMemo(() => {
    if (queryType && processTypes.includes(queryType)) {
      return queryType;
    }

    if (routeProcessType && processTypes.includes(routeProcessType)) {
      return routeProcessType;
    }

    if (processTypes.length > 0) {
      return processTypes[0];
    }

    return "shortlisted";
  }, [processTypes, queryType, routeProcessType]);

  const selectedTypeLabel = getProcessTypeLabel(selectedType);

  const isInterviewScheduleStage =
    selectedType === "phone_call_interview" ||
    selectedType === "initial_interview" ||
    selectedType === "final_interview";
  const selectedSteps = useMemo(
    () => pipelineSteps.filter((step) => step.process_type === selectedType),
    [pipelineSteps, selectedType],
  );

  const stepAssessments = useMemo<PipelineAssessment[]>(
    () => (selectedSteps[0]?.assessments as PipelineAssessment[]) ?? [],
    [selectedSteps],
  );

  const isResumeWithAssessments =
    selectedType === "resume_screening" && stepAssessments.length > 0;
  const isPassFailStage = !isResumeWithAssessments && (
    selectedType === "resume_screening" ||
    selectedType === "phone_call_interview" ||
    selectedType === "initial_interview"
  );
  const isAssessmentStage = selectedType === "assessments";
  const showResumeColumn = selectedType === "resume_screening";

  const isInterviewWithAssessments = isInterviewScheduleStage && stepAssessments.length > 0;

  // Preonboarding step detection
  const preonboardingPipelineStep = useMemo(
    () => pipelineSteps.find((s) => s.process_type === "pre_onboarding"),
    [pipelineSteps],
  );

  const isPreonboardingInterviewer = useMemo(() => {
    if (!preonboardingPipelineStep) return false;
    return preonboardingPipelineStep.interviewerId === user?.id;
  }, [preonboardingPipelineStep, user?.id]);

  // Fetch global template for preonboarding
  const { data: preonboardingTemplateData } = useQuery({
    queryKey: ["preonboarding-template", preonboardingPipelineStep?.id],
    queryFn: async () => {
      if (!preonboardingPipelineStep?.id) return { requirements: [] };
      const res = await axiosPrivate.get(`/api/candidate/preonboarding/pipeline-steps/${preonboardingPipelineStep.id}/template/`);
      return res.data as { requirements: TemplateItem[] };
    },
    enabled: !!preonboardingPipelineStep?.id,
  });

  // Fetch candidates at preonboarding
  const { data: preonboardingCandidates = [], isLoading: preonboardingCandidatesLoading } = useQuery({
    queryKey: ["preonboarding-candidates", jobId],
    queryFn: async () => {
      if (!jobId) return [];
      const res = await axiosPrivate.get(`/api/candidate/preonboarding/candidates/?job_posting_id=${jobId}`);
      return res.data as PreonboardingCandidate[];
    },
    enabled: selectedType === "pre_onboarding" && !!jobId,
  });

  // Save global template
  const savePreonboardingTemplateMutation = useMutation({
    mutationFn: async (items: TemplateItem[]) => {
      await axiosPrivate.put(`/api/candidate/preonboarding/pipeline-steps/${preonboardingPipelineStep.id}/template/`, {
        requirements: items,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preonboarding-template", preonboardingPipelineStep?.id] });
      setShowPreOnboardingTemplateModal(false);
    },
  });

  // Save candidate requirements
  const savePreonboardingCandidateReqsMutation = useMutation({
    mutationFn: async ({ appId, items }: { appId: number; items: TemplateItem[] }) => {
      await axiosPrivate.put(`/api/candidate/preonboarding/candidates/${appId}/requirements/`, {
        requirements: items,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preonboarding-candidates", jobId] });
      setShowPreOnboardingCandidateModal(false);
    },
  });

  const handlePreonboardingPassFail = (
    candidateAppId: number,
    candidateName: string,
    pipelineStepId: number | undefined,
    outcome: "pass" | "fail",
  ) => {
    if (!pipelineStepId || Number.isNaN(pipelineStepId)) return;

    queueAction({
      candidateName,
      label: outcome === "pass" ? "Pass" : "Fail",
      dedupKey: `preonboarding-progress-${candidateAppId}-${pipelineStepId}`,
      candidateId: candidateAppId,
      onCommit: async () => {
        try {
          await axiosPrivate.post("/api/candidate/pipeline/progress/", {
            candidate_application_id: candidateAppId,
            pipeline_step_id: pipelineStepId,
            outcome,
          });
          toast.success(`${candidateName} marked as ${outcome === "pass" ? "Pass" : "Fail"}.`);
          queryClient.setQueryData<PreonboardingCandidate[]>(["preonboarding-candidates", jobId], (old) =>
            old?.filter((c) => c.id !== candidateAppId) ?? []
          );
        } catch (error) {
          console.error("Unable to update preonboarding progress.", error);
          toast.error("Unable to submit preonboarding progress update.");
          queryClient.invalidateQueries({ queryKey: ["preonboarding-candidates", jobId] });
        }
      },
    });
  };

  const isPreonboardingProgressActionDisabled = useCallback(
    () => {
      if (processingId !== null) return true;
      if (!isPreonboardingInterviewer) return true;
      return false;
    },
    [processingId, isPreonboardingInterviewer],
  );

  // Onboarding step detection
  const onboardingPipelineStep = useMemo(
    () => pipelineSteps.find((s) => s.process_type === "onboarding"),
    [pipelineSteps],
  );

  const isOnboardingInterviewer = useMemo(() => {
    if (!onboardingPipelineStep) return false;
    return onboardingPipelineStep.interviewerId === user?.id;
  }, [onboardingPipelineStep, user?.id]);

  // Fetch candidates at onboarding
  const { data: onboardingCandidates = [], isLoading: onboardingCandidatesLoading } = useQuery({
    queryKey: ["onboarding-candidates", jobId],
    queryFn: async () => {
      if (!jobId) return [];
      const res = await axiosPrivate.get(`/api/candidate/onboarding/candidates/?job_posting_id=${jobId}`);
      return res.data as OnboardingCandidate[];
    },
    enabled: selectedType === "onboarding" && !!jobId,
  });

  // Immediate supervisor from job PRF (prf_nested returns full object)
  const immediateSupervisor = useMemo(() => {
    return (jobDetail as any)?.prf_nested?.immediate_supervisor ?? null;
  }, [jobDetail]);

  // Send onboarding mutation with optimistic update
  const sendOnboardingMutation = useMutation({
    mutationFn: async (payload: {
      candidate_application_id: number;
      onboarding_date: string;
      email_subject: string;
      email_body: string;
    }) => {
      await axiosPrivate.post("/api/candidate/onboarding/send/", payload);
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["onboarding-candidates", jobId] });
      const previous = queryClient.getQueryData<OnboardingCandidate[]>(["onboarding-candidates", jobId]);
      queryClient.setQueryData<OnboardingCandidate[]>(["onboarding-candidates", jobId], (old) =>
        old?.filter((c) => c.id !== payload.candidate_application_id) ?? []
      );
      return { previous };
    },
    onError: (err, payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["onboarding-candidates", jobId], context.previous);
      }
      toast.error("Unable to send onboarding.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-candidates", jobId] });
    },
  });

  const handleSendOnboarding = (
    candidateAppId: number,
    candidateName: string,
  ) => {
    setShowOnboardingModal(false);
    setSelectedOnboardingCandidate(null);

    queueAction({
      candidateName,
      label: "Onboarding",
      dedupKey: `onboarding-${candidateAppId}`,
      candidateId: candidateAppId,
      onCommit: async () => {
        await sendOnboardingMutation.mutateAsync({
          candidate_application_id: candidateAppId,
          onboarding_date: onboardingDate,
          email_subject: onboardingEmailSubject,
          email_body: onboardingEmailBody,
        });
        toast.success(`Onboarding sent to ${candidateName}.`);
      },
    });
  };

  const interviewerName = useMemo(
    () => onboardingPipelineStep?.interviewerName || user ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'ATS Recruitment Team' : 'ATS Recruitment Team',
    [onboardingPipelineStep, user],
  );

  const interviewerRole = useMemo(
    () => user?.role ? user.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '',
    [user],
  );

  const handleOnboardingPreview = () => {
    if (!selectedOnboardingCandidate) return;
    const companyName = (jobDetail as any)?.company?.name || (jobDetail as any)?.job_posting?.company?.name || "ATS Recruitment Team";
    const supervisorName = immediateSupervisor
      ? `${immediateSupervisor.first_name || ''} ${immediateSupervisor.last_name || ''}`.trim() || immediateSupervisor.email
      : 'Not assigned';

    const formattedDate = onboardingDate
      ? new Date(onboardingDate + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '[date not set]';

    const placeholders: Record<string, string> = {
      candidate_name: selectedOnboardingCandidate.candidate_name,
      onboarding_date: formattedDate,
      immediate_supervisor: supervisorName,
      job_title: selectedOnboardingCandidate.job_title,
      company_name: companyName,
      interviewer_name: interviewerName,
      interviewer_role: interviewerRole,
    };

    let previewSubject = onboardingEmailSubject;
    let previewBody = onboardingEmailBody;
    for (const [key, value] of Object.entries(placeholders)) {
      const tag = `{{${key}}}`;
      previewSubject = previewSubject.replaceAll(tag, value);
      previewBody = previewBody.replaceAll(tag, value);
    }

    setOnboardingPreviewSubject(previewSubject);
    setOnboardingPreviewBody(previewBody);
    setOnboardingPreviewOpen(true);
  };

  const openOnboardingModal = (candidate: OnboardingCandidate) => {
    setSelectedOnboardingCandidate({
      id: candidate.id,
      candidate_name: candidate.candidate_name,
      job_title: candidate.job_title,
    });
    setOnboardingDate(new Date().toISOString().split("T")[0]);
    setOnboardingEmailSubject("Onboarding Details - {{job_title}}");
    setOnboardingEmailBody(
      `Dear {{candidate_name}},\n\n` +
      `We are pleased to inform you that you have been onboarded for the position of {{job_title}}.\n\n` +
      `Your onboarding date is: {{onboarding_date}}\n\n` +
      `Your immediate supervisor is: {{immediate_supervisor}}\n\n` +
      `Please contact your supervisor for further details.\n\n` +
      `Best regards,\n` +
      `{{interviewer_name}}\n` +
      `{{interviewer_role}}\n` +
      `{{company_name}}`
    );
    setShowOnboardingModal(true);
  };

  const isOnboardingActionDisabled = useCallback(
    () => {
      if (processingId !== null) return true;
      if (!isOnboardingInterviewer) return true;
      return false;
    },
    [processingId, isOnboardingInterviewer],
  );

  const resolvePhotoUrl = (rawUrl?: string) => {
    if (!rawUrl) {
      return undefined;
    }

    if (/^(?:https?:\/\/|data:|blob:)/i.test(rawUrl)) {
      return rawUrl;
    }

    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
    if (!backendBaseUrl) {
      return rawUrl;
    }

    const trimmedBaseUrl = backendBaseUrl.replace(/\/$/, "");
    const normalizedPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
    return `${trimmedBaseUrl}${normalizedPath}`;
  };

  const selectedStepCandidates = useMemo(() => {
    const candidatesById = new Map<
      number,
      {
        id: number;
        name: string;
        department: string;
        statusLabel: string;
        pipelineStatus: string;
        resumeUrl?: string;
        scheduledFor?: string;
        interviewerName?: string;
        interviewerEmail?: string;
        stepInterviewerName?: string;
        stepInterviewerEmail?: string;
        stepInterviewerId?: number;
        photoUrl?: string;
        pipelineStepId?: number;
      }
    >();

    const selectedSteps = pipelineSteps.filter(
      (step) => step.process_type === selectedType,
    );

    for (const step of selectedSteps) {
      for (const candidate of step.candidateApplications) {
        const normalizedPipelineStatus = normalizeStatusTag(candidate.pipelineStatus);
        if (!ACTIVE_PIPELINE_STATUSES.has(normalizedPipelineStatus)) {
          continue;
        }

        if (!candidatesById.has(candidate.id)) {
          const resolvedPipelineStepId = candidate.pipelineStepId
            ? candidate.pipelineStepId
            : Number.parseInt(step.id, 10);

          candidatesById.set(candidate.id, {
            id: candidate.id,
            name: candidate.name,
            department: candidate.department || "-",
            statusLabel: candidate.pipelineStatusLabel || candidate.statusLabel,
            pipelineStatus: normalizedPipelineStatus,
            resumeUrl: (candidate as { resumeUrl?: string }).resumeUrl,
            scheduledFor: candidate.scheduledFor,
            interviewerName:
              step.interviewerName || candidate.assignedInterviewerName,
            interviewerEmail:
              step.interviewerEmail || candidate.assignedInterviewerEmail,
            stepInterviewerName: step.interviewerName,
            stepInterviewerEmail: step.interviewerEmail,
            stepInterviewerId: step.interviewerId,
            photoUrl: (() => {
              const direct = resolvePhotoUrl(candidate.photoUrl);
              if (direct) return direct;

              // Try to derive from the application form snapshot (common fields)
              const snapshot = (candidate as any).applicationFormSnapshot || (candidate as any).application_form_snapshot || {};
              const personal = snapshot.personal_info || {};

              const candidatesrcs = [
                personal.photo,
                personal.avatar,
                personal.photo2x2,
                personal.photo_2x2,
                snapshot.photo,
                snapshot.avatar,
              ];

              for (const s of candidatesrcs) {
                if (typeof s === 'string' && s.trim()) {
                  const resolved = resolvePhotoUrl(s);
                  if (resolved) return resolved;
                }
              }

              return undefined;
            })(),
            pipelineStepId: Number.isNaN(resolvedPipelineStepId)
              ? undefined
              : resolvedPipelineStepId,
          });
        }
      }
    }

    return Array.from(candidatesById.values())
      .filter((candidate) => {
        const loweredSearch = searchTerm.toLowerCase();
        return (
          candidate.name.toLowerCase().includes(loweredSearch) ||
          String(candidate.id).toLowerCase().includes(loweredSearch)
        );
      })
      .sort((left, right) => left.id - right.id);
  }, [pipelineSteps, selectedType, searchTerm]);

  const visibleStepCandidates = useMemo(
    () =>
      selectedStepCandidates.filter(
        (candidate) => !pendingCandidateIds.has(candidate.id),
      ),
    [pendingCandidateIds, selectedStepCandidates],
  );

  const resolvedJobTitle =
    jobDetail?.job_title ||
    formatJobTitle(jobId);

  const handleTypeChange = (nextType: string) => {
    setSearchParams({ type: nextType });
  };

  // Preonboarding helper functions
  const openPreOnboardingTemplateModal = () => {
    if (preonboardingTemplateData?.requirements?.length) {
      setPreOnboardingTemplateItems(
        preonboardingTemplateData.requirements.map((r, i) => ({ ...r, order: r.order ?? i })),
      );
    } else {
      setPreOnboardingTemplateItems(
        STANDARD_PREONBOARDING_REQUIREMENTS.map((r, i) => ({
          key: `req-${i}`,
          label: r.label,
          required: r.required,
          order: i,
        })),
      );
    }
    setShowPreOnboardingTemplateModal(true);
  };

  const addPreOnboardingTemplateItem = () => {
    if (!newPreOnboardingTemplateItem.trim()) return;
    const key = `req-${Date.now()}`;
    setPreOnboardingTemplateItems([
      ...preOnboardingTemplateItems,
      { key, label: newPreOnboardingTemplateItem.trim(), required: true, order: preOnboardingTemplateItems.length },
    ]);
    setNewPreOnboardingTemplateItem("");
  };

  const removePreOnboardingTemplateItem = (key: string) => {
    setPreOnboardingTemplateItems(preOnboardingTemplateItems.filter((t) => t.key !== key));
  };

  const togglePreOnboardingTemplateRequired = (key: string) => {
    setPreOnboardingTemplateItems(
      preOnboardingTemplateItems.map((t) => (t.key === key ? { ...t, required: !t.required } : t)),
    );
  };

  const openPreOnboardingCandidateModal = async (candidate: PreonboardingCandidate) => {
    setSelectedPreOnboardingCandidateId(candidate.id);
    try {
      const res = await axiosPrivate.get(`/api/candidate/preonboarding/candidates/${candidate.id}/requirements/`);
      const data = res.data;
      const items: TemplateItem[] = (data.requirements || []).map((r: RequirementItem, i: number) => ({
        key: r.requirement_key,
        label: r.requirement_label,
        required: r.required,
        order: i,
        file_url: r.file_url,
        filename: r.filename,
        status: r.status,
      }));
      setPreOnboardingCandidateItems(
        items.length
          ? items
          : STANDARD_PREONBOARDING_REQUIREMENTS.map((r, i) => ({
              key: `req-${i}`,
              label: r.label,
              required: r.required,
              order: i,
            })),
      );
    } catch {
      setPreOnboardingCandidateItems(
        STANDARD_PREONBOARDING_REQUIREMENTS.map((r, i) => ({
          key: `req-${i}`,
          label: r.label,
          required: r.required,
          order: i,
        })),
      );
    }
    setShowPreOnboardingCandidateModal(true);
  };

  const addPreOnboardingCandidateItem = () => {
    if (!newPreOnboardingCandidateItem.trim()) return;
    const key = `req-${Date.now()}`;
    setPreOnboardingCandidateItems([
      ...preOnboardingCandidateItems,
      { key, label: newPreOnboardingCandidateItem.trim(), required: true, order: preOnboardingCandidateItems.length },
    ]);
    setNewPreOnboardingCandidateItem("");
  };

  const removePreOnboardingCandidateItem = (key: string) => {
    setPreOnboardingCandidateItems(preOnboardingCandidateItems.filter((t) => t.key !== key));
  };

  const togglePreOnboardingCandidateRequired = (key: string) => {
    setPreOnboardingCandidateItems(
      preOnboardingCandidateItems.map((t) => (t.key === key ? { ...t, required: !t.required } : t)),
    );
  };

  const handleOpenStatusPage = () => {
    if (!jobId) {
      return;
    }

    const nextParams = new URLSearchParams();
    nextParams.set("type", selectedType);

    if (searchTerm.trim().length > 0) {
      nextParams.set("q", searchTerm);
    }

    navigate(`/job/${jobId}/applicants/status?${nextParams.toString()}`);
  };


  const isCandidateProgressActionDisabled = useCallback(
    (candidate: { id: number | string; stepInterviewerId?: number }) => {
      const candidateId =
        typeof candidate.id === "number"
          ? candidate.id
          : Number.parseInt(candidate.id, 10);

      if (Number.isNaN(candidateId)) {
        return true;
      }

      if (processingId !== null) {
        return true;
      }

      if (!candidate.stepInterviewerId) {
        return true;
      }

      return user?.id !== candidate.stepInterviewerId;
    },
    [processingId, user?.id],
  );

  const handleCandidateProgress = (
    candidateApplicationId: number,
    candidateName: string,
    pipelineStepId: number | undefined,
    outcome: "pass" | "fail",
  ) => {
    if (!pipelineStepId || Number.isNaN(pipelineStepId)) {
      return;
    }

    queueAction({
      candidateName,
      label: outcome === "pass" ? "Pass" : "Fail",
      dedupKey: `progress-${candidateApplicationId}-${pipelineStepId}`,
      candidateId: candidateApplicationId,
      onCommit: async () => {
        try {
          await axiosPrivate.post("/api/candidate/pipeline/progress/", {
            candidate_application_id: candidateApplicationId,
            pipeline_step_id: pipelineStepId,
            outcome,
          });
          toast.success(
            `${candidateName} marked as ${outcome === "pass" ? "Pass" : "Fail"}.`,
          );
          await refetch();
        } catch (error) {
          console.error("Unable to update candidate pipeline progress.", error);
          toast.error("Unable to submit candidate progress update.");
          await refetch();
        }
      },
    });
  };

  const handleCandidateShortlist = (
    candidateApplicationId: number,
    candidateName: string,
    pipelineStepId: number | undefined,
  ) => {
    if (!pipelineStepId || Number.isNaN(pipelineStepId)) {
      return;
    }

    queueAction({
      candidateName,
      label: "Shortlist",
      dedupKey: `shortlist-${candidateApplicationId}-${pipelineStepId}`,
      candidateId: candidateApplicationId,
      onCommit: async () => {
        try {
          await axiosPrivate.post("/api/candidate/pipeline/shortlist/", {
            candidate_application_id: candidateApplicationId,
            pipeline_step_id: pipelineStepId,
          });
          toast.success("Candidate shortlisted successfully.");
          await refetch();
        } catch {
          toast.error("Failed to shortlist candidate.");
        }
      },
    });
  };

  const handleOpenScheduleModal = (
    candidate: {
      id: number;
      name: string;
      pipelineStepId?: number;
      scheduledFor?: string;
      interviewerName?: string;
      interviewerEmail?: string;
    },
    jobTitle?: string,
  ) => {
    if (!candidate.pipelineStepId) {
      toast.error("Unable to schedule interview: pipeline step not found.");
      return;
    }

    const mode: "set" | "reschedule" = candidate.scheduledFor ? "reschedule" : "set";
    setScheduleModalState({
      open: true,
      candidateApplicationId: candidate.id,
      candidateName: candidate.name,
      pipelineStepId: candidate.pipelineStepId,
      mode,
      existingSchedule: candidate.scheduledFor,
      jobTitle,
    });

    setScheduleForm(
      createDefaultScheduleForm(
        candidate.name,
        candidate.scheduledFor,
        candidate.interviewerName,
        mode,
        jobTitle,
      ),
    );
  };

  const handleOpenInterviewEvaluationForm = (
    candidate: {
      id: number;
      name: string;
      pipelineStepId?: number;
      scheduledFor?: string;
      interviewerName?: string;
      interviewerEmail?: string;
      stepInterviewerId?: number;
    },
    jobTitle?: string,
  ) => {
    if (!candidate.pipelineStepId) {
      toast.error("Unable to open interview evaluation form: pipeline step not found.");
      return;
    }

    // Navigate to a bookmarkable interview-specific IEF route; still pass state for perf
    navigate(
      `/job/${jobId}/applicants/${candidate.id}/interviews/${candidate.pipelineStepId}/ief`,
      {
        state: {
          candidateApplicationId: candidate.id,
          candidateName: candidate.name,
          pipelineStepId: candidate.pipelineStepId,
          scheduledFor: candidate.scheduledFor,
          interviewerName: candidate.interviewerName,
          interviewerEmail: candidate.interviewerEmail,
          interviewerId: candidate.stepInterviewerId,
          jobTitle,
        },
      },
    );
  };

  const getResumePreviewUrl = (candidate: { resumeUrl?: string }): string | undefined => {
    const rawUrl = candidate.resumeUrl;
    if (!rawUrl) return undefined;
    if (/^(?:https?:\/\/|data:|blob:)/i.test(rawUrl)) return rawUrl;
    const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
    if (!backendBaseUrl) return rawUrl;
    const trimmedBaseUrl = backendBaseUrl.replace(/\/$/, "");
    const normalizedPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
    return `${trimmedBaseUrl}${normalizedPath}`;
  };

  const getResumeFileExt = (candidate: { resumeUrl?: string }): string | null => {
    const url = candidate.resumeUrl;
    if (!url) return null;
    const filename = url.split("/").pop()?.split("?")[0] || "";
    const ext = filename.split(".").pop() || "";
    return ext.toLowerCase() || null;
  };

  const handleOpenResumePreview = (candidate: { id: number; name: string; resumeUrl?: string }) => {
    setResumePreviewCandidate(candidate);
  };

  const handleDownloadResume = (candidate: { resumeUrl?: string; id: number }) => {
    const rawUrl = candidate.resumeUrl;
    if (!rawUrl) return;
    let resumeUrl: string;
    if (/^(?:https?:\/\/|data:|blob:)/i.test(rawUrl)) {
      resumeUrl = rawUrl;
    } else {
      const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
      const trimmedBaseUrl = (backendBaseUrl || "").replace(/\/$/, "");
      const normalizedPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
      resumeUrl = `${trimmedBaseUrl}${normalizedPath}`;
    }

    (async () => {
      try {
        const resp = await fetch(resumeUrl, { mode: "cors" });
        if (!resp.ok) throw new Error("Fetch failed");
        const blob = await resp.blob();
        const filename = (resumeUrl.split("/").pop() || `resume-${candidate.id}`).split("?")[0];
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || "resume";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch {
        const a = document.createElement("a");
        a.href = resumeUrl;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.click();
      }
    })();
  };

  // Load candidate assessments via useQuery when assessment stage is active
  const candidateIdsKey = useMemo(
    () => selectedStepCandidates.map((c) => c.id).join(","),
    [selectedStepCandidates],
  );

  useQuery({
    queryKey: [
      "candidate-assessments",
      selectedType,
      candidateIdsKey,
    ] as const,
    queryFn: async () => {
      if (!isAssessmentStage && !isInterviewWithAssessments && !isResumeWithAssessments) {
        return;
      }

      if (selectedStepCandidates.length === 0) {
        return;
      }

      const assessmentMap = new Map<number, CandidateAssessmentData[]>();

      for (const candidate of selectedStepCandidates) {
        try {
          const response = await axiosPrivate.get("/api/candidate/assessments/", {
            params: {
              candidate_application_id: candidate.id,
              pipeline_step_id: candidate.pipelineStepId,
            },
          });

          const items = Array.isArray(response.data) ? response.data : [];
          assessmentMap.set(candidate.id, items.map((a: any) => ({
            id: a.id,
            status: a.status || "not_assigned",
            score: a.score,
            notes: a.notes,
            assessmentId: a.assessment?.id,
            assessmentName: a.assessment?.name,
          })));
        } catch {
          assessmentMap.set(candidate.id, []);
        }
      }

      setCandidateAssessments(assessmentMap);
    },
    enabled: (isAssessmentStage || isInterviewWithAssessments || isResumeWithAssessments) && selectedStepCandidates.length > 0,
  });

  const handleOpenAssessmentModal = (
    candidate: { id: number; name: string; pipelineStepId?: number },
    mode: "preview" | "grade",
    assessmentId?: number,
    candidateAssessmentId?: number,
  ) => {
    if (!candidate.pipelineStepId) {
      toast.error("Pipeline step not found.");
      return;
    }

    if (mode === "preview" && stepAssessments.length === 0) {
      toast.error("No assessments configured for this pipeline step.");
      return;
    }

    const targetAssessment = assessmentId
      ? stepAssessments.find((a) => a.id === assessmentId)
      : stepAssessments[0];

    if (!targetAssessment && mode === "preview") {
      toast.error("Assessment not found.");
      return;
    }

    setAssessmentModalState({
      open: true,
      candidateApplicationId: candidate.id,
      candidateName: candidate.name,
      pipelineStepId: candidate.pipelineStepId,
      candidateAssessmentId: candidateAssessmentId,
      mode,
      assessment: targetAssessment
        ? {
            id: targetAssessment.id,
            type_label: targetAssessment.type_label,
            type: targetAssessment.type,
            file: targetAssessment.file
              ? {
                  filename: targetAssessment.file.filename,
                  file: targetAssessment.file.file,
                }
              : undefined,
          }
        : undefined,
    });
    setIsPreviewLoading(true);

    if (mode === "grade" && candidateAssessmentId) {
      const candidateAssessmentsList = candidateAssessments.get(candidate.id) || [];
      const found = candidateAssessmentsList.find((a) => a.id === candidateAssessmentId);
      if (found) {
        setAssessmentGradeForm({
          score: String(found.score ?? ""),
          notes: found.notes ?? "",
        });
      }
    }
  };

  const handleCloseAssessmentModal = () => {
    setAssessmentModalState((prev) => ({ ...prev, open: false }));
    setAssessmentGradeForm({ score: "", notes: "" });
    setIsSubmittingGrade(false);
  };

  const handleSubmitGrade = async () => {
    if (!assessmentModalState.candidateAssessmentId || !assessmentGradeForm.score) {
      toast.error("Please enter a score.");
      return;
    }

    setIsSubmittingGrade(true);
    try {
      await axiosPrivate.patch(
        `/api/candidate/assessments/${assessmentModalState.candidateAssessmentId}/`,
        {
          score: Number(assessmentGradeForm.score),
          notes: assessmentGradeForm.notes,
        },
      );

      toast.success(`Assessment graded for ${assessmentModalState.candidateName}.`);
      handleCloseAssessmentModal();
      await queryClient.invalidateQueries({ queryKey: ["candidate-assessments"] });
    } catch (error) {
      console.error("Failed to submit grade:", error);
      toast.error("Unable to submit grade.");
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  const handleViewAssessment = (candidate: { id: number; pipelineStepId?: number }) => {
    if (!jobId) return;
    navigate(`/job/${jobId}/exam-form/${candidate.id}?pipelineStepId=${candidate.pipelineStepId ?? ''}`);
  };

  const handleOpenSendAssessmentModal = (
    candidate: { id: number; name: string; pipelineStepId?: number },
  ) => {
    if (!candidate.pipelineStepId) {
      toast.error("Pipeline step not found.");
      return;
    }

    if (stepAssessments.length === 0) {
      toast.error("No assessments configured for this pipeline step.");
      return;
    }

    const interviewerFullName = user
      ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email
      : "";
    const interviewerRoleLabel = user?.role
      ? user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "";
    const companyName = user?.company?.name || "";

    const signatureBlock = [interviewerFullName, interviewerRoleLabel, companyName]
      .filter(Boolean)
      .join("\n");

    setSendAssessmentModalState({
      open: true,
      candidateApplicationId: candidate.id,
      candidateName: candidate.name,
      pipelineStepId: candidate.pipelineStepId,
      subject: `Assessment - ${resolvedJobTitle || "Job Application"}`,
      body: `Hello ${candidate.name},\n\nPlease find attached the assessment materials for your application.\n\nPlease complete and submit them at your earliest convenience.\n\nThank you.\n\nBest regards,\n${signatureBlock}`,
    });
    setSendPreview(null);
  };

  const handleCloseSendAssessmentModal = () => {
    setSendAssessmentModalState((prev) => ({ ...prev, open: false }));
    setSendPreview(null);
    setIsSendPreviewOpen(false);
  };

  const handleSendPreview = async () => {
    const assessmentIds = stepAssessments.map((a) => a.id).filter(Boolean);
    if (assessmentIds.length === 0) {
      toast.error("No assessments to send.");
      return;
    }

    setIsLoadingSendPreview(true);
    try {
      const response = await axiosPrivate.post("/api/candidate/assessments/send/preview/", {
        assessment_ids: assessmentIds,
        candidate_application_id: sendAssessmentModalState.candidateApplicationId,
        pipeline_step_id: sendAssessmentModalState.pipelineStepId,
        subject: sendAssessmentModalState.subject,
        body: sendAssessmentModalState.body,
      });
      setSendPreview(response.data);
      setIsSendPreviewOpen(true);
    } catch (error) {
      console.error("Failed to generate preview:", error);
      toast.error("Unable to generate email preview.");
    } finally {
      setIsLoadingSendPreview(false);
    }
  };

  const handleSendAssessment = () => {
    const assessmentIds = stepAssessments.map((a) => a.id).filter(Boolean);
    if (assessmentIds.length === 0) {
      toast.error("No assessments to send.");
      return;
    }

    const candidateAppId = sendAssessmentModalState.candidateApplicationId;
    const stepId = sendAssessmentModalState.pipelineStepId;
    const subject = sendAssessmentModalState.subject;
    const body = sendAssessmentModalState.body;
    const candidateName = sendAssessmentModalState.candidateName;

    handleCloseSendAssessmentModal();

    queueAction({
      candidateName,
      label: "Send Assessment",
      onCommit: async () => {
        try {
          await axiosPrivate.post("/api/candidate/assessments/send/", {
            assessment_ids: assessmentIds,
            candidate_application_id: candidateAppId,
            pipeline_step_id: stepId,
            subject,
            body,
          });
          toast.success(`Assessment email sent to ${candidateName}.`);
          await queryClient.invalidateQueries({ queryKey: ["candidate-assessments"] });
        } catch (error) {
          console.error("Failed to send assessment:", error);
          toast.error("Unable to send assessment email.");
        }
      },
    });
  };

  const getAssessmentStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; className: string }
    > = {
      not_assigned: { label: "Not Assigned", className: "border-gray-300 text-gray-600" },
      assigned: { label: "Assigned", className: "border-yellow-400 text-yellow-700" },
      sent: { label: "Sent", className: "border-blue-400 text-blue-700" },
      submitted: { label: "Submitted", className: "border-blue-400 text-blue-700" },
      graded: { label: "Graded", className: "border-green-500 text-green-600" },
      partially_graded: { label: "Partially Graded", className: "border-amber-400 text-amber-700" },
    };

    const config = statusConfig[status] || statusConfig.not_assigned;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleCloseScheduleModal = () => {
    if (isSavingSchedule) {
      return;
    }

    setScheduleModalState((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const handleScheduleInputChange = (
    field: keyof InterviewScheduleFormState,
    value: string,
  ) => {
    setScheduleForm((previous) => {
      const updated = { ...previous, [field]: value };

      // If user edits the subject directly, mark it as manually edited
      if (field === "subject") {
        subjectEditedRef.current = true;
        return updated;
      }

      // If setup-related fields changed, update subject (unless user edited it)
      if (
        field === "interviewSetup" ||
        field === "meetingAddress" ||
        field === "meetingPlatform" ||
        field === "meetingLink" ||
        field === "meetingLinkName"
      ) {
        if (!subjectEditedRef.current) {
          const activeSetup = (field === "interviewSetup" ? value : previous.interviewSetup) as
            InterviewScheduleFormState["interviewSetup"];
          const selectedTemplate = emailTemplates.find(
            (template) => String(template.id) === String(previous.emailTemplateId),
          );

          updated.subject = selectedTemplate?.subject
            ? renderTemplate(selectedTemplate.subject ?? "", { ...updated, subject: "" }, scheduleModalState) ||
              buildDefaultInterviewSubject(scheduleModalState.mode, activeSetup, scheduleModalState.jobTitle)
            : buildDefaultInterviewSubject(scheduleModalState.mode, activeSetup, scheduleModalState.jobTitle);
        }

        // Do not modify templateBody here; setup details are appended only in previews/sent emails
      }

      return updated;
    });
  };

  const [emailTemplates, setEmailTemplates] = useState<Array<any>>([]);

  useEffect(() => {
    let mounted = true;

    const loadTemplates = async () => {
      try {
        const resp = await emailTemplateService.listResponse({ page: 1, pageSize: 50 });
        const items = Array.isArray(resp) ? resp : resp?.results ?? [];
        if (mounted) setEmailTemplates(items);
      } catch (err) {
        // non-blocking
        console.debug("Unable to load email templates", err);
      }
    };

    void loadTemplates();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmitSchedule = async () => {
    const scheduledFor = buildIsoDateTime(
      scheduleForm.scheduledDate,
      scheduleForm.scheduledTime,
    );

    if (!scheduledFor) {
      toast.error("Please provide a valid interview date and time.");
      return;
    }

    setIsSavingSchedule(true);

    try {
      const payload = {
        candidate_application_id: scheduleModalState.candidateApplicationId,
        pipeline_step_id: scheduleModalState.pipelineStepId,
        scheduled_for: scheduledFor,
        remarks: scheduleForm.templateBody,
        schedule_details: {
          duration: scheduleForm.duration,
          subject: scheduleForm.subject,
          interviewer_names: scheduleForm.interviewerNames,
          interview_setup: scheduleForm.interviewSetup,
          meeting_platform: scheduleForm.meetingPlatform,
          meeting_link: scheduleForm.meetingLink,
          meeting_link_name: scheduleForm.meetingLinkName,
          meeting_address: scheduleForm.meetingAddress,
          reschedule_reason: scheduleForm.rescheduleReason,
          template_body: scheduleForm.templateBody,
          email_template_id: scheduleForm.emailTemplateId ?? null,
        },
      };

      await axiosPrivate.post("/api/candidate/pipeline/schedule/", payload);

      toast.success(
        scheduleModalState.mode === "reschedule"
          ? "Interview rescheduled and notifications sent."
          : "Interview scheduled and notifications sent.",
      );

      handleCloseScheduleModal();
      await refetch();
    } catch (error) {
      console.error("Unable to save interview schedule.", error);
      toast.error("Unable to save interview schedule.");
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleOpenEmailPreview = async () => {
    const scheduledFor = buildIsoDateTime(
      scheduleForm.scheduledDate,
      scheduleForm.scheduledTime,
    );

    if (!scheduledFor) {
      toast.error("Please provide a valid interview date and time.");
      return;
    }

    setIsLoadingEmailPreview(true);

    try {
      const payload = {
        candidate_application_id: scheduleModalState.candidateApplicationId,
        pipeline_step_id: scheduleModalState.pipelineStepId,
        scheduled_for: scheduledFor,
        schedule_details: {
          duration: scheduleForm.duration,
          subject: scheduleForm.subject,
          interviewer_names: scheduleForm.interviewerNames,
          interview_setup: scheduleForm.interviewSetup,
          meeting_platform: scheduleForm.meetingPlatform,
          meeting_link: scheduleForm.meetingLink,
          meeting_link_name: scheduleForm.meetingLinkName,
          meeting_address: scheduleForm.meetingAddress,
          reschedule_reason: scheduleForm.rescheduleReason,
          template_body: scheduleForm.templateBody,
          email_template_id: scheduleForm.emailTemplateId ?? null,
        },
      };

      const response = await axiosPrivate.post<InterviewEmailPreviewResponse>(
        "/api/candidate/pipeline/schedule/preview/",
        payload,
      );
      setEmailPreview(response.data);
      setIsEmailPreviewOpen(true);
    } catch (error) {
      console.error("Unable to generate interview email preview.", error);
      toast.error("Unable to generate interview email preview.");
    } finally {
      setIsLoadingEmailPreview(false);
    }
  };

  const getStatusBadgeClassName = (pipelineStatus: string) => {
    if (pipelineStatus === "scheduled") {
      return "border-yellow-400 text-yellow-700";
    }

    if (pipelineStatus === "failed") {
      return "border-red-500 text-red-600";
    }

    if (pipelineStatus === "passed") {
      return "border-green-500 text-green-600";
    }

    return "border-gray-300 text-gray-600";
  };

  const jobNonNegotiables = useMemo(() => {
    const nv = (jobDetail as any)?.non_negotiable?.non_negotiable
      ?? (jobDetail as any)?.application_form?.non_negotiable?.non_negotiable
      ?? (jobDetail as any)?.non_negotiable
      ?? [];
    return Array.isArray(nv) ? nv : [];
  }, [jobDetail]);

  const isFirstPipelineStep = useMemo(() => {
    return pipelineSteps.length > 0 && selectedType === pipelineSteps[0].process_type;
  }, [pipelineSteps, selectedType]);

  const showNonNegotiableColumn = useMemo(() => {
    return jobNonNegotiables.length > 0 && isFirstPipelineStep;
  }, [jobNonNegotiables, isFirstPipelineStep]);

  const candidateNonNegotiableMap = useMemo(() => {
    const buildSubmissionValues = (snapshot: any) => {
      if (!snapshot || typeof snapshot !== 'object') return {};

      const personal_info = snapshot.personal_info || {};
      const job_details = snapshot.job_details || {};
      const education_work = snapshot.education_work || {};
      const acknowledgement = snapshot.acknowledgement || {};

      const values: Record<string, any> = {
        first_name: personal_info.firstName || personal_info.first_name || '',
        last_name: personal_info.lastName || personal_info.last_name || '',
        gender: personal_info.gender,
        primary_contact_number: personal_info.primaryContact || personal_info.primary_contact_number,
        secondary_contact_number: personal_info.secondaryContact || personal_info.secondary_contact_number,
        email: personal_info.email,
        linkedin_profile: personal_info.linkedinProfile || personal_info.linkedin_profile,
        address: personal_info.addressLine1 || personal_info.address,
        expected_salary: job_details.expectedSalary ?? job_details.expected_salary,
        willing_to_work_onsite: job_details.willingToWorkOnsite ?? job_details.willing_to_work_onsite,
        preferred_interview_schedule: job_details.interviewSchedule ?? job_details.preferred_interview_schedule,
        education_attained: education_work.highestEducation ?? education_work.education_attained,
        year_graduated: education_work.yearGraduated ?? education_work.year_graduated,
        university: education_work.institution ?? education_work.university,
        course: education_work.program ?? education_work.course,
        work_experience: education_work.workExperience ?? education_work.work_experience,
        how_did_you_hear_about_us: acknowledgement.howDidYouLearn ?? acknowledgement.how_did_you_hear_about_us,
        agreement: acknowledgement.certificationAccepted ?? acknowledgement.agreement,
        signature: acknowledgement.signature,
      };

      if (snapshot.questionnaire_answers && typeof snapshot.questionnaire_answers === 'object') {
        Object.assign(values, snapshot.questionnaire_answers);
      }

      return values;
    };

    const evaluateRule = (actual: any, expected: any, operator?: string) => {
      const normOp = (operator || '').toString().trim().toUpperCase();

      const coerceBool = (v: any) => {
        if (typeof v === 'boolean') return v;
        if (typeof v === 'string') {
          const s = v.trim().toLowerCase();
          if (['true','1','yes','y','on'].includes(s)) return true;
          if (['false','0','no','n','off'].includes(s)) return false;
        }
        if (typeof v === 'number') return v === 1;
        return null;
      };

      if (['GREATER_THAN','>'].includes(normOp)) {
        const a = Number(actual); const b = Number(expected); return !Number.isNaN(a) && !Number.isNaN(b) && a > b;
      }
      if (['LESS_THAN','<'].includes(normOp)) {
        const a = Number(actual); const b = Number(expected); return !Number.isNaN(a) && !Number.isNaN(b) && a < b;
      }
      if (['NOT_EQUALS','!='].includes(normOp)) {
        return String(actual).trim().toLowerCase() !== String(expected).trim().toLowerCase();
      }

      const boolA = coerceBool(actual);
      const boolB = coerceBool(expected);
      if (boolA !== null && boolB !== null) return boolA === boolB;

      if (Array.isArray(actual) && Array.isArray(expected)) {
        return expected.every((val: any) => actual.includes(val));
      }

      return String(actual ?? '').trim().toLowerCase() === String(expected ?? '').toString().trim().toLowerCase();
    };

    const map = new Map<number, any[]>();
    for (const step of pipelineSteps) {
      for (const candidate of step.candidateApplications) {
        const id = candidate.id as number;
        const snapshot = (candidate as any).applicationFormSnapshot || {};
        const values = buildSubmissionValues(snapshot);

        const mismatches: any[] = [];
        for (const rule of jobNonNegotiables) {
          const field = rule?.field;
          if (!field) continue;
          if (field === 'expected_salary') continue;

          const expected = rule?.value;
          const operator = rule?.operator;
          const actual = values[field];

          const passed = evaluateRule(actual, expected, operator);
          if (!passed) {
            mismatches.push({ field, expected, actual, operator });
          }
        }

        if (mismatches.length > 0) map.set(id, mismatches);
      }
    }

    return map;
  }, [pipelineSteps, jobNonNegotiables]);

  const interviewTableColumnCount = (isInterviewScheduleStage ? 6 + (isInterviewWithAssessments ? 1 : 0) : isPassFailStage ? 5 : isAssessmentStage || isResumeWithAssessments ? 5 : 5) + (showNonNegotiableColumn ? 1 : 0) + (showResumeColumn ? 1 : 0);

  return (
    <>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate(`/job/${jobId}`)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {resolvedJobTitle}
              </h1>
            </div>
            <Badge variant="outline" className="w-fit">
              {selectedTypeLabel}
            </Badge>
          </div>

          <div className="rounded-md border bg-white p-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                  <Select
                    value={processTypes.length > 0 ? selectedType : undefined}
                    onValueChange={handleTypeChange}
                    disabled={processTypes.length === 0}
                  >
                    <SelectTrigger className="w-full sm:w-75">
                      <SelectValue placeholder="Select stage type" />
                    </SelectTrigger>
                    <SelectContent>
                      {processTypes.map((processType) => (
                        <SelectItem key={processType} value={processType}>
                          {getProcessTypeLabel(processType)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleOpenStatusPage}
                    disabled={processTypes.length === 0 || !jobId}
                  >
                    <BarChart3 className="h-4 w-4" />
                    View status page
                  </Button>
                </div>

              <div className="relative w-full sm:w-65">
                <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by candidate id"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {isLoading && (
              <div className="text-sm text-gray-500">Loading pipeline applicants...</div>
            )}

            {isError && (
              <div className="text-sm text-red-600">
                Unable to load applicants for this pipeline stage.
              </div>
            )}

            {!isLoading && !isError && processTypes.length === 0 && (
              <div className="text-sm text-gray-500">
                No pipeline stages are configured for this job.
              </div>
            )}

            {!isLoading && !isError && processTypes.length > 0 && (
              selectedType === "resume_screening" && !isResumeWithAssessments ? (
                <ResumeScreeningTable
                  candidates={selectedStepCandidates}
                  isPassFailDisabled={isCandidateProgressActionDisabled}
                  onPass={(candidate) =>
                    handleCandidateProgress(
                      Number(candidate.id),
                      candidate.name,
                      candidate.pipelineStepId,
                      "pass",
                    )
                  }
                  onShortlist={(candidate) =>
                    void handleCandidateShortlist(
                      Number(candidate.id),
                      candidate.name,
                      candidate.pipelineStepId,
                    )
                  }
                  onFail={(candidate) =>
                    handleCandidateProgress(
                      Number(candidate.id),
                      candidate.name,
                      candidate.pipelineStepId,
                      "fail",
                    )
                  }
                />
              ) : selectedType === "pre_onboarding" ? (
                <div className="mt-4 rounded-md border bg-white overflow-x-auto w-full">
                  <div className="p-4 border-b flex items-center justify-end gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={openPreOnboardingTemplateModal}
                      disabled={!preonboardingPipelineStep || !isPreonboardingInterviewer}
                      title={!isPreonboardingInterviewer ? "Only the assigned interviewer can configure the template." : undefined}
                    >
                      <Settings className="h-4 w-4" />
                      Configure Global Template
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20 text-center">ID</TableHead>
                        <TableHead className="w-48">Full Name</TableHead>
                        <TableHead className="w-48">Position</TableHead>
                        <TableHead className="w-40 text-center">Signed Offer</TableHead>
                        <TableHead className="w-40 text-center">Documents</TableHead>
                        <TableHead className="w-56 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preonboardingCandidatesLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : preonboardingCandidates.filter((a) =>
                        a.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No applicants found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        preonboardingCandidates
                          .filter((a) =>
                            a.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((applicant) => {
                            const canPass =
                              applicant.signed_offer_uploaded &&
                              applicant.requirements_required_submitted === applicant.requirements_required;
                            return (
                              <TableRow key={applicant.id}>
                                <TableCell className="text-center">{applicant.id}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={resolvePhotoUrl(applicant.photo_url) || undefined} />
                                      <AvatarFallback>
                                        {applicant.candidate_name?.split(" ").map((n) => n[0]).join("") || "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm">{applicant.candidate_name}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{applicant.job_title}</TableCell>
                                <TableCell className="text-center">
                                  {applicant.signed_offer_uploaded ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-xs text-green-700">Uploaded</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-gray-400">Not uploaded</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-center align-top">
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-sm">
                                        {applicant.requirements_required_submitted}/{applicant.requirements_required}
                                      </span>
                                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1 max-w-[80px] mx-auto">
                                        <div
                                          className="bg-blue-600 h-2 rounded-full"
                                          style={{
                                            width: `${applicant.requirements_required > 0 ? (applicant.requirements_required_submitted / applicant.requirements_required) * 100 : 0}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="border-t pt-1.5 space-y-1">
                                      {[
                                        { url: applicant.resume_url, filename: applicant.resume_filename, label: "Resume" },
                                        { url: applicant.cover_letter_url, filename: applicant.cover_letter_filename, label: "Cover Letter" },
                                        { url: applicant.med_cert_url, filename: applicant.med_cert_filename, label: "Medical Cert" },
                                      ].map((doc) =>
                                        doc.url ? (
                                          <a
                                            key={doc.label}
                                            href={resolveFileUrl(doc.url ?? undefined)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 hover:underline justify-center"
                                          >
                                            <FileText className="h-3 w-3 shrink-0" />
                                            <span className="truncate max-w-[100px]">{doc.label}</span>
                                          </a>
                                        ) : null
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex gap-2 justify-center">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs"
                                      onClick={() => openPreOnboardingCandidateModal(applicant)}
                                      disabled={!isPreonboardingInterviewer}
                                      title={!isPreonboardingInterviewer ? "Only the assigned interviewer can configure." : undefined}
                                    >
                                      <Settings className="h-3 w-3 mr-1" />
                                      Config
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      disabled={!canPass || isPreonboardingProgressActionDisabled()}
                                      title={
                                        processingId !== null
                                          ? "Please wait for current action to complete."
                                          : !isPreonboardingInterviewer
                                          ? "Only the assigned interviewer can pass."
                                          : undefined
                                      }
                                      onClick={() => {
                                        handlePreonboardingPassFail(applicant.id, applicant.candidate_name, preonboardingPipelineStep?.id, "pass");
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Pass
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 border-red-300 hover:bg-red-50"
                                      disabled={isPreonboardingProgressActionDisabled()}
                                      title={
                                        processingId !== null
                                          ? "Please wait for current action to complete."
                                          : !isPreonboardingInterviewer
                                          ? "Only the assigned interviewer can fail."
                                          : undefined
                                      }
                                      onClick={() => {
                                        handlePreonboardingPassFail(applicant.id, applicant.candidate_name, preonboardingPipelineStep?.id, "fail");
                                      }}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Fail
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : selectedType === "onboarding" ? (
                <div className="mt-4 rounded-md border bg-white overflow-x-auto w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20 text-center">ID</TableHead>
                        <TableHead className="w-48">Full Name</TableHead>
                        <TableHead className="w-48">Position</TableHead>
                        <TableHead className="w-56 text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {onboardingCandidatesLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          </TableCell>
                        </TableRow>
                      ) : onboardingCandidates.filter((a) =>
                        a.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            No applicants found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        onboardingCandidates
                          .filter((a) =>
                            a.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((applicant) => (
                            <TableRow key={applicant.id}>
                              <TableCell className="text-center">{applicant.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={resolvePhotoUrl(applicant.photo_url) || undefined} />
                                    <AvatarFallback>
                                      {applicant.candidate_name?.split(" ").map((n) => n[0]).join("") || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-sm">{applicant.candidate_name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{applicant.job_title}</TableCell>
                              <TableCell className="text-center">
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  disabled={isOnboardingActionDisabled()}
                                  title={
                                    processingId !== null
                                      ? "Please wait for current action to complete."
                                      : !isOnboardingInterviewer
                                      ? "Only the assigned interviewer can send onboarding."
                                      : undefined
                                  }
                                  onClick={() => openOnboardingModal(applicant)}
                                >
                                  Send Onboarding
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : selectedType === "for_job_offer" ? (
                <JobOfferPipelineTable
                  pipelineSteps={pipelineSteps.filter((s) => s.process_type === "for_job_offer")}
                  jobOffers={jobOffers}
                  jobTitle={resolvedJobTitle}
                  onRefetch={refetch}
                  jobDetail={jobDetail}
                />
              ) : (
              <div className="mt-4 rounded-md border bg-white overflow-x-auto w-full">
                <Table className="w-full table-fixed text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-16 border border-gray-200 py-2 px-3 text-xs lg:text-sm lg:py-3 lg:px-4">
                        ID Number
                      </TableHead>
                      <TableHead className="text-center border border-gray-200 py-2 px-3 w-36 text-xs whitespace-normal wrap-break-word lg:text-sm lg:py-3 lg:px-4">
                        Full Name
                      </TableHead>
                      {showResumeColumn ? (
                        <TableHead className="border border-gray-200 py-2 px-3 w-24 text-center text-xs whitespace-normal wrap-break-word lg:text-sm lg:py-3 lg:px-4">
                          Resume
                        </TableHead>
                      ) : null}

                      {isInterviewScheduleStage ? (
                        <>
                          <TableHead className="border border-gray-200 py-2 px-3 w-24 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            Set Schedule
                          </TableHead>
                          <TableHead className="border border-gray-200 py-2 px-3 w-24 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            Status
                          </TableHead>
                          <TableHead className="border border-gray-200 py-2 px-3 w-24 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            Interview Evaluation Form
                          </TableHead>
                          {isInterviewWithAssessments ? (
                            <TableHead className="border border-gray-200 py-2 px-3 w-36 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                              Actions
                            </TableHead>
                          ) : null}
                        </>
                      ) : isPassFailStage ? (
                        <>
                          <TableHead className="border border-gray-200 py-2 px-3 w-20 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            Pass
                          </TableHead>
                          <TableHead className="border border-gray-200 py-2 px-3 w-20 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            Fail
                          </TableHead>
                        </>
                      ) : isAssessmentStage || isResumeWithAssessments ? (
                        <>
                          <TableHead className="border border-gray-200 py-2 px-3 text-center text-xs lg:text-sm lg:py-3 lg:px-4 w-56">
                            Assessments
                          </TableHead>
                          <TableHead className="border border-gray-200 py-2 px-3 w-36 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            Actions
                          </TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="border border-gray-200 py-2 px-3 w-20 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            2x2
                            <br />
                            Picture
                          </TableHead>
                          <TableHead className="border border-gray-200 py-2 px-3 w-20 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            Status
                          </TableHead>
                        </>
                      )}

                      <TableHead className="text-center border border-gray-200 py-2 px-3 w-20 text-xs lg:text-sm lg:py-3 lg:px-4">
                        Department
                      </TableHead>

                      {showNonNegotiableColumn ? (
                        <TableHead className="border border-gray-200 py-2 px-3 w-28 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                          Non-Negotiable
                        </TableHead>
                      ) : null}

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleStepCandidates.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={interviewTableColumnCount}
                          className="border border-gray-200 p-6 lg:p-8 text-center text-gray-500 text-xs lg:text-sm"
                        >
                          No applicants found in this pipeline step.
                        </TableCell>
                      </TableRow>
                    ) : (
                      visibleStepCandidates.map((candidate) => (
                        <TableRow
                          key={candidate.id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="text-center border border-gray-200 py-3 px-3 font-medium text-xs lg:text-sm align-middle">
                            {String(candidate.id).padStart(3, "0")}
                          </TableCell>
                          <TableCell
                            className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 w-36 align-middle"
                            style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}
                          >
                            <Link
                              to={`/job/list/applicants/${candidate.id}`}
                              className="flex min-w-0 flex-col items-center justify-center gap-1 text-center lg:flex-row lg:gap-2 hover:opacity-80"
                            >
                              <Avatar className="h-10 w-10 shrink-0 rounded-sm">
                                <AvatarImage
                                  src={candidate.photoUrl || "/placeholder.svg"}
                                  className="object-cover"
                                />
                                <AvatarFallback className="text-xs lg:text-sm rounded-sm">
                                  {candidate.name
                                    .split(" ")
                                    .map((namePart) => namePart[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span
                                className="block min-w-0 max-w-full font-medium text-xs leading-tight whitespace-normal lg:text-sm"
                                style={{ overflowWrap: "anywhere" }}
                                title={candidate.name}
                              >
                                {candidate.name}
                              </span>
                            </Link>
                          </TableCell>

                          {showResumeColumn ? (
                            <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full px-2 text-xs lg:text-sm text-slate-700 border-slate-300 bg-white hover:bg-slate-900 hover:text-white"
                                onClick={() => handleOpenResumePreview(candidate)}
                              >
                                View Resume
                              </Button>
                            </TableCell>
                          ) : null}

                          {isInterviewScheduleStage ? (
                            <>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-yellow-600 border-yellow-500 bg-white hover:bg-yellow-500 hover:text-white"
                                  onClick={() => handleOpenScheduleModal(candidate, resolvedJobTitle)}
                                  disabled={
                                    isSavingSchedule ||
                                    !candidate.stepInterviewerId ||
                                    user?.id !== candidate.stepInterviewerId
                                  }
                                  title={
                                    !candidate.stepInterviewerId || user?.id !== candidate.stepInterviewerId
                                      ? 'Only the assigned interviewer can schedule or reschedule this initial interview.'
                                      : undefined
                                  }
                                >
                                  {candidate.scheduledFor ? "Reschedule" : "Set Schedule"}
                                </Button>
                                <p className="mt-1 text-[10px] text-gray-500">
                                  {formatDisplaySchedule(candidate.scheduledFor)}
                                </p>
                              </TableCell>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                <Badge
                                  variant="outline"
                                  className={getStatusBadgeClassName(candidate.pipelineStatus)}
                                >
                                  {candidate.statusLabel}
                                </Badge>
                              </TableCell>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-slate-700 border-slate-300 bg-white hover:bg-slate-900 hover:text-white"
                                  onClick={() =>
                                    handleOpenInterviewEvaluationForm(candidate, resolvedJobTitle)
                                  }
                                  disabled={!candidate.pipelineStepId}
                                >
                                  View
                                </Button>
                              </TableCell>
                              {isInterviewWithAssessments ? (
                                <TableCell className="border border-gray-200 py-3 px-2 text-center align-top">
                                  <div className="flex flex-col gap-1 overflow-x-auto min-w-32">
                                    {stepAssessments.map((sa) => {
                                      const candidateAssessment = (candidateAssessments.get(candidate.id) || []).find(
                                        (ca) => ca.assessmentId === sa.id
                                      );
                                      const status = candidateAssessment?.status || "not_assigned";
                                      const displayName = formatAssessmentType(sa.type);
                                      return (
                                        <div key={sa.id} className="flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-1 text-left shrink-0 min-w-0">
                                          <span className="text-xs font-medium text-gray-700 whitespace-nowrap shrink-0">{displayName}</span>
                                          <span className="text-[10px] text-gray-400 truncate shrink" title={sa.file?.filename || undefined}>
                                            {sa.file?.filename || ""}
                                          </span>
                                          <div className="flex-1" />
                                          {candidateAssessment ? (
                                            <Badge variant="outline" className="text-[10px] whitespace-nowrap px-1 py-0 h-5">
                                              {status === "graded" ? "Graded" : status === "submitted" ? "Submitted" : status === "sent" ? "Sent" : "Assigned"}
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="text-[10px] whitespace-nowrap px-1 py-0 h-5 border-gray-300 text-gray-500">Not Sent</Badge>
                                          )}
                                          <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                            {candidateAssessment?.score !== undefined && candidateAssessment?.score !== null
                                              ? `${candidateAssessment.score}/100`
                                              : ""}
                                          </span>
                                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 shrink-0"
                                            onClick={() => handleOpenAssessmentModal(candidate, "preview", sa.id)}>
                                            <FileText className="h-3 w-3 mr-1" />Preview
                                          </Button>
                                          {candidateAssessment && (
                                            <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 shrink-0"
                                              onClick={() => handleViewAssessment(candidate)}>View</Button>
                                          )}
                                          {status === "submitted" && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-6 text-[10px] px-2 text-blue-600 border-blue-500 bg-white hover:bg-blue-500 hover:text-white shrink-0"
                                              onClick={() =>
                                                handleOpenAssessmentModal(candidate, "grade", sa.id, candidateAssessment?.id)
                                              }
                                              disabled={!candidate.stepInterviewerId || user?.id !== candidate.stepInterviewerId}
                                              title={
                                                !candidate.stepInterviewerId || user?.id !== candidate.stepInterviewerId
                                                  ? 'Only the assigned interviewer can grade.'
                                                  : undefined
                                              }
                                            >
                                              Grade
                                            </Button>
                                          )}
                                        </div>
                                      );
                                    })}
                                    <div className="flex flex-col items-center gap-1.5 mt-1">
                                      <Button variant="outline" size="sm"
                                        className="w-full text-xs px-2 text-green-600 border-green-500 bg-white hover:bg-green-500 hover:text-white"
                                        onClick={() => handleOpenSendAssessmentModal(candidate)}
                                        disabled={candidate.pipelineStatus === "assessment_sent" || candidate.pipelineStatus === "assessment_partially_graded" || candidate.pipelineStatus === "assessment_graded" || !candidate.stepInterviewerId || user?.id !== candidate.stepInterviewerId}
                                      >
                                        Send
                                      </Button>
                                      <div className="flex gap-1">
                                        <Button variant="outline" size="sm"
                                          className="px-2 text-[10px] text-green-600 border-green-600 bg-white hover:bg-green-600 hover:text-white"
                                          disabled={candidate.pipelineStatus !== "assessment_graded" || isCandidateProgressActionDisabled(candidate)}
                                          onClick={() => handleCandidateProgress(candidate.id, candidate.name, candidate.pipelineStepId, "pass")}>
                                          Pass
                                        </Button>
                                        <Button variant="outline" size="sm"
                                          className="px-2 text-[10px] text-blue-600 border-blue-600 bg-white hover:bg-blue-600 hover:text-white"
                                          disabled={candidate.pipelineStatus !== "assessment_graded" || isCandidateProgressActionDisabled(candidate)}
                                          onClick={() => void handleCandidateShortlist(candidate.id, candidate.name, candidate.pipelineStepId)}>
                                          Shortlist
                                        </Button>
                                        <Button variant="outline" size="sm"
                                          className="px-2 text-[10px] text-red-600 border-red-600 bg-white hover:bg-red-600 hover:text-white"
                                          disabled={candidate.pipelineStatus !== "assessment_graded" || isCandidateProgressActionDisabled(candidate)}
                                          onClick={() => handleCandidateProgress(candidate.id, candidate.name, candidate.pipelineStepId, "fail")}>
                                          Fail
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                              ) : (
                                <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                  <div className="flex flex-col items-center gap-1.5">
                                    <div className="flex gap-1">
                                      <Button variant="outline" size="sm"
                                        className="px-2 text-[10px] text-green-600 border-green-600 bg-white hover:bg-green-600 hover:text-white"
                                        disabled={isCandidateProgressActionDisabled(candidate)}
                                        onClick={() => handleCandidateProgress(candidate.id, candidate.name, candidate.pipelineStepId, "pass")}>
                                        Pass
                                      </Button>
                                      <Button variant="outline" size="sm"
                                        className="px-2 text-[10px] text-blue-600 border-blue-600 bg-white hover:bg-blue-600 hover:text-white"
                                        disabled={isCandidateProgressActionDisabled(candidate)}
                                        onClick={() => void handleCandidateShortlist(candidate.id, candidate.name, candidate.pipelineStepId)}>
                                        Shortlist
                                      </Button>
                                      <Button variant="outline" size="sm"
                                        className="px-2 text-[10px] text-red-600 border-red-600 bg-white hover:bg-red-600 hover:text-white"
                                        disabled={isCandidateProgressActionDisabled(candidate)}
                                        onClick={() => handleCandidateProgress(candidate.id, candidate.name, candidate.pipelineStepId, "fail")}>
                                        Fail
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                              )}
                            </>
                          ) : isPassFailStage ? (
                            <>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="px-3 text-green-600 border-green-600 bg-white hover:bg-green-600 hover:text-white"
                                  disabled={isCandidateProgressActionDisabled(candidate)}
                                  onClick={() =>
                                    handleCandidateProgress(
                                      candidate.id,
                                      candidate.name,
                                      candidate.pipelineStepId,
                                      "pass",
                                    )
                                  }
                                >
                                  Pass
                                </Button>
                              </TableCell>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="px-3 text-red-600 border-red-600 bg-white hover:bg-red-600 hover:text-white"
                                  disabled={isCandidateProgressActionDisabled(candidate)}
                                  onClick={() =>
                                    handleCandidateProgress(
                                      candidate.id,
                                      candidate.name,
                                      candidate.pipelineStepId,
                                      "fail",
                                    )
                                  }
                                >
                                  Fail
                                </Button>
                              </TableCell>
                            </>
                          ) : isAssessmentStage || isResumeWithAssessments ? (
                            <>
                              <TableCell className="border border-gray-200 py-3 px-2 text-center align-top">
                                <div className="flex flex-col gap-1 overflow-x-auto">
                                  {stepAssessments.length === 0 ? (
                                    <div className="flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-1 text-left">
                                      <span className="text-xs text-gray-400">No assessments configured</span>
                                    </div>
                                  ) : (
                                    stepAssessments.map((sa) => {
                                      const candidateAssessment = (candidateAssessments.get(candidate.id) || []).find(
                                        (ca) => ca.assessmentId === sa.id
                                      );
                                      const status = candidateAssessment?.status || "not_assigned";
                                      const displayName = formatAssessmentType(sa.type);
                                      return (
                                        <div key={sa.id} className="flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-1 text-left shrink-0 min-w-0">
                                          <span className="text-xs font-medium text-gray-700 whitespace-nowrap shrink-0">
                                            {displayName}
                                          </span>
                                          <span className="text-[10px] text-gray-400 truncate shrink" title={sa.file?.filename || undefined}>
                                            {sa.file?.filename || ""}
                                          </span>
                                          <div className="flex-1" />
                                          {candidateAssessment ? getAssessmentStatusBadge(status) : (
                                            <Badge variant="outline" className="border-gray-300 text-gray-500 text-[10px] whitespace-nowrap">Not Sent</Badge>
                                          )}
                                          {candidateAssessment && (
                                            <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                              {candidateAssessment.score !== undefined && candidateAssessment.score !== null
                                                ? `${candidateAssessment.score}/100`
                                                : ""}
                                            </span>
                                          )}
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-6 text-[10px] px-2 shrink-0"
                                            onClick={() => handleOpenAssessmentModal(candidate, "preview", sa.id)}
                                          >
                                            <FileText className="h-3 w-3 mr-1" />
                                            Preview
                                          </Button>
                                          {candidateAssessment && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-6 text-[10px] px-2 shrink-0"
                                              onClick={() => handleViewAssessment(candidate)}
                                            >
                                              View
                                            </Button>
                                          )}
                                          {status === "submitted" && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-6 text-[10px] px-2 text-blue-600 border-blue-500 bg-white hover:bg-blue-500 hover:text-white shrink-0"
                                              onClick={() =>
                                                handleOpenAssessmentModal(candidate, "grade", sa.id, candidateAssessment?.id)
                                              }
                                              disabled={!candidate.stepInterviewerId || user?.id !== candidate.stepInterviewerId}
                                              title={
                                                !candidate.stepInterviewerId || user?.id !== candidate.stepInterviewerId
                                                  ? 'Only the assigned interviewer can grade.'
                                                  : undefined
                                              }
                                            >
                                              Grade
                                            </Button>
)}
                                         </div>
                                       );
                                     })
                                   )}
                                 </div>
                               </TableCell>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle w-36">
                                {stepAssessments.length > 0 ? (() => {
                                  const candidateAssessmentsList = candidateAssessments.get(candidate.id) || [];
                                  const alreadySent = candidateAssessmentsList.some((ca) => ca.is_sent);
                                  const isInterviewer = candidate.stepInterviewerId && user?.id === candidate.stepInterviewerId;
                                  const isAllGraded = candidate.pipelineStatus === "assessment_graded";
                                  const isAssessmentProgressed = alreadySent || candidate.pipelineStatus === "assessment_sent" || candidate.pipelineStatus === "assessment_partially_graded" || candidate.pipelineStatus === "assessment_graded";
                                  return (
                                    <div className="flex flex-col items-center gap-1.5">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs px-2 text-green-600 border-green-500 bg-white hover:bg-green-500 hover:text-white"
                                        onClick={() => handleOpenSendAssessmentModal(candidate)}
                                        disabled={isAssessmentProgressed || !isInterviewer}
                                        title={
                                          isAssessmentProgressed
                                            ? 'Assessment already sent or graded.'
                                            : !isInterviewer
                                              ? 'Only the assigned interviewer can send assessments.'
                                              : undefined
                                        }
                                      >
                                        Send
                                      </Button>
                                      <div className="flex gap-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="px-2 text-[10px] text-green-600 border-green-600 bg-white hover:bg-green-600 hover:text-white"
                                          disabled={!isAllGraded || isCandidateProgressActionDisabled(candidate)}
                                          onClick={() =>
                                            handleCandidateProgress(
                                              candidate.id,
                                              candidate.name,
                                              candidate.pipelineStepId,
                                              "pass",
                                            )
                                          }
                                        >
                                          Pass
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="px-2 text-[10px] text-blue-600 border-blue-600 bg-white hover:bg-blue-600 hover:text-white"
                                          disabled={!isAllGraded || isCandidateProgressActionDisabled(candidate)}
                                          onClick={() =>
                                            void handleCandidateShortlist(
                                              candidate.id,
                                              candidate.name,
                                              candidate.pipelineStepId,
                                            )
                                          }
                                        >
                                          Shortlist
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="px-2 text-[10px] text-red-600 border-red-600 bg-white hover:bg-red-600 hover:text-white"
                                          disabled={!isAllGraded || isCandidateProgressActionDisabled(candidate)}
                                          onClick={() =>
                                            handleCandidateProgress(
                                              candidate.id,
                                              candidate.name,
                                              candidate.pipelineStepId,
                                              "fail",
                                            )
                                          }
                                        >
                                          Fail
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })() : (
                                  <div className="flex items-center justify-center rounded border border-gray-200 bg-gray-50 px-1.5 py-1">
                                    <span className="text-xs text-gray-400">-</span>
                                  </div>
                                )}
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                <Avatar className="h-12 w-12 mx-auto rounded-sm">
                                  <AvatarImage
                                    src={candidate.photoUrl || "/placeholder.svg"}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="rounded-sm">
                                    2x2
                                  </AvatarFallback>
                                </Avatar>
                              </TableCell>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                <Badge
                                  variant="outline"
                                  className="text-xs lg:text-sm px-1 lg:px-2 leading-tight text-center"
                                >
                                  {candidate.statusLabel}
                                </Badge>
                              </TableCell>
                            </>
                          )}

                          <TableCell className="text-center border border-gray-200 py-3 px-3 text-xs lg:text-sm align-middle">
                            <span
                              className="leading-tight whitespace-normal"
                              style={{ overflowWrap: "anywhere" }}
                            >
                              {candidate.department}
                            </span>
                          </TableCell>

                          {showNonNegotiableColumn ? (
                            <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                              {candidateNonNegotiableMap.get(candidate.id) ? (
                                <Badge variant="outline" className="border-red-500 text-red-600">
                                  Mismatch
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-green-500 text-green-600">
                                  OK
                                </Badge>
                              )}
                            </TableCell>
                          ) : null}

                        </TableRow>
))
                    )}
                  </TableBody>
                </Table>
              </div>
            )
          )}
          </div>
         </div>
       </div>

       <Dialog
        open={scheduleModalState.open}
        onOpenChange={(open) => {
          if (!open) handleCloseScheduleModal();
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {scheduleModalState.mode === "reschedule" ? "Reschedule Interview" : "Schedule Interview"}
                </DialogTitle>
                <DialogDescription>
                  {scheduleModalState.candidateName
                    ? `Candidate: ${scheduleModalState.candidateName}`
                    : "Set up the interview details."}
                </DialogDescription>
</DialogHeader>

              <div className="rounded-md border border-gray-200 p-3 space-y-3">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[140px_140px_140px_1fr]">
                <Input
                  id="interview-date"
                  type="date"
                  value={scheduleForm.scheduledDate}
                  onChange={(event) => handleScheduleInputChange("scheduledDate", event.target.value)}
                  placeholder="Date"
                />
                <Select
                  value={scheduleForm.scheduledTime}
                  onValueChange={(value) => handleScheduleInputChange("scheduledTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00 AM</SelectItem>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="13:00">01:00 PM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={scheduleForm.duration}
                  onValueChange={(value) => handleScheduleInputChange("duration", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 mins">30 mins</SelectItem>
                    <SelectItem value="45 mins">45 mins</SelectItem>
                    <SelectItem value="60 mins">60 mins</SelectItem>
                    <SelectItem value="90 mins">90 mins</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="interview-interviewers"
                  value={scheduleForm.interviewerNames}
                  readOnly
                  disabled
                  className="bg-gray-50"
                  placeholder="Interviewers"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
                  <div className="space-y-2">
                  <Input
                    id="interview-subject"
                    value={scheduleForm.subject}
                    onChange={(event) =>
                      handleScheduleInputChange("subject", event.target.value)
                    }
                    placeholder="Subject:"
                  />

                  <Select
                    value={scheduleForm.emailTemplateId ? String(scheduleForm.emailTemplateId) : "custom"}
                    onValueChange={(value) => {
                      if (!value || value === "custom") {
                        // custom — keep current body
                        subjectEditedRef.current = false;
                        setScheduleForm((prev) => ({
                          ...prev,
                          emailTemplateId: undefined,
                          subject: buildDefaultInterviewSubject(
                            scheduleModalState.mode,
                            prev.interviewSetup,
                            scheduleModalState.jobTitle,
                          ),
                        }));
                        return;
                      }

                      const chosen = emailTemplates.find((t) => String(t.id) === String(value));
                      if (chosen) {
                        const baseBody = chosen.body ?? "";
                        const renderedSubject = renderTemplate(chosen.subject ?? "", scheduleForm, scheduleModalState);
                        subjectEditedRef.current = false;
                        setScheduleForm((prev) => ({
                          ...prev,
                          templateBody: baseBody,
                          emailTemplateId: chosen.id,
                          subject: renderedSubject || prev.subject,
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template or Custom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom / No template</SelectItem>
                      {emailTemplates.map((tmpl) => (
                        <SelectItem key={tmpl.id} value={String(tmpl.id)}>
                          {tmpl.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Textarea
                    id="interview-template"
                    value={scheduleForm.templateBody}
                    onChange={(event) =>
                      handleScheduleInputChange("templateBody", event.target.value)
                    }
                    placeholder="Templated"
                    className="min-h-28"
                  />
                  <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">
                    {buildInterviewSetupDetails(
                      scheduleForm.interviewSetup,
                      scheduleForm.meetingAddress,
                      scheduleForm.meetingPlatform,
                      scheduleForm.meetingLink,
                      scheduleForm.meetingLinkName,
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Interview Set-up</Label>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="setup"
                        checked={scheduleForm.interviewSetup === "onsite"}
                        onChange={() => handleScheduleInputChange("interviewSetup", "onsite")}
                      />
                      Onsite
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="setup"
                        checked={scheduleForm.interviewSetup === "online"}
                        onChange={() => handleScheduleInputChange("interviewSetup", "online")}
                      />
                      Online
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="setup"
                        checked={scheduleForm.interviewSetup === "phone"}
                        onChange={() => handleScheduleInputChange("interviewSetup", "phone")}
                      />
                      Phone
                    </label>
                  </div>

                  {scheduleForm.interviewSetup === "onsite" ? (
                    <Input
                      value={scheduleForm.meetingAddress}
                      onChange={(event) => handleScheduleInputChange("meetingAddress", event.target.value)}
                      placeholder="Address"
                    />
                  ) : scheduleForm.interviewSetup === "online" ? (
                    <>
                      <Select
                        value={scheduleForm.meetingPlatform}
                        onValueChange={(value) => handleScheduleInputChange("meetingPlatform", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Zoom Meeting">Zoom Meeting</SelectItem>
                          <SelectItem value="Google Meet">Google Meet</SelectItem>
                          <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={scheduleForm.meetingLinkName}
                        onChange={(event) => handleScheduleInputChange("meetingLinkName", event.target.value)}
                        placeholder="Link Name"
                      />
                      <Input
                        value={scheduleForm.meetingLink}
                        onChange={(event) => handleScheduleInputChange("meetingLink", event.target.value)}
                        placeholder="Link"
                      />
                    </>
                  ) : null}
                </div>
              </div>

              {scheduleModalState.mode === "reschedule" && (
                <Select
                  value={scheduleForm.rescheduleReason}
                  onValueChange={(value) => handleScheduleInputChange("rescheduleReason", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Reason for rescheduling" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interviewer unavailable">Interviewer unavailable</SelectItem>
                    <SelectItem value="Candidate requested">Candidate requested</SelectItem>
                    <SelectItem value="Calendar conflict">Calendar conflict</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
)}
           </div>

           <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleOpenEmailPreview()}
              disabled={isSavingSchedule || isLoadingEmailPreview}
            >
              {isLoadingEmailPreview ? "Loading..." : "View Email"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseScheduleModal}
              disabled={isSavingSchedule}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleSubmitSchedule()}
              disabled={isSavingSchedule}
            >
              {isSavingSchedule
                ? "Saving..."
                : scheduleModalState.mode === "reschedule"
                  ? "Confirm"
                  : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEmailPreviewOpen} onOpenChange={setIsEmailPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              This is what will be sent to the candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase">Subject</div>
              <div className="text-sm bg-white p-3 rounded border border-gray-200 wrap-break-word">
                {emailPreview?.subject || scheduleForm.subject}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase">Rendered HTML</div>
              <iframe
                title="Interview Email HTML Preview"
                className="w-full h-64 sm:h-80 bg-white rounded border border-gray-200"
                srcDoc={emailPreview?.html_body || ""}
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase">Plain Text Body</div>
              <div className="text-sm bg-white p-4 rounded border border-gray-200 whitespace-pre-wrap wrap-break-word max-h-80 overflow-y-auto">
                {emailPreview?.body || "No preview available."}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEmailPreviewOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assessmentModalState.open} onOpenChange={handleCloseAssessmentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {assessmentModalState.mode === "preview" ? "Assessment Preview" : "Grade Assessment"}
            </DialogTitle>
            <DialogDescription>
              {assessmentModalState.mode === "preview"
                ? `Preview assessment file for ${assessmentModalState.candidateName}.`
                : `Enter the score and notes for ${assessmentModalState.candidateName}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {assessmentModalState.mode === "preview" ? (
              <>
                <div className="space-y-2">
                  <Label className="font-semibold">
                    {formatAssessmentType(assessmentModalState.assessment?.type)}
                  </Label>
                  {assessmentModalState.assessment?.file?.file ? (
                    (() => {
                      const assessment = assessmentModalState.assessment!;
                      const file = assessment.file!;
                      const previewUrl = resolveFileUrl(file.file);
                      const ext = file.filename?.split('.').pop() || null;
                      if (isPdfExtension(ext) && previewUrl) {
                        return (
                          <div className="relative">
                            {isPreviewLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded border z-10">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                              </div>
                            )}
                            <iframe
                              src={previewUrl}
                              className="w-full h-96 rounded border border-gray-200"
                              title="Assessment preview"
                              onLoad={() => setIsPreviewLoading(false)}
                            />
                          </div>
                        );
                      }
                      if (isImageExtension(ext) && previewUrl) {
                        return (
                          <div className="rounded border border-gray-200 bg-gray-100 flex items-center justify-center min-h-[200px]">
                            {isPreviewLoading && (
                              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            )}
                            <img
                              src={previewUrl}
                              alt="Assessment preview"
                              className="max-w-full max-h-96 object-contain"
                              style={{ display: isPreviewLoading ? 'none' : undefined }}
                              onLoad={() => setIsPreviewLoading(false)}
                              onError={() => setIsPreviewLoading(false)}
                            />
                          </div>
                        );
                      }
                      return (
                        <div className="flex flex-col gap-2 items-center p-8 bg-gray-50 rounded border border-dashed border-gray-300">
                          <FileText className="h-10 w-10 text-gray-400" />
                          <p className="text-sm text-gray-500">{file.filename}</p>
                          {previewUrl && (
                            <Button asChild variant="outline" size="sm">
                              <a href={previewUrl} target="_blank" rel="noreferrer">Download File</a>
                            </Button>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="p-8 bg-gray-50 rounded border border-dashed border-gray-300 text-center">
                      <p className="text-sm text-gray-500">No file uploaded for this assessment.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="assessment-score">Score (0-100)</Label>
                  <Input
                    id="assessment-score"
                    type="number"
                    min="0"
                    max="100"
                    value={assessmentGradeForm.score}
                    onChange={(e) =>
                      setAssessmentGradeForm((prev) => ({
                        ...prev,
                        score: e.target.value,
                      }))
                    }
                    placeholder="Enter score..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment-notes">Private Notes (Staff Only)</Label>
                  <Textarea
                    id="assessment-notes"
                    value={assessmentGradeForm.notes}
                    onChange={(e) =>
                      setAssessmentGradeForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Enter grading notes..."
                    className="min-h-24"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseAssessmentModal}
              disabled={isSubmittingGrade}
            >
              {assessmentModalState.mode === "preview" ? "Close" : "Cancel"}
            </Button>
            {assessmentModalState.mode === "grade" && (
              <Button
                type="button"
                onClick={handleSubmitGrade}
                disabled={isSubmittingGrade}
              >
                {isSubmittingGrade ? "Submitting..." : "Submit Grade"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sendAssessmentModalState.open} onOpenChange={handleCloseSendAssessmentModal}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Send Assessment Email</DialogTitle>
            <DialogDescription>
              Send assessment materials to {sendAssessmentModalState.candidateName} via email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="send-assessment-subject">Email Subject</Label>
              <Input
                id="send-assessment-subject"
                value={sendAssessmentModalState.subject}
                onChange={(e) =>
                  setSendAssessmentModalState((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Assessment email subject..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-assessment-body">Email Body</Label>
              <Textarea
                id="send-assessment-body"
                value={sendAssessmentModalState.body}
                onChange={(e) =>
                  setSendAssessmentModalState((prev) => ({ ...prev, body: e.target.value }))
                }
                placeholder="Assessment email body..."
                className="min-h-28"
              />
              <p className="text-xs text-gray-500">
                Available placeholders: {"{candidate_name}"}, {"{job_title}"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Assessments to Send</Label>
              <div className="rounded border border-gray-200 bg-gray-50 p-3 space-y-1">
                {stepAssessments.length === 0 ? (
                  <p className="text-sm text-gray-500">No assessments configured.</p>
                ) : (
                  stepAssessments.map((sa) => (
                    <div key={sa.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        {formatAssessmentType(sa.type)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {sa.file?.filename || "No file"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseSendAssessmentModal}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSendPreview}
              disabled={isLoadingSendPreview}
            >
              {isLoadingSendPreview ? "Loading..." : "Preview Email"}
            </Button>
            <Button
              type="button"
              onClick={handleSendAssessment}
            >
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSendPreviewOpen} onOpenChange={setIsSendPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              This is what will be sent to the candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase">To</div>
              <div className="text-sm bg-white p-3 rounded border border-gray-200">
                {sendPreview?.recipient_name} ({sendPreview?.recipient_email})
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase">Subject</div>
              <div className="text-sm bg-white p-3 rounded border border-gray-200 wrap-break-word">
                {sendPreview?.subject}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase">Rendered HTML</div>
              <iframe
                title="Assessment Email HTML Preview"
                className="w-full h-64 sm:h-80 bg-white rounded border border-gray-200"
                srcDoc={sendPreview?.html_body || ""}
              />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase">Attachments</div>
              <div className="text-sm bg-white p-3 rounded border border-gray-200">
                {sendPreview?.attachments && sendPreview.attachments.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {sendPreview!.attachments.map((att, idx) => (
                      <li key={idx}>
                        {att.filename} ({Math.round(att.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No attachments</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSendPreviewOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(resumePreviewCandidate)} onOpenChange={(open) => { if (!open) setResumePreviewCandidate(null); }}>
        <DialogContent className="flex h-[90vh] max-h-[90vh] w-[min(96vw,80rem)] max-w-none flex-col overflow-hidden">
          <DialogHeader className="flex flex-col gap-4 text-left sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <DialogTitle>{resumePreviewCandidate ? `${resumePreviewCandidate.name}'s Resume` : "Resume Preview"}</DialogTitle>
              <DialogDescription>Preview the submitted resume and download a copy.</DialogDescription>
            </div>

            {resumePreviewCandidate ? (
              <Button
                className="w-full shrink-0 sm:w-auto"
                variant="outline"
                onClick={() => handleDownloadResume(resumePreviewCandidate)}
                disabled={!getResumePreviewUrl(resumePreviewCandidate)}
              >
                <Download className="mr-2 h-4 w-4" />
                Open / Download Resume
              </Button>
            ) : null}
          </DialogHeader>

          {resumePreviewCandidate ? (() => {
            const previewUrl = getResumePreviewUrl(resumePreviewCandidate);
            const ext = getResumeFileExt(resumePreviewCandidate);
            const isPdf = ext === "pdf";
            const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext || "");

            return (
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                <div className="overflow-hidden rounded-lg border bg-white">
                  {isImage && previewUrl ? (
                    <img
                      alt={`${resumePreviewCandidate.name} resume preview`}
                      className="h-[72vh] w-full object-contain bg-white"
                      src={previewUrl}
                    />
                  ) : isPdf && previewUrl ? (
                    <iframe
                      title={`${resumePreviewCandidate.name} resume preview`}
                      className="h-[72vh] w-full bg-white"
                      src={previewUrl}
                    />
                  ) : previewUrl ? (
                    <div className="flex h-[72vh] w-full items-center justify-center p-6 text-sm text-gray-500">
                      <iframe
                        title={`${resumePreviewCandidate.name} resume preview`}
                        className="h-[72vh] w-full bg-white"
                        src={previewUrl}
                      />
                    </div>
                  ) : (
                    <div className="flex h-[72vh] w-full items-center justify-center p-6 text-sm text-gray-500">
                      Resume preview is unavailable.
                    </div>
                  )}
                </div>

                <div className="rounded-lg border bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Resume Link</p>
                  <p className="mt-1 wrap-break-word text-sm text-gray-900">
                    {previewUrl || "No resume link available."}
                  </p>
                </div>
              </div>
            );
          })() : (
            <div className="flex items-center justify-center rounded-lg border border-dashed p-10 text-sm text-gray-500">
              Resume preview is unavailable.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Global Preonboarding Template Modal */}
      {showPreOnboardingTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPreOnboardingTemplateModal(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4">
            <div className="bg-white rounded-lg shadow-xl">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-blue-500">
                <button
                  onClick={() => setShowPreOnboardingTemplateModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-[#0056d2] text-center">
                  Send Requirements
                </h2>
              </div>

              {/* Body */}
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                <p className="text-sm font-semibold text-gray-900 mb-3">Requirement list:</p>
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {preOnboardingTemplateItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-1">
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={item.required}
                          onChange={() => togglePreOnboardingTemplateRequired(item.key)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          disabled={!isPreonboardingInterviewer}
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                      <button
                        onClick={() => removePreOnboardingTemplateItem(item.key)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                        disabled={!isPreonboardingInterviewer}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Row */}
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add requirement"
                    value={newPreOnboardingTemplateItem}
                    onChange={(e) => setNewPreOnboardingTemplateItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPreOnboardingTemplateItem()}
                    disabled={!isPreonboardingInterviewer}
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addPreOnboardingTemplateItem}
                    disabled={!isPreonboardingInterviewer}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreOnboardingTemplateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#0056d2] hover:bg-blue-700 text-white"
                  onClick={() => savePreonboardingTemplateMutation.mutate(preOnboardingTemplateItems)}
                  disabled={!isPreonboardingInterviewer}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Per-Candidate Preonboarding Config Modal */}
      {showPreOnboardingCandidateModal && selectedPreOnboardingCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPreOnboardingCandidateModal(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4">
            <div className="bg-white rounded-lg shadow-xl">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-blue-500">
                <button
                  onClick={() => setShowPreOnboardingCandidateModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-[#0056d2] text-center">
                  Send Requirements
                </h2>
                <div className="absolute top-4 left-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setPreOnboardingCandidateItems(
                        STANDARD_PREONBOARDING_REQUIREMENTS.map((r, i) => ({
                          key: `req-${i}`,
                          label: r.label,
                          required: r.required,
                          order: i,
                        })),
                      )
                    }
                    className="text-xs"
                    disabled={!isPreonboardingInterviewer}
                  >
                    Load Standard
                  </Button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                {/* Date Fields */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-900 w-36 shrink-0">
                      Submission Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="date"
                        value={submissionDate}
                        onChange={(e) => setSubmissionDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!isPreonboardingInterviewer}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-900 w-36 shrink-0">
                      Report Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="datetime-local"
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!isPreonboardingInterviewer}
                      />
                    </div>
                  </div>
                </div>

                {/* Requirement List */}
                <p className="text-sm font-semibold text-gray-900 mb-3">Requirement list:</p>
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {preOnboardingCandidateItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-1">
                      <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={item.required}
                          onChange={() => togglePreOnboardingCandidateRequired(item.key)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 shrink-0"
                          disabled={!isPreonboardingInterviewer}
                        />
                        <span className="text-sm text-gray-700 truncate">{item.label}</span>
                      </label>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.file_url && (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title={item.filename || "View file"}
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        )}
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          item.status === "submitted" || item.status === "verified"
                            ? "bg-green-100 text-green-700"
                            : item.status === "stale"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {item.status === "submitted" ? "Submitted" :
                           item.status === "verified" ? "Verified" :
                           item.status === "stale" ? "Stale" :
                           item.status === "carried_over" ? "Carried Over" :
                           "Pending"}
                        </span>
                        <button
                          onClick={() => removePreOnboardingCandidateItem(item.key)}
                          className="text-gray-400 hover:text-red-500"
                          disabled={!isPreonboardingInterviewer}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Row */}
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add requirement"
                    value={newPreOnboardingCandidateItem}
                    onChange={(e) => setNewPreOnboardingCandidateItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPreOnboardingCandidateItem()}
                    disabled={!isPreonboardingInterviewer}
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addPreOnboardingCandidateItem}
                    disabled={!isPreonboardingInterviewer}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPreOnboardingCandidateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#0056d2] hover:bg-blue-700 text-white"
                  onClick={() => {
                    if (selectedPreOnboardingCandidateId) {
                      savePreonboardingCandidateReqsMutation.mutate({
                        appId: selectedPreOnboardingCandidateId,
                        items: preOnboardingCandidateItems,
                      });
                    }
                  }}
                  disabled={!isPreonboardingInterviewer}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Email Preview Dialog */}
      <Dialog open={onboardingPreviewOpen} onOpenChange={setOnboardingPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              This is what will be sent to the candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase">Subject</div>
              <div className="text-sm bg-white p-3 rounded border border-gray-200 wrap-break-word">
                {onboardingPreviewSubject}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase">Plain Text Body</div>
              <div className="text-sm bg-white p-4 rounded border border-gray-200 whitespace-pre-wrap wrap-break-word max-h-80 overflow-y-auto">
                {onboardingPreviewBody || "No preview available."}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOnboardingPreviewOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Onboarding Send Modal */}
      {showOnboardingModal && selectedOnboardingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowOnboardingModal(false)} />
          <div className="relative z-10 w-full max-w-lg mx-4">
            <div className="bg-white rounded-lg shadow-xl">
              <div className="relative px-6 pt-6 pb-4 border-b border-blue-500">
                <button
                  onClick={() => setShowOnboardingModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-[#0056d2] text-center">
                  Send Onboarding
                </h2>
              </div>

              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Candidate</p>
                  <p className="text-sm text-gray-600">{selectedOnboardingCandidate.candidate_name}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">Position</p>
                  <p className="text-sm text-gray-600">{selectedOnboardingCandidate.job_title}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">Immediate Supervisor</p>
                  <p className="text-sm text-gray-600">
                    {immediateSupervisor
                      ? `${immediateSupervisor.first_name || ''} ${immediateSupervisor.last_name || ''}`.trim() || immediateSupervisor.email
                      : 'Not assigned'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-900">Onboarding Date</Label>
                  <Input
                    type="date"
                    value={onboardingDate}
                    onChange={(e) => setOnboardingDate(e.target.value)}
                    className="mt-1"
                  />
                  {!onboardingDate && (
                    <p className="text-xs text-amber-600 mt-1">Select a date to enable the Send button.</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-900">Email Subject</Label>
                  <Input
                    value={onboardingEmailSubject}
                    onChange={(e) => setOnboardingEmailSubject(e.target.value)}
                    className="mt-1"
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-900">Email Body</Label>
                  <p className="text-xs text-gray-400 mb-1">
                    Available placeholders: {'{{candidate_name}}'}, {'{{onboarding_date}}'}, {'{{immediate_supervisor}}'}, {'{{job_title}}'}, {'{{company_name}}'}, {'{{interviewer_name}}'}, {'{{interviewer_role}}'}
                  </p>
                  <textarea
                    value={onboardingEmailBody}
                    onChange={(e) => setOnboardingEmailBody(e.target.value)}
                    className="mt-1 w-full min-h-[200px] rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Email body"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowOnboardingModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOnboardingPreview}
                >
                  Preview Email
                </Button>
                <Button
                  className="bg-[#0056d2] hover:bg-blue-700 text-white"
                  disabled={!onboardingDate || !isOnboardingInterviewer}
                  title={
                    !onboardingDate
                      ? "Select an onboarding date first."
                      : !isOnboardingInterviewer
                      ? "Only the assigned interviewer can send onboarding."
                      : undefined
                  }
                  onClick={() => {
                    if (selectedOnboardingCandidate) {
                      handleSendOnboarding(
                        selectedOnboardingCandidate.id,
                        selectedOnboardingCandidate.candidate_name,
                      );
                    }
                  }}
                >
                  Send Onboarding
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
