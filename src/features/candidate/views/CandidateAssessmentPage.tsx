import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, FileDown, FileUp, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { axiosPrivate } from "@/config/axios";
import AssessmentFileViewer from "@/features/applicants/components/AssessmentFileViewer";
import { formatAssessmentType } from "@/shared/utils/assessmentUtils";

interface PipelineStep {
  id?: number;
  status: string;
  status_label: string;
  process_type_label: string;
  scheduled_for: string | null;
}

interface AssessmentRecord {
  id: number;
  assessment?: {
    id?: number;
    name?: string | null;
    type?: string | null;
    file?: {
      filename?: string | null;
      file?: string | null;
      file_extension?: string | null;
    } | null;
  } | null;
  assessment_download_url?: string | null;
  submission_file_url?: string | null;
  status?: string;
  score?: number | null;
  notes?: string | null;
  is_submitted?: boolean;
  is_graded?: boolean;
  candidate_pipeline_step?: number | null;
}

interface ApplicationDetail {
  job_title: string;
  pipeline_steps?: PipelineStep[];
  assessments?: AssessmentRecord[];
}

export default function CandidateAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<Map<number, boolean>>(new Map());
  const [answerFiles, setAnswerFiles] = useState<Map<number, File | null>>(new Map());

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/api/candidate/me/applications/${id}/`);
      setApp(res.data);
    } catch {
      setApp(null);
      toast.error("Unable to load application details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpload = async (assessmentId: number) => {
    const file = answerFiles.get(assessmentId);
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploading((prev) => new Map(prev).set(assessmentId, true));

    try {
      const formData = new FormData();
      formData.append("answer_file", file);

      await axiosPrivate.patch(`/api/candidate/assessments/${assessmentId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Answer submitted successfully.");
      setAnswerFiles((prev) => new Map(prev).set(assessmentId, null));
      await fetchData();
    } catch {
      toast.error("Unable to submit answer.");
    } finally {
      setUploading((prev) => new Map(prev).set(assessmentId, false));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Application not found.</p>
      </div>
    );
  }

  const assessments = app.assessments || [];
  const stepTypeFromState = (location.state as { stepType?: string } | null)?.stepType;

  const stepMap = new Map<number, PipelineStep>();
  (app.pipeline_steps || []).forEach(s => { if (s.id != null) stepMap.set(s.id, s); });

  const stepTypes = new Set<string>();
  assessments.forEach(a => {
    if (a.candidate_pipeline_step != null) {
      const step = stepMap.get(a.candidate_pipeline_step);
      if (step?.process_type_label) stepTypes.add(step.process_type_label);
    }
  });

  const subtitle = stepTypeFromState
    ? `${stepTypeFromState}`
    : stepTypes.size === 1
      ? [...stepTypes][0]
      : stepTypes.size > 1
        ? `Assessment Tasks`
        : 'Assessment Tasks';

  const assessmentsByStep = new Map<string, AssessmentRecord[]>();
  assessments.forEach(a => {
    let key = stepTypeFromState || 'Assessment Tasks';
    if (!stepTypeFromState && a.candidate_pipeline_step != null) {
      const step = stepMap.get(a.candidate_pipeline_step);
      key = step?.process_type_label || 'Assessment Tasks';
    }
    const existing = assessmentsByStep.get(key) || [];
    existing.push(a);
    assessmentsByStep.set(key, existing);
  });

  const assessmentSteps = (app.pipeline_steps || []).filter(
    (step) => step.process_type_label?.toLowerCase().includes("assess")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/candidate/applications/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{app.job_title}</h1>
            <p className="text-sm text-gray-500">Assessment - {subtitle}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {assessments.length === 0 && assessmentSteps.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <FileDown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No Assessments Found</h2>
            <p className="text-sm text-gray-500">
              No assessments have been assigned to you for this application yet.
              You will be notified when assessments are available.
            </p>
          </div>
        ) : assessments.length > 0 && !assessments.some((a) => a.is_sent) ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-12 text-center">
            <FileDown className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Assessments Not Yet Sent</h2>
            <p className="text-sm text-gray-500">
              Assessments have been prepared but not yet sent by the interviewer.
              You will be notified when the assessment materials are available.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {[...assessmentsByStep.entries()].map(([stepType, stepAssessments]) => (
              <div key={stepType}>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-[#0056d2]">{stepType}</h2>
                  <div className="flex-1 h-px bg-gray-300 mb-4" />
                </div>
                {stepAssessments.map((assessment) => {
                  const isUploading = uploading.get(assessment.id) || false;
                  const selectedFile = answerFiles.get(assessment.id) ?? null;

                  return (
                    <div key={assessment.id} className="bg-white rounded-lg border shadow-sm p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formatAssessmentType(assessment.assessment?.type)}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={
                                assessment.is_graded
                                  ? "border-green-500 text-green-600"
                                  : assessment.is_submitted
                                    ? "border-blue-400 text-blue-700"
                                    : "border-yellow-400 text-yellow-700"
                              }
                            >
                              {assessment.is_graded
                                ? "Graded"
                                : assessment.is_submitted
                                  ? "Submitted"
                                  : "Assigned"}
                            </Badge>
                            {assessment.score !== null && assessment.score !== undefined && (
                              <Badge variant="secondary" className="text-xs">
                                Score: {assessment.score}/100
                              </Badge>
                            )}
                          </div>
                        </div>

                        {assessment.assessment_download_url && (
                          <Button asChild variant="outline" size="sm" className="gap-2">
                            <a href={assessment.assessment_download_url} target="_blank" rel="noreferrer">
                              <FileDown className="h-4 w-4" />
                              Download Assessment
                            </a>
                          </Button>
                        )}
                      </div>

                      {assessment.assessment_download_url && (
                        <AssessmentFileViewer
                          url={assessment.assessment_download_url}
                          fileExtension={assessment.assessment?.file?.file_extension}
                          label={formatAssessmentType(assessment.assessment?.type)}
                          className="mb-4"
                        />
                      )}

                      {assessment.submission_file_url && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-4">
                          <p className="text-sm font-medium text-green-800 mb-2">Your submitted answer</p>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="gap-2">
                              <a href={assessment.submission_file_url} target="_blank" rel="noreferrer">
                                <FileUp className="h-4 w-4" />
                                View Submission
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}

                      {assessment.is_graded && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-4">
                          <p className="text-sm font-medium text-blue-800 mb-2">Grading Result</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-blue-600">Score</p>
                              <p className="text-lg font-bold text-blue-900">
                                {assessment.score !== null && assessment.score !== undefined
                                  ? `${assessment.score}/100`
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-blue-600">Feedback</p>
                              <p className="text-sm text-blue-800">
                                {assessment.notes || "No feedback provided."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!assessment.is_submitted && !assessment.is_graded && (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Upload your completed answer
                          </p>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="flex-1">
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] ?? null;
                                  setAnswerFiles((prev) => new Map(prev).set(assessment.id, file));
                                }}
                              />
                              {selectedFile && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Selected: {selectedFile.name}
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              className="gap-2"
                              onClick={() => handleUpload(assessment.id)}
                              disabled={isUploading || !selectedFile}
                            >
                              {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <FileUp className="h-4 w-4" />
                              )}
                              Submit Answer
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {assessmentSteps.length > 0 && assessments.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-sm text-yellow-700">
                  You have an assessment stage in your application pipeline, but no assessments have been assigned yet.
                  Please wait for the interviewer to send the assessment materials.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
