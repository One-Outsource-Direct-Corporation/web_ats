export interface PlaceholderContext {
  candidate_name?: string;
  applicant_name?: string;
  job_title?: string;
  pipeline_step_title?: string;
  pipeline_step_process_type?: string;
  pipeline_step_process_type_label?: string;
  interviewer_name?: string;
  interviewer_role?: string;
  company_name?: string;
  outcome?: string;
}

export function renderPlaceholders(
  text: string,
  context: PlaceholderContext,
): string {
  let result = String(text ?? "");
  for (const [key, value] of Object.entries(context)) {
    const resolved = String(value ?? "");
    result = result.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"), resolved);
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), resolved);
  }
  return result;
}
