import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, FileDown, FileUp, Loader2, Save, Eye } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { defaultAxios } from "@/config/axios";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface AssessmentFile {
  id: number;
  filename?: string | null;
  file?: string | null;
  file_extension?: string | null;
}

interface AssessmentItem {
  id: number;
  name?: string | null;
  type?: string | null;
  file?: AssessmentFile | null;
}

interface CandidateAssessmentRecord {
  id: number;
  candidate_name?: string | null;
  job_title?: string | null;
  pipeline_step_title?: string | null;
  pipeline_process_type?: string | null;
  assessment?: AssessmentItem | null;
  assessment_download_url?: string | null;
  submission_file_url?: string | null;
  status?: "assigned" | "submitted" | "graded" | string;
  score?: number | null;
  score_inputted_by_name?: string | null;
  notes?: string | null;
  is_submitted?: boolean;
  is_graded?: boolean;
}

const resolveFileUrl = (rawUrl?: string | null) => {
  if (!rawUrl) {
    return "";
  }

  if (/^(?:https?:\/\/|data:|blob:)/i.test(rawUrl)) {
    return rawUrl;
  }

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
  if (!backendBaseUrl) {
    return rawUrl;
  }

  const trimmedBaseUrl = backendBaseUrl.replace(/\/$/, "");
  const normalizedPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return `${trimmedBaseUrl}${normalizedPath}`;
};

export default function ExamForm() {
  const navigate = useNavigate();
  const { jobId, applicantId } = useParams<{ jobId: string; applicantId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [records, setRecords] = useState<CandidateAssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [savingGrade, setSavingGrade] = useState(false);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const assessmentSectionRef = useRef<HTMLDivElement | null>(null);

  const processType = searchParams.get("type") ?? undefined;

  const loadAssessment = async () => {
    if (!applicantId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await defaultAxios.get<CandidateAssessmentRecord[]>(
        "/api/candidate/assessments/",
        {
          params: {
            candidate_application_id: applicantId,
            type: processType,
          },
        },
      );

      const items = Array.isArray(response.data) ? response.data : [];
      setRecords(items);

      const first = items[0];
      setScore(first?.score !== null && first?.score !== undefined ? String(first.score) : "");
      setNotes(first?.notes ?? "");
    } catch (error) {
      console.error("Unable to load assessment.", error);
      toast.error("Unable to load assessment.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAssessment();
  }, [applicantId, processType]);

  const assessment = records[0];
  const isStaff = Boolean(user?.is_staff || user?.role === "admin" || user?.role === "superadmin");

  const assessmentDownloadUrl = useMemo(
    () => resolveFileUrl(assessment?.assessment_download_url ?? assessment?.assessment?.file?.file ?? undefined),
    [assessment],
  );

  const submissionUrl = useMemo(
    () => resolveFileUrl(assessment?.submission_file_url),
    [assessment],
  );

  const statusLabel = assessment?.is_graded
    ? "Graded"
    : assessment?.is_submitted
      ? "Submitted"
      : assessment
        ? "Assigned"
        : "Waiting";

  const handleOpenAssessment = () => {
    assessmentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitAnswer = async () => {
    if (!assessment) {
      toast.error("No assigned assessment found.");
      return;
    }

    if (!answerFile) {
      toast.error("Please choose a file to submit.");
      return;
    }

    setSavingAnswer(true);

    try {
      const formData = new FormData();
      formData.append("answer_file", answerFile);

      await defaultAxios.patch(`/api/candidate/assessments/${assessment.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Assessment answer uploaded.");
      setAnswerFile(null);
      await loadAssessment();
    } catch (error) {
      console.error("Unable to submit assessment answer.", error);
      toast.error("Unable to submit assessment answer.");
    } finally {
      setSavingAnswer(false);
    }
  };

  const handleSaveGrade = async () => {
    if (!assessment) {
      toast.error("No assigned assessment found.");
      return;
    }

    setSavingGrade(true);

    try {
      const formData = new FormData();
      if (score.trim().length > 0) {
        formData.append("score", score);
      }
      formData.append("notes", notes || "");

      await defaultAxios.patch(`/api/candidate/assessments/${assessment.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Assessment grade saved.");
      await loadAssessment();
    } catch (error) {
      console.error("Unable to save grade.", error);
      toast.error("Unable to save grade.");
    } finally {
      setSavingGrade(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate(`/job/${jobId}/assessments`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
            {statusLabel}
          </Badge>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-linear-to-r from-slate-900 to-slate-700 px-6 py-5 text-white">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Assigned Assessment</p>
                <h1 className="mt-2 text-2xl font-semibold">
                  {assessment?.job_title || `Job ${jobId}`}
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  {assessment?.candidate_name || `Applicant ${applicantId}`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2"
                  onClick={handleOpenAssessment}
                  disabled={!assessment}
                >
                  <Eye className="h-4 w-4" />
                  See Assessment
                </Button>
                {assessmentDownloadUrl ? (
                  <Button asChild variant="outline" className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
                    <a href={assessmentDownloadUrl} target="_blank" rel="noreferrer">
                      <FileDown className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
              <section ref={assessmentSectionRef} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Assessment File</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {assessment?.assessment?.name || assessment?.assessment?.type || "No assessment assigned yet"}
                    </h2>
                  </div>

                  {assessment?.assessment?.file?.filename ? (
                    <Badge variant="secondary" className="rounded-full">
                      {assessment.assessment.file.filename}
                    </Badge>
                  ) : null}
                </div>

                {loading ? (
                  <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading assigned assessment...
                  </div>
                ) : assessment ? (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                      <p className="text-sm text-slate-600">
                        This is the exact assessment file assigned by the interviewer. Download it, complete it, then upload the answer file here.
                      </p>

                      {assessmentDownloadUrl ? (
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Button asChild className="gap-2">
                            <a href={assessmentDownloadUrl} target="_blank" rel="noreferrer">
                              <FileDown className="h-4 w-4" />
                              Open Assessment File
                            </a>
                          </Button>
                          {assessment?.assessment?.file?.file_extension ? (
                            <Badge variant="outline" className="rounded-full capitalize">
                              {assessment.assessment.file.file_extension}
                            </Badge>
                          ) : null}
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-amber-700">
                          The assigned assessment file has not been uploaded yet.
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Status</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{statusLabel}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Score</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {assessment.score !== null && assessment.score !== undefined ? assessment.score : "Pending"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Submission</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {assessment.is_submitted ? "Uploaded" : "Not yet submitted"}
                        </p>
                      </div>
                    </div>

                    {assessment.submission_file_url ? (
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-medium text-slate-700">Submitted File</p>
                        <a
                          href={submissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                        >
                          <FileUp className="h-4 w-4" />
                          View submitted answer file
                        </a>
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <label className="block text-sm font-medium text-slate-700" htmlFor="answer-file">
                        Upload your completed answer
                      </label>
                      <Input
                        id="answer-file"
                        type="file"
                        className="mt-2"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          setAnswerFile(file);
                        }}
                      />

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Button
                          type="button"
                          className="gap-2"
                          onClick={handleSubmitAnswer}
                          disabled={savingAnswer || !answerFile}
                        >
                          {savingAnswer ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
                          Submit Answer
                        </Button>
                        {answerFile ? (
                          <p className="text-sm text-slate-500">Selected: {answerFile.name}</p>
                        ) : (
                          <p className="text-sm text-slate-500">Choose the completed assessment file to submit.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                    No assessment has been assigned yet. The assessment button will appear once the interviewer sends it.
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Result</p>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Current Grade</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                      {assessment?.score !== null && assessment?.score !== undefined ? assessment.score : "Pending"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Notes</p>
                    <p className="mt-2 text-sm text-slate-700">
                      {assessment?.notes || "The assigned interviewer will add notes after manual grading."}
                    </p>
                  </div>
                </div>
              </section>

              {isStaff ? (
                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Interviewer Notes</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700" htmlFor="score-input">
                        Grade
                      </label>
                      <Input
                        id="score-input"
                        type="number"
                        min="0"
                        step="1"
                        value={score}
                        onChange={(event) => setScore(event.target.value)}
                        className="mt-2"
                        placeholder="Enter score"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700" htmlFor="notes-input">
                        Private Notes
                      </label>
                      <Textarea
                        id="notes-input"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        className="mt-2 min-h-35"
                        placeholder="Notes visible only to the interviewer"
                      />
                    </div>

                    <Button
                      type="button"
                      className="w-full gap-2"
                      onClick={handleSaveGrade}
                      disabled={savingGrade}
                    >
                      {savingGrade ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Grade
                    </Button>
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}