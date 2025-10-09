import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

// Cancel Confirmation Modal
interface CancelConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  onSaveAsDraft: () => void;
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  open,
  onClose,
  onConfirmCancel,
  onSaveAsDraft,
}) => (
  <Dialog open={open} onOpenChange={onClose}>
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
        <Button variant="outline" onClick={onSaveAsDraft}>
          Save as Draft
        </Button>
        <Button variant="outline" onClick={onClose}>
          No
        </Button>
        <Button variant="destructive" onClick={onConfirmCancel}>
          Yes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Submit Confirmation Modal
interface SubmitConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  open,
  onClose,
  onConfirmSubmit,
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-lg font-medium text-gray-800">
          Submit Request
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          Are you sure you want to submit this request?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          No, Go Back
        </Button>
        <Button
          className="bg-[#0056D2] hover:bg-blue-700 text-white"
          onClick={onConfirmSubmit}
        >
          Submit
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Success Popup Component
interface SuccessPopupProps {
  show: boolean;
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-3 z-50 transition-all duration-300 ease-in-out">
      Request Sent! Your request has been sent successfully.
    </div>
  );
};
