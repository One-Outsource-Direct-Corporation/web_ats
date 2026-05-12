import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export type PoolingOption = 'all_previous' | 'new_only' | 'both';

interface ApplicantPoolingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle: string;
  onConfirm: (option: PoolingOption) => void;
  onSkip: () => void;
}

export default function ApplicantPoolingModal({
  open,
  onOpenChange,
  jobTitle,
  onConfirm,
  onSkip,
}: ApplicantPoolingModalProps) {
  const [selectedOption, setSelectedOption] = useState<PoolingOption>('all_previous');

  const handleConfirm = () => {
    onConfirm(selectedOption);
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Pool Applicants Before Publishing
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            You're about to publish the job post for {jobTitle}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className="text-sm text-green-600 font-medium">Creating Position</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 max-w-[100px]"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <span className="text-sm text-blue-600 font-medium">Applicant Pooling</span>
            </div>
          </div>

          {/* Pooling Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Would you like to start by pooling applicants for this role?
            </p>
            <RadioGroup value={selectedOption} onValueChange={(value) => setSelectedOption(value as PoolingOption)}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedOption('all_previous')}>
                <RadioGroupItem value="all_previous" id="all_previous" />
                <Label htmlFor="all_previous" className="cursor-pointer flex-1">
                  All Previous Applicants
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedOption('new_only')}>
                <RadioGroupItem value="new_only" id="new_only" />
                <Label htmlFor="new_only" className="cursor-pointer flex-1">
                  New Applicants Only
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedOption('both')}>
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="cursor-pointer flex-1">
                  Both
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-700"
          >
            Not now
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
