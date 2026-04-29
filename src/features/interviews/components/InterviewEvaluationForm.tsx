import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Plus, Sparkles, Trash2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";

import {
  interviewEvaluationFormService,
  type InterviewEvaluationFormDataSection,
  type InterviewEvaluationFormTemplate,
  type InterviewEvaluationFormRecord,
} from "../services/interviewEvaluationFormService";
import { defaultAxios } from "@/config/axios";

interface InterviewRouteState {
  candidateApplicationId?: number;
  candidateName?: string;
  pipelineStepId?: number;
  scheduledFor?: string;
  interviewerName?: string;
  interviewerEmail?: string;
  interviewerId?: number;
  jobTitle?: string;
}

interface IefRow {
  id: string;
  skill: string;
  rating: string;
  remarks: string;
}

interface IefSection {
  key: string;
  title: string;
  description: string;
  rows: IefRow[];
}

const DEFAULT_SECTIONS = [
  {
    key: "technical_skills",
    title: "Technical Skills",
    description: "Role-specific hard skills and technical depth.",
    rows: ["Programming Fundamentals", "System Design", "Testing & Debugging"],
  },
  {
    key: "soft_skills",
    title: "Soft Skills",
    description: "Communication, teamwork, and adaptability.",
    rows: ["Communication", "Teamwork", "Adaptability"],
  },
  {
    key: "core_values",
    title: "Core Values",
    description: "Alignment with company values and working style.",
    rows: ["Integrity", "Innovation", "Accountability"],
  },
] as const;

const createRow = (skill = "", rating = "", remarks = ""): IefRow => ({
  id: `${skill || "row"}-${Math.random().toString(36).slice(2, 8)}`,
  skill,
  rating,
  remarks,
});

const createDefaultSections = (): IefSection[] =>
  DEFAULT_SECTIONS.map((section) => ({
    key: section.key,
    title: section.title,
    description: section.description,
    rows: section.rows.map((skill) => createRow(skill)),
  }));

const toDateInputValue = (isoDateTime?: string): string => {
  if (!isoDateTime) {
    return "";
  }

  const parsed = new Date(isoDateTime);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatInterviewDate = (isoDateTime?: string): string => {
  if (!isoDateTime) {
    return "Not scheduled";
  }

  const parsed = new Date(isoDateTime);
  if (Number.isNaN(parsed.getTime())) {
    return "Not scheduled";
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeTemplateSections = (
  template?: InterviewEvaluationFormTemplate | null,
): IefSection[] => {
  const rawSections = Array.isArray(template?.sections) ? template.sections : [];

  if (rawSections.length === 0) {
    return createDefaultSections();
  }

  return rawSections.map((section, sectionIndex) => {
    const sectionObject = section as {
      name?: string;
      title?: string;
      description?: string;
      questionnaires?: Array<Record<string, unknown>>;
      questions?: Array<Record<string, unknown>>;
      skills?: Array<Record<string, unknown>>;
      items?: Array<Record<string, unknown>>;
    };

    const rowsSource =
      sectionObject.questionnaires ??
      sectionObject.questions ??
      sectionObject.skills ??
      sectionObject.items ??
      [];

    const rows = rowsSource.length > 0
      ? rowsSource.map((row, rowIndex) => {
        const rowObject = row as {
          skill?: string;
          name?: string;
          label?: string;
          question?: string;
          rating?: string | number;
          score?: string | number;
          remarks?: string;
          description?: string;
        };

        return createRow(
          rowObject.skill || rowObject.name || rowObject.label || rowObject.question || `Item ${rowIndex + 1}`,
          String(rowObject.rating ?? rowObject.score ?? ""),
          rowObject.remarks || rowObject.description || "",
        );
      })
      : [createRow()];

    return {
      key: String(sectionObject.name || sectionObject.title || `section-${sectionIndex + 1}`),
      title: sectionObject.title || sectionObject.name || `Section ${sectionIndex + 1}`,
      description: sectionObject.description || "Customize this section as needed.",
      rows,
    };
  });
};

const normalizeRating = (value: string): string => {
  if (!value || value.trim() === "") {
    return "";
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return "";
  }

  // Clamp between 0-100 and return as string
  const clamped = Math.max(0, Math.min(100, parsed));
  return String(clamped);
};

const normalizeSavedSections = (savedSections: unknown): IefSection[] => {
  if (!Array.isArray(savedSections) || savedSections.length === 0) {
    return createDefaultSections();
  }

  return savedSections.map((section, sectionIndex) => {
    const sectionObject = section as InterviewEvaluationFormDataSection;
    const rows = Array.isArray(sectionObject.rows) && sectionObject.rows.length > 0
      ? sectionObject.rows.map((row, rowIndex) => ({
          id: String(row.id ?? `saved-row-${sectionIndex + 1}-${rowIndex + 1}`),
          skill: String(row.skill ?? ""),
          rating: row.rating !== null && row.rating !== undefined ? String(row.rating) : "",
          remarks: String(row.remarks ?? ""),
        }))
      : [createRow()];

    return {
      key: String(sectionObject.key ?? `section-${sectionIndex + 1}`),
      title: String(sectionObject.title ?? `Section ${sectionIndex + 1}`),
      description: String(sectionObject.description ?? "Customize this section as needed."),
      rows,
    };
  });
};

export default function InterviewEvaluationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as InterviewRouteState | null) ?? null;
  const params = useParams<{
    jobId?: string;
    candidateApplicationId?: string;
    interviewId?: string;
  }>();

  const [templates, setTemplates] = useState<InterviewEvaluationFormTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("blank");
  const [sections, setSections] = useState<IefSection[]>(createDefaultSections());
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicantName, setApplicantName] = useState(routeState?.candidateName ?? "");
  const [interviewDate, setInterviewDate] = useState(toDateInputValue(routeState?.scheduledFor));
  const [scheduledForDisplay, setScheduledForDisplay] = useState(formatInterviewDate(routeState?.scheduledFor));
  const [positionApplyingFor, setPositionApplyingFor] = useState(routeState?.jobTitle ?? "");
  const [interviewer, setInterviewer] = useState(routeState?.interviewerName ?? routeState?.interviewerEmail ?? "");
  const [interviewerId, setInterviewerId] = useState<number | null>(routeState?.interviewerId ?? null);
  const [aiSummary, setAiSummary] = useState("");
  const [interviewerNotes, setInterviewerNotes] = useState("");
  const [existingFormId, setExistingFormId] = useState<number | null>(null);
  const [pendingExistingForm, setPendingExistingForm] = useState<InterviewEvaluationFormRecord | null>(null);
  const hasHydratedExistingFormRef = useRef(false);

  useEffect(() => {
    setApplicantName(routeState?.candidateName ?? "");
    setInterviewDate(toDateInputValue(routeState?.scheduledFor));
    setScheduledForDisplay(formatInterviewDate(routeState?.scheduledFor));
    setPositionApplyingFor(routeState?.jobTitle ?? "");
    setInterviewer(routeState?.interviewerName ?? routeState?.interviewerEmail ?? "");
    setInterviewerId(routeState?.interviewerId ?? null);
  }, [routeState]);

  // If route state is missing, try to fetch prefill values using the candidate and pipeline ids from params
  useEffect(() => {
    let mounted = true;

    const shouldFetch = !routeState && params.candidateApplicationId;
    if (!shouldFetch) return;

    const fetchPrefill = async () => {
      try {
        const query = new URLSearchParams();
        query.set("candidate_id", String(params.candidateApplicationId));
        if (params.interviewId) query.set("pipeline_step_id", String(params.interviewId));

        const resp = await defaultAxios.get(`/api/candidate/ief/prefill/?${query.toString()}`);
        const data = resp.data as {
          applicant_name?: string;
          job_title?: string;
          scheduled_for?: string | null;
          interviewer?: { id?: number; first_name?: string; last_name?: string; email?: string } | null;
        };

        if (!mounted) return;

        if (data.applicant_name) setApplicantName(data.applicant_name);
        if (data.job_title) setPositionApplyingFor(data.job_title);
        if (data.scheduled_for) setInterviewDate(toDateInputValue(data.scheduled_for));
        if (data.interviewer) {
          setInterviewerId(data.interviewer.id ?? null);
          setInterviewer(`${data.interviewer.first_name || ""} ${data.interviewer.last_name || ""}`.trim() || data.interviewer.email || "");
        }
      } catch (err) {
        console.debug("Unable to fetch IEF prefill data.", err);
      }
    };

    void fetchPrefill();

    return () => {
      mounted = false;
    };
  }, [params.candidateApplicationId, params.interviewId, routeState]);

  useEffect(() => {
    let mounted = true;

    const candidateApplicationId = params.candidateApplicationId ? Number(params.candidateApplicationId) : undefined;
    const pipelineStepId = params.interviewId ? Number(params.interviewId) : undefined;

    if (!candidateApplicationId || !pipelineStepId) {
      return () => {
        mounted = false;
      };
    }

    const loadExistingForm = async () => {
      try {
        const records = await interviewEvaluationFormService.listForms({
          candidateId: candidateApplicationId,
          pipelineStepId,
        });

        const existingForm = records[0];
        if (!mounted || !existingForm) {
          return;
        }

        setPendingExistingForm(existingForm);
      } catch (error) {
        console.debug("Unable to load existing IEF.", error);
      }
    };

    void loadExistingForm();

    return () => {
      mounted = false;
    };
  }, [params.candidateApplicationId, params.interviewId]);

  // Separate effect to hydrate form data from pending existing form
  useEffect(() => {
    if (!pendingExistingForm) {
      return;
    }

    hasHydratedExistingFormRef.current = true;
    setExistingFormId(pendingExistingForm.id);
    setApplicantName(pendingExistingForm.data?.applicant_name || routeState?.candidateName || "");
    setInterviewDate(toDateInputValue(pendingExistingForm.scheduled_for || routeState?.scheduledFor));
    setScheduledForDisplay(formatInterviewDate(pendingExistingForm.scheduled_for || routeState?.scheduledFor));
    setPositionApplyingFor(pendingExistingForm.data?.position_applying_for || routeState?.jobTitle || "");
    setInterviewer(pendingExistingForm.data?.interviewer || routeState?.interviewerName || routeState?.interviewerEmail || "");
    setInterviewerId(pendingExistingForm.interviewer ?? routeState?.interviewerId ?? null);
    setAiSummary(pendingExistingForm.ai_summary || "");
    setInterviewerNotes(pendingExistingForm.interviewer_notes || "");

    if (pendingExistingForm.template) {
      setSelectedTemplateId(String(pendingExistingForm.template));
    }

    // Hydrate sections LAST to ensure they don't get overwritten
    setSections(normalizeSavedSections(pendingExistingForm.data?.sections));
  }, [pendingExistingForm, routeState?.candidateName, routeState?.interviewerName, routeState?.interviewerEmail, routeState?.jobTitle, routeState?.scheduledFor, routeState?.interviewerId]);

  useEffect(() => {
    let mounted = true;

    const loadTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const response = await interviewEvaluationFormService.listTemplates();
        if (mounted) {
          setTemplates(response);
        }
      } catch (error) {
        console.debug("Unable to load IEF templates.", error);
      } finally {
        if (mounted) {
          setIsLoadingTemplates(false);
        }
      }
    };

    void loadTemplates();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (hasHydratedExistingFormRef.current) {
      return;
    }

    if (selectedTemplateId === "blank") {
      if (existingFormId) {
        return;
      }
      setSections(createDefaultSections());
      return;
    }

    // Only apply template sections if no existing form; preserve saved form sections
    if (existingFormId) {
      return;
    }

    const selectedTemplate = templates.find((template) => String(template.id) === selectedTemplateId);
    setSections(normalizeTemplateSections(selectedTemplate));
  }, [existingFormId, selectedTemplateId, templates]);

  const selectedTemplate = useMemo(
    () => templates.find((template) => String(template.id) === selectedTemplateId),
    [selectedTemplateId, templates],
  );

  const updateRow = (sectionKey: string, rowId: string, field: keyof IefRow, value: string) => {
    setSections((previous) =>
      previous.map((section) => {
        if (section.key !== sectionKey) {
          return section;
        }

        return {
          ...section,
          rows: section.rows.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  [field]: field === "rating" ? normalizeRating(value) : value,
                }
              : row,
          ),
        };
      }),
    );
  };

  const addRow = (sectionKey: string) => {
    setSections((previous) =>
      previous.map((section) =>
        section.key === sectionKey
          ? {
              ...section,
              rows: [...section.rows, createRow()],
            }
          : section,
      ),
    );
  };

  const removeRow = (sectionKey: string, rowId: string) => {
    setSections((previous) =>
      previous.map((section) => {
        if (section.key !== sectionKey) {
          return section;
        }

        const remainingRows = section.rows.filter((row) => row.id !== rowId);
        return {
          ...section,
          rows: remainingRows.length > 0 ? remainingRows : [createRow()],
        };
      }),
    );
  };

  const sectionAverage = (rows: IefRow[]) => {
    const values = rows
      .map((row) => Number(row.rating))
      .filter((value) => Number.isFinite(value));

    if (values.length === 0) {
      return 0;
    }

    return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
  };

  const handleSubmit = async () => {
    const candidateApplicationId = routeState?.candidateApplicationId ?? (params.candidateApplicationId ? Number(params.candidateApplicationId) : undefined);
    const pipelineStepId = routeState?.pipelineStepId ?? (params.interviewId ? Number(params.interviewId) : undefined);

    if (!candidateApplicationId || !pipelineStepId) {
      toast.error("Interview context is missing candidate or pipeline step details.");
      return;
    }

    const hasInvalidRating = sections.some((section) =>
      section.rows.some((row) => {
        const parsed = Number(row.rating);
        return row.skill.trim().length === 0 || Number.isNaN(parsed) || parsed < 0 || parsed > 100;
      }),
    );

    if (hasInvalidRating) {
      toast.error("Each skill row needs a name and a rating from 0 to 100.");
      return;
    }

    setIsSubmitting(true);

    try {
        // Remove entirely-empty rows (no skill and no rating) before submission.
        const cleanedSections = sections.map((section) => ({
          ...section,
          rows: section.rows.filter((row) => row.skill.trim().length > 0 || String(row.rating).trim().length > 0),
        }));

        // Ensure there is at least one filled row overall
        const hasAnyFilledRow = cleanedSections.some((s) => s.rows.length > 0);
        if (!hasAnyFilledRow) {
          toast.error("Please add at least one skill row with a rating.");
          setIsSubmitting(false);
          return;
        }

        // Convert ratings to numbers and include all fields in payload
        const sectionsWithNumberRatings = cleanedSections.map((section) => ({
          key: section.key,
          title: section.title,
          description: section.description,
          rows: section.rows.map((row) => ({
            id: row.id,
            skill: row.skill,
            rating: row.rating ? Number(row.rating) : null,
            remarks: row.remarks,
          })),
        }));

        const payload = {
          candidate_application: candidateApplicationId,
          candidate_pipeline_step: pipelineStepId,
          template: selectedTemplate?.id ?? null,
          interviewer: interviewerId,
          scheduled_for: routeState?.scheduledFor ?? new Date().toISOString(),
          data: {
            sections: sectionsWithNumberRatings,
            applicant_name: applicantName,
            interview_date: interviewDate,
            position_applying_for: positionApplyingFor,
            interviewer,
          },
          ai_summary: aiSummary,
          interviewer_notes: interviewerNotes,
        };

      if (existingFormId) {
        await defaultAxios.patch(`/api/candidate/ief/${existingFormId}/`, payload);
      } else {
        await interviewEvaluationFormService.createForm(payload);
      }

      toast.success("Interview evaluation form saved.");
    } catch (error) {
      console.error("Unable to save the interview evaluation form.", error);
      toast.error("Unable to save the interview evaluation form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-amber-50 p-6 shadow-sm">
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="self-start px-2 text-blue-600 hover:bg-blue-50"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">Interview Evaluation Form</h1>
              <Badge variant="outline" className="rounded-full border-amber-300 bg-white/80 text-amber-800">
                Manual review
              </Badge>
            </div>
            <p className="max-w-2xl text-sm text-slate-600">
              Record structured feedback for the candidate, keep the AI summary blank for now,
              and use the template list to prefill reusable sections.
            </p>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 lg:grid-cols-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Applicant Name</Label>
              <Input value={applicantName} readOnly className="bg-slate-50" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Interview Date</Label>
              <Input value={scheduledForDisplay} readOnly className="bg-slate-50" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Position Applying For</Label>
              <Input value={positionApplyingFor} readOnly className="bg-slate-50" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-slate-500">Interviewer</Label>
              <Input value={interviewer || "Selected pipeline interviewer"} readOnly className="bg-slate-50" />
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Template</Label>
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId} disabled={isLoadingTemplates}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template or keep the default sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blank">Blank form</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={String(template.id)}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate?.description ? (
                <p className="text-xs text-slate-500">{selectedTemplate.description}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Template Status</Label>
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <Sparkles className="h-4 w-4 text-amber-600" />
                {isLoadingTemplates
                  ? "Loading IEF templates..."
                  : selectedTemplate
                    ? `Prefilled from ${selectedTemplate.name}`
                    : "Using the default interview evaluation sections."}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {sections.map((section) => (
              <Card key={section.key} className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <CardTitle className="text-xl text-slate-900">{section.title}</CardTitle>
                      <CardDescription className="mt-1 text-slate-600">
                        {section.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full border-slate-300 text-slate-600">
                        Average {sectionAverage(section.rows)}%
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => addRow(section.key)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Row
                      </Button>
                    </div>
                  </div>
                  <Separator />
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.rows.map((row, index) => (
                    <div
                      key={row.id}
                      className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1.1fr_140px_1.4fr_auto] lg:items-start"
                    >
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wide text-slate-500">Skill {index + 1}</Label>
                        <Input
                          value={row.skill}
                          onChange={(event) => updateRow(section.key, row.id, "skill", event.target.value)}
                          placeholder="Enter a skill or competency"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wide text-slate-500">Rating</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={row.rating || ""}
                          onChange={(event) => updateRow(section.key, row.id, "rating", event.target.value)}
                          placeholder="0 - 100"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wide text-slate-500">Remarks</Label>
                        <Textarea
                          value={row.remarks}
                          onChange={(event) => updateRow(section.key, row.id, "remarks", event.target.value)}
                          placeholder="Add interviewer notes for this skill"
                          className="min-h-24"
                        />
                      </div>
                      <div className="flex items-start justify-end lg:pt-8">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(section.key, row.id)}
                          className="text-slate-500 hover:bg-red-50 hover:text-red-600"
                          disabled={section.rows.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">AI Summary</CardTitle>
                <CardDescription className="text-slate-600">
                  Leave this blank for now if you are completing the evaluation manually.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={aiSummary}
                  onChange={(event) => setAiSummary(event.target.value)}
                  placeholder="Optional AI-generated summary"
                  className="min-h-40"
                />
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Interviewer Notes</CardTitle>
                <CardDescription className="text-slate-600">
                  Use this space for private interviewer observations or follow-up points.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={interviewerNotes}
                  onChange={(event) => setInterviewerNotes(event.target.value)}
                  placeholder="Add interviewer notes"
                  className="min-h-40"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              className="min-w-40 bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Submit Evaluation"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
