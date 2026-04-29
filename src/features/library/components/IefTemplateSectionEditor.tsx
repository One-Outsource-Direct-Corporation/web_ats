import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

import type { IefTemplateSection } from "../types/iefTemplate.types";

interface IefTemplateSectionEditorProps {
  sections: IefTemplateSection[];
  onChange: (sections: IefTemplateSection[]) => void;
  readOnly?: boolean;
}

const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
};

const createRow = () => ({
  id: createId("row"),
  skill: "",
  rating: "",
  remarks: "",
});

const createSection = (): IefTemplateSection => ({
  key: createId("section"),
  title: "New Section",
  description: "",
  rows: [createRow()],
});

export function IefTemplateSectionEditor({ sections, onChange, readOnly = false }: IefTemplateSectionEditorProps) {
  const updateSection = (index: number, updates: Partial<IefTemplateSection>) => {
    onChange(
      sections.map((section, currentIndex) =>
        currentIndex === index ? { ...section, ...updates } : section,
      ),
    );
  };

  const updateRow = (
    sectionIndex: number,
    rowIndex: number,
    field: "skill" | "rating" | "remarks",
    value: string,
  ) => {
    onChange(
      sections.map((section, currentIndex) => {
        if (currentIndex !== sectionIndex) {
          return section;
        }

        const rows = (section.rows ?? []).map((row, currentRowIndex) =>
          currentRowIndex === rowIndex ? { ...row, [field]: value } : row,
        );

        return { ...section, rows };
      }),
    );
  };

  const addSection = () => {
    onChange([...sections, createSection()]);
  };

  const deleteSection = (sectionIndex: number) => {
    onChange(sections.filter((_, currentIndex) => currentIndex !== sectionIndex));
  };

  const addRow = (sectionIndex: number) => {
    onChange(
      sections.map((section, currentIndex) =>
        currentIndex === sectionIndex
          ? { ...section, rows: [...(section.rows ?? []), createRow()] }
          : section,
      ),
    );
  };

  const deleteRow = (sectionIndex: number, rowIndex: number) => {
    onChange(
      sections.map((section, currentIndex) => {
        if (currentIndex !== sectionIndex) {
          return section;
        }

        const rows = (section.rows ?? []).filter((_, currentRowIndex) => currentRowIndex !== rowIndex);
        return {
          ...section,
          rows: rows.length > 0 ? rows : [createRow()],
        };
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Template Sections</h3>
          <p className="text-sm text-gray-600">Build the reusable structure that will seed interview evaluation forms.</p>
        </div>

        {!readOnly && (
          <Button type="button" onClick={addSection} className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Button>
        )}
      </div>

      {sections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center text-sm text-gray-500">
            No sections yet. Add your first section to start the template.
          </CardContent>
        </Card>
      ) : (
        sections.map((section, sectionIndex) => (
          <Card key={section.key ?? sectionIndex} className="border-gray-200 shadow-sm">
            <CardHeader className="space-y-4 border-b bg-gray-50/80">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`section-title-${sectionIndex}`}>Section Title</Label>
                    <Input
                      id={`section-title-${sectionIndex}`}
                      value={section.title ?? ""}
                      onChange={(event) => updateSection(sectionIndex, { title: event.target.value })}
                      disabled={readOnly}
                      placeholder="Section title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`section-description-${sectionIndex}`}>Description</Label>
                    <Textarea
                      id={`section-description-${sectionIndex}`}
                      value={section.description ?? ""}
                      onChange={(event) => updateSection(sectionIndex, { description: event.target.value })}
                      disabled={readOnly}
                      placeholder="Describe what this section evaluates"
                      rows={3}
                    />
                  </div>
                </div>

                {!readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteSection(sectionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Rows</h4>
                {!readOnly && (
                  <Button type="button" variant="outline" onClick={() => addRow(sectionIndex)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Row
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {(section.rows ?? []).map((row, rowIndex) => (
                  <div key={row.id ?? rowIndex} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-[1.2fr_0.5fr]">
                      <div className="space-y-2">
                        <Label htmlFor={`row-skill-${sectionIndex}-${rowIndex}`}>Skill</Label>
                        <Input
                          id={`row-skill-${sectionIndex}-${rowIndex}`}
                          value={row.skill ?? ""}
                          onChange={(event) => updateRow(sectionIndex, rowIndex, "skill", event.target.value)}
                          disabled={readOnly}
                          placeholder="e.g. Problem solving"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`row-rating-${sectionIndex}-${rowIndex}`}>Default Rating</Label>
                        <Input
                          id={`row-rating-${sectionIndex}-${rowIndex}`}
                          type="number"
                          min="0"
                          max="100"
                          value={row.rating ?? ""}
                          onChange={(event) => updateRow(sectionIndex, rowIndex, "rating", event.target.value)}
                          disabled={readOnly}
                          placeholder="0 - 100"
                        />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`row-remarks-${sectionIndex}-${rowIndex}`}>Remarks</Label>
                      <Textarea
                        id={`row-remarks-${sectionIndex}-${rowIndex}`}
                        value={row.remarks ?? ""}
                        onChange={(event) => updateRow(sectionIndex, rowIndex, "remarks", event.target.value)}
                        disabled={readOnly}
                        rows={3}
                        placeholder="Optional guidance for the interviewer"
                      />
                    </div>

                    {!readOnly && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteRow(sectionIndex, rowIndex)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Row
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
