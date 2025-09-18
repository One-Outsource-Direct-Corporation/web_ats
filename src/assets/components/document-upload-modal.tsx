import type React from "react";
import { useState } from "react";
import { X, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentUploadModalProps {
  onClose: () => void;
  onDocumentsUploaded: (resumeData: any) => void;
}

export function DocumentUploadModal({
  onClose,
  onDocumentsUploaded,
}: DocumentUploadModalProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const valid =
      file.type === "application/pdf" ||
      file.type.startsWith("image/") ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!valid) return;

    if (type === "resume") setResumeFile(file);
    else setCoverLetterFile(file);
  };

  const removeFile = (type: "resume" | "cover") => {
    if (type === "resume") setResumeFile(null);
    else setCoverLetterFile(null);
  };

  const handleContinue = async () => {
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResumeData = {
      firstName: "John",
      lastName: "Doe",
      birthday: "15-Jan-1990",
      gender: "male",
      primaryContact: "+63 912 345 6789",
      secondaryContact: "+63 987 654 3210",
      email: "john.doe@email.com",
      linkedinProfile: "https://linkedin.com/in/johndoe",
      addressLine1: "123 Main Street, Barangay San Antonio",
      city: "Makati City",
      district: "Metro Manila",
      postalCode: "1203",
      country: "Philippines",
    };

    onDocumentsUploaded(mockResumeData);
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
        Please upload your resume and cover letter. We’ll extract the
        information to help fill out your application.
      </p>

      {/* Resume Upload */}
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
                accept=".pdf,.doc,.docx,image/*"
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
                Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
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

      {/* Cover Letter Upload */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Cover Letter</h3>
        <div className="border-2 border-dashed rounded-lg p-6 text-center relative bg-white">
          <div className="text-4xl mb-2">📋</div>
          {!coverLetterFile ? (
            <>
              <p className="text-gray-600 mb-2">
                Drag & drop your cover letter here or
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
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
                Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
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
          disabled={!resumeFile || isProcessing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          {isProcessing ? "Processing..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
