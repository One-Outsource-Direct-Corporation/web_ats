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
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import type {
  Assessment,
  AssessmentInDb,
  AssessmentLocal,
} from "@/shared/types/pipeline.types";
import { useState, useEffect } from "react";
import { Field, FieldGroup, FieldLabel } from "../../ui/field";
import { Upload, X, FileText, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
    name: null,
    is_template: false,
    type: "",
    order: 0,
    file: null,
  });

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [openTemplateCombobox, setOpenTemplateCombobox] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Mock templates data - replace with actual data from your backend
  const templates = [
    { value: "1", label: "Technical Assessment Template" },
    { value: "2", label: "Personality Test Template" },
    { value: "3", label: "Skills Evaluation Template" },
    { value: "4", label: "Cognitive Assessment Template" },
    { value: "5", label: "Portfolio Review Template" },
  ];

  // Reset form when modal opens/closes or when editing a different assessment
  useEffect(() => {
    if (editingAssessment) {
      setAssessmentForm({
        name: editingAssessment.name || null,
        is_template: editingAssessment.is_template,
        type: editingAssessment.type,
        order: editingAssessment.order,
        file: editingAssessment.file || null,
      });
      // Set preview if editing has an image file
      if (editingAssessment.file) {
        if (typeof editingAssessment.file === "string") {
          setFilePreview(editingAssessment.file);
        } else if (
          editingAssessment.file instanceof File &&
          editingAssessment.file.type.startsWith("image/")
        ) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreview(reader.result as string);
          };
          reader.readAsDataURL(editingAssessment.file);
        } else {
          setFilePreview(null);
        }
      } else {
        setFilePreview(null);
      }
    } else {
      setAssessmentForm({
        name: null,
        is_template: false,
        type: "",
        order: 0,
        file: null,
      });
      setFilePreview(null);
      setSelectedTemplate("");
    }
  }, [editingAssessment, open]);

  function handleTemplateSelect(currentValue: string) {
    setSelectedTemplate(currentValue === selectedTemplate ? "" : currentValue);
    setOpenTemplateCombobox(false);

    // If a template is selected, clear the file and reset is_template
    if (currentValue !== selectedTemplate && currentValue !== "") {
      handleAssessmentFormChange("file", null);
      handleAssessmentFormChange("is_template", false);
      handleAssessmentFormChange("name", null);
      setFilePreview(null);
    }
  }

  function handleAssessmentFormChange(
    field: keyof Assessment,
    value: string | boolean | File | null
  ) {
    setAssessmentForm({ ...assessmentForm, [field]: value });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleAssessmentFormChange("file", file);

      // Create preview for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  }

  function handleClearFile() {
    handleAssessmentFormChange("file", null);
    setFilePreview(null);
    // Reset file input
    const fileInput = document.getElementById(
      "photo-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  function getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toUpperCase() || "";
  }

  function truncateFilename(filename: string, maxLength: number = 30): string {
    if (filename.length <= maxLength) return filename;
    const extension = filename.split(".").pop() || "";
    const nameWithoutExt = filename.slice(0, filename.lastIndexOf("."));
    const truncatedName = nameWithoutExt.slice(
      0,
      maxLength - extension.length - 4
    );
    return `${truncatedName}...${extension}`;
  }

  function getFileName(file: any): string {
    if (file instanceof File) {
      return file.name;
    }
    if (typeof file === "string") {
      return file.split("/").pop() || "file";
    }
    return file?.name || "file";
  }

  function handleSubmit() {
    if (isEditing && editingAssessment && onUpdate) {
      const id =
        (editingAssessment as AssessmentInDb).id ||
        (editingAssessment as AssessmentLocal).tempId;
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
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Assessment" : "Add Assessment"}
          </DialogTitle>
        </DialogHeader>
        <FieldGroup className="py-4">
          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Select Template
            </FieldLabel>
            <Popover
              open={openTemplateCombobox}
              onOpenChange={setOpenTemplateCombobox}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTemplateCombobox}
                  className="w-full justify-between"
                >
                  {selectedTemplate
                    ? templates.find(
                        (template) => template.value === selectedTemplate
                      )?.label
                    : "Browse Templates"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search templates..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No template found.</CommandEmpty>
                    <CommandGroup>
                      {templates.map((template) => (
                        <CommandItem
                          key={template.value}
                          value={template.value}
                          onSelect={handleTemplateSelect}
                        >
                          {template.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedTemplate === template.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedTemplate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTemplate("")}
                className="mt-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Template
              </Button>
            )}
          </Field>

          <Field>
            <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Assessment Type
            </FieldLabel>
            <Select
              value={assessmentForm.type ?? ""}
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

          <Field>
            {!assessmentForm.file ? (
              <div
                className={cn(
                  "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors",
                  selectedTemplate
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-gray-400 cursor-pointer"
                )}
              >
                <input
                  type="file"
                  accept=".jpg,.jpeg,.pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                  disabled={!!selectedTemplate}
                />
                <label
                  htmlFor="photo-upload"
                  className={cn(
                    selectedTemplate ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600 block mb-1">
                    {selectedTemplate
                      ? "Template selected - Upload disabled"
                      : "Click to upload file"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Supports: JPG, PDF, DOCX
                  </span>
                </label>
              </div>
            ) : (
              <div className="border-2 border-gray-300 rounded-lg p-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFile}
                  className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>

                {filePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-48 max-w-full rounded-lg mb-2 object-contain"
                    />
                    <span
                      className="text-sm text-gray-600"
                      title={getFileName(assessmentForm.file)}
                    >
                      {truncateFilename(getFileName(assessmentForm.file))}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-gray-900 truncate"
                        title={getFileName(assessmentForm.file)}
                      >
                        {truncateFilename(getFileName(assessmentForm.file))}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getFileExtension(getFileName(assessmentForm.file))}{" "}
                        File
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Field>
        </FieldGroup>

        <FieldGroup className="pb-4">
          <Field orientation="horizontal" className="items-center gap-3">
            <Checkbox
              id="is-template"
              checked={assessmentForm.is_template}
              onCheckedChange={(checked) =>
                handleAssessmentFormChange("is_template", checked)
              }
              disabled={!!selectedTemplate}
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <FieldLabel
              htmlFor="is-template"
              className={cn(
                "text-sm font-medium text-gray-700",
                selectedTemplate
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              )}
            >
              Save as Template
            </FieldLabel>
          </Field>

          {assessmentForm.is_template && (
            <Field>
              <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
                Template Name
              </FieldLabel>
              <Input
                type="text"
                placeholder="Enter template name"
                value={assessmentForm.name || ""}
                onChange={(e) =>
                  handleAssessmentFormChange("name", e.target.value)
                }
                className="w-full"
              />
            </Field>
          )}
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
