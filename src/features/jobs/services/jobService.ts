import { axiosPrivate } from "@/config/axios";
import type { AxiosInstance } from "axios";
import type {
  JobDetailResponseDto,
  JobListItem,
  JobPipelineStep,
  JobPipelineStepResponseDto,
  JobPostingListResponseDto,
  JobPostingResponseDto,
  JobQueryResult,
} from "../types/job.types";

function formatDisplayDate(dateValue?: string | null): string {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function resolveMediaUrl(rawUrl?: string | null): string | undefined {
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
}

const toJobListItem = (jobPosting: JobPostingResponseDto): JobListItem => ({
  id: String(jobPosting.id),
  title: jobPosting.job_title,
  created: formatDisplayDate(jobPosting.created_at ?? jobPosting.updated_at),
  postingType: jobPosting.type ?? undefined,
  clientName: jobPosting.client_name ?? undefined,
  vacancies:
    typeof jobPosting.number_of_vacancies === "number"
      ? jobPosting.number_of_vacancies
      : undefined,
  totalCandidates:
    typeof jobPosting.total_candidates === "number"
      ? jobPosting.total_candidates
      : undefined,
  status: jobPosting.status ?? undefined,
  department:
    jobPosting.department?.name ?? jobPosting.department_name ?? undefined,
  employmentType: jobPosting.employment_type ?? undefined,
});

export async function getJobsResponse(
  options?: { httpClient?: AxiosInstance },
): Promise<JobQueryResult> {
  const httpClient = options?.httpClient ?? axiosPrivate;
  const response =
    await httpClient.get<JobPostingListResponseDto>("/api/job/");
  return response.data.results.map(toJobListItem);
}

function isPipelineStepResponseDto(
  value: unknown,
): value is JobPipelineStepResponseDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<JobPipelineStepResponseDto>;
  return typeof candidate.process_type === "string";
}

function readPipelineFromSource(
  source: unknown,
): JobPipelineStepResponseDto[] | null {
  if (typeof source !== "object" || source === null) {
    return null;
  }

  const maybePipeline = (source as { pipeline?: unknown }).pipeline;
  if (!Array.isArray(maybePipeline)) {
    return null;
  }

  return maybePipeline.filter(isPipelineStepResponseDto);
}

function toPipelineStep(
  step: JobPipelineStepResponseDto,
  index: number,
): JobPipelineStep {
  const stage = typeof step.stage === "number" ? step.stage : 0;
  const order = typeof step.order === "number" ? step.order : index + 1;
  const interviewerFirstName =
    typeof step.interviewer?.first_name === "string"
      ? step.interviewer.first_name.trim()
      : "";
  const interviewerLastName =
    typeof step.interviewer?.last_name === "string"
      ? step.interviewer.last_name.trim()
      : "";
  const interviewerName = step.interviewer
    ? `${interviewerFirstName} ${interviewerLastName}`.trim() || step.interviewer.email
    : undefined;
  const candidateApplicationIds = Array.isArray(step.candidate_application_ids)
    ? step.candidate_application_ids.filter(
        (candidateId): candidateId is number =>
          typeof candidateId === "number",
      )
    : [];
  const candidateApplications = Array.isArray(step.candidate_applications)
    ? step.candidate_applications
        .filter(
          (candidate) =>
            typeof candidate?.id === "number" &&
            typeof candidate?.name === "string" &&
            typeof candidate?.status === "string" &&
            typeof candidate?.status_label === "string",
        )
        .map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          status: candidate.status,
          statusLabel: candidate.status_label,
          pipelineStepId:
            typeof candidate.pipeline_step_id === "number"
              ? candidate.pipeline_step_id
              : undefined,
          pipelineStatus:
            typeof candidate.pipeline_status === "string"
              ? candidate.pipeline_status
              : undefined,
          pipelineStatusLabel:
            typeof candidate.pipeline_status_label === "string"
              ? candidate.pipeline_status_label
              : undefined,
          scheduledFor:
            typeof candidate.scheduled_for === "string"
              ? candidate.scheduled_for
              : undefined,
          assignedInterviewerName:
            typeof candidate.assigned_interviewer_name === "string"
              ? candidate.assigned_interviewer_name
              : undefined,
          assignedInterviewerEmail:
            typeof candidate.assigned_interviewer_email === "string"
              ? candidate.assigned_interviewer_email
              : undefined,
          department:
            typeof candidate.department === "string"
              ? candidate.department
              : undefined,
          photoUrl:
            typeof candidate.photo_url === "string"
              ? resolveMediaUrl(candidate.photo_url)
              : undefined,
          resumeUrl:
            typeof candidate.resume_url === "string"
              ? resolveMediaUrl(candidate.resume_url)
              : undefined,
          applicationFormSnapshot:
            typeof (candidate as unknown as Record<string, unknown>).application_form_snapshot === "object"
              ? (candidate as unknown as Record<string, unknown>).application_form_snapshot as Record<string, unknown>
              : (candidate as unknown as { applicationFormSnapshot?: Record<string, unknown> }).applicationFormSnapshot ?? {},
        }))
    : [];

  const assessments = Array.isArray(step.assessments)
    ? step.assessments
        .filter(
          (a) => typeof a?.id === "number",
        )
        .map((a) => ({
          id: a.id,
          type_label: a.type_label ?? null,
          type: a.type ?? null,
          file: a.file ?? null,
        }))
    : [];

  return {
    id: String(step.id ?? `${stage}-${order}-${index}`),
    process_type: step.process_type,
    process_title: (step.process_title ?? "").trim(),
    stage,
    order,
    interviewerName,
    interviewerEmail: step.interviewer?.email,
    interviewerId: step.interviewer?.id,
    candidateApplicationIds,
    candidateApplications,
    assessments,
  };
}

export function extractPipelineStepsFromJobDetail(
  detail?: JobDetailResponseDto | null,
): JobPipelineStep[] {
  if (!detail) {
    return [];
  }

  const sources = [
    detail.prf_nested,
    detail.prf,
    detail.external_posting_nested,
    detail.external_posting,
  ];

  for (const source of sources) {
    const pipeline = readPipelineFromSource(source);
    if (!pipeline || pipeline.length === 0) {
      continue;
    }

    return pipeline
      .map(toPipelineStep)
      .sort(
        (left, right) => left.stage - right.stage || left.order - right.order,
      );
  }

  return [];
}

export async function getJobDetailResponse(
  jobId: number | string,
  includeAllStatuses?: boolean,
  options?: { httpClient?: AxiosInstance },
): Promise<JobDetailResponseDto> {
  const httpClient = options?.httpClient ?? axiosPrivate;
  const params = includeAllStatuses ? { include_all_statuses: true } : {};
  const response = await httpClient.get<JobDetailResponseDto>(
    `/api/job/${jobId}/`,
    { params },
  );
  return response.data;
}
