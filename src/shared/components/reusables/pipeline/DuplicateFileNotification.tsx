import { AlertCircle } from "lucide-react";

interface DuplicateFileNotificationProps {
  isChecking: boolean;
  duplicateInfo: {
    duplicate: boolean;
    filename: string;
    fileId: number;
    fileType: string;
  } | null;
}

export function DuplicateFileNotification({
  isChecking,
  duplicateInfo,
}: DuplicateFileNotificationProps) {
  if (isChecking) {
    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mt-0.5" />
        <span className="text-sm text-blue-700">
          Checking if file exists in database...
        </span>
      </div>
    );
  }

  if (duplicateInfo?.duplicate) {
    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">
            File Already Exists in Database
          </p>
          <p className="text-xs text-blue-700 mt-1">
            A file already exists. The existing file will be automatically
            reused by the backend to save storage space.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
