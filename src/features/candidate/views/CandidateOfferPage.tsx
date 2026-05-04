import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Download, Upload, FileCheck, AlertCircle } from "lucide-react";

export default function CandidateOfferPage() {
  const { trackingCode } = useParams<{ trackingCode: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Client-side validation
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selected.type)) {
      setError("Only PDF, JPG, and PNG files are allowed.");
      setFile(null);
      return;
    }

    if (selected.size > maxSize) {
      setError("File too large. Maximum 10MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    // TODO: Wire to actual API endpoint
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('tracking_code', trackingCode || '');
    // await api.post('/candidate/upload-signed-offer/', formData);

    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <img
              src="/OODC%20logo2.png"
              alt="Company Logo"
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Job Offer</h1>
              <p className="text-sm text-gray-500">
                Reference: {trackingCode || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Offer Preview Card */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Job Offer</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>

          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="text-center mb-6">
              <img
                src="/OODC%20logo2.png"
                alt="Company Logo"
                className="h-16 w-auto mx-auto mb-4"
              />
              <h3 className="text-xl font-bold">Job Offer Letter</h3>
            </div>

            <div className="space-y-4 text-sm">
              <p>
                Dear Candidate,
              </p>
              <p>
                We are pleased to offer you the position of{" "}
                <strong>[Position Title]</strong> at our company.
              </p>
              <p>
                Please review the attached offer letter and return the signed
                copy at your earliest convenience.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Signed Document */}
        {!uploadSuccess ? (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Upload Signed Document
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Please download the offer letter above, sign it, and upload the
              signed copy here. Accepted formats: PDF, JPG, PNG (max 10MB).
            </p>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 p-3 rounded">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="signed-doc">Select File</Label>
                <Input
                  id="signed-doc"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>

              {file && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded">
                  <FileCheck className="h-4 w-4" />
                  <span>{file.name}</span>
                  <span className="text-gray-400">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Submit Signed Document"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <FileCheck className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-green-800">
              Document Submitted Successfully
            </h2>
            <p className="text-sm text-green-700 mt-2">
              Thank you! Our HR team will review your signed document and
              contact you shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
