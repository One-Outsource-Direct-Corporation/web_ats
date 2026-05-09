import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { queryKeys } from "@/shared/query-keys";
import { Button } from "@/shared/components/ui/button";
import { findMatchingDocumentByTypeOrName, type CandidateDocument } from "@/features/candidate/constants/requiredDocuments";
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  FileUp,
} from "lucide-react";

interface RequirementItem {
  requirement_key: string;
  requirement_label: string;
  required: boolean;
  status: "pending" | "submitted" | "verified" | "stale" | "carried_over";
  version: number;
  original_filename: string;
  file_id: number | null;
  carry_over_to_onboarding: boolean;
  submitted_at: string | null;
}

interface PreonboardingData {
  candidate_application_id: number | null;
  requirements: RequirementItem[];
  progress: {
    total: number;
    required_count: number;
    required_submitted: number;
    required_pending: number;
    submitted: number;
    verified: number;
    pending: number;
    stale: number;
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="h-3 w-3" />,
  },
  submitted: {
    label: "Submitted",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Upload className="h-3 w-3" />,
  },
  verified: {
    label: "Verified",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  stale: {
    label: "Re-submit Required",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  carried_over: {
    label: "Carried to Onboarding",
    color: "bg-gray-50 text-gray-500 border-gray-200",
    icon: <FileText className="h-3 w-3" />,
  },
};

export default function CandidatePreonboardingPage() {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [showDocPicker, setShowDocPicker] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.preonboarding.data(),
    queryFn: async () => {
      const res = await axiosPrivate.get("/api/candidate/me/preonboarding/");
      return res.data as PreonboardingData;
    },
  });

  const { data: documents = [] } = useQuery({
    queryKey: queryKeys.documents.list(),
    queryFn: async () => {
      const res = await axiosPrivate.get("/api/candidate/me/documents/");
      return res.data as CandidateDocument[];
    },
  });

  const submitMutation = useMutation({
    mutationFn: async ({
      requirement_key,
      file,
      document_id,
    }: {
      requirement_key: string;
      file?: File;
      document_id?: number;
    }) => {
      const formData = new FormData();
      formData.append("requirement_key", requirement_key);
      if (file) formData.append("file", file);
      if (document_id) formData.append("document_id", String(document_id));
      await axiosPrivate.post("/api/candidate/me/preonboarding/submit/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.preonboarding.all });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (requirement_key: string) => {
      await axiosPrivate.delete(`/api/candidate/me/preonboarding/${requirement_key}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.preonboarding.all });
    },
  });

  const handleFileUpload = (key: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploadingKey(key);
      try {
        await submitMutation.mutateAsync({ requirement_key: key, file });
      } finally {
        setUploadingKey(null);
      }
    };
    input.click();
  };

  const handleUseDocument = async (key: string, documentId: number) => {
    setUploadingKey(key);
    try {
      await submitMutation.mutateAsync({ requirement_key: key, document_id: documentId });
    } finally {
      setUploadingKey(null);
      setShowDocPicker(null);
    }
  };

  const progress = data?.progress;
  const requirements = data?.requirements ?? [];
  const hasStaleItems = requirements.some((r) => r.status === "stale");

  const findMatchingDocument = useCallback(
    (requirementLabel: string) => findMatchingDocumentByTypeOrName(requirementLabel, documents),
    [documents],
  );

  const matchedDocs = useMemo(() => {
    const map = new Map<string, CandidateDocument | undefined>();
    for (const req of requirements) {
      if (req.status === "pending" || req.status === "stale") {
        map.set(req.requirement_key, findMatchingDocument(req.requirement_label || req.requirement_key));
      }
    }
    return map;
  }, [requirements, findMatchingDocument]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center py-12 text-gray-500">Loading preonboarding requirements...</div>
      </div>
    );
  }

  if (!data?.candidate_application_id) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Preonboarding Requirements</h2>
          <p className="text-gray-500">You don't have any applications at the preonboarding stage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Preonboarding Requirements</h1>
      <p className="text-gray-500 mb-6">
        Submit the required documents to complete your preonboarding.
      </p>

      {hasStaleItems && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Requirements have changed</p>
            <p className="text-sm text-red-600">
              Some requirements were modified by HR. Please review and re-submit the affected items.
            </p>
          </div>
        </div>
      )}

      {progress && (
        <div className="mb-6 bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {progress.required_submitted} of {progress.required_count} required items submitted
            </span>
            <span className="text-sm text-gray-500">
              {progress.submitted} / {progress.total} total
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#0056d2] h-2.5 rounded-full transition-all"
              style={{
                width: `${progress.required_count > 0 ? (progress.required_submitted / progress.required_count) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {requirements.map((req) => {
          const config = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
          return (
            <div
              key={req.requirement_key}
              className={`bg-white rounded-lg border p-4 ${
                req.status === "stale" ? "border-red-300 bg-red-50/50" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {req.requirement_label || req.requirement_key}
                    </span>
                    {req.required && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
                    >
                      {config.icon}
                      {config.label}
                    </span>
                  </div>

                  {req.status === "submitted" && req.original_filename && (
                    <p className="text-sm text-gray-500 truncate">
                      {req.original_filename}
                    </p>
                  )}

                  {req.status === "carried_over" && (
                    <p className="text-xs text-gray-400">
                      This item will be completed during onboarding.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                  {(req.status === "pending" || req.status === "stale") && (() => {
                    const matchedDoc = matchedDocs.get(req.requirement_key);
                    return (
                      <>
                        {matchedDoc ? (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                            disabled={uploadingKey === req.requirement_key}
                            onClick={() => handleUseDocument(req.requirement_key, matchedDoc.id)}
                          >
                            {uploadingKey === req.requirement_key ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <FileUp className="h-3 w-3 mr-1" />
                            )}
                            Import: {matchedDoc.original_filename || matchedDoc.filename}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={uploadingKey === req.requirement_key}
                            onClick={() => handleFileUpload(req.requirement_key)}
                            className="text-xs"
                          >
                            {uploadingKey === req.requirement_key ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Upload className="h-3 w-3 mr-1" />
                            )}
                            Upload
                          </Button>
                        )}
                        {!matchedDoc && documents.length > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-blue-600"
                            onClick={() => setShowDocPicker(showDocPicker === req.requirement_key ? null : req.requirement_key)}
                          >
                            Use from Documents
                          </Button>
                        )}
                        {matchedDoc && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={uploadingKey === req.requirement_key}
                            onClick={() => handleFileUpload(req.requirement_key)}
                            className="text-xs"
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Upload
                          </Button>
                        )}
                      </>
                    );
                  })()}
                  {(req.status === "submitted" || req.status === "verified") && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => handleFileUpload(req.requirement_key)}
                      >
                        Replace
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-red-500"
                        onClick={() => removeMutation.mutate(req.requirement_key)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {showDocPicker === req.requirement_key && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Select a document</span>
                    <button
                      onClick={() => setShowDocPicker(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {documents.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No documents available. Upload documents first.
                    </p>
                  ) : (
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {documents.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => handleUseDocument(req.requirement_key, doc.id)}
                          className="w-full flex items-center gap-3 p-2 rounded hover:bg-white text-left transition-colors"
                        >
                          <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate flex-1">
                            {doc.original_filename || doc.filename}
                          </span>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {requirements.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No requirements have been configured yet.</p>
        </div>
      )}
    </div>
  );
}
