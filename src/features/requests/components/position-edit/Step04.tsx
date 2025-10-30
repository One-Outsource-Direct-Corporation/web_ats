import PipelineConfiguration from "@/shared/components/reusables/PipelineConfiguration";
import type { PipelineStep } from "@/features/positions-client/types/create_position.types";
import type { JobPostingResponsePosition } from "@/features/jobs/types/job.types";

export default function Step04({
  formData,
  setFormData,
  errors,
}: {
  formData: JobPostingResponsePosition;
  setFormData: (data: JobPostingResponsePosition) => void;
  errors?: any;
}) {
  const handlePipelineStep = (
    pipeline_identifier: number,
    data: PipelineStep
  ) => {
    // Check if updating existing DB record (has id and position)
    const existingDbIndex = formData.pipeline.findIndex(
      (step) => step.id === pipeline_identifier && step.position === formData.id
    );

    // Check if updating newly added step (has pipeline_identifier)
    const existingNewIndex = formData.pipeline.findIndex(
      (step) => (step as any).pipeline_identifier === pipeline_identifier
    );

    if (existingDbIndex >= 0) {
      // Update existing DB step - preserve id and position
      const updatedPipeline = [...formData.pipeline];
      const existingStep = updatedPipeline[existingDbIndex];
      updatedPipeline[existingDbIndex] = {
        ...existingStep,
        ...data,
        id: existingStep.id,
        position: existingStep.position,
        process_type_display: data.process_type
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      };
      setFormData({
        ...formData,
        pipeline: updatedPipeline,
      });
    } else if (existingNewIndex >= 0) {
      // Update newly added step - keep pipeline_identifier
      const updatedPipeline = [...formData.pipeline];
      updatedPipeline[existingNewIndex] = {
        ...data,
        pipeline_identifier,
        process_type_display: data.process_type
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      } as any;
      setFormData({
        ...formData,
        pipeline: updatedPipeline,
      });
    } else {
      // Add new step - use pipeline_identifier only (no id or position)
      const newStep = {
        ...data,
        pipeline_identifier,
        process_type_display: data.process_type
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      };
      setFormData({
        ...formData,
        pipeline: [...formData.pipeline, newStep] as any,
      });
    }
  };

  const handlePipelineDelete = (pipeline_identifier: number) => {
    const updatedPipeline = formData.pipeline
      .map((step) => {
        // Check if this is an existing DB record (has id and position from API)
        const isExistingRecord =
          step.id === pipeline_identifier && step.position === formData.id;

        if (isExistingRecord) {
          // Mark for deletion instead of removing
          return { ...step, _delete: true } as any;
        }

        // Check if this is a newly added step (has pipeline_identifier)
        const isNewStep =
          (step as any).pipeline_identifier === pipeline_identifier;
        if (isNewStep) {
          // Return null to filter out later (newly added steps are removed completely)
          return null;
        }

        return step;
      })
      .filter((step) => step !== null); // Remove newly added steps that were deleted

    setFormData({
      ...formData,
      pipeline: updatedPipeline as any,
    });
  };

  // Filter out deleted items for display
  const visiblePipelineSteps = formData.pipeline.filter(
    (step) => !(step as any)._delete
  );

  return (
    <PipelineConfiguration
      pipelineSteps={visiblePipelineSteps}
      pipelineHandler={handlePipelineStep}
      pipelineDeleteHandler={handlePipelineDelete}
      errors={errors}
      title="Edit Pipeline Configuration"
    />
  );
}
