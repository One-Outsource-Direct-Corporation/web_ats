import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "../../ui/field";
import type {
  Assessment,
  AssessmentInDb,
  AssessmentLocal,
} from "@/shared/types/pipeline.types";
import { TemplateSelector } from "./TemplateSelector";
import { AssessmentTypeSelect } from "./AssessmentTypeSelect";
import { FileUploadArea } from "./FileUploadArea";
import { DuplicateFileNotification } from "./DuplicateFileNotification";
import { TemplateCheckbox } from "./TemplateCheckbox";
import { useAssessmentForm } from "./useAssessmentForm";
import useAssessment from "@/shared/hooks/useAssessment";

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
  } = useAssessment({ templatesOnly: true, pageSize: 20 });

  const {
    assessmentForm,
    filePreview,
    selectedTemplate,
    isUsingTemplateFile,
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
        </FieldGroup>

        <TemplateCheckbox
          isTemplate={assessmentForm.is_template}
          templateName={assessmentForm.name}
          isUsingTemplateFile={isUsingTemplateFile}
          onTemplateChange={(checked) => updateField("is_template", checked)}
          onNameChange={(name) => updateField("name", name)}
        />

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
