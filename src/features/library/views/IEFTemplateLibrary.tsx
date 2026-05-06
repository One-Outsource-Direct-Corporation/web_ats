import { useMemo } from "react";
import { ArrowLeft, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";

import { iefTemplateService } from "../services/iefTemplate.service";
import { useIefTemplatesQuery } from "../hooks/useIefTemplatesQuery";

export default function IEFTemplateLibrary() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const {
    templates,
    loading,
    search,
    setSearch,
    refetch,
  } = useIefTemplatesQuery();

  const visibleTemplates = useMemo(() => templates, [templates]);

  const handleDelete = async (templateId: number) => {
    const confirmed = window.confirm("Delete this IEF template? This cannot be undone.");
    if (!confirmed) {
      return;
    }

    try {
      await iefTemplateService.deleteTemplate(templateId, { httpClient: axiosPrivate });
      toast.success("IEF template deleted.");
      await refetch();
    } catch (error) {
      console.error("Failed to delete IEF template", error);
      toast.error("Failed to delete IEF template.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[96px]">
      <div className="mx-auto w-full max-w-7xl px-6 pb-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <Button variant="ghost" className="mb-3 px-0 text-gray-600 hover:text-gray-900" onClick={() => navigate("/library") }>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">IEF Template Library</h1>
            <p className="text-sm text-gray-600">Create and manage reusable interview evaluation templates.</p>
          </div>

          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate("/library/ief-templates/new?mode=edit") }>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="space-y-4 border-b bg-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl text-gray-900">Your Templates</CardTitle>
                <CardDescription>Templates are private to your account.</CardDescription>
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Total {visibleTemplates.length}
              </div>
            </div>

            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder="Search IEF templates"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="p-4">Template</TableHead>
                  <TableHead className="p-4">Sections</TableHead>
                  <TableHead className="p-4">Status</TableHead>
                  <TableHead className="p-4">Updated</TableHead>
                  <TableHead className="p-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell className="p-6 text-center" colSpan={5}>
                      Loading templates...
                    </TableCell>
                  </TableRow>
                ) : visibleTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell className="p-6 text-center" colSpan={5}>
                      No IEF templates found.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="p-4 font-medium text-gray-900">
                        <div>
                          <div>{template.name}</div>
                          <div className="text-sm font-normal text-gray-500">{template.description ?? ""}</div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-gray-600">{template.sections?.length ?? 0}</TableCell>
                      <TableCell className="p-4 text-gray-600">{template.is_active ? "Active" : "Inactive"}</TableCell>
                      <TableCell className="p-4 text-gray-600">
                        {template.updated_at ? new Date(template.updated_at).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => navigate(`/library/ief-templates/${template.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => navigate(`/library/ief-templates/${template.id}?mode=edit`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => void handleDelete(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
