import { useState } from "react";
import { toast } from "react-toastify";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar.tsx";
import { Badge } from "@/shared/components/ui/badge.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group.tsx";
import { Textarea } from "@/shared/components/ui/textarea.tsx";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { useDeferredAction } from "@/features/applicants/hooks/useDeferredAction";

interface Candidate {
  id: number;
  name: string;
  department?: string;
  photoUrl?: string;
}

interface ShortlistStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  candidateApplicationId: number;
  pipelineStepId: number;
  canChangeStatus: boolean;
  onStatusChange?: () => void;
}

const getCandidateInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ShortlistStatusModal({
  isOpen,
  onClose,
  candidate,
  candidateApplicationId,
  pipelineStepId,
  canChangeStatus,
  onStatusChange,
}: ShortlistStatusModalProps) {
  const [status, setStatus] = useState<"passed" | "failed">("passed");
  const [remarks, setRemarks] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const { queueAction } = useDeferredAction();

  const handleSubmit = () => {
    if (!candidate || !canChangeStatus || !candidateApplicationId || !pipelineStepId) {
      toast.error("Only the assigned interviewer can change this status.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const endpoint =
      status === "passed"
        ? "/api/candidate/pipeline/shortlist/approve/"
        : "/api/candidate/pipeline/shortlist/reject/";

    const payload = {
      candidate_application_id: candidateApplicationId,
      pipeline_step_id: pipelineStepId,
      remarks: remarks.trim(),
    };

    const candidateName = candidate.name;
    const targetStatus = status;

    setStatus("passed");
    setRemarks("");
    onClose();

    queueAction({
      candidateName,
      label: targetStatus === "passed" ? "Shortlist Approve" : "Shortlist Reject",
      onCommit: async () => {
        try {
          const response = await axiosPrivate.post(endpoint, payload);
          if (response.status === 200) {
            toast.success(
              `Candidate marked as ${targetStatus === "passed" ? "Passed" : "Failed"}`,
              {
                position: "top-right",
                autoClose: 3000,
              },
            );
            onStatusChange?.();
          }
        } catch (error: any) {
          const errorMessage =
            error?.response?.data?.error || "Failed to update candidate status";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
          console.error("Error updating candidate status:", error);
        }
      },
    });
  };

  const handleClose = () => {
    setStatus("passed");
    setRemarks("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Update Candidate Status</DialogTitle>
          <DialogDescription className="text-slate-600">
            Change the status of this shortlisted candidate to Passed or Failed
          </DialogDescription>
          {!canChangeStatus ? (
            <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Only the assigned interviewer can change this candidate's status.
            </div>
          ) : null}
        </DialogHeader>

        {candidate && (
          <div className="space-y-6">
            {/* Candidate Information */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={candidate.photoUrl || "/placeholder.svg"} />
                  <AvatarFallback>{getCandidateInitials(candidate.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900">{candidate.name}</div>
                  <div className="text-sm text-slate-600">
                    ID #{String(candidate.id).padStart(3, "0")}
                  </div>
                  {candidate.department && (
                    <div className="text-sm text-slate-500">{candidate.department}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-900">Decision</Label>
              <RadioGroup value={status} onValueChange={(v) => setStatus(v as "passed" | "failed")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="passed" id="status-passed" />
                  <Label htmlFor="status-passed" className="flex cursor-pointer items-center gap-2 font-normal">
                    <Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-100">
                      Passed
                    </Badge>
                    <span className="text-sm text-slate-600">Candidate passed the evaluation</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="failed" id="status-failed" />
                  <Label htmlFor="status-failed" className="flex cursor-pointer items-center gap-2 font-normal">
                    <Badge className="bg-red-100 text-red-800 border border-red-300 hover:bg-red-100">
                      Failed
                    </Badge>
                    <span className="text-sm text-slate-600">Candidate failed the evaluation</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-sm font-medium text-slate-900">
                Remarks <span className="text-slate-400">(Optional)</span>
              </Label>
              <Textarea
                id="remarks"
                placeholder="Add any additional notes or reasons for this decision..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>

            {/* Confirmation Message */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="text-sm text-amber-900">
                This action will move the candidate from <strong>Shortlisted</strong> to{" "}
                <strong className={status === "passed" ? "text-green-700" : "text-red-700"}>
                  {status === "passed" ? "Passed" : "Failed"}
                </strong>{" "}
                and will be recorded in the candidate's history.
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canChangeStatus}
            className={status === "passed" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          >
            {`Mark as ${status === "passed" ? "Passed" : "Failed"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
