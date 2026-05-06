import { FileDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { resolveFileUrl, isImageExtension, isPdfExtension } from "@/shared/utils/assessmentUtils";

interface AssessmentFileViewerProps {
  url: string;
  fileExtension?: string | null;
  label?: string;
  className?: string;
}

export default function AssessmentFileViewer({ url, fileExtension, label, className }: AssessmentFileViewerProps) {
  const resolvedUrl = resolveFileUrl(url);

  if (!resolvedUrl) return null;

  if (isPdfExtension(fileExtension)) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">{label || "PDF Document"}</span>
          <Button asChild variant="outline" size="sm" className="gap-1 h-7 text-xs">
            <a href={resolvedUrl} target="_blank" rel="noreferrer">
              <FileDown className="h-3 w-3" />
              Download
            </a>
          </Button>
        </div>
        <iframe
          src={resolvedUrl}
          className="w-full h-96 rounded border border-gray-200"
          title={label || "PDF preview"}
        />
      </div>
    );
  }

  if (isImageExtension(fileExtension)) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">{label || "Image"}</span>
          <Button asChild variant="outline" size="sm" className="gap-1 h-7 text-xs">
            <a href={resolvedUrl} target="_blank" rel="noreferrer">
              <FileDown className="h-3 w-3" />
              Download
            </a>
          </Button>
        </div>
        <div className="rounded border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={resolvedUrl}
            alt={label || "Assessment image"}
            className="max-w-full max-h-96 object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Button asChild variant="outline" className="gap-2">
        <a href={resolvedUrl} target="_blank" rel="noreferrer">
          <FileDown className="h-4 w-4" />
          {label ? `Download ${label}` : "Download File"}
        </a>
      </Button>
    </div>
  );
}
