import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { MinusCircle } from "lucide-react";
import { useNavigate } from "react-router";

interface CancelRequestModalProps {
  onSaveDraft?: () => Promise<void> | void;
  savingDraft?: boolean;
}

export default function CancelRequestModal({
  onSaveDraft,
  savingDraft = false,
}: CancelRequestModalProps) {
  const navigate = useNavigate();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-1 border-red-700 text-red-700 text-sm hover:bg-red-700 hover:text-white"
        >
          <MinusCircle className="h-4 w-4" /> Cancel Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-800">
            Cancel Request
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Do you want to cancel the request form for this position?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          {onSaveDraft && (
            <Button
              variant="secondary"
              onClick={() => {
                void onSaveDraft();
              }}
              disabled={savingDraft}
            >
              {savingDraft ? "Saving..." : "Save as Draft"}
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline">No</Button>
          </DialogClose>
          <Button variant="destructive" onClick={() => navigate("/requests")}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
