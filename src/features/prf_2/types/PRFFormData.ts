import type { JobPostingCreatePayload } from "@/features/jobs/types/JobPosting.ts";
import type { PRFCreatePayload } from "@/features/prf_2/types/PRF.ts";
import type { ApplicationFormInputPayload } from "@/shared/types/application_form_input.types.ts";
import type { PipelineInputFormState } from "@/shared/types/pipeline_input.types.ts";

export type PRFJobPostingFormData = JobPostingCreatePayload & {
  id?: number;
};

export interface PRFFormData {
  job_posting: PRFJobPostingFormData;
  prf_input: PRFCreatePayload;
  application_form_input: ApplicationFormInputPayload;
  pipeline_input: PipelineInputFormState;
}
