import { useState, useEffect } from "react";
import type { Assessment } from "@/shared/types/pipeline.types";
import { defaultAxios } from "@/config/axios";

interface UseAssessmentFormProps {
  editingAssessment?: Assessment | null;
  open: boolean;
}

export function useAssessmentForm({
  editingAssessment,
  open,
}: UseAssessmentFormProps) {
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
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isUsingTemplateFile, setIsUsingTemplateFile] = useState(false);
  const [duplicateFileInfo, setDuplicateFileInfo] = useState<{
    duplicate: boolean;
    filename: string;
    fileId: number;
    fileType: string;
  } | null>(null);
  const [checkingFile, setCheckingFile] = useState(false);

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

      const isTemplateFile =
        editingAssessment.file &&
        typeof editingAssessment.file === "object" &&
        "id" in editingAssessment.file;

      setIsUsingTemplateFile(!!isTemplateFile);

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
        } else if (
          "filename" in editingAssessment.file &&
          typeof editingAssessment.file.filename === "string"
        ) {
          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
            editingAssessment.file.filename
          );
          if (isImage && editingAssessment.file.file instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(editingAssessment.file.file);
          } else {
            setFilePreview(null);
          }
        } else {
          setFilePreview(null);
        }
      } else {
        setFilePreview(null);
      }
    } else {
      resetForm();
    }
  }, [editingAssessment, open]);

  const resetForm = () => {
    setAssessmentForm({
      name: null,
      is_template: false,
      type: "",
      order: 0,
      file: null,
    });
    setFilePreview(null);
    setSelectedTemplate("");
    setIsUsingTemplateFile(false);
    setDuplicateFileInfo(null);
  };

  const updateField = (
    field: keyof Assessment,
    value: string | boolean | File | null
  ) => {
    setAssessmentForm({ ...assessmentForm, [field]: value });
  };

  const checkFileExists = async (file: File) => {
    setCheckingFile(true);
    setDuplicateFileInfo(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await defaultAxios.post(
        "/api/assessment/test-file-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.duplicate && response.data?.existing_file) {
        setDuplicateFileInfo({
          duplicate: true,
          filename: response.data.existing_file.filename,
          fileId: response.data.existing_file.id,
          fileType: response.data.existing_file.file_type,
        });
      }
    } catch (error) {
      console.error("Error checking file:", error);
    } finally {
      setCheckingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("file", file);
      checkFileExists(file);

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
  };

  const clearFile = () => {
    updateField("file", null);
    setFilePreview(null);
    setSelectedTemplate("");
    setIsUsingTemplateFile(false);
    setDuplicateFileInfo(null);

    const fileInput = document.getElementById(
      "photo-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleTemplateSelect = (
    templateId: string,
    templates: Assessment[]
  ) => {
    setSelectedTemplate(templateId);
    setDuplicateFileInfo(null);

    if (templateId !== "") {
      const template = templates.find((t) => {
        if ("id" in t) {
          return String(t.id) === templateId;
        }
        return false;
      });

      if (template) {
        setAssessmentForm((prev) => ({
          ...prev,
          type: template.type,
          is_template: false,
          name: null,
          file:
            template.file &&
            typeof template.file === "object" &&
            "id" in template.file
              ? template.file
              : template.file,
        }));

        if (
          template.file &&
          typeof template.file === "object" &&
          "id" in template.file
        ) {
          setIsUsingTemplateFile(true);

          const fileData = template.file as any;
          const fileType = fileData.file_type?.toLowerCase();
          const filename = fileData.filename;

          const isImageFile =
            fileType === "jpg" ||
            fileType === "jpeg" ||
            fileType === "png" ||
            fileType === "gif" ||
            fileType === "webp" ||
            (filename && /\.(jpg|jpeg|png|gif|webp)$/i.test(filename));

          if (
            isImageFile &&
            fileData.file &&
            typeof fileData.file === "string"
          ) {
            setFilePreview(fileData.file);
          } else {
            setFilePreview(null);
          }
        } else if (template.file === null) {
          setIsUsingTemplateFile(false);
          setFilePreview(null);
        } else if (template.file instanceof File) {
          setIsUsingTemplateFile(false);

          if (template.file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(template.file as File);
          } else {
            setFilePreview(null);
          }
        } else {
          setFilePreview(null);
        }
      }
    } else {
      setAssessmentForm((prev) => ({
        ...prev,
        file: null,
        is_template: false,
        name: null,
      }));
      setFilePreview(null);
      setIsUsingTemplateFile(false);
    }
  };

  return {
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
  };
}
