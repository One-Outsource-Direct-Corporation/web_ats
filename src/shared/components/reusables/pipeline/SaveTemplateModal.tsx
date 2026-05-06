import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { FileI, AssessmentTemplate } from "@/shared/types/pipeline.types";

interface SaveTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentType: string;
  selectedFile: FileI | null;
  onCreateTemplate: (name: string) => Promise<AssessmentTemplate | null>;
}

export function SaveTemplateModal({
  open,
  onOpenChange,
  assessmentType,
  selectedFile,
  onCreateTemplate,
}: SaveTemplateModalProps) {
  const [templateName, setTemplateName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!templateName.trim()) return;
    setSaving(true);
    try {
      await onCreateTemplate(templateName.trim());
      onOpenChange(false);
    } catch {
      // error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              type="text"
              placeholder="Enter template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Assessment Type</Label>
            <p className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2 border">
              {assessmentType || "Not selected"}
            </p>
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            <p className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2 border truncate">
              {selectedFile && typeof selectedFile === "object" && "filename" in selectedFile
                ? selectedFile.filename
                : selectedFile instanceof File
                  ? selectedFile.name
                  : "No file selected"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || !templateName.trim() || !assessmentType}
          >
            {saving ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
