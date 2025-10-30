import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";

interface AssessmentFormData {
  type: string;
  title: string;
  description: string;
  required: boolean;
}

interface AddAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentForm: AssessmentFormData;
  onAssessmentFormChange: (form: AssessmentFormData) => void;
  onAdd: () => void;
}

export function AddAssessmentModal({
  open,
  onOpenChange,
  assessmentForm,
  onAssessmentFormChange,
  onAdd,
}: AddAssessmentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Assessment</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Assessment Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Assessment Type
            </label>
            <Select
              value={assessmentForm.type}
              onValueChange={(value) =>
                onAssessmentFormChange({ ...assessmentForm, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Assessment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Assessment Type" disabled>
                  Select Assessment Type
                </SelectItem>
                <SelectItem value="Technical Test">Technical Test</SelectItem>
                <SelectItem value="Personality Test">
                  Personality Test
                </SelectItem>
                <SelectItem value="Skills Assessment">
                  Skills Assessment
                </SelectItem>
                <SelectItem value="Cognitive Test">Cognitive Test</SelectItem>
                <SelectItem value="Portfolio Review">
                  Portfolio Review
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assessment Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Assessment Title
            </label>
            <Input
              placeholder="Enter assessment title"
              value={assessmentForm.title}
              onChange={(e) =>
                onAssessmentFormChange({
                  ...assessmentForm,
                  title: e.target.value,
                })
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </label>
            <textarea
              placeholder="Enter assessment description"
              value={assessmentForm.description}
              onChange={(e) =>
                onAssessmentFormChange({
                  ...assessmentForm,
                  description: e.target.value,
                })
              }
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Required Assessment */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={assessmentForm.required}
              onCheckedChange={(checked) =>
                onAssessmentFormChange({
                  ...assessmentForm,
                  required: checked as boolean,
                })
              }
            />
            <label className="text-sm text-gray-700">Required Assessment</label>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={onAdd}
          >
            Add Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
