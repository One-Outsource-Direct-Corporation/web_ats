import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Download, FileText } from "lucide-react";

function resolveMediaUrl(rawUrl?: string | null): string | undefined {
  if (!rawUrl) {
    return undefined;
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
}

export type Candidate = {
  id: number | string;
  name: string;
  department?: string;
  photoUrl?: string;
  avatar?: string;
  resumeUrl?: string | null;
  pipelineStepId?: number;
  stepInterviewerId?: number;
  statusLabel?: string;
};

type Props = {
  candidates: Candidate[];
  onPass?: (candidate: Candidate) => void;
  onFail?: (candidate: Candidate) => void;
  isPassFailDisabled?: (candidate: Candidate) => boolean;
  className?: string;
};

export default function ResumeScreeningTable({
  candidates,
  onPass,
  onFail,
  isPassFailDisabled,
  className,
}: Props) {
  const [selectedApplicant, setSelectedApplicant] = useState<Candidate | null>(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
  const [resumePreviewMimeType, setResumePreviewMimeType] = useState<string | null>(null);
  const [isResumePreviewLoading, setIsResumePreviewLoading] = useState(false);
  const [resumePreviewError, setResumePreviewError] = useState<string | null>(null);

  const selectedApplicantResumeUrl = resolveMediaUrl(selectedApplicant?.resumeUrl);

  const getCandidatePhotoUrl = (candidate: Candidate): string | undefined => {
    return resolveMediaUrl(candidate.photoUrl ?? candidate.avatar);
  };

  useEffect(() => {
    let isActive = true;
    let objectUrl: string | null = null;

    setResumePreviewUrl(null);
    setResumePreviewMimeType(null);
    setResumePreviewError(null);

    if (!selectedApplicantResumeUrl) {
      setIsResumePreviewLoading(false);
      return () => undefined;
    }

    setIsResumePreviewLoading(true);

    (async () => {
      try {
        const response = await fetch(selectedApplicantResumeUrl, { mode: "cors" });

        if (!response.ok) {
          throw new Error("Failed to load resume preview.");
        }

        const blob = await response.blob();
        objectUrl = window.URL.createObjectURL(blob);

        if (!isActive) {
          window.URL.revokeObjectURL(objectUrl);
          return;
        }

        setResumePreviewUrl(objectUrl);
        setResumePreviewMimeType(blob.type || null);
      } catch {
        if (isActive) {
          setResumePreviewError("Resume preview is unavailable for this file.");
        }
      } finally {
        if (isActive) {
          setIsResumePreviewLoading(false);
        }
      }
    })();

    return () => {
      isActive = false;

      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedApplicantResumeUrl]);

  const handleDownloadResume = (candidate: Candidate) => {
    const resumeUrl = resolveMediaUrl(candidate.resumeUrl);
    if (!resumeUrl) return;

    // Try to fetch and download as blob so the file is directly downloaded
    (async () => {
      try {
        const resp = await fetch(resumeUrl, { mode: "cors" });
        if (!resp.ok) throw new Error("Fetch failed");
        const blob = await resp.blob();
        const filename = (resumeUrl.split("/").pop() || `resume-${candidate.id}`).split("?")[0];
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || "resume";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      } catch {
        // Fallback: open in new tab
        const a = document.createElement("a");
        a.href = resumeUrl;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.click();
      }
    })();
  };

  return (
    <div className={className}>
      <div className="mt-4 rounded-md border bg-white overflow-x-auto">
        <Table className="w-full table-fixed text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-16 border border-gray-200 py-2 px-3 text-xs lg:text-sm lg:py-3 lg:px-4">ID</TableHead>
              <TableHead className="text-center border border-gray-200 py-2 px-3 w-36 text-xs whitespace-normal wrap-break-word lg:text-sm lg:py-3 lg:px-4">Full Name</TableHead>
              <TableHead className="border border-gray-200 py-2 px-3 w-24 text-center text-xs whitespace-normal wrap-break-word lg:text-sm lg:py-3 lg:px-4">Resume</TableHead>
              <TableHead className="border border-gray-200 py-2 px-3 w-20 text-center text-xs lg:text-sm lg:py-3 lg:px-4">Pass</TableHead>
              <TableHead className="border border-gray-200 py-2 px-3 w-20 text-center text-xs lg:text-sm lg:py-3 lg:px-4">Fail</TableHead>
              <TableHead className="text-center border border-gray-200 py-2 px-3 w-24 text-xs lg:text-sm lg:py-3 lg:px-4">Department</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-gray-50">
                  <TableCell className="text-center border border-gray-200 py-3 px-3 font-medium text-xs lg:text-sm align-middle">{String(candidate.id)}</TableCell>

                  <TableCell className="border border-gray-200 py-3 px-3 lg:py-4 lg:px-4 w-36 align-middle" style={{ whiteSpace: "normal", overflowWrap: "anywhere" }}>
                    <div className="flex min-w-0 flex-col items-center justify-center gap-1 text-center lg:flex-row lg:gap-3">
                      <Avatar className="h-6 w-6 lg:h-8 lg:w-8 shrink-0">
                        <AvatarImage
                          src={getCandidatePhotoUrl(candidate) || "/placeholder.svg"}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-sm text-xs lg:text-sm">
                          {candidate.name
                            ?.split(" ")
                            .map((namePart) => namePart[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="block min-w-0 max-w-full font-medium text-xs leading-tight whitespace-normal lg:text-sm" style={{ overflowWrap: "anywhere" }} title={candidate.name}>
                        {candidate.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full px-2 text-xs lg:text-sm text-slate-700 border-slate-300 bg-white hover:bg-slate-900 hover:text-white"
                      onClick={() => setSelectedApplicant(candidate)}
                    >
                      <FileText className="mr-1 h-3.5 w-3.5" />
                      View Resume
                    </Button>
                  </TableCell>

                  <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 text-green-600 border-green-600 bg-white hover:bg-green-600 hover:text-white"
                      disabled={isPassFailDisabled?.(candidate) ?? false}
                      onClick={() => onPass?.(candidate)}
                    >
                      Pass
                    </Button>
                  </TableCell>

                  <TableCell className="border border-gray-200 py-3 px-3 text-center align-middle">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 text-red-600 border-red-600 bg-white hover:bg-red-600 hover:text-white"
                      disabled={isPassFailDisabled?.(candidate) ?? false}
                      onClick={() => onFail?.(candidate)}
                    >
                      Fail
                    </Button>
                  </TableCell>

                  <TableCell className="text-center border border-gray-200 py-3 px-3 text-xs lg:text-sm align-middle">
                    <span className="leading-tight whitespace-normal" style={{ overflowWrap: "anywhere" }}>{candidate.department || "-"}</span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="border border-gray-200 p-6 lg:p-8 text-center text-gray-500 text-xs lg:text-sm">
                  No applicants found in this stage.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(selectedApplicant)} onOpenChange={(open) => { if (!open) setSelectedApplicant(null); }}>
        <DialogContent className="flex h-[90vh] max-h-[90vh] w-[min(96vw,80rem)] max-w-none flex-col overflow-hidden">
          <DialogHeader className="flex flex-col gap-4 text-left sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <DialogTitle>{selectedApplicant ? `${selectedApplicant.name}'s Resume` : "Resume Preview"}</DialogTitle>
              <DialogDescription>Preview the submitted resume and download a copy.</DialogDescription>
            </div>

            {selectedApplicant ? (
              <Button
                className="w-full shrink-0 sm:w-auto"
                variant="outline"
                onClick={() => handleDownloadResume(selectedApplicant)}
                disabled={!selectedApplicantResumeUrl}
              >
                <Download className="mr-2 h-4 w-4" />
                Open / Download Resume
              </Button>
            ) : null}
          </DialogHeader>

          {selectedApplicant ? (
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              <div className="overflow-hidden rounded-lg border bg-white">
                {isResumePreviewLoading ? (
                  <div className="flex h-[72vh] w-full items-center justify-center p-6 text-sm text-gray-500">
                    Loading resume preview...
                  </div>
                ) : resumePreviewError ? (
                  <div className="flex h-[72vh] w-full items-center justify-center p-6 text-sm text-gray-500">
                    {resumePreviewError}
                  </div>
                ) : resumePreviewUrl && resumePreviewMimeType?.startsWith("image/") ? (
                  <img
                    alt={`${selectedApplicant.name} resume preview`}
                    className="h-[72vh] w-full object-contain bg-white"
                    src={resumePreviewUrl}
                  />
                ) : resumePreviewUrl && resumePreviewMimeType === "application/pdf" ? (
                  <iframe
                    title={`${selectedApplicant.name} resume preview`}
                    className="h-[72vh] w-full bg-white"
                    src={resumePreviewUrl}
                  />
                ) : (
                  <div className="flex h-[72vh] w-full items-center justify-center p-6 text-sm text-gray-500">
                    Resume preview is unavailable.
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Resume Link</p>
                <p className="mt-1 wrap-break-word text-sm text-gray-900">
                  {selectedApplicantResumeUrl || "No resume link available."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed p-10 text-sm text-gray-500">
              Resume preview is unavailable.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
