import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, Search, ArrowLeft, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button.tsx";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog.tsx";
import { toast } from "react-toastify";
import { axiosPrivate } from "@/config/axios";

interface BusinessUnit {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function BusinessUnitLibrary() {
  const navigate = useNavigate();
  const [units, setUnits] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | null>(null);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [saving, setSaving] = useState(false);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get("/api/core/business-unit/");
      setUnits(res.data.results || res.data || []);
    } catch {
      toast.error("Failed to load business units.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const filtered = units.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Name and slug are required.");
      return;
    }
    setSaving(true);
    try {
      if (dialogMode === "create") {
        await axiosPrivate.post("/api/core/business-unit/", form);
        toast.success("Business unit created.");
      } else if (dialogMode === "edit" && selectedUnit) {
        await axiosPrivate.patch(`/api/core/business-unit/${selectedUnit.id}/`, form);
        toast.success("Business unit updated.");
      }
      setIsDialogOpen(false);
      setForm({ name: "", slug: "" });
      fetchUnits();
    } catch {
      toast.error("Failed to save business unit.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to deactivate this business unit?")) return;
    try {
      await axiosPrivate.delete(`/api/core/business-unit/${id}/`);
      toast.success("Business unit deactivated.");
      fetchUnits();
    } catch {
      toast.error("Failed to deactivate business unit.");
    }
  };

  const openCreate = () => {
    setDialogMode("create");
    setSelectedUnit(null);
    setForm({ name: "", slug: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (unit: BusinessUnit) => {
    setDialogMode("edit");
    setSelectedUnit(unit);
    setForm({ name: unit.name, slug: unit.slug });
    setIsDialogOpen(true);
  };

  const openView = (unit: BusinessUnit) => {
    setDialogMode("view");
    setSelectedUnit(unit);
    setForm({ name: unit.name, slug: unit.slug });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => navigate("/library")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Business Units</h1>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            placeholder="Search business units"
          />
        </div>
        <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Business Unit
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="p-4">Name</TableHead>
              <TableHead className="p-4">Slug</TableHead>
              <TableHead className="p-4">Status</TableHead>
              <TableHead className="p-4">Updated</TableHead>
              <TableHead className="p-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="p-6 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-6 text-center">
                  No business units found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="p-4 font-medium">{unit.name}</TableCell>
                  <TableCell className="p-4 text-gray-600">{unit.slug}</TableCell>
                  <TableCell className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        unit.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {unit.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="p-4 text-gray-600">
                    {unit.updated_at ? new Date(unit.updated_at).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openView(unit)}>
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(unit)}>
                        <Pencil className="h-4 w-4 text-emerald-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(unit.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create"
                ? "Create Business Unit"
                : dialogMode === "edit"
                ? "Edit Business Unit"
                : "Business Unit"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                disabled={dialogMode === "view"}
                placeholder="e.g. OODC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                disabled={dialogMode === "view"}
                placeholder="e.g. oodc"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            {dialogMode !== "view" && (
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
