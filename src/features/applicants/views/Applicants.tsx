import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApplicants } from "../hooks/useApplicants";
import { ApplicantList } from "../components/ApplicantList";
import { Input } from "@/shared/components/ui/input.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select.tsx";
import { Loader2 } from "lucide-react";
import { ChevronRightCircle } from "lucide-react";

export default function Applicants() {
  useEffect(() => {
    document.title = "Applicants";
  }, []);

  const navigate = useNavigate();
  const { data: applicants = [], isLoading, error } = useApplicants();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.name?.toLowerCase().includes(q) &&
          !a.email?.toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (positionFilter !== "all" && a.position !== positionFilter)
        return false;
      if (departmentFilter !== "all" && a.department !== departmentFilter)
        return false;
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      return true;
    });
  }, [applicants, search, statusFilter, positionFilter, departmentFilter, typeFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPositionFilter("all");
    setDepartmentFilter("all");
    setTypeFilter("all");
  };

  const hasFilters =
    search || statusFilter !== "all" || positionFilter !== "all" ||
    departmentFilter !== "all" || typeFilter !== "all";

  const statusOptions = useMemo(
    () => [...new Set(applicants.map((a) => a.status).filter(Boolean))],
    [applicants]
  );
  const positionOptions = useMemo(
    () => [...new Set(applicants.map((a) => a.position).filter(Boolean))],
    [applicants]
  );
  const departmentOptions = useMemo(
    () => [...new Set(applicants.map((a) => a.department).filter(Boolean))],
    [applicants]
  );
  const typeOptions = useMemo(
    () => [...new Set(applicants.map((a) => a.type).filter(Boolean))],
    [applicants]
  );

  return (
    <div>
      <div className="fixed top-[64px] left-0 right-0 z-30 bg-gray-50 border-b border-gray-200 shadow-sm px-6 pt-4 pb-3">
        <div className="max-w-7xl mx-auto -space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Applicants</h1>
          <p className="text-lg text-gray-700 mt-5">
            Stores candidate details and tracks their application progress.
          </p>
          {hasFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-500 hover:underline cursor-pointer pb-2"
              >
                Clear filters
              </button>
            </div>
          )}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <Input
              placeholder="Search applicants..."
              className="w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 ml-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="min-w-[160px] bg-gray-100">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s!}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="min-w-[160px] bg-gray-100">
                  <SelectValue placeholder="All Job Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Job Position</SelectItem>
                  {positionOptions.map((p) => (
                    <SelectItem key={p} value={p!}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="min-w-[160px] bg-gray-100">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departmentOptions.map((d) => (
                    <SelectItem key={d} value={d!}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="min-w-[160px] bg-gray-100">
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Employment Type</SelectItem>
                  {typeOptions.map((t) => (
                    <SelectItem key={t} value={t!}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 px-6 pt-[270px] pb-[80px]">
        <div className="mx-auto max-w-7xl w-full">
          <div className="overflow-x-auto rounded-lg border bg-white">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">
                Failed to load applicants. Please try again.
              </div>
            ) : (
              <ApplicantList applicants={filtered} />
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 z-50">
        <Button
          variant="default"
          size="sm"
          className="w-full sm:w-auto"
          style={{ backgroundColor: "#0056D2", color: "white" }}
          onClick={() => navigate("/job/list/applicants/pool")}
        >
          Pool Applicant
        </Button>
        <button
          onClick={() => navigate("/job")}
          className="text-right flex items-center text-blue-500 text-sm hover:underline"
        >
          <ChevronRightCircle className="w-4 h-4 mr-1" />
          Applicants by Position
        </button>
      </div>
    </div>
  );
}
