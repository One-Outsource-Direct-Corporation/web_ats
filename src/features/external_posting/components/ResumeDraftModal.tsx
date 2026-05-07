import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FileText, RefreshCw } from "lucide-react";
import { formatDate } from "@/shared/utils/formatDate";

interface ResumeDraftModalProps {
  open: boolean;
  savedAt: string;
  summary: {
    jobTitle: string | null;
    client: number | string | null;
  };
  onResume: () => void;
  onStartNew: () => void;
}

export default function ResumeDraftModal({
  open,
  savedAt,
  summary,
  onResume,
  onStartNew,
}: ResumeDraftModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-800">
            Resume Draft
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            You have an unfinished external posting draft saved from{" "}
            <span className="font-medium">{formatDate(savedAt)}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-gray-50 p-4 space-y-2 text-sm">
          {summary.jobTitle && (
            <div className="flex justify-between">
              <span className="text-gray-500">Job Title</span>
              <span className="font-medium text-gray-800">{summary.jobTitle}</span>
            </div>
          )}
          {summary.client && (
            <div className="flex justify-between">
              <span className="text-gray-500">Client</span>
              <span className="font-medium text-gray-800">{summary.client}</span>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onStartNew}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Start New
          </Button>
          <Button onClick={onResume}>
            <FileText className="h-4 w-4 mr-1" />
            Resume Draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
