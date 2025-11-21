// Types for ActionDialog

export interface ActionDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}
