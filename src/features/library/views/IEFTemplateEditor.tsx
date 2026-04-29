import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, Pencil, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

import { IefTemplateSectionEditor } from "../components/IefTemplateSectionEditor";
import { iefTemplateService } from "../services/iefTemplate.service";
import type { IefTemplatePayload, IefTemplateRecord, IefTemplateSection } from "../types/iefTemplate.types";

interface TemplateEditorState {
  name: string;
  description: string;
  is_active: boolean;
  sections: IefTemplateSection[];
}

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const createRow = () => ({
  id: createId("row"),
  skill: "",
  rating: "",
  remarks: "",
});

const createDefaultSections = (): IefTemplateSection[] => [
  {
    key: createId("technical-skills"),
    title: "Technical Skills",
    description: "Role-specific hard skills and technical depth.",
    rows: [createRow(), createRow(), createRow()],
  },
  {
    key: createId("soft-skills"),
    title: "Soft Skills",
    description: "Communication, teamwork, and adaptability.",
    rows: [createRow(), createRow(), createRow()],
  },
  {
    key: createId("core-values"),
    title: "Core Values",
    description: "Alignment with company values and working style.",
    rows: [createRow(), createRow(), createRow()],
  },
];

const normalizeSections = (savedSections: unknown): IefTemplateSection[] => {
  if (!Array.isArray(savedSections) || savedSections.length === 0) {
    return createDefaultSections();
  }

  return savedSections.map((section, sectionIndex) => {
    const sectionObject = section as Record<string, unknown>;
    const rowsSource =
      (sectionObject.rows as Array<Record<string, unknown>> | undefined) ??
      (sectionObject.questionnaires as Array<Record<string, unknown>> | undefined) ??
      (sectionObject.questions as Array<Record<string, unknown>> | undefined) ??
      (sectionObject.items as Array<Record<string, unknown>> | undefined) ??
      [];

    const rows = rowsSource.length > 0
      ? rowsSource.map((row, rowIndex) => ({
          id: String(row.id ?? `saved-row-${sectionIndex + 1}-${rowIndex + 1}`),
          skill: String(row.skill ?? row.name ?? row.label ?? row.question ?? ""),
          rating: row.rating !== undefined && row.rating !== null ? String(row.rating) : row.score !== undefined && row.score !== null ? String(row.score) : "",
          remarks: String(row.remarks ?? row.description ?? ""),
        }))
      : [createRow()];

    return {
      key: String(sectionObject.key ?? sectionObject.name ?? sectionObject.title ?? `section-${sectionIndex + 1}`),
      title: String(sectionObject.title ?? sectionObject.name ?? `Section ${sectionIndex + 1}`),
      description: String(sectionObject.description ?? ""),
      rows,
    };
  });
};

const normalizeTemplate = (template: IefTemplateRecord): TemplateEditorState => ({
  name: template.name ?? "",
  description: template.description ?? "",
  is_active: Boolean(template.is_active),
  sections: normalizeSections(template.sections),
});

const buildPayload = (state: TemplateEditorState): IefTemplatePayload => ({
  name: state.name.trim(),
  description: state.description.trim(),
  is_active: state.is_active,
  sections: state.sections.map((section, sectionIndex) => ({
    key: section.key?.trim() || `section-${sectionIndex + 1}`,
    title: section.title?.trim() || `Section ${sectionIndex + 1}`,
    description: section.description ?? "",
    rows: (section.rows ?? []).map((row, rowIndex) => ({
      id: row.id ?? `row-${sectionIndex + 1}-${rowIndex + 1}`,
      skill: row.skill ?? "",
      rating: row.rating !== undefined && row.rating !== null && String(row.rating).trim() !== "" ? Number(row.rating) : null,
      remarks: row.remarks ?? "",
    })),
  })),
});

export default function IEFTemplateEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const params = useParams<{ templateId?: string }>();

  const templateIdParam = params.templateId ?? "new";
  const isCreateMode = templateIdParam === "new";
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const mode = searchParams.get("mode");
  const isEditable = isCreateMode || mode === "edit";

  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateState, setTemplateState] = useState<TemplateEditorState>({
    name: "",
    description: "",
    is_active: true,
    sections: createDefaultSections(),
  });

  useEffect(() => {
    let mounted = true;

    const loadTemplate = async () => {
      if (isCreateMode) {
        setLoading(false);
        setError(null);
        setTemplateState({
          name: "",
          description: "",
          is_active: true,
          sections: createDefaultSections(),
        });
        return;
      }

      const numericTemplateId = Number(templateIdParam);
      if (Number.isNaN(numericTemplateId)) {
        setError("Invalid template id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const template = await iefTemplateService.detailTemplate(numericTemplateId, {
          httpClient: axiosPrivate,
        });

        if (!mounted) {
          return;
        }

        setTemplateState(normalizeTemplate(template));
      } catch (fetchError) {
        console.error("Failed to load IEF template", fetchError);
        if (mounted) {
          setError("Failed to load the IEF template.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadTemplate();

    return () => {
      mounted = false;
    };
  }, [axiosPrivate, isCreateMode, templateIdParam]);

  const handleSave = async () => {
    const trimmedName = templateState.name.trim();
    if (!trimmedName) {
      setError("Template name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = buildPayload({ ...templateState, name: trimmedName });

      if (isCreateMode) {
        const created = await iefTemplateService.createTemplate(payload, { httpClient: axiosPrivate });
        toast.success("IEF template created.");
        navigate(`/library/ief-templates/${created.id}`);
        return;
      }

      const numericTemplateId = Number(templateIdParam);
      const updated = await iefTemplateService.updateTemplate(numericTemplateId, payload, {
        httpClient: axiosPrivate,
      });
      toast.success("IEF template updated.");
      navigate(`/library/ief-templates/${updated.id}`);
    } catch (saveError) {
      console.error("Failed to save IEF template", saveError);
      setError("Failed to save the IEF template.");
      toast.error("Failed to save IEF template.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isCreateMode) {
      navigate("/library/ief-templates");
      return;
    }

    const confirmed = window.confirm("Delete this IEF template? This cannot be undone.");
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    try {
      const numericTemplateId = Number(templateIdParam);
      await iefTemplateService.deleteTemplate(numericTemplateId, { httpClient: axiosPrivate });
      toast.success("IEF template deleted.");
      navigate("/library/ief-templates");
    } catch (deleteError) {
      console.error("Failed to delete IEF template", deleteError);
      toast.error("Failed to delete IEF template.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[96px]">
      <div className="mx-auto w-full max-w-7xl px-6 pb-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Button variant="ghost" className="mb-3 px-0 text-gray-600 hover:text-gray-900" onClick={() => navigate("/library/ief-templates") }>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to IEF Templates
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isCreateMode ? "Create IEF Template" : isEditable ? "Edit IEF Template" : "View IEF Template"}
            </h1>
            <p className="text-sm text-gray-600">
              Build reusable interview evaluation sections for future interviews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCreateMode && !isEditable && (
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate(`/library/ief-templates/${templateIdParam}?mode=edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {isEditable && !isCreateMode && (
              <Button variant="outline" onClick={() => navigate(`/library/ief-templates/${templateIdParam}`)}>
                Cancel
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={deleting || loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isCreateMode ? "Discard" : "Delete"}
            </Button>
            {isEditable && (
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => void handleSave()} disabled={saving || loading}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Template"}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="space-y-3 border-b bg-white">
              <CardTitle className="text-xl text-gray-900">Template Details</CardTitle>
              <CardDescription>Core metadata for the reusable template.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-4 md:p-6">
              <div className="space-y-2">
                <Label htmlFor="template-name">Name</Label>
                <Input
                  id="template-name"
                  value={templateState.name}
                  onChange={(event) => setTemplateState((prev) => ({ ...prev, name: event.target.value }))}
                  disabled={!isEditable}
                  placeholder="Template name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={templateState.description}
                  onChange={(event) => setTemplateState((prev) => ({ ...prev, description: event.target.value }))}
                  disabled={!isEditable}
                  placeholder="Optional template description"
                  rows={6}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Active</p>
                  <p className="text-xs text-gray-500">Only active templates are meant for selection in the interview form.</p>
                </div>
                <Button
                  type="button"
                  variant={templateState.is_active ? "default" : "outline"}
                  className={templateState.is_active ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
                  onClick={() => isEditable && setTemplateState((prev) => ({ ...prev, is_active: !prev.is_active }))}
                  disabled={!isEditable}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {templateState.is_active ? "Active" : "Inactive"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b bg-white">
                <CardTitle className="text-xl text-gray-900">Sections</CardTitle>
                <CardDescription>
                  Design the same section structure that interviewers will see when evaluating candidates.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {loading ? (
                  <div className="py-12 text-center text-sm text-gray-500">Loading template...</div>
                ) : (
                  <IefTemplateSectionEditor
                    sections={templateState.sections}
                    onChange={(sections) => setTemplateState((prev) => ({ ...prev, sections }))}
                    readOnly={!isEditable}
                  />
                )}
              </CardContent>
            </Card>

            <Separator />

            <div className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-600">
              <span>{isEditable ? "Editing mode enabled" : "Read-only view mode"}</span>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Route-based editor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
