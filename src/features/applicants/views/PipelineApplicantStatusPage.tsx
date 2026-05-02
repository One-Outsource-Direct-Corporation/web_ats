import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, BarChart3, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar.tsx";
import { Badge } from "@/shared/components/ui/badge.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card.tsx";
import { Input } from "@/shared/components/ui/input.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs.tsx";

import { useJobDetailQuery } from "@/features/jobs/hooks/useJobs";
import { extractPipelineStepsFromJobDetail } from "@/features/jobs/services/jobService";
import { formatJobTitle, getProcessTypeLabel } from "@/features/jobs/utils/jobFormatters";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ShortlistStatusModal from "@/features/applicants/components/ShortlistStatusModal";

type PipelineStatusGroup = "passed" | "failed" | "shortlisted";

interface PipelineStatusCandidate {
  id: number;
  name: string;
  department: string;
  statusLabel: string;
  pipelineStatus: string;
  photoUrl?: string;
  pipelineStepId?: number;
}

interface PipelineStepStatusSummary {
  stepId: string;
  stepTitle: string;
  processType: string;
  stepInterviewerId?: number;
  candidates: PipelineStatusCandidate[];
  groupedCandidates: Record<PipelineStatusGroup, PipelineStatusCandidate[]>;
}

const normalizePipelineStatus = (value?: string): PipelineStatusGroup | "other" => {
  const normalized = (value ?? "").trim().toLowerCase();

  if (normalized === "passed" || normalized === "pass" || normalized === "approved_from_shortlist") {
    return "passed";
  }

  if (normalized === "failed" || normalized === "fail" || normalized === "rejected_from_shortlist") {
    return "failed";
  }

  if (normalized === "shortlisted" || normalized === "shortlist") {
    return "shortlisted";
  }

  return "other";
};

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

const getCandidateInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getStatusBadgeClassName = (status: PipelineStatusGroup) => {
  if (status === "passed") {
    return "border-green-500 text-green-600";
  }

  if (status === "failed") {
    return "border-red-500 text-red-600";
  }

  return "border-amber-500 text-amber-700";
};

export default function PipelineApplicantStatusPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { data: jobDetail, isLoading, isError, refetch } = useJobDetailQuery(jobId, true);
  const [activeStepId, setActiveStepId] = useState<string>("");

  // Refetch data when page mounts to ensure we have fresh data
  useEffect(() => {
    console.log("🔄 PipelineApplicantStatusPage mounted, refetching job data...");
    refetch();
  }, [jobId, refetch]);

  // Date range state for filtering movements
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  // Local UI state for candidate history expansion and fetched histories
  const [expandedCandidateId, setExpandedCandidateId] = useState<number | null>(null);
  const [candidateHistories, setCandidateHistories] = useState<Record<number, any[]>>({});

  // Movements state for tracker
  const [movements, setMovements] = useState<any[]>([]);
  const [loadingMovements, setLoadingMovements] = useState<boolean>(false);

  // Shortlist status modal state
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState<boolean>(false);
  const [selectedCandidateForStatus, setSelectedCandidateForStatus] = useState<{
    id: number;
    name: string;
    department?: string;
    photoUrl?: string;
    candidateApplicationId: number;
    pipelineStepId: number;
    stepInterviewerId?: number;
  } | null>(null);

  const fetchMovements = async () => {
    if (!jobId) return;
    setLoadingMovements(true);
    try {
      const base = import.meta.env.VITE_BACKEND_URL ?? "";
      if (!base) {
        setMovements([]);
        setLoadingMovements(false);
        return;
      }

      const params = new URLSearchParams();
      if (dateRange.from) params.set('from', dateRange.from.toISOString());
      if (dateRange.to) params.set('to', dateRange.to.toISOString());

      const url = `${base.replace(/\/$/, "")}/api/candidate/movements/jobs/${jobId}/?${params.toString()}`;
      const resp = await fetch(url, { credentials: 'include' });
      if (resp.ok) {
        const data = await resp.json();
        setMovements(data.movements || []);
      } else {
        console.error('Failed to fetch movements', resp.statusText);
        setMovements([]);
      }
    } catch (err) {
      console.error('Error fetching movements', err);
      setMovements([]);
    } finally {
      setLoadingMovements(false);
    }
  };

  useEffect(() => {
    void fetchMovements();
  }, [jobId, dateRange.from, dateRange.to]);

  // Simple placeholder fetch function for candidate history.
  // Keeps UI compiling; can be replaced with a proper API call.
  const fetchCandidateHistory = async (candidateId: number) => {
    try {
      // If already fetched, skip
      if (candidateHistories[candidateId]) {
        return;
      }

      // Placeholder: attempt real fetch if backend URL is configured
      const base = import.meta.env.VITE_BACKEND_URL ?? "";
      if (!base) {
        setCandidateHistories((prev) => ({ ...prev, [candidateId]: [] }));
        return;
      }

      const url = `${base.replace(/\/$/, "")}/api/candidate/status-history/${candidateId}/`;
      const response = await fetch(url, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setCandidateHistories((prev) => ({ ...prev, [candidateId]: data.history || [] }));
      } else {
        setCandidateHistories((prev) => ({ ...prev, [candidateId]: [] }));
        console.error(`Failed to fetch candidate history: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error fetching candidate history", err);
      setCandidateHistories((prev) => ({ ...prev, [candidateId]: [] }));
    }
  };

  // Handle expandable candidate history
  const handleToggleCandidateHistory = (candidateId: number) => {
    if (expandedCandidateId === candidateId) {
      setExpandedCandidateId(null);
    } else {
      setExpandedCandidateId(candidateId);
      fetchCandidateHistory(candidateId);
    }
  };

  // Handle opening shortlist status modal
  const handleOpenShortlistModal = (
    candidate: PipelineStatusCandidate,
    candidateApplicationId: number,
    stepInterviewerId?: number,
  ) => {
    setSelectedCandidateForStatus({
      id: candidate.id,
      name: candidate.name,
      department: candidate.department,
      photoUrl: candidate.photoUrl,
      candidateApplicationId,
      pipelineStepId: candidate.pipelineStepId || 0,
      stepInterviewerId,
    });
    setIsShortlistModalOpen(true);
  };

  // Handle closing shortlist modal
  const handleCloseShortlistModal = () => {
    setIsShortlistModalOpen(false);
    setSelectedCandidateForStatus(null);
  };

  // Handle status change callback - refetch data
  const handleStatusChangeSuccess = () => {
    void fetchMovements();
    void refetch();
  };

  const pipelineSteps = useMemo(
    () => extractPipelineStepsFromJobDetail(jobDetail),
    [jobDetail],
  );

  // Refetch job detail with include_all_statuses flag for status page
  useEffect(() => {
    if (jobId && jobDetail === undefined) {
      // Trigger refetch with query parameter if needed
      const url = new URL(window.location.href);
      if (!url.searchParams.has('status_page')) {
        url.searchParams.set('status_page', 'true');
        // Note: actual refetch with params handled by useJobDetailQuery
      }
    }
  }, [jobId, jobDetail]);

  const queryType = searchParams.get("type") ?? undefined;
  const searchTerm = searchParams.get("q") ?? "";
  const resolvedJobTitle = jobDetail?.job_title || formatJobTitle(jobId);

  const stepSummaries = useMemo<PipelineStepStatusSummary[]>(() => {
    return pipelineSteps.map((step) => {
      console.log(`📊 Processing step: ${step.process_title || step.process_type}`, {
        totalCandidates: step.candidateApplications.length,
        candidates: step.candidateApplications.map(c => ({
          id: c.id,
          name: c.name,
          pipelineStatus: c.pipelineStatus,
          status: c.status,
          pipelineStatusLabel: c.pipelineStatusLabel,
          statusLabel: c.statusLabel,
        }))
      });

      const candidatesById = new Map<number, PipelineStatusCandidate>();

      for (const candidate of step.candidateApplications) {
        if (candidatesById.has(candidate.id)) {
          continue;
        }

        // Use pipelineStatus if available, otherwise fall back to status
        const effectiveStatus = candidate.pipelineStatus || candidate.status;
        
        const candidateItem: PipelineStatusCandidate = {
          id: candidate.id,
          name: candidate.name,
          department: candidate.department || "-",
          statusLabel: candidate.pipelineStatusLabel || candidate.statusLabel || effectiveStatus || "Unknown",
          pipelineStatus: effectiveStatus,
          photoUrl: resolvePhotoUrl(candidate.photoUrl),
          pipelineStepId: candidate.pipelineStepId,
        };

        candidatesById.set(candidate.id, candidateItem);
      }

      const filteredCandidates = Array.from(candidatesById.values()).filter((candidate) => {
        if (!searchTerm) {
          return true;
        }

        const loweredSearch = searchTerm.toLowerCase();
        return (
          candidate.name.toLowerCase().includes(loweredSearch) ||
          String(candidate.id).toLowerCase().includes(loweredSearch) ||
          candidate.department.toLowerCase().includes(loweredSearch) ||
          candidate.statusLabel.toLowerCase().includes(loweredSearch)
        );
      });

      // Separate pending candidates from passed/failed/shortlisted
      // Pending: shown as count-only in status page
      // Passed/Failed/Shortlisted: shown as expandable candidate cards with history
      const pendingCandidates = filteredCandidates.filter(c => normalizePipelineStatus(c.pipelineStatus) === 'other');
      const groupedCandidates: Record<PipelineStatusGroup, PipelineStatusCandidate[]> = {
        passed: [],
        failed: [],
        shortlisted: [],
      };
      for (const candidate of filteredCandidates) {
        const normalizedStatus = normalizePipelineStatus(candidate.pipelineStatus);
        if (normalizedStatus !== "other") {
          groupedCandidates[normalizedStatus].push(candidate);
        }
      }

      return {
        stepId: step.id,
        stepTitle: step.process_title || getProcessTypeLabel(step.process_type),
        processType: step.process_type,
        stepInterviewerId: step.interviewerId,
        candidates: pendingCandidates,
        groupedCandidates,
      };
    });
  }, [pipelineSteps, searchTerm]);

  const defaultActiveStepId = useMemo(() => {
    if (queryType) {
      const matchingStep = pipelineSteps.find((step) => step.process_type === queryType);
      if (matchingStep) {
        return matchingStep.id;
      }
    }

    return pipelineSteps[0]?.id ?? "";
  }, [pipelineSteps, queryType]);

  useEffect(() => {
    if (!defaultActiveStepId) {
      return;
    }

    setActiveStepId((currentValue) => currentValue || defaultActiveStepId);
  }, [defaultActiveStepId]);

  const updateSearchParams = (nextSearchTerm = searchTerm) => {
    const nextParams: Record<string, string> = {};

    if (nextSearchTerm.trim().length > 0) {
      nextParams.q = nextSearchTerm;
    }

    setSearchParams(nextParams);
  };

  // Compute step-specific counts for the active step
  const activeStepCounts = useMemo(() => {
    const activeSummary = stepSummaries.find(s => s.stepId === (activeStepId || defaultActiveStepId));
    if (!activeSummary) {
      return { passed: 0, failed: 0, shortlisted: 0, pending: 0 };
    }
    return {
      passed: activeSummary.groupedCandidates.passed.length,
      failed: activeSummary.groupedCandidates.failed.length,
      shortlisted: activeSummary.groupedCandidates.shortlisted.length,
      pending: activeSummary.candidates.length,
    };
  }, [stepSummaries, activeStepId, defaultActiveStepId]);

  // Calculate movement summaries
  const movementSummaries = useMemo(() => {
    const summary = {
      shortlistToPassed: movements.filter(m => m.movement_type === 'shortlist_to_passed'),
      shortlistToFailed: movements.filter(m => m.movement_type === 'shortlist_to_failed'),
      total: movements.length,
    };
    return summary;
  }, [movements]);

  // Reset date range
  const handleResetDateRange = () => {
    setDateRange({ from: null, to: null });
  };

  const handleBackToPipeline = () => {
    if (!jobId) {
      return;
    }

    const nextParams = new URLSearchParams();

    if (queryType) {
      nextParams.set("type", queryType);
    }

    if (searchTerm.trim().length > 0) {
      nextParams.set("q", searchTerm);
    }

    navigate(`/job/${jobId}/applicants?${nextParams.toString()}`);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 mt-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-red-200 bg-white p-6 text-red-600 shadow-sm">
          Unable to load the pipeline status page.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-emerald-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToPipeline}
                className="self-start px-2 text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to pipeline
              </Button>

              <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold text-slate-900">Pipeline Status Overview</h1>
                  <Badge variant="outline" className="rounded-full border-emerald-300 bg-white/80 text-emerald-800">
                    All pipeline steps
                  </Badge>
                </div>
                <p className="max-w-3xl text-sm text-slate-600">
                  Review {resolvedJobTitle} across every pipeline step. The counts below aggregate candidates by outcome within each step.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              Full-page review view
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1fr_auto] lg:items-center">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Current pipeline context</span>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {queryType ? getProcessTypeLabel(queryType) : "All stages"}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Search</span>
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by candidate name, ID, or department"
                value={searchTerm}
                onChange={(event) => updateSearchParams(event.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleBackToPipeline}
            className="h-10 px-4 text-slate-700 border-slate-300 bg-white hover:bg-slate-900 hover:text-white"
          >
            Open pipeline view
          </Button>
        </div>

        <Card className="border-slate-200 shadow-sm bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">Candidate Movement Tracker</CardTitle>
            <CardDescription className="text-slate-600">
              Track when candidates move from shortlisted to passed/failed status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Date From</label>
                <Input
                  type="date"
                  value={dateRange.from?.toISOString().split('T')[0] ?? ''}
                  onChange={(e) =>
                    setDateRange(prev => ({
                      ...prev,
                      from: e.target.value ? new Date(e.target.value) : null,
                    }))
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Date To</label>
                <Input
                  type="date"
                  value={dateRange.to?.toISOString().split('T')[0] ?? ''}
                  onChange={(e) =>
                    setDateRange(prev => ({
                      ...prev,
                      to: e.target.value ? new Date(e.target.value) : null,
                    }))
                  }
                  className="mt-2"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetDateRange}
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>

            {loadingMovements ? (
              <div className="text-center text-sm text-slate-500 py-4">
                Loading movements...
              </div>
            ) : movementSummaries.total > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-green-100 p-3">
                  <div className="text-sm font-medium text-green-900">
                    {movementSummaries.shortlistToPassed.length} Moved to Passed
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    From shortlisted status
                  </div>
                </div>
                <div className="rounded-lg bg-red-100 p-3">
                  <div className="text-sm font-medium text-red-900">
                    {movementSummaries.shortlistToFailed.length} Moved to Failed
                  </div>
                  <div className="text-xs text-red-700 mt-1">
                    From shortlisted status
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-slate-500 py-4">
                No movements recorded for the selected date range
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading pipeline status data...
          </div>
        ) : null}

        {!isLoading && pipelineSteps.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            No pipeline stages are configured for this job.
          </div>
        ) : null}

        {!isLoading && pipelineSteps.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {(["passed", "failed", "shortlisted"] as const).map((status) => (
                <Card key={status} className="border-slate-200 shadow-sm">
                  <CardHeader className="space-y-2 pb-3">
                    <CardTitle className="text-lg capitalize text-slate-900">{status}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {activeStepCounts[status]} candidate{activeStepCounts[status] === 1 ? "" : "s"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className={getStatusBadgeClassName(status)}>
                      {status.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs value={activeStepId || defaultActiveStepId} onValueChange={setActiveStepId} className="space-y-4">
              <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-transparent p-0 md:grid-cols-2 xl:grid-cols-3">
                {stepSummaries.map((summary) => (
                  <TabsTrigger key={summary.stepId} value={summary.stepId} className="justify-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left data-[state=active]:border-emerald-300 data-[state=active]:bg-emerald-50">
                    <div className="flex w-full flex-col gap-1">
                      <span className="font-medium text-slate-900">{summary.stepTitle}</span>
                      <span className="text-xs text-slate-500">{getProcessTypeLabel(summary.processType)}</span>
                      <span className="text-xs text-slate-600">
                        {summary.candidates.length} candidate{summary.candidates.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {stepSummaries.map((summary) => (
                <TabsContent key={summary.stepId} value={summary.stepId}>
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <CardTitle className="text-xl text-slate-900">{summary.stepTitle}</CardTitle>
                          <CardDescription className="text-slate-600">
                            Candidates for {getProcessTypeLabel(summary.processType)} grouped by outcome.
                            <span className="ml-2 inline text-sm font-medium text-slate-700">
                              Pending: {summary.candidates.length}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(["passed", "failed", "shortlisted"] as const).map((status) => {
                        const candidates = summary.groupedCandidates[status];

                        return (
                          <div key={status} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getStatusBadgeClassName(status)}>
                                  {status.toUpperCase()}
                                </Badge>
                                <span className="text-sm font-medium text-slate-700">
                                  {candidates.length} candidate{candidates.length === 1 ? "" : "s"}
                                </span>
                              </div>
                            </div>

                            {candidates.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                No {status} candidates found in this pipeline step.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {candidates.map((candidate) => (
                                  <div key={candidate.id} className="space-y-2">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-2">
                                      <button
                                        onClick={() => handleToggleCandidateHistory(candidate.id)}
                                        className="flex-1 text-left rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition-colors flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                                      >
                                        <div className="flex min-w-0 items-center gap-3 flex-1">
                                          <Avatar className="h-12 w-12 shrink-0 rounded-sm">
                                            <AvatarImage src={candidate.photoUrl || "/placeholder.svg"} className="object-cover" />
                                            <AvatarFallback className="rounded-sm">{getCandidateInitials(candidate.name)}</AvatarFallback>
                                          </Avatar>
                                          <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-slate-900">{candidate.name}</div>
                                            <div className="text-xs text-slate-500">ID #{String(candidate.id).padStart(3, "0")}</div>
                                            <div className="text-xs text-slate-500">{candidate.department}</div>
                                          </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                          <Badge variant="outline" className={getStatusBadgeClassName(status)}>
                                            {candidate.statusLabel}
                                          </Badge>
                                          {candidate.pipelineStepId ? (
                                            <Badge variant="outline" className="border-slate-300 text-slate-600">
                                              Step #{candidate.pipelineStepId}
                                            </Badge>
                                          ) : null}
                                        </div>
                                      </button>

                                      {status === "shortlisted" && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleOpenShortlistModal(candidate, candidate.id, summary.stepInterviewerId)}
                                          disabled={!summary.stepInterviewerId || user?.id !== summary.stepInterviewerId}
                                          title={
                                            !summary.stepInterviewerId || user?.id !== summary.stepInterviewerId
                                              ? "Only the assigned interviewer can change this status."
                                              : undefined
                                          }
                                          className="h-10 shrink-0 bg-emerald-600 px-3 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                                        >
                                          Change Status
                                        </Button>
                                      )}
                                    </div>

                                    {expandedCandidateId === candidate.id && candidateHistories[candidate.id] && (
                                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                                        <div className="text-sm font-medium text-amber-900">Status History Timeline</div>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                          {candidateHistories[candidate.id].map((history) => (
                                            <div key={history.id} className="text-sm border-l-2 border-amber-300 pl-3 pb-2">
                                              <div className="flex items-center justify-between">
                                                <span className="font-medium text-amber-900">
                                                  {history.previous_status_label || 'Initial'} → {history.new_status_label}
                                                </span>
                                                <span className="text-xs text-amber-700">
                                                  {new Date(history.created_at).toLocaleDateString()}
                                                </span>
                                              </div>
                                              <div className="text-xs text-amber-700 mt-1">
                                                Changed by: {history.updated_by_name} ({history.updated_by_email})
                                              </div>
                                              {history.remarks && (
                                                <div className="text-xs text-amber-600 mt-1 italic">
                                                  Remarks: {history.remarks}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </>
        ) : null}
      </div>

      {/* Shortlist Status Modal */}
      <ShortlistStatusModal
        isOpen={isShortlistModalOpen}
        onClose={handleCloseShortlistModal}
        candidate={selectedCandidateForStatus}
        candidateApplicationId={selectedCandidateForStatus?.candidateApplicationId || 0}
        pipelineStepId={selectedCandidateForStatus?.pipelineStepId || 0}
        canChangeStatus={selectedCandidateForStatus ? user?.id === selectedCandidateForStatus.stepInterviewerId : false}
        onStatusChange={handleStatusChangeSuccess}
      />
    </div>
  );
}