import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosPrivate } from "@/config/axios";

interface ApplicationDetail {
  id: number;
  status: string;
  email: string;
  source: string;
  submitted_at: string;
  job_posting_snapshot: Record<string, unknown>;
  pipeline_steps?: Array<{
    id: number;
    status: string;
    pipeline_step_snapshot: { process_title: string };
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Application #{app.id}</h1>

      <div className="bg-white border rounded p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Status:</span>{" "}
            <span className="font-medium capitalize">{app.status.replace(/_/g, " ")}</span>
          </div>
          <div>
            <span className="text-gray-500">Source:</span>{" "}
            <span className="font-medium capitalize">{app.source.replace(/_/g, " ")}</span>
          </div>
          <div>
            <span className="text-gray-500">Submitted:</span>{" "}
            <span className="font-medium">
              {new Date(app.submitted_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {app.pipeline_steps && app.pipeline_steps.length > 0 && (
        <div className="bg-white border rounded p-4">
          <h2 className="font-semibold mb-2">Pipeline Progress</h2>
          <div className="space-y-2">
            {app.pipeline_steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm font-medium">
                  {step.pipeline_step_snapshot?.process_title || "Step"}
                </span>
                <span className="text-xs capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {step.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
