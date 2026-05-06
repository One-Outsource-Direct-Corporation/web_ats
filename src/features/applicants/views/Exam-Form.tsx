import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, FileDown, FileUp, Loader2, Save, Eye } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import useAxiosMultipart from "@/features/auth/hooks/useAxiosMultipart";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatAssessmentType } from "@/shared/utils/assessmentUtils";

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

interface PerAssessmentState {
  answerFile: File | null;
  score: string;
  notes: string;
  savingAnswer: boolean;
  savingGrade: boolean;
}

const resolveFileUrl = (rawUrl?: string | null) => {
  if (!rawUrl) return "";
  if (/^(?:https?:\/\/|data:|blob:)/i.test(rawUrl)) return rawUrl;
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
  if (!backendBaseUrl) return rawUrl;
  const trimmedBaseUrl = backendBaseUrl.replace(/\/$/, "");
  const normalizedPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return `${trimmedBaseUrl}${normalizedPath}`;
};

const isImageExtension = (ext?: string | null) => {
  if (!ext) return false;
  const normalized = ext.toLowerCase().replace(".", "");
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(normalized);
};

const isPdfExtension = (ext?: string | null) => {
  if (!ext) return false;
  return ext.toLowerCase().replace(".", "") === "pdf";
};

export default function ExamForm() {
  const navigate = useNavigate();
  const { jobId, applicantId } = useParams<{ jobId: string; applicantId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const axiosMultipart = useAxiosMultipart();

  const [records, setRecords] = useState<CandidateAssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [perAssessmentState, setPerAssessmentState] = useState<Map<number, PerAssessmentState>>(new Map());
  const assessmentSectionRef = useRef<HTMLDivElement | null>(null);

  const processType = searchParams.get("type") ?? undefined;
  const isStaff = Boolean(user?.is_staff || user?.role === "admin" || user?.role === "superadmin");

  const loadAssessment = async () => {
    if (!applicantId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axiosPrivate.get<CandidateAssessmentRecord[]>(
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

      const stateMap = new Map<number, PerAssessmentState>();
      for (const item of items) {
        stateMap.set(item.id, {
          answerFile: null,
          score: item.score !== null && item.score !== undefined ? String(item.score) : "",
          notes: item.notes ?? "",
          savingAnswer: false,
          savingGrade: false,
        });
      }
      setPerAssessmentState(stateMap);
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

  const firstRecord = records[0];
  const statusLabel = firstRecord?.is_graded
    ? "Graded"
    : firstRecord?.is_submitted
      ? "Submitted"
      : records.length > 0
        ? "Assigned"
        : "Waiting";

  const handleOpenAssessment = () => {
    assessmentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updatePerAssessment = (id: number, update: Partial<PerAssessmentState>) => {
    setPerAssessmentState((prev) => {
      const next = new Map(prev);
      const current = next.get(id);
      if (current) {
        next.set(id, { ...current, ...update });
      }
      return next;
    });
  };

  const handleSubmitAnswer = async (recordId: number) => {
    const state = perAssessmentState.get(recordId);
    if (!state?.answerFile) {
      toast.error("Please choose a file to submit.");
      return;
    }

    updatePerAssessment(recordId, { savingAnswer: true });

    try {
      const formData = new FormData();
      formData.append("answer_file", state.answerFile);

      await axiosMultipart.patch(`/api/candidate/assessments/${recordId}/`, formData);

      toast.success("Assessment answer uploaded.");
      updatePerAssessment(recordId, { answerFile: null, savingAnswer: false });
      await loadAssessment();
    } catch (error) {
      console.error("Unable to submit assessment answer.", error);
      toast.error("Unable to submit assessment answer.");
      updatePerAssessment(recordId, { savingAnswer: false });
    }
  };

  const handleSaveGrade = async (recordId: number) => {
    const state = perAssessmentState.get(recordId);
    if (!state?.score) {
      toast.error("Please enter a score.");
      return;
    }

    updatePerAssessment(recordId, { savingGrade: true });

    try {
      const formData = new FormData();
      formData.append("score", state.score);
      formData.append("notes", state.notes || "");

      await axiosMultipart.patch(`/api/candidate/assessments/${recordId}/`, formData);

      toast.success("Assessment grade saved.");
      updatePerAssessment(recordId, { savingGrade: false });
      await loadAssessment();
    } catch (error) {
      console.error("Unable to save grade.", error);
      toast.error("Unable to save grade.");
      updatePerAssessment(recordId, { savingGrade: false });
    }
  };

  const renderFilePreview = (downloadUrl: string, fileExtension?: string | null, label: string) => {
    if (!downloadUrl) return null;

    if (isPdfExtension(fileExtension)) {
      return (
        <div className="mt-3 rounded-lg border border-gray-200 overflow-hidden">
          <iframe
            src={downloadUrl}
            className="w-full h-96"
            title={label}
          />
        </div>
      );
    }

    if (isImageExtension(fileExtension)) {
      return (
        <div className="mt-3 rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
          <img
            src={downloadUrl}
            alt={label}
            className="max-w-full max-h-96 object-contain mx-auto"
          />
        </div>
      );
    }

    return (
      <div className="mt-3">
        <Button asChild variant="outline" className="gap-2">
          <a href={downloadUrl} target="_blank" rel="noreferrer">
            <FileDown className="h-4 w-4" />
            Download {label}
          </a>
        </Button>
      </div>
    );
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
                <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Assigned Assessments</p>
                <h1 className="mt-2 text-2xl font-semibold">
                  {firstRecord?.job_title || `Job ${jobId}`}
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  {firstRecord?.candidate_name || `Applicant ${applicantId}`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2"
                  onClick={handleOpenAssessment}
                  disabled={records.length === 0}
                >
                  <Eye className="h-4 w-4" />
                  See Assessments
                </Button>
              </div>
            </div>
          </div>

          <div ref={assessmentSectionRef} className="px-6 py-6 space-y-6">
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-slate-500 py-8">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading assigned assessments...
              </div>
            ) : records.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 text-center">
                No assessments have been assigned yet. The assessment will appear once the interviewer sends it.
              </div>
            ) : (
              records.map((record) => {
                const downloadUrl = resolveFileUrl(
                  record.assessment_download_url ?? record.assessment?.file?.file ?? undefined
                );
                const submissionUrl = resolveFileUrl(record.submission_file_url);
                const state = perAssessmentState.get(record.id);
                const fileExt = record.assessment?.file?.file_extension ?? null;

                const itemStatusLabel = record.is_graded
                  ? "Graded"
                  : record.is_submitted
                    ? "Submitted"
                    : "Assigned";

                return (
                  <section
                    key={record.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Assessment
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-slate-900">
                          {formatAssessmentType(record.assessment?.type)}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        {record.assessment?.file?.filename && (
                          <Badge variant="secondary" className="rounded-full">
                            {record.assessment.file.filename}
                          </Badge>
                        )}
                        {fileExt && (
                          <Badge variant="outline" className="rounded-full capitalize">
                            {fileExt}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 mb-4">
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Status</p>
                        <Badge
                          variant="outline"
                          className={
                            record.is_graded
                              ? "mt-2 border-green-500 text-green-600"
                              : record.is_submitted
                                ? "mt-2 border-blue-400 text-blue-700"
                                : "mt-2 border-yellow-400 text-yellow-700"
                          }
                        >
                          {itemStatusLabel}
                        </Badge>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Score</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {record.score !== null && record.score !== undefined ? `${record.score}/100` : "Pending"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Submission</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {record.is_submitted ? "Uploaded" : "Not yet submitted"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                        <p className="text-sm font-medium text-slate-700">Assessment File</p>
                        {downloadUrl ? (
                          <>
                            <div className="mt-2 flex flex-wrap gap-3">
                              <Button asChild className="gap-2">
                                <a href={downloadUrl} target="_blank" rel="noreferrer">
                                  <FileDown className="h-4 w-4" />
                                  Open Assessment File
                                </a>
                              </Button>
                            </div>
                            {renderFilePreview(downloadUrl, fileExt, formatAssessmentType(record.assessment?.type))}
                          </>
                        ) : (
                          <p className="mt-4 text-sm text-amber-700">
                            The assigned assessment file has not been uploaded yet.
                          </p>
                        )}
                      </div>

                      {submissionUrl && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-sm font-medium text-slate-700">Submitted Answer</p>
                          <div className="mt-2 flex flex-wrap gap-3">
                            <Button asChild variant="outline" className="gap-2">
                              <a href={submissionUrl} target="_blank" rel="noreferrer">
                                <FileUp className="h-4 w-4" />
                                View submitted answer
                              </a>
                            </Button>
                          </div>
                          {renderFilePreview(submissionUrl, null, "Submitted Answer")}
                        </div>
                      )}

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <label
                          className="block text-sm font-medium text-slate-700"
                          htmlFor={`answer-file-${record.id}`}
                        >
                          Upload your completed answer
                        </label>
                        <Input
                          id={`answer-file-${record.id}`}
                          type="file"
                          className="mt-2"
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            updatePerAssessment(record.id, { answerFile: file });
                          }}
                        />

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <Button
                            type="button"
                            className="gap-2"
                            onClick={() => handleSubmitAnswer(record.id)}
                            disabled={state?.savingAnswer || !state?.answerFile}
                          >
                            {state?.savingAnswer ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <FileUp className="h-4 w-4" />
                            )}
                            Submit Answer
                          </Button>
                          {state?.answerFile ? (
                            <p className="text-sm text-slate-500">Selected: {state.answerFile.name}</p>
                          ) : (
                            <p className="text-sm text-slate-500">Choose the completed assessment file to submit.</p>
                          )}
                        </div>
                      </div>

                      {isStaff && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-3">
                            Interviewer Grading
                          </p>
                          <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                            <div>
                              <label
                                className="block text-sm font-medium text-slate-700"
                                htmlFor={`score-input-${record.id}`}
                              >
                                Grade (0-100)
                              </label>
                              <Input
                                id={`score-input-${record.id}`}
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={state?.score ?? ""}
                                onChange={(event) =>
                                  updatePerAssessment(record.id, { score: event.target.value })
                                }
                                className="mt-2"
                                placeholder="Enter score"
                              />
                            </div>
                            <div>
                              <label
                                className="block text-sm font-medium text-slate-700"
                                htmlFor={`notes-input-${record.id}`}
                              >
                                Private Notes
                              </label>
                              <Textarea
                                id={`notes-input-${record.id}`}
                                value={state?.notes ?? ""}
                                onChange={(event) =>
                                  updatePerAssessment(record.id, { notes: event.target.value })
                                }
                                className="mt-2 min-h-[80px]"
                                placeholder="Notes visible only to the interviewer"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button
                              type="button"
                              className="gap-2"
                              onClick={() => handleSaveGrade(record.id)}
                              disabled={state?.savingGrade}
                            >
                              {state?.savingGrade ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                              Save Grade
                            </Button>
                          </div>
                          {record.score_inputted_by_name && (
                            <p className="mt-2 text-xs text-slate-400">
                              Graded by: {record.score_inputted_by_name}
                            </p>
                          )}
                        </div>
                      )}

                      {!isStaff && record.is_graded && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-3">
                            Result
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-500">Score</p>
                              <p className="mt-1 text-2xl font-semibold text-slate-900">
                                {record.score !== null && record.score !== undefined ? `${record.score}/100` : "Pending"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Notes</p>
                              <p className="mt-1 text-sm text-slate-700">
                                {record.notes || "No feedback provided."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
