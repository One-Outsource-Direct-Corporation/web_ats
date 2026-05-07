import PipelineConfiguration from "@/shared/components/reusables/PipelineConfiguration";
import { usePipeline } from "@/shared/hooks/usePipeline";
import type { PRFFormData } from "@/features/prf_2/types/PRFFormData";
import type { PipelineStep, PipelineStepLocal } from "@/shared/types/pipeline.types";
import type React from "react";
import type { ValidationError } from "@/features/prf_2/utils/validateSteps";
import { FieldError } from "@/shared/components/ui/field";
import { useMemo } from "react";

const PASSED_BODY =
  "Dear {{ candidate_name }},\n\n" +
  "We are pleased to inform you that you have successfully completed the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
  "We will be in touch with further details regarding the next steps.\n\n" +
  "Best regards,\n" +
  "{{ interviewer_name }}\n" +
  "{{ interviewer_role }}\n" +
  "{{ company_name }}";

const FAILED_BODY =
  "Dear {{ candidate_name }},\n\n" +
  "Thank you for your participation in the {{ pipeline_step_process_type_label }} for the position of {{ job_title }}. " +
  "After careful consideration, we regret to inform you that you have not been successful on this occasion.\n\n" +
  "We appreciate your interest and wish you all the best in your future endeavors.\n\n" +
  "Best regards,\n" +
  "{{ interviewer_name }}\n" +
  "{{ interviewer_role }}\n" +
  "{{ company_name }}";

const MANDATORY_STAGE_04_CONFIGS: Omit<PipelineStepLocal, "tempId">[] = [
  {
    process_type: "for_job_offer",
    process_title: "For Job Offer",
    description: "",
    order: 1,
    stage: 4,
    interviewer: null,
    passedEmailTemplateId: null,
    failedEmailTemplateId: null,
    notification_templates: [
      { action_type: "send_email", trigger_outcome: "passed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: PASSED_BODY },
      { action_type: "send_email", trigger_outcome: "failed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: FAILED_BODY },
    ],
    assessments: [],
  },
  {
    process_type: "pre_onboarding",
    process_title: "Pre-Onboarding",
    description: "",
    order: 2,
    stage: 4,
    interviewer: null,
    passedEmailTemplateId: null,
    failedEmailTemplateId: null,
    notification_templates: [
      { action_type: "send_email", trigger_outcome: "passed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: PASSED_BODY },
      { action_type: "send_email", trigger_outcome: "failed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: FAILED_BODY },
    ],
    assessments: [],
  },
  {
    process_type: "onboarding",
    process_title: "Onboarding",
    description: "",
    order: 3,
    stage: 4,
    interviewer: null,
    passedEmailTemplateId: null,
    failedEmailTemplateId: null,
    notification_templates: [
      { action_type: "send_email", trigger_outcome: "passed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: PASSED_BODY },
      { action_type: "send_email", trigger_outcome: "failed", subject: "{{ pipeline_step_process_type_label }} - {{ job_title }}", body: FAILED_BODY },
    ],
    assessments: [],
  },
];

function ensureMandatoryStage04Steps(
  pipeline: PipelineStep[],
): PipelineStep[] {
  const existing = new Set(
    pipeline
      .filter((s) => s.stage === 4)
      .map((s) => (s as PipelineStepLocal).tempId || (s as any).id)
  );

  const existingTypes = new Set(
    pipeline.filter((s) => s.stage === 4).map((s) => s.process_type)
  );

  const missing = MANDATORY_STAGE_04_CONFIGS.filter(
    (config) => !existingTypes.has(config.process_type)
  );

  if (missing.length === 0) {
    return pipeline;
  }

  const merged = [...pipeline];
  missing.forEach((config, index) => {
    const stepsInStage = merged.filter((s) => s.stage === 4);
    const nextOrder = stepsInStage.length + 1;
    merged.push({
      ...config,
      tempId: `default-${config.process_type}-${Date.now()}-${index}`,
      order: nextOrder,
    } as PipelineStepLocal);
  });

  return merged;
}

interface PRFStep05Props {
  formData: PRFFormData;
  updateFormData: React.Dispatch<React.SetStateAction<PRFFormData>>;
  errors?: ValidationError | null;
}

export default function PRFStep05({
  formData,
  updateFormData,
  errors,
}: PRFStep05Props) {
  const enforcedPipeline = useMemo(
    () => ensureMandatoryStage04Steps(formData.pipeline_input),
    [formData.pipeline_input]
  );

  const pipelineHandler = (updatedPipelines: PRFFormData["pipeline_input"]) => {
    updateFormData((prev) => ({
      ...prev,
      pipeline_input: updatedPipelines,
    }));
  };

  const { pipelines, addPipelineStep, updatePipelineStep, deletePipelineStep } =
    usePipeline(enforcedPipeline, pipelineHandler);

  const pipelineErrors = errors?.pipeline ?? errors?.pipeline_input;
  const normalizedPipelineErrors = errors
    ? { ...errors, pipeline: pipelineErrors }
    : undefined;

  return (
    <div className="lg:col-span-3 space-y-6">
      {Array.isArray(pipelineErrors) &&
        pipelineErrors.length > 0 &&
        typeof pipelineErrors[0] === "string" && (
          <FieldError>{pipelineErrors[0]}</FieldError>
        )}
      <PipelineConfiguration
        pipelineSteps={pipelines}
        addPipelineStep={addPipelineStep}
        updatePipelineStep={updatePipelineStep}
        deletePipelineStep={deletePipelineStep}
        errors={normalizedPipelineErrors}
        jobTitle={formData.job_posting.job_title ?? ""}
      />
    </div>
  );
}
