import type { JobPipelineStep } from "../types/job.types";

const STAGE_TITLE_BY_NUMBER: Record<number, string> = {
  1: "STAGE 01 - HR Interview",
  2: "STAGE 02 - Hiring Manager/Client",
  3: "STAGE 03 - Final Stage",
};

const PROCESS_TYPE_LABELS: Record<string, string> = {
  resume_screening: "Resume Screening",
  phone_call_interview: "Phone Call Interview",
  shortlisted: "Shortlisted",
  initial_interview: "Initial Interview",
  assessments: "Assessments",
  final_interview: "Final Interview",
  for_job_offer: "For Job Offer",
  pre_onboarding: "Requirements Sent",
  onboarding: "Onboarding",
  failed: "Failed",
};

const PROCESS_TYPE_ROUTE_SEGMENTS: Record<
  string,
  { segment: string; customFinalStage: boolean }
> = {
  resume_screening: { segment: "resumescreening", customFinalStage: false },
  phone_call_interview: {
    segment: "phonecallinterview",
    customFinalStage: false,
  },
  shortlisted: { segment: "shortlisted", customFinalStage: false },
  initial_interview: { segment: "initialinterview", customFinalStage: false },
  assessments: { segment: "assessments", customFinalStage: false },
  final_interview: { segment: "finalinterview", customFinalStage: false },
  for_job_offer: { segment: "forjoboffer", customFinalStage: false },
  pre_onboarding: {
    segment: "preonboarding",
    customFinalStage: false,
  },
  onboarding: { segment: "Onboarding", customFinalStage: true },
  failed: { segment: "Failed", customFinalStage: true },
};

/**
 * Formats a job title slug into a human-readable title
 * @param slug - The URL-friendly job title slug
 * @returns The formatted job title
 */
export function formatJobTitle(slug?: string): string {
  if (!slug) return "Unknown Job";

  const titleMap: Record<string, string> = {
    projectmanager: "Project Manager",
    socialcontentmanager: "Social Content Manager",
    senioruiuxdesigner: "Senior UI UX Designer",
    leaddeveloper: "Lead Developer",
    customersupport: "Customer Support",
    qaengineer: "QA Engineer",
    humanresourcescoordinator: "Human Resources Coordinator",
    operationsmanager: "Operations Manager",
    socialmediamanager: "Social Media Manager",
    marketingspecialist: "Marketing Specialist",
  };

  const normalizedSlug = normalizeJobToken(slug);

  if (titleMap[normalizedSlug]) {
    return titleMap[normalizedSlug];
  }

  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizeJobToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Converts a stage name into a URL-friendly slug
 * @param stageName - The human-readable stage name
 * @returns The URL-friendly stage slug
 */
export function formatStageSlug(stageName: string): string {
  return stageName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Mapping of custom final stages to their route segments
 */
export const CUSTOM_STAGE_ROUTES: Record<string, string> = {
  "For Offer and Finalization": "OfferAndFinalization",
  "Pre-Onboarding": "PreOnboarding",
  Onboarding: "Onboarding",
  Failed: "Failed",
};

/**
 * Checks if a stage is a custom final stage
 * @param stageName - The stage name to check
 * @returns True if the stage is a custom final stage
 */
export function isCustomFinalStage(stageName: string): boolean {
  return Object.prototype.hasOwnProperty.call(CUSTOM_STAGE_ROUTES, stageName);
}

/**
 * Gets the appropriate route path for a stage
 * @param stageName - The stage name
 * @param jobId - The job id (optional for custom final stages)
 * @returns The complete route path
 */
export function getStageRoutePath(stageName: string, jobId?: string): string {
  const isCustomStage = isCustomFinalStage(stageName);

  if (isCustomStage) {
    const stageSlug = CUSTOM_STAGE_ROUTES[stageName];
    return `/job/stage/${stageSlug}`;
  }

  const stageSlug = formatStageSlug(stageName);
  return `/job/${jobId}/${stageSlug}`;
}

export function getProcessTypeLabel(processType: string): string {
  if (PROCESS_TYPE_LABELS[processType]) {
    return PROCESS_TYPE_LABELS[processType];
  }

  return processType
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getStageRoutePathFromProcessType(
  processType: string,
  jobId?: string,
): string | null {
  const routeConfig = PROCESS_TYPE_ROUTE_SEGMENTS[processType];

  if (!routeConfig) {
    return null;
  }

  if (routeConfig.customFinalStage) {
    return `/job/stage/${routeConfig.segment}`;
  }

  return `/job/${jobId}/applicants?type=${encodeURIComponent(processType)}`;
}

export function getProcessTypeFromRouteSegment(
  routeSegment?: string,
): string | null {
  if (!routeSegment) {
    return null;
  }

  const normalizedSegment = routeSegment.toLowerCase();
  const routeEntry = Object.entries(PROCESS_TYPE_ROUTE_SEGMENTS).find(
    ([, value]) => value.segment.toLowerCase() === normalizedSegment,
  );

  return routeEntry?.[0] ?? null;
}

export interface JobPipelineStageGroup {
  stage: number;
  title: string;
  steps: JobPipelineStep[];
}

export function groupPipelineStepsByStage(
  steps: JobPipelineStep[],
): JobPipelineStageGroup[] {
  const grouped = new Map<number, JobPipelineStep[]>();

  for (const step of steps) {
    const stageSteps = grouped.get(step.stage) ?? [];
    stageSteps.push(step);
    grouped.set(step.stage, stageSteps);
  }

  return Array.from(grouped.entries())
    .sort(([leftStage], [rightStage]) => leftStage - rightStage)
    .map(([stage, stageSteps]) => ({
      stage,
      title:
        STAGE_TITLE_BY_NUMBER[stage] ??
        `STAGE ${String(stage).padStart(2, "0")}`,
      steps: [...stageSteps].sort((left, right) => left.order - right.order),
    }));
}
