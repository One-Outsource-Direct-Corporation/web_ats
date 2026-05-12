import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { toast } from "react-toastify";

interface AssignToJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: {
    id: number;
    candidate_name: string;
    candidate_email: string;
  };
  onSuccess: () => void;
}

interface JobPosting {
  id: number;
  job_title: string;
  status: string;
  published: boolean;
  posted_by?: { id: number };
}

interface PipelineStage {
  stage: number;
  title: string;
  steps: PipelineStep[];
}

interface PipelineStep {
  id: number;
  process_type: string;
  process_title: string;
  stage: number;
  order: number;
  interviewer?: { id: number } | null;
}

export default function AssignToJobModal({
  open,
  onOpenChange,
  candidate,
  onSuccess,
}: AssignToJobModalProps) {
  const axiosPrivate = useAxiosPrivate();

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

  const { data: jobPostings } = useQuery({
    queryKey: ['accessible-job-postings'],
    queryFn: async () => {
      const response = await axiosPrivate.get('/api/job_posting/', {
        params: {
          status: 'active',
          published: true,
          exclude_applied_by_email: candidate.candidate_email,
        }
      });
      return response.data.results || [];
    },
    enabled: open,
  });

  const { data: pipelineStages } = useQuery({
    queryKey: ['job-pipeline', selectedJobId],
    queryFn: async () => {
      if (!selectedJobId) return [];
      const response = await axiosPrivate.get(`/api/job_posting/${selectedJobId}/`);
      const pipeline = response.data.prf?.pipeline || response.data.external_posting?.pipeline || [];

      const stagesMap = new Map<number, { stage: number; title: string; steps: PipelineStep[] }>();
      pipeline.forEach((step: PipelineStep) => {
        if (!stagesMap.has(step.stage)) {
          stagesMap.set(step.stage, {
            stage: step.stage,
            title: `Stage ${step.stage}`,
            steps: [],
          });
        }
        stagesMap.get(step.stage)!.steps.push(step);
      });

      return Array.from(stagesMap.values()).sort((a, b) => a.stage - b.stage);
    },
    enabled: !!selectedJobId,
  });

  useEffect(() => {
    if (!open) {
      setSelectedJobId(null);
      setSelectedStage(null);
      setSelectedStepId(null);
    }
  }, [open]);

  useEffect(() => {
    setSelectedStepId(null);
  }, [selectedStage]);

  const assignMutation = useMutation({
    mutationFn: async () => {
      if (!selectedJobId || !selectedStepId) {
        throw new Error('Job posting and pipeline step are required');
      }

      await axiosPrivate.post(`/api/candidate/talent-pool/${candidate.id}/assign_to_job/`, {
        job_posting_id: selectedJobId,
        pipeline_step_id: selectedStepId,
      });
    },
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to assign candidate to job');
    },
  });

  const handleAssign = () => {
    if (!selectedJobId || !selectedStepId) {
      toast.error('Please select a job posting and pipeline step');
      return;
    }
    assignMutation.mutate();
  };

  const selectedStageData = pipelineStages?.find(s => s.stage === selectedStage);
  const selectedStep = selectedStageData?.steps.find(s => s.id === selectedStepId);
  const allSteps = pipelineStages?.flatMap(s => s.steps) || [];
  const selectedStepIndex = allSteps.findIndex(s => s.id === selectedStepId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign to Job Posting</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium">{candidate.candidate_name}</p>
            <p className="text-xs text-gray-500">{candidate.candidate_email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Job Posting *
            </label>
            <Select
              value={selectedJobId?.toString() || ""}
              onValueChange={(value) => setSelectedJobId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a job posting" />
              </SelectTrigger>
              <SelectContent>
                {jobPostings?.map((job: JobPosting) => (
                  <SelectItem key={job.id} value={job.id.toString()}>
                    {job.job_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedJobId && pipelineStages && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Stage *
              </label>
              <Select
                value={selectedStage?.toString() || ""}
                onValueChange={(value) => setSelectedStage(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {pipelineStages.map((stage: PipelineStage) => (
                    <SelectItem key={stage.stage} value={stage.stage.toString()}>
                      {stage.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedStageData && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Pipeline Step *
              </label>
              <Select
                value={selectedStepId?.toString() || ""}
                onValueChange={(value) => setSelectedStepId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a step" />
                </SelectTrigger>
                <SelectContent>
                  {selectedStageData.steps.map((step: PipelineStep) => (
                    <SelectItem key={step.id} value={step.id.toString()}>
                      {step.process_title || step.process_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedStep && selectedStepIndex > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
              <p>
                Steps before <strong>{selectedStep.process_title || selectedStep.process_type}</strong> will be marked as skipped. The candidate will start at this step.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedJobId || !selectedStepId || assignMutation.isPending}
            className="bg-[#0056D2] hover:bg-[#0041a3]"
          >
            {assignMutation.isPending ? 'Assigning...' : 'Assign to Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
