import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import type {
  Assessment,
  AssessmentLocal,
} from "@/shared/types/pipeline.types";
import { useState, useEffect } from "react";
import { Field, FieldGroup, FieldLabel } from "../../ui/field";
import { Textarea } from "../../ui/textarea";

interface AddAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (assessment: AssessmentLocal) => void;
  editingAssessment?: Assessment | null;
  onUpdate?: (id: number | string, assessment: Assessment) => void;
}

export function AddAssessmentModal({
  open,
  onOpenChange,
  onAdd,
  editingAssessment,
  onUpdate,
}: AddAssessmentModalProps) {
  const isEditing = !!editingAssessment;

  const [assessmentForm, setAssessmentForm] = useState<
    Omit<Assessment, "id" | "tempId">
  >({
    type: "",
    title: "",
    description: "",
    required: false,
    order: 0,
  });

  // Reset form when modal opens/closes or when editing a different assessment
  useEffect(() => {
    if (editingAssessment) {
      setAssessmentForm({
        type: editingAssessment.type,
        title: editingAssessment.title,
        description: editingAssessment.description,
        required: editingAssessment.required,
        order: editingAssessment.order,
      });
    } else {
      setAssessmentForm({
        type: "",
        title: "",
        description: "",
        required: false,
        order: 0,
      });
    }
  }, [editingAssessment, open]);

  function handleAssessmentFormChange(
    field: keyof Assessment,
    value: string | boolean
  ) {
    setAssessmentForm({ ...assessmentForm, [field]: value });
  }

  function handleSubmit() {
    if (isEditing && editingAssessment && onUpdate) {
      const id =
        (editingAssessment as any).id || (editingAssessment as any).tempId;
      onUpdate(id, { ...editingAssessment, ...assessmentForm });
    } else {
      onAdd({ ...assessmentForm, tempId: `temp-${Date.now()}` });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-600"
        >
          Add Assessment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Assessment" : "Add Assessment"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="py-4">
          {/* Assessment Type */}
          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Assessment Type
            </FieldLabel>
            <Select
              value={assessmentForm.type}
              onValueChange={(value) =>
                handleAssessmentFormChange("type", value)
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
          </Field>

          {/* Assessment Title */}
          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Assessment Title
            </FieldLabel>
            <Input
              placeholder="Enter assessment title"
              value={assessmentForm.title}
              onChange={(e) =>
                handleAssessmentFormChange("title", e.target.value)
              }
            />
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </FieldLabel>
            <Textarea
              placeholder="Enter assessment description"
              value={assessmentForm.description}
              onChange={(e) =>
                handleAssessmentFormChange("description", e.target.value)
              }
              className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Field>

          {/* Required Assessment */}
          <Field orientation="horizontal">
            <Checkbox
              id="required-assessment"
              checked={assessmentForm.required}
              onCheckedChange={(checked) =>
                handleAssessmentFormChange("required", checked)
              }
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
            <FieldLabel
              htmlFor="required-assessment"
              className="text-sm text-gray-700"
            >
              Required Assessment
            </FieldLabel>
          </Field>
        </FieldGroup>

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
            onClick={handleSubmit}
          >
            {isEditing ? "Update Assessment" : "Add Assessment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
