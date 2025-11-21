import { Button } from "@/shared/components/ui/button";
import { Field } from "../../ui/field";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  file: any;
  filePreview: string | null;
  selectedTemplate: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
}

export function FileUploadArea({
  file,
  filePreview,
  selectedTemplate,
  onFileChange,
  onClearFile,
}: FileUploadAreaProps) {
  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  const truncateFilename = (
    filename: string,
    maxLength: number = 30
  ): string => {
    if (filename.length <= maxLength) return filename;
    const extension = filename.split(".").pop() || "";
    const nameWithoutExt = filename.slice(0, filename.lastIndexOf("."));
    const truncatedName = nameWithoutExt.slice(
      0,
      maxLength - extension.length - 4
    );
    return `${truncatedName}...${extension}`;
  };

  const getFileName = (file: any): string => {
    if (file instanceof File) {
      return file.name;
    }
    if (typeof file === "string") {
      return file.split("/").pop() || "file";
    }
    if (file && typeof file === "object") {
      if ("id" in file && !("filename" in file)) {
        return "Template File";
      }
      if ("filename" in file) {
        return file.filename;
      }
    }
    return file?.name || "file";
  };

  if (!file) {
    return (
      <Field>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            selectedTemplate
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-gray-400 cursor-pointer"
          )}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.pdf,.docx"
            onChange={onFileChange}
            className="hidden"
            id="photo-upload"
            disabled={!!selectedTemplate}
          />
          <label
            htmlFor="photo-upload"
            className={cn(
              selectedTemplate ? "cursor-not-allowed" : "cursor-pointer"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8 mx-auto mb-2",
                selectedTemplate ? "text-gray-300" : "text-gray-400"
              )}
            />
            <span
              className={cn(
                "text-sm block mb-1",
                selectedTemplate ? "text-gray-400" : "text-gray-600"
              )}
            >
              {selectedTemplate ? "Template selected" : "Click to upload file"}
            </span>
            <span
              className={cn(
                "text-xs",
                selectedTemplate ? "text-gray-400" : "text-gray-500"
              )}
            >
              Supports: JPG, PDF, DOCX
            </span>
          </label>
        </div>
      </Field>
    );
  }

  return (
    <Field>
      <div className="border-2 border-gray-300 rounded-lg p-4 relative">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearFile}
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        {filePreview ? (
          <div className="flex flex-col items-center">
            <img
              src={filePreview}
              alt="Preview"
              className="max-h-48 max-w-full rounded-lg mb-2 object-contain"
            />
            <span className="text-sm text-gray-600" title={getFileName(file)}>
              {truncateFilename(getFileName(file))}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={getFileName(file)}
              >
                {truncateFilename(getFileName(file))}
              </p>
              <p className="text-xs text-gray-500">
                {file && typeof file === "object" && "filename" in file
                  ? `${getFileExtension(file.filename)} File`
                  : getFileExtension(getFileName(file)) + " File"}
              </p>
            </div>
          </div>
        )}
      </div>
    </Field>
  );
}
