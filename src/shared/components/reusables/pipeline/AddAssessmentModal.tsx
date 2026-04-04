import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "../../ui/field";
import type {
  Assessment,
  AssessmentInDb,
  AssessmentLocal,
} from "@/shared/types/pipeline.types";
import { TemplateSelector } from "./TemplateSelector";
import { AssessmentTypeSelect } from "./AssessmentTypeSelect";
import { FileUploadArea } from "./FileUploadArea";
import { DuplicateFileNotification } from "./DuplicateFileNotification";
import { useAssessmentForm } from "./useAssessmentForm";
import useAssessment from "@/shared/hooks/useAssessment";
import { Input } from "@/shared/components/ui/input";

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

  const {
    assessments: templates,
    loading: templatesLoading,
    hasMore,
    loadMore,
    handleSearch: onSearchTemplates,
    refetch,
    createTemplate,
  } = useAssessment({ templatesOnly: true, pageSize: 20 });

  const [templateName, setTemplateName] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);

  const {
    assessmentForm,
    filePreview,
    selectedTemplate,
    duplicateFileInfo,
    checkingFile,
    updateField,
    handleFileChange,
    clearFile,
    handleTemplateSelect,
  } = useAssessmentForm({ editingAssessment, open });

  const handleSubmit = () => {
    if (isEditing && editingAssessment && onUpdate) {
      const id =
        (editingAssessment as AssessmentInDb).id ||
        (editingAssessment as AssessmentLocal).tempId;
      const updatedData = { ...editingAssessment, ...assessmentForm };
      onUpdate(id, updatedData);
    } else {
      const newAssessment = { ...assessmentForm, tempId: `temp-${Date.now()}` };
      onAdd(newAssessment);
    }
    onOpenChange(false);
  };

  const handleSaveAsTemplate = async () => {
    if (!assessmentForm.type || !templateName.trim()) {
      return;
    }

    try {
      setSavingTemplate(true);
      const createdTemplate = await createTemplate({
        name: templateName.trim(),
        type: assessmentForm.type,
        file: assessmentForm.file,
      });

      if (createdTemplate) {
        const refreshedTemplates = await refetch();
        handleTemplateSelect(String(createdTemplate.id), refreshedTemplates);
        setTemplateName(createdTemplate.name ?? "");
      }
    } catch (error) {
      console.error("Failed to save template:", error);
    } finally {
      setSavingTemplate(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setTemplateName("");
      return;
    }

    if (editingAssessment?.name) {
      setTemplateName(editingAssessment.name);
    } else {
      setTemplateName("");
    }
  }, [editingAssessment, open]);

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
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Assessment" : "Add Assessment"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="py-4">
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={(templateId) =>
              handleTemplateSelect(templateId, templates)
            }
            templates={templates}
            templatesLoading={templatesLoading}
            hasMore={hasMore}
            loadMore={loadMore}
            onSearch={onSearchTemplates}
          />

          <AssessmentTypeSelect
            value={assessmentForm.type}
            onChange={(value) => updateField("type", value)}
          />

          <FileUploadArea
            file={assessmentForm.file}
            filePreview={filePreview}
            selectedTemplate={selectedTemplate}
            onFileChange={handleFileChange}
            onClearFile={clearFile}
          />

          <DuplicateFileNotification
            isChecking={checkingFile}
            duplicateInfo={duplicateFileInfo}
          />

          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Template Name
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAsTemplate}
                disabled={
                  savingTemplate || !templateName.trim() || !assessmentForm.type
                }
              >
                {savingTemplate ? "Saving..." : "Save as Template"}
              </Button>
            </div>
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
