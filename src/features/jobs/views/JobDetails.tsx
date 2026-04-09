import { useEffect, useMemo, useState } from "react";
import { useJobBySlug, useJobDetailQuery, useJobs } from "../hooks/useJobs";
import { extractPipelineStepsFromJobDetail } from "../services/jobService";
import { Input } from "@/shared/components/ui/input.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { ArrowLeft, LayoutGrid, List } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import type { JobPipelineStep } from "../types/job.types";
import {
  formatJobTitle,
  getProcessTypeLabel,
  getStageRoutePathFromProcessType,
  groupPipelineStepsByStage,
  toCompactJobSlug,
} from "../utils/jobFormatters";
import formatName from "@/shared/utils/formatName";

interface JobRouteState {
  jobTitle?: string;
  jobId?: string;
}

export default function JobDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobtitle } = useParams<{ jobtitle: string }>();
  const jobs = useJobs();
  const jobBySlug = useJobBySlug(jobtitle);
  const routeState = (location.state ?? null) as JobRouteState | null;

  const [selectedStage, setSelectedStage] = useState<string>("");

  const jobFromStateById = useMemo(() => {
    if (!routeState?.jobId) {
      return undefined;
    }

    return jobs.find((item) => item.id === String(routeState.jobId));
  }, [jobs, routeState?.jobId]);

  const jobFromStateByTitle = useMemo(() => {
    if (!routeState?.jobTitle) {
      return undefined;
    }

    return jobs.find((item) => item.title === routeState.jobTitle);
  }, [jobs, routeState?.jobTitle]);

  const currentJob = jobFromStateById ?? jobBySlug ?? jobFromStateByTitle;
  const currentJobTitle =
    currentJob?.title ?? routeState?.jobTitle ?? formatJobTitle(jobtitle);
  const currentJobId =
    currentJob?.id ??
    (routeState?.jobId ? String(routeState.jobId) : undefined);

  const {
    data: jobDetail,
    isLoading,
    isError,
  } = useJobDetailQuery(currentJobId);

  const pipelineSteps = useMemo(
    () => extractPipelineStepsFromJobDetail(jobDetail),
    [jobDetail],
  );
  const groupedStages = useMemo(
    () => groupPipelineStepsByStage(pipelineSteps),
    [pipelineSteps],
  );

  const handleStageClick = (step: JobPipelineStep) => {
    const stageName =
      step.process_title || getProcessTypeLabel(step.process_type);
    setSelectedStage(stageName);

    const jobSlug = toCompactJobSlug(currentJobTitle);
    const path = getStageRoutePathFromProcessType(step.process_type, jobSlug);

    if (!path) {
      return;
    }

    navigate(path, {
      state: {
        jobTitle: currentJobTitle,
        stageName,
      },
    });
  };

  useEffect(() => {
    document.title = `Applicants - ${currentJobTitle || "Job Details"}`;
  }, [currentJobTitle]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/job/")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-3xl font-bold text-gray-800">
                  {currentJobTitle || "Job Details"}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    navigate(
                      `/job/${toCompactJobSlug(currentJobTitle)}/weekly`,
                      {
                        state: { jobTitle: currentJobTitle },
                      },
                    )
                  }
                >
                  <LayoutGrid className="text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon">
                  <List className="text-blue-800" />
                </Button>
              </div>
            </div>

            {/* Job Info Display */}
            {currentJob && (
              <div className="bg-white border rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <span className="ml-2 font-semibold">
                      {currentJob.department || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Employment Type:</span>
                    <span className="ml-2 font-semibold">
                      {formatName(currentJob.employmentType) || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 font-semibold">
                      {formatName(currentJob.status) || "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Stage Display */}
            {selectedStage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  Last selected stage:{" "}
                  <span className="font-semibold">{selectedStage}</span>
                </p>
              </div>
            )}

            {/* Search */}
            <div>
              <Input placeholder="Search" className="max-w-md bg-gray-100" />
            </div>

            <hr />

            {/* Stages */}
            <div className="space-y-10">
              {isLoading && (
                <div className="border rounded-md p-4 text-sm text-gray-500">
                  Loading pipeline...
                </div>
              )}

              {isError && (
                <div className="border rounded-md p-4 text-sm text-red-600">
                  Unable to load this job pipeline right now.
                </div>
              )}

              {!isLoading && !isError && groupedStages.length === 0 && (
                <div className="border rounded-md p-4 text-sm text-gray-500">
                  No pipeline is configured for this job yet.
                </div>
              )}

              {!isLoading &&
                !isError &&
                groupedStages.map((stage) => (
                  <div key={stage.stage} className="space-y-4">
                    <h2 className="text-md font-semibold text-gray-800">
                      {stage.title}
                    </h2>
                    <div className="border rounded-md divide-y">
                      {stage.steps.map((step) => (
                        <div
                          key={step.id}
                          className="flex justify-between items-center px-4 py-3 hover:bg-gray-50"
                        >
                          <span>
                            {step.process_title ||
                              getProcessTypeLabel(step.process_type)}
                          </span>
                          <Button
                            variant="link"
                            className="text-blue-600 text-sm px-0 hover:underline"
                            onClick={() => handleStageClick(step)}
                          >
                            View Applicants
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
