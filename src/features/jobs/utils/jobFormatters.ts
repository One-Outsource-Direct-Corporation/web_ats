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

  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "");

  return (
    titleMap[normalizedSlug] || slug.replace(/([a-z])([A-Z])/g, "$1 $2").trim()
  );
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
  Onboarding: "Onboarding",
  Warm: "Warm",
  Failed: "Failed",
};

/**
 * Checks if a stage is a custom final stage
 * @param stageName - The stage name to check
 * @returns True if the stage is a custom final stage
 */
export function isCustomFinalStage(stageName: string): boolean {
  return CUSTOM_STAGE_ROUTES.hasOwnProperty(stageName);
}

/**
 * Gets the appropriate route path for a stage
 * @param stageName - The stage name
 * @param jobSlug - The job title slug (optional for custom final stages)
 * @returns The complete route path
 */
export function getStageRoutePath(stageName: string, jobSlug?: string): string {
  const isCustomStage = isCustomFinalStage(stageName);

  if (isCustomStage) {
    const stageSlug = CUSTOM_STAGE_ROUTES[stageName];
    return `/job/stage/${stageSlug}`;
  }

  const stageSlug = formatStageSlug(stageName);
  return `/job/${jobSlug}/${stageSlug}`;
}
