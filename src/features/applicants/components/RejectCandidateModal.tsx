import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { toast } from "react-toastify";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

interface RejectCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    id: number;
    name: string;
    pipelineStepId?: number;
  };
  onReject: (candidateId: number, pipelineStepId: number | undefined, addToPool: boolean, rejectionReason: string) => Promise<void>;
}

export default function RejectCandidateModal({
  isOpen,
  onClose,
  candidate,
  onReject,
}: RejectCandidateModalProps) {
  const [addToPool, setAddToPool] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onReject(candidate.id, candidate.pipelineStepId, addToPool, rejectionReason);
      handleClose();
    } catch (error) {
      toast.error('Failed to reject candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAddToPool(false);
    setRejectionReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Candidate</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject {candidate.name}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-md border border-blue-200">
            <Checkbox
              id="add-to-pool"
              checked={addToPool}
              onCheckedChange={(checked) => setAddToPool(checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="add-to-pool" className="font-medium text-blue-900 cursor-pointer">
                Add to Talent Pool
              </Label>
              <p className="text-xs text-blue-700">
                This candidate will be added to the talent pool and can be assigned to other job postings later.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason" className="text-sm font-medium">
              Rejection Reason <span className="text-gray-400">(Optional)</span>
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Add a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-20"
            />
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm text-amber-900">
              This action will reject the candidate from the current pipeline step.
              {addToPool && " They will be added to the talent pool for future consideration."}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Rejecting...' : 'Reject Candidate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
