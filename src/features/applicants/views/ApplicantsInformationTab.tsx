import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useMemo, useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar.tsx";
import { Badge } from "@/shared/components/ui/badge.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs.tsx";
import { Textarea } from "@/shared/components/ui/textarea.tsx";
import {
  Briefcase,
  Mail,
  MessageSquare,
  CheckSquare,
  Download,
  Send,
  ChevronRight,
  MapPin,
  Phone,
  FileText,
  Trash2,
  Upload,
  Scaling,
} from "lucide-react";
import { Navbar } from "@/shared/components/reusables/Navbar.tsx";
import AnsweredForm from "@/shared/components/forms/AnsweredForm.tsx";
import { getApplicantById, getComments, createComment, deleteComment } from "../services/applicantService";
import type { Applicant, Comment, PreonboardingDocument } from "../types/applicant.types";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { useJobDetailQuery } from "@/features/jobs/hooks/useJobs";
import { extractPipelineStepsFromJobDetail } from "@/features/jobs/services/jobService";

function resolveMediaUrl(rawUrl?: string | null): string | undefined {
  if (!rawUrl) return undefined;
  if (/^(?:https?:\/\/|data:|blob:)/i.test(rawUrl)) return rawUrl;
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
  if (!backendBaseUrl) return rawUrl;
  const trimmedBaseUrl = backendBaseUrl.replace(/\/$/, "");
  const normalizedPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return `${trimmedBaseUrl}${normalizedPath}`;
}

function downloadFile(url: string, filename?: string | null) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  a.target = "_blank";
  a.rel = "noreferrer";
  a.click();
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear}y ago`;
}

export default function ApplicantTracker() {
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const { applicantId } = useParams();

  const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const { data: jobDetail } = useJobDetailQuery(currentApplicant?.job_id);
  const { data: applyDetail } = useQuery({
    queryKey: ["job-apply-form", currentApplicant?.job_id],
    queryFn: async () => {
      if (!currentApplicant?.job_id) return null
      const resp = await axiosPrivate.get(`/api/job/${currentApplicant.job_id}/apply/`)
      return resp.data as Record<string, unknown>
    },
    enabled: !!currentApplicant?.job_id,
  })
  const interviewSteps = useMemo(
    () =>
      extractPipelineStepsFromJobDetail(jobDetail).filter((step) =>
        ["phone_call_interview", "initial_interview", "final_interview"].includes(step.process_type),
      ),
    [jobDetail],
  )
  const questionnaireSections = useMemo(
    () => {
      const fromAppForm = (
        (jobDetail as Record<string, unknown>)?.application_form as Record<string, unknown> | undefined
      )?.questionnaire as Record<string, unknown> | undefined
      if (fromAppForm?.sections && Array.isArray(fromAppForm.sections) && fromAppForm.sections.length > 0) {
        return fromAppForm.sections as Array<{
          id?: number; name: string
          questionnaires: Array<{ id: number; question: string; question_type: string; options?: unknown[] }>
        }>
      }
      const fromApply = (
        applyDetail?.application_form as Record<string, unknown> | undefined
      )?.questionnaire as Record<string, unknown> | undefined
      if (fromApply?.sections && Array.isArray(fromApply.sections)) {
        return fromApply.sections as Array<{
          id?: number; name: string
          questionnaires: Array<{ id: number; question: string; question_type: string; options?: unknown[] }>
        }>
      }
      return []
    },
    [jobDetail, applyDetail],
  )

  useEffect(() => {
    if (!applicantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getApplicantById(applicantId)
      .then(setCurrentApplicant)
      .catch(() => setCurrentApplicant(null))
      .finally(() => setLoading(false));
  }, [applicantId]);

  useEffect(() => {
    if (!currentApplicant?.id) return;
    const appId = Number(currentApplicant.id);
    if (!appId) return;
    setCommentsLoading(true);
    getComments(appId)
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  }, [currentApplicant?.id]);

  const handleSendComment = useCallback(async () => {
    const trimmed = newComment.trim();
    if (!trimmed || !currentApplicant?.id) return;
    const appId = Number(currentApplicant.id);
    if (!appId) return;
    setIsSubmittingComment(true);
    try {
      await createComment(appId, trimmed);
      setNewComment("");
      const updated = await getComments(appId);
      setComments(Array.isArray(updated) ? updated : []);
    } catch {
      toast.error("Failed to send comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  }, [newComment, currentApplicant?.id]);

  const handleDeleteComment = useCallback(async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      toast.error("Failed to delete comment.");
    }
  }, []);

  const documents = useMemo(() => {
    const items: Array<{ label: string; url?: string | null; filename?: string | null; group?: string }> = [
      { label: "Resume", url: currentApplicant?.resume_url, filename: currentApplicant?.resume_filename, group: "Application" },
      { label: "Cover Letter", url: currentApplicant?.cover_letter_url, filename: currentApplicant?.cover_letter_filename, group: "Application" },
      { label: "Photo", url: currentApplicant?.photo_url, filename: currentApplicant?.resume_filename, group: "Application" },
      { label: "Medical Certificate", url: currentApplicant?.med_cert_url, filename: currentApplicant?.med_cert_filename, group: "Application" },
      { label: "Signed Job Offer", url: currentApplicant?.signed_offer_url, filename: currentApplicant?.signed_offer_filename, group: "Application" },
    ]
    const preonboarding = (currentApplicant?.preonboarding_documents ?? []).map(
      (doc: PreonboardingDocument) => ({
        label: doc.requirement_label || doc.requirement_key,
        url: doc.file_url,
        filename: doc.filename,
        group: "Pre-onboarding",
      }),
    )
    return [...items.filter((doc) => !!doc.url), ...preonboarding.filter((doc) => !!doc.url)]
  }, [currentApplicant])

  return (
    <>
      <Navbar />
      {/* Back button below the navbar, top-left of the page content */}

      <div className="min-h-screen bg-gray-50 p-6 pt-4">
        <div className="mx-auto max-w-7xl space-y-6 mt-20">
          <div className="px-6 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Progress Bar Panel */}
                <Card>
                  <CardContent className="p-6">
                    {/* Heading */}
                    <h3 className="mb-4 text-lg font-bold text-gray-800 text-center">
                      Application Status
                    </h3>

                    {/* Responsive Progress Bar */}
                    {currentApplicant?.pipeline_progress &&
                    currentApplicant.pipeline_progress.length > 0 ? (
                      <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
                        {currentApplicant.pipeline_progress.map((step, index) => {
                          const isCompleted =
                            step.status === "passed" ||
                            step.status === "shortlisted" ||
                            step.status === "approved_from_shortlist" ||
                            step.status === "assessment_graded" ||
                            step.status === "scheduled" ||
                            step.status === "in_progress" ||
                            step.status === "offer_sent" ||
                            step.status === "offer_signed" ||
                            step.status === "onboarding_sent";
                          const isCurrent =
                            step.status === "pending" ||
                            step.status === "assessment_sent" ||
                            step.status === "assessment_partially_graded";
                          const isFailed = step.status === "failed" || step.status === "rejected_from_shortlist";

                          return (
                            <div key={step.pipeline_step_id} className="flex items-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`rounded-lg px-4 py-2 text-sm font-medium text-center ${
                                    isFailed
                                      ? "bg-red-100 text-red-800"
                                      : isCurrent
                                      ? "bg-blue-500 text-white"
                                      : isCompleted
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {step.process_title}
                                </div>
                              </div>

                              {index < currentApplicant.pipeline_progress.length - 1 && (
                                <ChevronRight className="mx-2 hidden sm:block h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 text-center">
                        No pipeline steps configured.
                      </div>
                    )}
                  </CardContent>
                </Card>

            {/* Applicant Profile */}
            {loading ? (
              <Card>
                <CardContent className="p-6 flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </CardContent>
              </Card>
            ) : !currentApplicant ? (
              <Card>
                <CardContent className="p-6 text-center py-12 text-gray-500">
                  Applicant not found.
                </CardContent>
              </Card>
            ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={resolveMediaUrl(currentApplicant.photo_url) || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {currentApplicant.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentApplicant.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{currentApplicant.position || "-"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{currentApplicant.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {currentApplicant && (
            <>
            {/* Main Content Panels */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Panel (60%) */}
              <div className="md:col-span-3">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <Tabs defaultValue="information" className="h-full">
                      <TabsList className="flex flex-col sm:flex-row w-full">
                        <TabsTrigger value="information">
                          Information
                        </TabsTrigger>
                        <TabsTrigger value="answered-form">
                          Answered Form
                        </TabsTrigger>
                        <TabsTrigger value="document">Document</TabsTrigger>
                      </TabsList>

                      <TabsContent
                        value="information"
                        className="mt-6 space-y-6"
                      >
                        {/* Working Experience */}
                        <div>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500 p-2">
                              <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                Working Experience
                              </h3>
                            </div>
                            {(() => {
                              const totalYears = (currentApplicant?.work_experience ?? []).reduce(
                                (acc, exp) => acc + (exp.years ?? 0),
                                0,
                              );
                              return totalYears > 0 ? (
                                <Badge variant="secondary">{totalYears} Year{totalYears > 1 ? 's' : ''}</Badge>
                              ) : null;
                            })()}
                          </div>

                          <div className="space-y-4">
                            {currentApplicant?.work_experience && currentApplicant.work_experience.length > 0 ? (
                              currentApplicant.work_experience.map((exp, index) => (
                                <div key={index} className="relative">
                                  <div className="flex">
                                    <div className="mr-4 flex flex-col items-center">
                                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                      {index < (currentApplicant.work_experience?.length ?? 0) - 1 && (
                                        <div className="mt-2 h-16 w-px bg-gray-300"></div>
                                      )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                      <h4 className="font-bold text-gray-900">
                                        {exp.jobTitle || "N/A"}
                                      </h4>
                                      <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
                                        <span>{exp.company || "N/A"}</span>
                                        {exp.years != null && (
                                          <>
                                            <span className="text-gray-400">|</span>
                                            <span>{exp.years} Year{exp.years > 1 ? 's' : ''}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500 text-center py-4">
                                No work experience provided.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500 p-2">
                              <Mail className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold">Cover Letter</h3>
                          </div>
                          {currentApplicant?.cover_letter_url ? (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4">
                              <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center rounded bg-blue-100 p-2">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <span className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded bg-white px-1 text-[10px] font-bold text-blue-600 shadow-sm">
                                    {currentApplicant.cover_letter_filename?.split('.').pop()?.toUpperCase() || "DOC"}
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {currentApplicant.cover_letter_filename || "Cover Letter"}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full sm:w-auto"
                                  onClick={() => window.open(currentApplicant.cover_letter_url!, "_blank")}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Preview
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full sm:w-auto"
                                  onClick={() => {
                                    const a = document.createElement("a");
                                    a.href = currentApplicant.cover_letter_url!;
                                    a.download = currentApplicant.cover_letter_filename || "cover_letter";
                                    a.click();
                                  }}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 text-center py-4 rounded-lg bg-gray-50">
                              No cover letter provided.
                            </div>
                          )}
                        </div>

                        {/* Resume */}
                        <div>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500 p-2">
                              <CheckSquare className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold">Resume</h3>
                          </div>
                          {currentApplicant?.resume_url ? (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4">
                              <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center rounded bg-blue-100 p-2">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <span className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 rounded bg-white px-1 text-[10px] font-bold text-blue-600 shadow-sm">
                                    {currentApplicant.resume_filename?.split('.').pop()?.toUpperCase() || "PDF"}
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {currentApplicant.resume_filename || "Resume"}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full sm:w-auto"
                                  onClick={() => window.open(currentApplicant.resume_url!, "_blank")}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Preview
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full sm:w-auto"
                                  onClick={() => {
                                    const a = document.createElement("a");
                                    a.href = currentApplicant.resume_url!;
                                    a.download = currentApplicant.resume_filename || "resume";
                                    a.click();
                                  }}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 text-center py-4 rounded-lg bg-gray-50">
                              No resume provided.
                            </div>
                          )}
                        </div>

                        {/* Comments */}
                        <div>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500 p-2">
                              <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold">Comments</h3>
                          </div>

                          <div className="space-y-4">
                            {commentsLoading ? (
                              <div className="flex justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                              </div>
                            ) : comments.length === 0 ? (
                              <div className="text-sm text-gray-500 text-center py-4">
                                No comments yet.
                              </div>
                            ) : (
                              comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 group">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={resolveMediaUrl(comment.author_avatar) || "/placeholder.svg"}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {comment.author_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">
                                        {comment.author_name}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {formatRelativeTime(comment.created_at)}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words">
                                      {comment.content}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
                                    onClick={() => handleDeleteComment(comment.id)}
                                    title="Delete comment"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Textarea
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="flex-1 min-h-[60px]"
                            />
                            <Button
                              size="icon"
                              className="bg-[#0056d2] shrink-0 self-end"
                              onClick={handleSendComment}
                              disabled={isSubmittingComment || !newComment.trim()}
                            >
                              {isSubmittingComment ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="answered-form"
                        className="mt-6 space-y-8"
                      >
                        <AnsweredForm
                          snapshot={currentApplicant.application_form_snapshot ?? {}}
                          questionnaireSnapshot={currentApplicant.application_form_questionnaire_snapshot ?? {}}
                          questionnaireSections={questionnaireSections}
                        />
                      </TabsContent>

                      <TabsContent value="document" className="mt-6 space-y-4">
                        {documents.length > 0 ? (
                          <div className="space-y-6">
                            {["Application", "Pre-onboarding"].map((group) => {
                              const groupDocs = documents.filter((d) => (d.group ?? "Application") === group)
                              if (groupDocs.length === 0) return null
                              return (
                                <div key={group} className="space-y-3">
                                  <h4 className="text-sm font-semibold text-gray-800">{group} Documents</h4>
                                  <div className="space-y-3">
                                    {groupDocs.map((doc, i) => {
                                      const ext = doc.filename?.split(".").pop()?.toUpperCase() || "FILE"
                                      const colorMap: Record<string, string> = {
                                        PDF: "bg-red-100 text-red-600",
                                        DOC: "bg-blue-100 text-blue-600",
                                        DOCX: "bg-blue-100 text-blue-600",
                                        JPG: "bg-green-100 text-green-600",
                                        JPEG: "bg-green-100 text-green-600",
                                        PNG: "bg-green-100 text-green-600",
                                      }
                                      const badgeClass = colorMap[ext] || "bg-gray-100 text-gray-600"
                                      const resolvedUrl = resolveMediaUrl(doc.url)
                                      return (
                                        <div key={`${group}-${i}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                          <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className={`rounded p-2 shrink-0 ${badgeClass.split(" ")[0]}`}>
                                              <span className={`text-xs font-bold ${badgeClass.split(" ")[1]}`}>
                                                {ext}
                                              </span>
                                            </div>
                                            <div className="min-w-0">
                                              <h4 className="font-medium text-gray-900 break-words whitespace-normal">
                                                {doc.filename || doc.label}
                                              </h4>
                                              <p className="text-sm text-gray-500 capitalize truncate">{doc.label}</p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2 shrink-0">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="px-2 text-xs"
                                              onClick={() => resolvedUrl && window.open(resolvedUrl, "_blank")}
                                              disabled={!resolvedUrl}
                                            >
                                              <FileText className="h-3.5 w-3.5 mr-1" />
                                              Preview
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="px-2 text-xs"
                                              onClick={() => resolvedUrl && downloadFile(resolvedUrl, doc.filename || undefined)}
                                              disabled={!resolvedUrl}
                                            >
                                              <Download className="h-3.5 w-3.5 mr-1" />
                                              Download
                                            </Button>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 text-center py-8">
                            No documents uploaded.
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel (40%) */}
              <div className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Interview Evaluation Forms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {interviewSteps.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-8">
                        No interview steps configured for this job.
                      </div>
                    ) : (
                      interviewSteps.map((step) => (
                        <div
                          key={step.id}
                          className="space-y-3 rounded-lg bg-white p-4 shadow"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{step.process_title}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/job/${currentApplicant?.job_id}/applicants/${applicantId}/interviews/${step.id}/ief`
                                )
                              }
                              className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                            >
                              <Scaling className="h-4 w-4" />
                              View IEF
                            </Button>
                          </div>
                        </div>
                      ))
                    )}

                    {/* AI Evaluation Summary - Disabled */}
                    <div className="space-y-2 opacity-50 pointer-events-none">
                      <h4 className="font-semibold flex items-center gap-2">
                        AI Evaluation Summary
                        <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                      </h4>
                      <Textarea
                        readOnly
                        disabled
                        value=""
                        placeholder="AI Evaluation will be available soon."
                        className="h-20 text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
