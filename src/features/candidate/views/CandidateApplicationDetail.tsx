import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { queryKeys } from "@/shared/query-keys";
import { FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ApplicationDetail {
  job_title: string;
  pipeline_steps?: Array<{
    id?: number;
    status: string;
    status_label: string;
    process_type_label: string;
    scheduled_for: string | null;
  }>;
  assessments?: Array<{
    id: number;
    assessment?: {
      type_label?: string | null;
      type?: string | null;
    } | null;
    status?: string;
    is_submitted?: boolean;
    is_graded?: boolean;
    is_sent?: boolean;
    score?: number | null;
    candidate_pipeline_step?: number | null;
  }>;
}

export default function CandidateApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { data: app, isLoading } = useQuery({
    queryKey: queryKeys.candidates.application(id!),
    queryFn: async () => {
      const res = await axiosPrivate.get(`/api/candidate/me/applications/${id}/`);
      return res.data as ApplicationDetail;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!app) return <div className="p-6">Application not found.</div>;

  const assessments = app.assessments || [];

  const assessmentsByStep = new Map<number, typeof assessments>();
  assessments.forEach(a => {
    if (a.candidate_pipeline_step != null) {
      const existing = assessmentsByStep.get(a.candidate_pipeline_step) || [];
      existing.push(a);
      assessmentsByStep.set(a.candidate_pipeline_step, existing);
    }
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/candidate/dashboard")}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold mb-4">{app.job_title}</h1>

      {app.pipeline_steps && app.pipeline_steps.length > 0 && (
        <div className="bg-white border rounded p-4">
          <h2 className="font-semibold mb-2">Pipeline Progress</h2>
          <div className="space-y-2">
            {app.pipeline_steps.map((step, index) => {
              const stepAssessments = step.id != null
                ? assessmentsByStep.get(step.id)
                : null;
              const hasSentStepAssessment = stepAssessments?.some(a => a.is_sent);
              const hasUnsentStepAssessment = stepAssessments != null && stepAssessments.length > 0 && !hasSentStepAssessment;

              return (
                <div
                  key={`${step.process_type_label}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <span className="text-sm font-medium">
                      {step.process_type_label || "Step"}
                    </span>
                    {step.scheduled_for && (
                      <span className="block text-xs text-gray-500">
                        {new Date(step.scheduled_for).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                        {" "}
                        {new Date(step.scheduled_for).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {step.status_label || step.status.replace(/_/g, " ")}
                    </span>
                    {hasSentStepAssessment && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs h-7 px-2"
                        onClick={() => navigate(`/candidate/applications/${id}/assessments`, { state: { stepType: step.process_type_label } })}
                      >
                        <FileText className="h-3 w-3" />
                        View Assessment
                      </Button>
                    )}
                    {hasUnsentStepAssessment && (
                      <span className="text-xs text-yellow-600 italic">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
