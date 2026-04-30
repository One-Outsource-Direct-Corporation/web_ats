import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "react-toastify";

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
import { defaultAxios } from "@/config/axios";
import { emailTemplateService } from "@/features/library/services/emailTemplate.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { useJobDetailQuery } from "@/features/jobs/hooks/useJobs";
import { extractPipelineStepsFromJobDetail } from "@/features/jobs/services/jobService";
import {
  formatJobTitle,
  getProcessTypeFromRouteSegment,
  getProcessTypeLabel,
} from "@/features/jobs/utils/jobFormatters";

import ResumeScreeningTable from "@/features/applicants/components/ResumeScreeningTable";

type PipelineProgressOutcome = "pass" | "fail";

interface PendingProgressAction {
  id: string;
  candidateApplicationId: number;
  candidateName: string;
  pipelineStepId: number;
  outcome: PipelineProgressOutcome;
  toastId?: string | number;
}

interface InterviewScheduleModalState {
  open: boolean;
  candidateApplicationId: number;
  candidateName: string;
  pipelineStepId: number;
  mode: "set" | "reschedule";
  existingSchedule?: string;
  jobTitle?: string;
}



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

const GRACE_PERIOD_MS = 5000;
const DEFERRED_ACTION_TOAST_POSITION = "top-center" as const;
const DEFERRED_ACTION_TOAST_STYLE = {
  top: "50%",
  transform: "translateY(-50%)",
};

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

export default function PipelineApplicants() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams<{ jobId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const [pendingActions, setPendingActions] = useState<PendingProgressAction[]>([]);
  const pendingTimersRef = useRef<Record<string, ReturnType<typeof window.setTimeout>>>({});
  const pendingCountdownIntervalsRef = useRef<Record<string, ReturnType<typeof window.setInterval>>>({});
  const pendingActionsRef = useRef<PendingProgressAction[]>([]);

  const [processingCandidateId, setProcessingCandidateId] = useState<number | null>(null);

  const [scheduleModalState, setScheduleModalState] = useState<InterviewScheduleModalState>({
    open: false,
    candidateApplicationId: 0,
    candidateName: "",
    pipelineStepId: 0,
    mode: "set",
    existingSchedule: undefined,
    jobTitle: undefined,
  });
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

  const { data: jobDetail, isLoading, isError, refetch } = useJobDetailQuery(jobId);

  useEffect(() => {
    pendingActionsRef.current = pendingActions;
  }, [pendingActions]);

  useEffect(() => {
    return () => {
      for (const timerId of Object.values(pendingTimersRef.current)) {
        window.clearTimeout(timerId);
      }
      pendingTimersRef.current = {};

      for (const intervalId of Object.values(pendingCountdownIntervalsRef.current)) {
        window.clearInterval(intervalId);
      }
      pendingCountdownIntervalsRef.current = {};
    };
  }, []);

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
  const isPassFailStage =
    selectedType === "resume_screening" ||
    selectedType === "phone_call_interview" ||
    selectedType === "initial_interview";
  const showResumeColumn = selectedType === "resume_screening";

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
        if (!candidatesById.has(candidate.id)) {
          const resolvedPipelineStepId = candidate.pipelineStepId
            ? candidate.pipelineStepId
            : Number.parseInt(step.id, 10);

          candidatesById.set(candidate.id, {
            id: candidate.id,
            name: candidate.name,
            department: candidate.department || "-",
            statusLabel: candidate.pipelineStatusLabel || candidate.statusLabel,
            pipelineStatus: normalizeStatusTag(candidate.pipelineStatus),
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

      for (const candidateId of step.candidateApplicationIds) {
        if (!candidatesById.has(candidateId)) {
          const fallbackStepId = Number.parseInt(step.id, 10);
          candidatesById.set(candidateId, {
            id: candidateId,
            name: `Candidate #${candidateId}`,
            department: "-",
            statusLabel: "Pending",
            pipelineStatus: "pending",
            pipelineStepId: Number.isNaN(fallbackStepId) ? undefined : fallbackStepId,
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

  const pendingCandidateIds = useMemo(
    () => new Set(pendingActions.map((pendingAction) => pendingAction.candidateApplicationId)),
    [pendingActions],
  );

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

  const clearPendingActionCountdown = useCallback((actionId: string) => {
    const intervalId = pendingCountdownIntervalsRef.current[actionId];
    if (!intervalId) {
      return;
    }

    window.clearInterval(intervalId);
    delete pendingCountdownIntervalsRef.current[actionId];
  }, []);

  const removePendingAction = useCallback((actionId: string) => {
    setPendingActions((previousValue) =>
      previousValue.filter((action) => action.id !== actionId),
    );
  }, []);

  const handleUndoPendingAction = useCallback((actionId: string) => {
    const timerId = pendingTimersRef.current[actionId];
    if (timerId) {
      window.clearTimeout(timerId);
      delete pendingTimersRef.current[actionId];
    }

    clearPendingActionCountdown(actionId);

    const existingAction = pendingActionsRef.current.find(
      (pendingAction) => pendingAction.id === actionId,
    );
    removePendingAction(actionId);

    if (existingAction?.toastId !== undefined) {
      toast.dismiss(existingAction.toastId);
    }
  }, [clearPendingActionCountdown, removePendingAction]);

  const commitPendingAction = useCallback(
    async (pendingAction: PendingProgressAction) => {
      if (!pendingActionsRef.current.some((action) => action.id === pendingAction.id)) {
        return;
      }

      const timerId = pendingTimersRef.current[pendingAction.id];
      if (timerId) {
        window.clearTimeout(timerId);
        delete pendingTimersRef.current[pendingAction.id];
      }

      clearPendingActionCountdown(pendingAction.id);

      try {
        setProcessingCandidateId(pendingAction.candidateApplicationId);
        await defaultAxios.post("/api/candidate/pipeline/progress/", {
          candidate_application_id: pendingAction.candidateApplicationId,
          pipeline_step_id: pendingAction.pipelineStepId,
          outcome: pendingAction.outcome,
        });

        toast.success(
          `${pendingAction.candidateName} marked as ${pendingAction.outcome === "pass" ? "Pass" : "Fail"}.`,
          {
            position: DEFERRED_ACTION_TOAST_POSITION,
            style: DEFERRED_ACTION_TOAST_STYLE,
          },
        );
      } catch (error) {
        console.error("Unable to update candidate pipeline progress.", error);
        toast.error("Unable to submit candidate progress update.", {
          position: DEFERRED_ACTION_TOAST_POSITION,
          style: DEFERRED_ACTION_TOAST_STYLE,
        });
      } finally {
        removePendingAction(pendingAction.id);
        setProcessingCandidateId(null);
        await refetch();
      }
    },
    [clearPendingActionCountdown, refetch, removePendingAction],
  );

  const renderDeferredActionToast = useCallback(
    (pendingAction: PendingProgressAction, secondsLeft: number) => {
      const actionLabel = pendingAction.outcome === "pass" ? "Pass" : "Fail";

      return (
        <div className="space-y-2">
          <p className="text-sm leading-5">
            <span className="font-semibold">{pendingAction.candidateName}</span>{" "}
            queued for {actionLabel}. Auto-submit in {secondsLeft} second{secondsLeft === 1 ? "" : "s"}.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => handleUndoPendingAction(pendingAction.id)}
          >
            Undo
          </Button>
        </div>
      );
    },
    [handleUndoPendingAction],
  );

  const showDeferredActionToast = useCallback(
    (pendingAction: PendingProgressAction) => {
      const startingSeconds = Math.ceil(GRACE_PERIOD_MS / 1000);
      let secondsLeft = startingSeconds;

      const toastId = toast.info(
        renderDeferredActionToast(pendingAction, startingSeconds),
        {
          autoClose: GRACE_PERIOD_MS,
          closeButton: false,
          position: DEFERRED_ACTION_TOAST_POSITION,
          style: DEFERRED_ACTION_TOAST_STYLE,
        },
      );

      pendingCountdownIntervalsRef.current[pendingAction.id] = window.setInterval(() => {
        secondsLeft -= 1;

        if (secondsLeft <= 0) {
          clearPendingActionCountdown(pendingAction.id);
          return;
        }

        toast.update(toastId, {
          render: renderDeferredActionToast(pendingAction, secondsLeft),
        });
      }, 1000);

      return toastId;
    },
    [clearPendingActionCountdown, renderDeferredActionToast],
  );

  const isCandidateProgressActionDisabled = useCallback(
    (candidate: { id: number | string; stepInterviewerId?: number }) => {
      const candidateId =
        typeof candidate.id === "number"
          ? candidate.id
          : Number.parseInt(candidate.id, 10);

      if (Number.isNaN(candidateId)) {
        return true;
      }

      if (processingCandidateId === candidateId) {
        return true;
      }

      if (!candidate.stepInterviewerId) {
        return true;
      }

      return user?.id !== candidate.stepInterviewerId;
    },
    [processingCandidateId, user?.id],
  );

  const handleCandidateProgress = (
    candidateApplicationId: number,
    candidateName: string,
    pipelineStepId: number | undefined,
    outcome: PipelineProgressOutcome,
  ) => {
    if (!pipelineStepId || Number.isNaN(pipelineStepId)) {
      return;
    }

    if (processingCandidateId === candidateApplicationId) {
      return;
    }

    const hasPendingAction = pendingActions.some(
      (pendingAction) =>
        pendingAction.candidateApplicationId === candidateApplicationId &&
        pendingAction.pipelineStepId === pipelineStepId,
    );
    if (hasPendingAction) {
      return;
    }

    const actionId = `${candidateApplicationId}-${pipelineStepId}-${Date.now()}-${outcome}`;

    const pendingAction: PendingProgressAction = {
      id: actionId,
      candidateApplicationId,
      candidateName,
      pipelineStepId,
      outcome,
    };

    pendingAction.toastId = showDeferredActionToast(pendingAction);

    setPendingActions((previousValue) => [...previousValue, pendingAction]);
    pendingTimersRef.current[pendingAction.id] = window.setTimeout(() => {
      void commitPendingAction(pendingAction);
    }, GRACE_PERIOD_MS);
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
          jobTitle,
        },
      },
    );
  };

  const handleOpenResumePreview = () => {
    // Not used: preview handled by ResumeScreeningTable component
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

      await defaultAxios.post("/api/candidate/pipeline/schedule/", payload);

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

      const response = await defaultAxios.post<InterviewEmailPreviewResponse>(
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

  const interviewTableColumnCount = (isInterviewScheduleStage ? 6 : isPassFailStage ? 5 : 6) + (showNonNegotiableColumn ? 1 : 0) + (showResumeColumn ? 1 : 0);

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
              selectedType === "resume_screening" ? (
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
                  onFail={(candidate) =>
                    handleCandidateProgress(
                      Number(candidate.id),
                      candidate.name,
                      candidate.pipelineStepId,
                      "fail",
                    )
                  }
                />
              ) : (
              <div className="mt-4 rounded-md border bg-white overflow-x-auto">
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

                      {!isInterviewScheduleStage && !isPassFailStage ? (
                        <TableHead className="border border-gray-200 py-2 px-3 w-24 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                          Interview Evaluation
                          <br />
                          Form
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
                            <div className="flex min-w-0 flex-col items-center justify-center gap-1 text-center lg:flex-row lg:gap-2">
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
                            </div>
                          </TableCell>

                          {showResumeColumn ? (
                            <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full px-2 text-xs lg:text-sm text-slate-700 border-slate-300 bg-white hover:bg-slate-900 hover:text-white"
                                onClick={() => handleOpenResumePreview()}
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
                                  disabled={isSavingSchedule}
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

                          {!isInterviewScheduleStage && !isPassFailStage ? (
                            <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full px-2 text-xs lg:text-sm"
                              >
                                View
                              </Button>
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

            {searchTerm && (
              <div className="text-xs lg:text-sm text-gray-600">
                Showing {visibleStepCandidates.length} applicants
                {searchTerm && ` for "${searchTerm}"`}
              </div>
            )}
          </div>
        </div>
      </div>

      

      <Dialog open={scheduleModalState.open} onOpenChange={handleCloseScheduleModal}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {scheduleModalState.mode === "reschedule"
                ? "Reschedule Interview"
                : "Schedule Interview"}
            </DialogTitle>
            <DialogDescription>
              Plan, organize and schedule interview.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="max-w-56">
              <Input
                id="interview-schedule-date"
                type="date"
                value={scheduleForm.scheduledDate}
                onChange={(event) =>
                  handleScheduleInputChange("scheduledDate", event.target.value)
                }
              />
            </div>
            <div className="rounded-md border border-gray-200 p-3 space-y-3">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[140px_140px_1fr]">
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
                  <div className="flex items-center gap-3 text-sm">
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
                        value={scheduleForm.meetingLink}
                        onChange={(event) => handleScheduleInputChange("meetingLink", event.target.value)}
                        placeholder="Link"
                      />
                      <Input
                        value={scheduleForm.meetingLinkName}
                        onChange={(event) => handleScheduleInputChange("meetingLinkName", event.target.value)}
                        placeholder="Link Name"
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
          </div>

          <DialogFooter>
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
        <DialogContent className="sm:max-w-2xl">
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
                className="w-full h-80 bg-white rounded border border-gray-200"
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
    </>
  );
}
