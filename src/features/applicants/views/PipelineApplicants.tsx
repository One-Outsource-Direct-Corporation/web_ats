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

import { useJobDetailQuery } from "@/features/jobs/hooks/useJobs";
import { extractPipelineStepsFromJobDetail } from "@/features/jobs/services/jobService";
import {
  formatJobTitle,
  getProcessTypeFromRouteSegment,
  getProcessTypeLabel,
} from "@/features/jobs/utils/jobFormatters";

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
  rescheduleReason: string;
}

const GRACE_PERIOD_MS = 5000;
const DEFERRED_ACTION_TOAST_POSITION = "top-right" as const;

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

const createDefaultScheduleForm = (
  candidateName: string,
  existingSchedule?: string,
  interviewerName?: string,
): InterviewScheduleFormState => ({
  scheduledDate: toDateInputValue(existingSchedule),
  scheduledTime: toTimeInputValue(existingSchedule),
  duration: "60 mins",
  subject: "Interview Session",
  interviewerNames: interviewerName || "",
  templateBody: `Hello ${candidateName},\n\nYour interview has been scheduled.`,
  interviewSetup: "phone",
  meetingPlatform: "Zoom Meeting",
  meetingLink: "",
  meetingLinkName: "",
  rescheduleReason: "",
});

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

  const [pendingActions, setPendingActions] = useState<PendingProgressAction[]>([]);
  const pendingTimersRef = useRef<Record<string, ReturnType<typeof window.setTimeout>>>({});
  const pendingActionsRef = useRef<PendingProgressAction[]>([]);

  const [processingCandidateId, setProcessingCandidateId] = useState<number | null>(null);

  const [scheduleModalState, setScheduleModalState] = useState<InterviewScheduleModalState>({
    open: false,
    candidateApplicationId: 0,
    candidateName: "",
    pipelineStepId: 0,
    mode: "set",
    existingSchedule: undefined,
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
    rescheduleReason: "",
  });
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

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

  const isPassFailStage =
    selectedType === "resume_screening" ||
    selectedType === "phone_call_interview" ||
    selectedType === "initial_interview";
  const isInterviewScheduleStage =
    selectedType === "phone_call_interview" ||
    selectedType === "initial_interview";

  const resolvePhotoUrl = (rawUrl?: string) => {
    if (!rawUrl) {
      return undefined;
    }

    if (/^https?:\/\//i.test(rawUrl)) {
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
        scheduledFor?: string;
        interviewerName?: string;
        interviewerEmail?: string;
        stepInterviewerName?: string;
        stepInterviewerEmail?: string;
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
            scheduledFor: candidate.scheduledFor,
            interviewerName:
              step.interviewerName || candidate.assignedInterviewerName,
            interviewerEmail:
              step.interviewerEmail || candidate.assignedInterviewerEmail,
            stepInterviewerName: step.interviewerName,
            stepInterviewerEmail: step.interviewerEmail,
            photoUrl: resolvePhotoUrl(candidate.photoUrl),
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

    removePendingAction(actionId);

    toast.dismiss(actionId);
  }, [removePendingAction]);

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

      try {
        setProcessingCandidateId(pendingAction.candidateApplicationId);
        await defaultAxios.post("/api/candidate/pipeline/progress/", {
          candidate_application_id: pendingAction.candidateApplicationId,
          pipeline_step_id: pendingAction.pipelineStepId,
          outcome: pendingAction.outcome,
        });

        toast.success(
          `${pendingAction.candidateName} marked as ${pendingAction.outcome === "pass" ? "Pass" : "Fail"}.`,
          { position: DEFERRED_ACTION_TOAST_POSITION },
        );
      } catch (error) {
        console.error("Unable to update candidate pipeline progress.", error);
        toast.error("Unable to submit candidate progress update.", {
          position: DEFERRED_ACTION_TOAST_POSITION,
        });
      } finally {
        removePendingAction(pendingAction.id);
        setProcessingCandidateId(null);
        await refetch();
      }
    },
    [refetch, removePendingAction],
  );

  const showDeferredActionToast = useCallback(
    (pendingAction: PendingProgressAction) => {
      const actionLabel = pendingAction.outcome === "pass" ? "Pass" : "Fail";

      const toastId = toast.info(
        <div className="space-y-2">
          <p className="text-sm leading-5">
            <span className="font-semibold">{pendingAction.candidateName}</span>{" "}
            queued for {actionLabel}. Auto-submit in 5 seconds.
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
        </div>,
        {
          autoClose: GRACE_PERIOD_MS,
          closeButton: false,
          position: DEFERRED_ACTION_TOAST_POSITION,
        },
      );

      return toastId;
    },
    [handleUndoPendingAction],
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
    });

    setScheduleForm(
      createDefaultScheduleForm(
        candidate.name,
        candidate.scheduledFor,
        candidate.interviewerName,
      ),
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
    setScheduleForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

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
      await defaultAxios.post("/api/candidate/pipeline/schedule/", {
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
          reschedule_reason: scheduleForm.rescheduleReason,
          template_body: scheduleForm.templateBody,
        },
      });

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

  const interviewTableColumnCount = isInterviewScheduleStage ? 5 : isPassFailStage ? 5 : 6;

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
              <div className="mt-4 rounded-md border bg-white overflow-x-auto">
                <Table className="table-fixed text-xs lg:min-w-200">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-16 border border-gray-200 py-2 px-3 text-xs lg:text-sm lg:py-3 lg:px-4">
                        ID Number
                      </TableHead>
                      <TableHead className="text-center border border-gray-200 py-2 px-3 w-32 lg:min-w-50 text-xs lg:text-sm lg:py-3 lg:px-4">
                        Full Name
                      </TableHead>

                      {isInterviewScheduleStage ? (
                        <>
                          <TableHead className="border border-gray-200 py-2 px-3 w-24 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            Set Schedule
                          </TableHead>
                          <TableHead className="border border-gray-200 py-2 px-3 w-24 text-center text-xs lg:text-sm lg:py-3 lg:px-4">
                            Status
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
                          className="hover:bg-gray-50 h-16 lg:h-20"
                        >
                          <TableCell className="text-center border border-gray-200 py-3 px-3 font-medium text-xs lg:text-sm align-middle">
                            {String(candidate.id).padStart(3, "0")}
                          </TableCell>
                          <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 w-32 align-middle">
                            <div className="flex items-center justify-center gap-2 lg:gap-3">
                              <Avatar className="h-12 w-12 shrink-0 rounded-sm">
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
                                className="font-medium text-xs lg:text-sm wrap-break-word leading-tight"
                                title={candidate.name}
                              >
                                {candidate.name}
                              </span>

                            </div>
                          </TableCell>

                          {isInterviewScheduleStage ? (
                            <>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-yellow-600 border-yellow-500 bg-white hover:bg-yellow-500 hover:text-white"
                                  onClick={() => handleOpenScheduleModal(candidate)}
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
                            </>
                          ) : isPassFailStage ? (
                            <>
                              <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="px-3 text-green-600 border-green-600 bg-white hover:bg-green-600 hover:text-white"
                                  disabled={processingCandidateId === candidate.id}
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
                                  disabled={processingCandidateId === candidate.id}
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
                            <span className="wrap-break-word leading-tight">
                              {candidate.department}
                            </span>
                          </TableCell>

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
                  <Textarea
                    id="interview-template"
                    value={scheduleForm.templateBody}
                    onChange={(event) =>
                      handleScheduleInputChange("templateBody", event.target.value)
                    }
                    placeholder="Templated"
                    className="min-h-28"
                  />
                </div>

                {scheduleModalState.mode === "reschedule" ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Interview Set-up</Label>
                    <div className="flex items-center gap-3 text-sm">
                      <label className="flex items-center gap-1"><input type="radio" name="setup" checked={scheduleForm.interviewSetup === "onsite"} onChange={() => handleScheduleInputChange("interviewSetup", "onsite")} /> Onsite</label>
                      <label className="flex items-center gap-1"><input type="radio" name="setup" checked={scheduleForm.interviewSetup === "online"} onChange={() => handleScheduleInputChange("interviewSetup", "online")} /> Online</label>
                      <label className="flex items-center gap-1"><input type="radio" name="setup" checked={scheduleForm.interviewSetup === "phone"} onChange={() => handleScheduleInputChange("interviewSetup", "phone")} /> Phone</label>
                    </div>
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
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">Schedule Interview:</p>
                    <p className="capitalize">{scheduleForm.interviewSetup}</p>
                  </div>
                )}
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
    </>
  );
}
