import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { User, Users2 } from "lucide-react";

interface HiringTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HiringTypeDialog({
  open,
  onOpenChange,
}: HiringTypeDialogProps) {
  const navigate = useNavigate();

  const handleInternalHiring = () => {
    navigate("/prf");
    onOpenChange(false);
  };

  const handleClientHiring = () => {
    navigate("/positions/create-new-position");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="text-blue-700 text-sm font-semibold">
            SELECT TYPE OF HIRING
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center gap-12 mt-6">
          {/* Internal Hiring */}
          <div
            className="flex flex-col items-center space-y-2 cursor-pointer group"
            onClick={handleInternalHiring}
          >
            <div className="w-16 h-16 rounded-full border border-gray-500 text-gray-600 flex items-center justify-center group-hover:border-blue-500 group-hover:text-blue-500">
              <User className="w-6 h-6" />
            </div>
            <span className="text-sm text-gray-600 font-medium group-hover:text-blue-500">
              Internal Hiring
            </span>
          </div>

          {/* Client */}
          <div
            className="flex flex-col items-center space-y-2 cursor-pointer group"
            onClick={handleClientHiring}
          >
            <div className="w-16 h-16 rounded-full border border-gray-500 text-gray-600 group-hover:border-blue-500 group-hover:text-blue-500 flex items-center justify-center">
              <Users2 className="w-6 h-6" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-blue-500 font-medium">
              Client
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
