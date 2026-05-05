import type React from "react";
import { useState } from "react";
import { X, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const ALLOWED_DOCUMENT_EXTENSIONS = [".doc", ".docx", ".pdf", ".jpg", ".jpeg", ".png"] as const;
const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/octet-stream",
]);

const RESUME_ACCEPT_ATTRIBUTE = ALLOWED_DOCUMENT_EXTENSIONS.join(",");
const RESUME_HELPER_TEXT = "Supported: DOC, DOCX, PDF, JPG, JPEG, PNG (Max 10MB)";

export interface UploadedDocumentsPayload {
  resumeFile?: File | null;
  coverLetterFile?: File | null;
}

interface DocumentUploadModalProps {
  onClose: () => void;
  onDocumentsUploaded: (
    documents: UploadedDocumentsPayload,
  ) => Promise<void> | void;
  hasProfileResume?: boolean;
}

export function DocumentUploadModal({
  onClose,
  onDocumentsUploaded,
  hasProfileResume = false,
}: DocumentUploadModalProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAllowedDocumentFile = (file: File) => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;

    if (!ALLOWED_DOCUMENT_EXTENSIONS.includes(extension as (typeof ALLOWED_DOCUMENT_EXTENSIONS)[number])) {
      return false;
    }

    if (file.type && !ALLOWED_DOCUMENT_MIME_TYPES.has(file.type)) {
      return false;
    }

    return true;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAllowedDocumentFile(file)) {
      setErrorMessage("Unsupported file type. Use DOC, DOCX, PDF, JPG, JPEG, or PNG.");
      e.target.value = "";
      return;
    }

    setErrorMessage(null);

    if (type === "resume") setResumeFile(file);
    else setCoverLetterFile(file);
  };

  const removeFile = (type: "resume" | "cover") => {
    if (type === "resume") setResumeFile(null);
    else setCoverLetterFile(null);
    setErrorMessage(null);
  };

  const handleContinue = async () => {
    if (!hasProfileResume && !resumeFile) {
      return;
    }

    setIsProcessing(true);

    try {
      await onDocumentsUploaded({
        resumeFile,
        coverLetterFile,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Upload Documents</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      <p className="text-gray-600 mb-4">
        {hasProfileResume
          ? "Your profile resume will be used for this application. You may also upload an optional cover letter."
          : "Please upload your resume and cover letter. We'll extract the information to help fill out your application."}
      </p>

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {/* Resume Upload — only shown when candidate has no profile resume */}
      {!hasProfileResume && (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Resume / CV</h3>
        <div className="border-2 border-dashed rounded-lg p-6 text-center relative bg-white">
          <div className="text-4xl mb-2">📄</div>
          {!resumeFile ? (
            <>
              <p className="text-gray-600 mb-2">
                Drag & drop your resume here or
              </p>
              <input
                type="file"
                accept={RESUME_ACCEPT_ATTRIBUTE}
                onChange={(e) => handleFileChange(e, "resume")}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer inline-block"
              >
                Browse Resume
              </label>
              <p className="text-xs text-gray-500 mt-2">
                {RESUME_HELPER_TEXT}
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mt-2">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile("resume")}
                className="text-gray-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Cover Letter Upload */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Cover Letter (Optional)</h3>
        <div className="border-2 border-dashed rounded-lg p-6 text-center relative bg-white">
          <div className="text-4xl mb-2">📋</div>
          {!coverLetterFile ? (
            <>
              <p className="text-gray-600 mb-2">
                Drag & drop your cover letter here or
              </p>
              <input
                type="file"
                accept={RESUME_ACCEPT_ATTRIBUTE}
                onChange={(e) => handleFileChange(e, "cover")}
                className="hidden"
                id="cover-upload"
              />
              <label
                htmlFor="cover-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer inline-block"
              >
                Browse Cover Letter
              </label>
              <p className="text-xs text-gray-500 mt-2">
                {RESUME_HELPER_TEXT}
              </p>
            </>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mt-2">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {coverLetterFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile("cover")}
                className="text-gray-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-800">
              Processing documents and extracting information...
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="px-6 py-2 bg-transparent"
        >
          Skip for Now
        </Button>
        <Button
          onClick={handleContinue}
          disabled={(!hasProfileResume && !resumeFile) || isProcessing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          {isProcessing ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
