import { useState, useEffect, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/shared/components/reusables/Navbar.tsx";
import {
  Users,
  Building2,
  Trash2,
  FolderIcon,
  MailIcon,
  UserIcon,
  FileTextIcon,
  Plus,
  CheckSquare,
  LayoutGrid,
  List,
  ArrowLeft,
  BookOpen,
  Eye,
  Pencil,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { toast } from "react-toastify";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useDepartmentQuery } from "@/features/department/hooks/useDepartmentQuery";
import DepartmentAddModal from "@/features/department/components/DepartmentAddModal";
import {
  questionnaireTemplateService,
  useQuestionnaireTemplateDetail,
  useQuestionnaireTemplatesQuery,
} from "@/features/application_form_questionnaire";
import type { QuestionnaireTemplateDetail } from "@/features/application_form_questionnaire";
import type {
  ApplicationFormQuestionnaire,
  Section,
  SectionDb,
  SectionLocal,
  QuestionnaireDb,
  QuestionnaireLocal,
  Questionnaire,
} from "@/features/external_posting/types/questionnaire.types";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { SectionList } from "@/features/external_posting/components/questionnaires/SectionList";

export default function Library() {
  const navigate = useNavigate();
  // Use a path array to track navigation history
  const [path, setPath] = useState<
    (
      | "home"
      | "internal"
      | "external"
      | "forms"
      | "departments"
      | "questionnaire-templates"
    )[]
  >(["home"]);
  const currentView = path[path.length - 1]; // The current active view
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [formsViewType, setFormsViewType] = useState<"grid" | "list">("grid");
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [templateDetailId, setTemplateDetailId] = useState<number | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templateDialogMode, setTemplateDialogMode] = useState<
    "view" | "edit" | "create"
  >("view");
  const [templateDraft, setTemplateDraft] =
    useState<ApplicationFormQuestionnaire>({
      name: "",
      template: false,
      sections: [],
    });
  const [templateSaveError, setTemplateSaveError] = useState<string | null>(
    null,
  );
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const {
    departments,
    search: departmentSearch,
    setSearch: setDepartmentSearch,
    hasMore: hasMoreDepartments,
    loadMore: loadMoreDepartments,
    loading: departmentsLoading,
    isFetchingNextPage: isFetchingDepartmentsNext,
    totalCount: departmentsTotalCount,
    refetch: refetchDepartments,
  } = useDepartmentQuery({ enabled: currentView === "departments" });

  const {
    templates,
    loading: templatesLoading,
    hasMore: templatesHasMore,
    loadMore: loadMoreTemplates,
    handleSearch: handleTemplateSearch,
    totalCount: templatesTotalCount,
    refetch: refetchTemplates,
  } = useQuestionnaireTemplatesQuery({ pageSize: 10 });

  const axiosPrivate = useAxiosPrivate();

  const { template: selectedTemplate, loading: templateLoading } =
    useQuestionnaireTemplateDetail(
      templateDetailId ?? undefined,
      isTemplateDialogOpen,
    );

  useEffect(() => {
    document.title = "Library";
  }, []);

  useEffect(() => {
    if (!isTemplateDialogOpen) {
      return;
    }

    setTemplateSaveError(null);

    if (templateDialogMode === "create") {
      setTemplateDraft(createEmptyTemplateDraft());
      return;
    }

    if (templateDialogMode === "edit" && selectedTemplate) {
      setTemplateDraft(mapTemplateToDraft(selectedTemplate));
    }
  }, [isTemplateDialogOpen, selectedTemplate, templateDialogMode]);

  const folderStroke = 1;
  const iconStroke = 1.5;

  const sharedFolders = [
    {
      label: "Forms",
      folderColor: "text-gray-800 group-hover:text-blue-600",
      icon: (
        <FileTextIcon className="text-gray-800 group-hover:text-blue-600" />
      ),
      textColor: "text-gray-800 group-hover:text-blue-600",
      onClick: () => setPath((prev) => [...prev, "forms"]), // Navigate to forms view
    },
    {
      label: "Departments",
      folderColor: "text-gray-800 group-hover:text-emerald-600",
      icon: (
        <Building2 className="text-gray-800 group-hover:text-emerald-600" />
      ),
      textColor: "text-gray-800 group-hover:text-emerald-600",
      onClick: () => setPath((prev) => [...prev, "departments"]),
    },
    {
      label: "Application Form Questionnaire",
      folderColor: "text-gray-800 group-hover:text-amber-600",
      icon: <BookOpen className="text-gray-800 group-hover:text-amber-600" />,
      textColor: "text-gray-800 group-hover:text-amber-600",
      onClick: () => setPath((prev) => [...prev, "questionnaire-templates"]),
    },
    {
      label: "Email Templates",
      folderColor: "text-gray-800 group-hover:text-blue-600",
      icon: <MailIcon className="text-gray-800 group-hover:text-blue-600" />,
      textColor: "text-gray-800 group-hover:text-blue-600",
      onClick: () => console.log("Email Templates clicked"), // Placeholder for actual navigation
    },
    {
      label: "Applicants",
      folderColor: "text-gray-800 group-hover:text-blue-600",
      icon: <UserIcon className="text-gray-800 group-hover:text-blue-600" />,
      textColor: "text-gray-800 group-hover:text-blue-600",
      onClick: () => console.log("Applicants clicked"), // Placeholder for actual navigation
    },
  ];

  const forms = [
    "Personnel Requisition Form (PRF)",
    "Open Position (For External Client)",
    "Interview Evaluation Form",
  ];

  const getTemplateQuestionCount = (template: {
    sections: Array<{ questionnaires: Array<unknown> }>;
  }) =>
    template.sections.reduce(
      (total, section) => total + section.questionnaires.length,
      0,
    );

  const createEmptyTemplateDraft = (): ApplicationFormQuestionnaire => ({
    name: "",
    template: false,
    sections: [],
  });

  const mapTemplateToDraft = (
    template: QuestionnaireTemplateDetail,
  ): ApplicationFormQuestionnaire => ({
    id: template.id,
    name: template.name,
    template: false,
    sections: template.sections.map((section) => ({
      id: section.id,
      name: section.name,
      questionnaires: section.questionnaires.map((question) => ({
        id: question.id,
        question: question.question,
        description: question.description,
        question_type: question.question_type,
        options: question.options,
        parameter: question.parameter,
        is_non_negotiable: Boolean(question.is_non_negotiable),
        non_negotiable_value: question.non_negotiable_value ?? null,
      })),
    })),
  });

  const getSectionId = (section: Section) =>
    (section as SectionDb).id ?? (section as SectionLocal).tempId;

  const handleTemplateNameChange = (value: string) => {
    setTemplateDraft((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const handleTemplateSectionAdd = (newSection: Section) => {
    setTemplateDraft((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const handleTemplateSectionUpdate = (
    id: number | string,
    updatedSection: Section,
  ) => {
    setTemplateDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        getSectionId(section) === id ? updatedSection : section,
      ),
    }));
  };

  const handleTemplateSectionDelete = (id: number | string) => {
    setTemplateDraft((prev) => {
      const updatedSections = prev.sections
        .map((section) => {
          if (getSectionId(section) === id) {
            if (typeof id === "number") {
              const updatedQuestionnaires = section.questionnaires
                .map((question) => {
                  if ((question as QuestionnaireDb).id) {
                    return { ...question, _delete: true };
                  }
                  return question;
                })
                .filter((question) => !(question as QuestionnaireLocal).tempId);

              return {
                ...section,
                _delete: true,
                questionnaires: updatedQuestionnaires,
              };
            }

            return null;
          }
          return section;
        })
        .filter(Boolean) as Section[];

      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };

  const buildTemplatePayload = (draft: ApplicationFormQuestionnaire) => ({
    name: draft.name.trim(),
    sections: draft.sections.map((section) => ({
      id: (section as SectionDb).id,
      name: section.name,
      _delete: (section as SectionDb)._delete,
      questionnaires: section.questionnaires.map((question) => ({
        id: (question as QuestionnaireDb).id,
        question: question.question,
        description: question.description ?? "",
        question_type: question.question_type,
        options: question.options ?? [],
        parameter: question.parameter ?? "",
        is_non_negotiable: Boolean(question.is_non_negotiable),
        non_negotiable_value: question.non_negotiable_value ?? null,
        _delete: (question as QuestionnaireDb)._delete,
      })),
    })),
  });

  const handleTemplateSave = async () => {
    const trimmedName = templateDraft.name.trim();
    if (!trimmedName) {
      setTemplateSaveError("Template name is required.");
      return;
    }

    setIsSavingTemplate(true);
    setTemplateSaveError(null);

    try {
      const payload = buildTemplatePayload({
        ...templateDraft,
        name: trimmedName,
      });

      if (templateDialogMode === "create") {
        await questionnaireTemplateService.createTemplate(payload, {
          httpClient: axiosPrivate,
        });
        toast.success("Template created successfully.");
      }

      if (templateDialogMode === "edit") {
        const templateId = templateDetailId ?? selectedTemplate?.id;
        if (templateId) {
          await questionnaireTemplateService.updateTemplate(
            templateId,
            payload,
            {
              httpClient: axiosPrivate,
            },
          );
          toast.success("Template updated successfully.");
        }
      }

      setIsTemplateDialogOpen(false);
      setTemplateDetailId(null);
      setTemplateDialogMode("view");
      refetchTemplates();
    } catch {
      setTemplateSaveError("Failed to save template. Please try again.");
      toast.error("Failed to save template.");
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const toggleFormSelection = (formName: string) => {
    setSelectedForms((prev) =>
      prev.includes(formName)
        ? prev.filter((name) => name !== formName)
        : [...prev, formName],
    );
  };

  const handleFormClick = (formName: string) => {
    if (formName === "Personnel Requisition Form (PRF)") {
      navigate("/prf");
    }
    if (formName === "Open Position (For External Client)") {
      navigate("/positions/create-new-position");
    }
    if (formName === "Interview Evaluation Form") {
      navigate("/ieform");
    } else {
      toggleFormSelection(formName);
    }
  };

  const handleArchive = () => {
    console.log("Archived forms:", selectedForms);
    setSelectedForms([]);
    setIsArchiveDialogOpen(false);
  };

  const isFolderView = currentView === "internal" || currentView === "external";

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-[100px] bg-gray-50">
        {" "}
        {/* Added pt for fixed header */}
        {/* Fixed top header section */}
        <div className="fixed top-[64px] left-0 right-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
          <div className="max-w-7xl mx-auto -space-y-2">
            <h1 className="text-3xl font-bold text-gray-800 pb-5">Library</h1>{" "}
            {/* Always display Library heading */}
            <p className="text-lg text-gray-700">
              Houses templates and hiring resources.
            </p>
            {path.length > 1 && ( // Show back button if not on the home view
              <div className="flex items-center -mb-2">
                <Button
                  variant="ghost"
                  onClick={() => setPath((prev) => prev.slice(0, -1))} // Go back one level
                  className="text-gray-600 hover:text-blue-600 px-2 py-1 mt-2 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            )}
          </div>
        </div>
        <main className="flex-grow px-6 pt-[110px] pb-[80px] max-w-7xl mx-auto w-full">
          {" "}
          {/* Adjusted pt for main content */}
          <div className="flex items-start justify-between py-4">
            {/* Home View */}
            {currentView === "home" && (
              <div className="w-full space-y-8">
                <div className="flex space-x-10">
                  <div
                    onClick={() => setPath((prev) => [...prev, "internal"])}
                    className="flex flex-col items-center cursor-pointer group transition"
                  >
                    <Users className="text-gray-800 group-hover:text-blue-600 w-7 h-7 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 mt-2">
                      Internal
                    </span>
                  </div>

                  <div
                    onClick={() => setPath((prev) => [...prev, "external"])}
                    className="flex flex-col items-center cursor-pointer group transition"
                  >
                    <Building2 className="text-gray-800 group-hover:text-blue-600 w-7 h-7 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 mt-2">
                      External Client
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-slate-50 to-amber-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        Quick Access
                      </p>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Department & Questionnaire Libraries
                      </h2>
                      <p className="text-sm text-gray-600">
                        Jump directly into global departments or your private
                        template library.
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-full px-3 py-1 bg-white/80">
                      Curated resources
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPath((prev) => [...prev, "departments"])
                      }
                      className="group flex items-start justify-between rounded-xl border border-emerald-200 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-500">
                          Departments
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          Organization Map
                        </p>
                        <p className="text-sm text-gray-600">
                          View and manage business unit departments.
                        </p>
                      </div>
                      <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                        <Building2 className="h-5 w-5" />
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPath((prev) => [...prev, "questionnaire-templates"])
                      }
                      className="group flex items-start justify-between rounded-xl border border-amber-200 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-amber-500">
                          Application Form Questionnaire
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          My Templates
                        </p>
                        <p className="text-sm text-gray-600">
                          Build reusable section and question sets.
                        </p>
                      </div>
                      <div className="rounded-full bg-amber-50 p-2 text-amber-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isFolderView && (
              <div className="flex space-x-10">
                {sharedFolders.map((folder, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2 group"
                  >
                    <div
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={folder.onClick}
                    >
                      <div className="relative w-16 h-16">
                        <FolderIcon
                          className={`${folder.folderColor} w-full h-full`}
                          strokeWidth={folderStroke}
                        />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          {cloneElement(folder.icon, {
                            strokeWidth: iconStroke,
                            className: `${folder.icon.props.className} w-5 h-5`,
                          })}
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${folder.textColor}`}>
                      {folder.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {currentView === "forms" && (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">Forms</h2>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-sm">View by:</span>
                    <button
                      onClick={() => setFormsViewType("grid")}
                      className={`p-1 rounded ${
                        formsViewType === "grid"
                          ? "bg-gray-200 text-gray-800"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFormsViewType("list")}
                      className={`p-1 rounded ${
                        formsViewType === "list"
                          ? "bg-gray-200 text-gray-800"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    {selectedForms.length > 0 && (
                      <div
                        onClick={() => setIsArchiveDialogOpen(true)}
                        className="flex items-center space-x-1 text-blue-600 cursor-pointer hover:underline"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Archive</span>
                      </div>
                    )}
                    <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      <Plus className="w-4 h-4" />
                      <span>Add Form</span>
                    </button>
                  </div>
                </div>

                {/* Forms List */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    {forms.map((form, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${
                          selectedForms.includes(form)
                            ? "bg-blue-50"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleFormClick(form)}
                      >
                        <div
                          className={`w-5 h-5 border rounded flex items-center justify-center mr-3 ${
                            selectedForms.includes(form)
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedForms.includes(form) && (
                            <CheckSquare
                              className="w-3 h-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <span className="text-gray-800">{form}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === "departments" && (
              <div className="w-full space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Departments
                    </h2>
                    <p className="text-sm text-gray-600">
                      Global list of departments across business units.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DepartmentAddModal
                      onDepartmentAdded={refetchDepartments}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={departmentSearch}
                      onChange={(event) =>
                        setDepartmentSearch(event.target.value)
                      }
                      className="pl-9"
                      placeholder="Search departments"
                    />
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Total {departmentsTotalCount}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="p-4">Department</TableHead>
                        <TableHead className="p-4">Business Unit</TableHead>
                        <TableHead className="p-4">Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departmentsLoading ? (
                        <TableRow>
                          <TableCell colSpan={3} className="p-6 text-center">
                            Loading departments...
                          </TableCell>
                        </TableRow>
                      ) : departments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="p-6 text-center">
                            No departments found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        departments.map((department) => (
                          <TableRow key={department.id}>
                            <TableCell className="p-4 font-medium text-gray-900">
                              {department.name}
                            </TableCell>
                            <TableCell className="p-4 text-gray-600">
                              {department.business_unit
                                ? department.business_unit.toUpperCase()
                                : "-"}
                            </TableCell>
                            <TableCell className="p-4 text-gray-600">
                              {department.updated_at
                                ? new Date(
                                    department.updated_at,
                                  ).toLocaleDateString()
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {hasMoreDepartments && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => loadMoreDepartments()}
                      disabled={isFetchingDepartmentsNext}
                    >
                      {isFetchingDepartmentsNext ? "Loading..." : "Load more"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentView === "questionnaire-templates" && (
              <div className="w-full space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Application Form Questionnaires
                    </h2>
                    <p className="text-sm text-gray-600">
                      Private templates visible only to your account.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-amber-500 text-white hover:bg-amber-600"
                      onClick={() => {
                        setTemplateDialogMode("create");
                        setTemplateDetailId(null);
                        setIsTemplateDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Template
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      onChange={(event) =>
                        handleTemplateSearch(event.target.value)
                      }
                      className="pl-9"
                      placeholder="Search templates"
                    />
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Total {templatesTotalCount}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                  <Table>
                    <TableHeader className="bg-amber-50">
                      <TableRow>
                        <TableHead className="p-4">Template</TableHead>
                        <TableHead className="p-4">Sections</TableHead>
                        <TableHead className="p-4">Questions</TableHead>
                        <TableHead className="p-4">Updated</TableHead>
                        <TableHead className="p-4 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templatesLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="p-6 text-center">
                            Loading templates...
                          </TableCell>
                        </TableRow>
                      ) : templates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="p-6 text-center">
                            No templates found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        templates.map((template) => (
                          <TableRow key={template.id}>
                            <TableCell className="p-4 font-medium text-gray-900">
                              {template.name}
                            </TableCell>
                            <TableCell className="p-4 text-gray-600">
                              {template.sections.length}
                            </TableCell>
                            <TableCell className="p-4 text-gray-600">
                              {getTemplateQuestionCount(template)}
                            </TableCell>
                            <TableCell className="p-4 text-gray-600">
                              {template.updated_at
                                ? new Date(
                                    template.updated_at,
                                  ).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-600 hover:text-gray-900"
                                  onClick={() => {
                                    setTemplateDialogMode("view");
                                    setTemplateDetailId(template.id);
                                    setIsTemplateDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-amber-600 hover:text-amber-700"
                                  onClick={() => {
                                    setTemplateDialogMode("edit");
                                    setTemplateDetailId(template.id);
                                    setIsTemplateDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {templatesHasMore && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => loadMoreTemplates()}
                      disabled={templatesLoading}
                    >
                      {templatesLoading ? "Loading..." : "Load more"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {isFolderView && (
              <div className="flex items-center space-x-1 text-blue-600 cursor-pointer hover:underline transition">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Archive Folder</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Archive Confirmation Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Archive {selectedForms.length > 1 ? "Files" : "File"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 text-left">
            Are you sure you want to archive{" "}
            {selectedForms.length > 1 ? "these files" : "this file"}?
          </p>
          <DialogFooter className="justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsArchiveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchive}>
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTemplateDialogOpen}
        onOpenChange={(open) => {
          setIsTemplateDialogOpen(open);
          if (!open) {
            setTemplateDetailId(null);
            setTemplateDialogMode("view");
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {templateDialogMode === "create"
                ? "Create Template"
                : templateDialogMode === "edit"
                  ? "Edit Template"
                  : "Template Details"}
            </DialogTitle>
          </DialogHeader>

          {(templateDialogMode === "create" ||
            templateDialogMode === "edit") && (
            <div className="space-y-5">
              {templateDialogMode === "edit" && templateLoading ? (
                <p className="text-sm text-gray-500">Loading template...</p>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Template Name
                    </p>
                    <Input
                      value={templateDraft.name}
                      onChange={(event) =>
                        handleTemplateNameChange(event.target.value)
                      }
                      placeholder="Enter template name"
                    />
                    {templateSaveError && (
                      <p className="text-xs text-red-600">
                        {templateSaveError}
                      </p>
                    )}
                  </div>

                  <SectionList
                    sections={templateDraft.sections}
                    addSection={handleTemplateSectionAdd}
                    onUpdateSection={handleTemplateSectionUpdate}
                    onDeleteSection={handleTemplateSectionDelete}
                  />

                  <DialogFooter className="justify-end gap-2">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsTemplateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="bg-amber-500 text-white hover:bg-amber-600"
                      onClick={handleTemplateSave}
                      disabled={isSavingTemplate}
                    >
                      {isSavingTemplate ? "Saving..." : "Save Template"}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          )}

          {templateDialogMode === "view" && (
            <div className="space-y-4">
              {templateLoading ? (
                <p className="text-sm text-gray-500">Loading template...</p>
              ) : !selectedTemplate ? (
                <p className="text-sm text-gray-500">Template not found.</p>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Template Name
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedTemplate.name}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {selectedTemplate.sections.map((section) => (
                      <div
                        key={section.id}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            {section.name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {section.questionnaires.length} questions
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {section.questionnaires.map((question) => (
                            <div
                              key={question.id}
                              className="rounded-md border border-gray-100 bg-gray-50 p-3"
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {question.question}
                              </p>
                              {question.description && (
                                <p className="text-xs text-gray-500">
                                  {question.description}
                                </p>
                              )}
                              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                                {question.question_type.replace(/_/g, " ")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
