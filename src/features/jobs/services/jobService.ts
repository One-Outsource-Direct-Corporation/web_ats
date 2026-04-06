import { defaultAxios } from "@/config/axios";
import type {
  JobDetailResponseDto,
  JobListItem,
  JobPipelineStep,
  JobPipelineStepResponseDto,
  JobPostingListResponseDto,
  JobPostingResponseDto,
  JobQueryResult,
} from "../types/job.types";

const toJobListItem = (jobPosting: JobPostingResponseDto): JobListItem => ({
  id: String(jobPosting.id),
  title: jobPosting.job_title,
  created: new Date(jobPosting.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }),
  vacancies: jobPosting.number_of_vacancies,
  status: jobPosting.status,
  department: jobPosting.department_name ?? undefined,
  employmentType: jobPosting.employment_type ?? undefined,
});

export async function getJobsResponse(): Promise<JobQueryResult> {
  const response =
    await defaultAxios.get<JobPostingListResponseDto>("/api/job/");
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

  return {
    id: String(step.id ?? `${stage}-${order}-${index}`),
    process_type: step.process_type,
    process_title: (step.process_title ?? "").trim(),
    stage,
    order,
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
): Promise<JobDetailResponseDto> {
  const response = await defaultAxios.get<JobDetailResponseDto>(
    `/api/job/${jobId}/`,
  );
  return response.data;
}
