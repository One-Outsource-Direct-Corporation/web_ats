import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosPrivate } from "@/config/axios";
import { FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ApplicationDetail {
  job_title: string;
  pipeline_steps?: Array<{
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
  }>;
}

export default function CandidateApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPrivate
      .get(`/api/candidate/me/applications/${id}/`)
      .then((res) => setApp(res.data))
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!app) return <div className="p-6">Application not found.</div>;

  const assessments = app.assessments || [];
  const hasAssessments = assessments.length > 0;
  const hasSentAssessments = assessments.some((a) => a.is_sent);
  const hasAssessmentStep = (app.pipeline_steps || []).some(
    (step) => step.process_type_label?.toLowerCase().includes("assess")
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/candidate/dashboard")}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold mb-4">{app.job_title}</h1>

      {(hasAssessments || hasAssessmentStep) && (
        <div className="bg-white border rounded p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">Assessments</h2>
              {!hasAssessments && (
                <p className="text-sm text-gray-500 mt-1">
                  Assessment stage pending. You will be notified when assessment materials are available.
                </p>
              )}
              {hasAssessments && !hasSentAssessments && (
                <p className="text-sm text-gray-500 mt-1">
                  Assessments not yet sent. Waiting for the interviewer to send them.
                </p>
              )}
            </div>
            {hasSentAssessments && (
              <Button
                size="sm"
                className="gap-2"
                onClick={() => navigate(`/candidate/applications/${id}/assessments`)}
              >
                <FileText className="h-4 w-4" />
                View Assessments
              </Button>
            )}
          </div>
        </div>
      )}

      {app.pipeline_steps && app.pipeline_steps.length > 0 && (
        <div className="bg-white border rounded p-4">
          <h2 className="font-semibold mb-2">Pipeline Progress</h2>
          <div className="space-y-2">
            {app.pipeline_steps.map((step, index) => (
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
                <span className="text-xs capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {step.status_label || step.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
